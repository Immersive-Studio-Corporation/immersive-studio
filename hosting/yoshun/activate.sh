#!/usr/bin/env bash
set -euo pipefail

# Run only from the reviewed, extracted bundle on OG-YOSHUN.
# Installs one static virtual host. No Docker, database or game service changes.
if [ "$(id -u)" -ne 0 ]; then
    echo 'Activation requires an administrator: sudo bash activate.sh' >&2
    exit 1
fi
if [ "$(hostname)" != 'OG-YOSHUN' ]; then
    echo 'This bundle is intended for OG-YOSHUN only.' >&2
    exit 1
fi

bundle=$(cd -- "$(dirname -- "$0")" && pwd)
domain=immersive.heritagedepoudlard.fr
destination=/var/www/immersive-studio
release=$destination/releases/20260906-domain
available=/etc/nginx/sites-available/immersive-studio.conf
enabled=/etc/nginx/sites-enabled/immersive-studio.conf
snippet=/etc/nginx/snippets/immersive-studio-static.conf

test -f "$bundle/public/index.html"
test -f "$bundle/public/404.html"
test -d "$bundle/public/_next"
test -f "$bundle/SHA256SUMS"
if find "$bundle/public" -type l -print -quit | grep -q .; then
    echo 'Unexpected symlink in the public bundle.' >&2
    exit 1
fi
(cd "$bundle" && sha256sum --check --quiet SHA256SUMS)

if [ -e "$available" ] && ! grep -q '^# Immersive Studio - managed deployment$' "$available"; then
    echo 'An unmanaged virtual host already exists. No changes made.' >&2
    exit 1
fi
if [ -e "$snippet" ] && ! grep -q '^# Immersive Studio - managed deployment$' "$snippet"; then
    echo 'An unmanaged static configuration already exists. No changes made.' >&2
    exit 1
fi
if [ -L "$destination" ] || [ -L "$destination/releases" ] || [ -L "$release" ]; then
    echo 'Unexpected symlink in the release directories. No changes made.' >&2
    exit 1
fi
if [ -e "$enabled" ] || [ -L "$enabled" ]; then
    test "$(readlink "$enabled")" = "$available"
fi
if [ -e "$destination/current" ] && [ ! -L "$destination/current" ]; then
    echo 'The current release path is not a symlink. No changes made.' >&2
    exit 1
fi
/usr/sbin/nginx -t

install -d -m 755 "$destination/releases" /etc/nginx/snippets
if [ ! -d "$release" ]; then
    staging=$(mktemp -d "$destination/releases/.staging.XXXXXX")
    cp -R "$bundle/public/." "$staging/"
    awk '$2 ~ /^public\// {sub(/^public\//, "", $2); print}' "$bundle/SHA256SUMS" > "$staging/.release-sha256"
    (cd "$staging" && sha256sum --check --quiet .release-sha256)
    chown -R root:root "$staging"
    chmod -R u=rwX,go=rX "$staging"
    mv -- "$staging" "$release"
fi
# Never activate an incomplete or different release after an interrupted run.
(cd "$release" && awk '$2 ~ /^public\// {sub(/^public\//, "", $2); print}' "$bundle/SHA256SUMS" | sha256sum --check --quiet -)
backup=$(mktemp -d "$destination/activation-backup.XXXXXX")
previous_current=$(readlink "$destination/current" || true)
if [ -f "$available" ]; then cp -p "$available" "$backup/site.conf"; fi
if [ -f "$snippet" ]; then cp -p "$snippet" "$backup/static.conf"; fi
had_enabled=no
if [ -L "$enabled" ]; then had_enabled=yes; fi

rollback() {
    if [ -f "$backup/site.conf" ]; then
        cp -p "$backup/site.conf" "$available"
    else
        rm -f -- "$available"
    fi
    if [ -f "$backup/static.conf" ]; then
        cp -p "$backup/static.conf" "$snippet"
    else
        rm -f -- "$snippet"
    fi
    if [ "$had_enabled" = no ]; then rm -f -- "$enabled"; fi
    if [ -n "$previous_current" ]; then
        ln -sfn -- "$previous_current" "$destination/current"
    else
        rm -f -- "$destination/current"
    fi
}

rollback_armed=yes
finish() {
    result=$?
    trap - EXIT
    if [ "$rollback_armed" = yes ]; then
        rollback
        if /usr/sbin/nginx -t; then systemctl reload nginx || true; fi
        echo 'Activation did not complete; previous configuration restored.' >&2
    fi
    exit "$result"
}
trap finish EXIT

install -m 644 "$bundle/static-locations.conf" "$snippet"
ln -sfn -- "$release" "$destination/current"
ln -sfn -- "$available" "$enabled"

activate_config() {
    install -m 644 "$1" "$available.next"
    mv -f -- "$available.next" "$available"
    if ! /usr/sbin/nginx -t; then
        echo 'Configuration rejected.' >&2
        exit 1
    fi
    if ! systemctl reload nginx; then
        echo 'Reload failed.' >&2
        exit 1
    fi
}

if [ ! -s "/etc/letsencrypt/live/$domain/fullchain.pem" ] ||
   [ ! -s "/etc/letsencrypt/live/$domain/privkey.pem" ]; then
    activate_config "$bundle/http.conf"
    echo 'HTTP is ready. IONOS must point immersive to 91.197.6.63 for HTTPS validation.'
    # Reuse the existing Certbot account; do not register a new account here.
    if ! certbot certonly --webroot --webroot-path /var/www/certbot \
        --domain "$domain" --cert-name "$domain" --non-interactive; then
        rollback_armed=no
        echo 'HTTPS validation is pending. HTTP remains available; check DNS then rerun.' >&2
        exit 2
    fi
fi

activate_config "$bundle/https.conf"
curl --fail --silent --show-error --resolve "$domain:443:127.0.0.1" \
    "https://$domain/" --output /dev/null
rollback_armed=no
echo "Ready: https://$domain"
echo "Previous configuration preserved at: $backup"
