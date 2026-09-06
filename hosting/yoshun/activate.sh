#!/usr/bin/env bash
set -euo pipefail
if [ "$(id -u)" -eq 0 ]; then
    echo 'Run this as hdpbots, without sudo. The public gateway is managed by Yoshun.' >&2
    exit 1
fi
if [ "$(hostname)" != OG-YOSHUN ]; then echo 'Intended for OG-YOSHUN only.' >&2; exit 1; fi
cd -- "$(dirname -- "$0")"
test "$(docker context show)" = rootless
docker compose config --quiet
docker compose up -d --no-build web
curl --fail --silent --show-error http://127.0.0.1:8088/ --output /dev/null
echo 'The site is ready on 127.0.0.1:8088. Ask Yoshun to route immersive.heritagedepoudlard.fr with HTTPS.'
