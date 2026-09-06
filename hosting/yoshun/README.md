# Hébergement sur OG-YOSHUN

Le README actif de la machine, /home/hdpbots/README.md, décrit la migration du 29 août 2026 : compte hdpbots non privilégié, Docker rootless et Nginx/TLS gérés par Yoshun. Les anciens documents OVH/Caddy ne s'appliquent plus.

Le service Immersive Studio est installé et répond sur http://127.0.0.1:8088.
Conteneur : immersive-studio-web. Image Nginx officielle figée par digest, utilisateur 101, volumes et système de fichiers en lecture seule, redémarrage unless-stopped. Aucun port public supplémentaire.

Dossier actif : /home/hdpbots/immersive-studio/staging/20260906-domain

## Connexion et gestion

Depuis PowerShell :

    ssh -i "C:\Users\Derek\.ssh\id_ed25519" hdpbots@91.197.6.63

Puis dans la session SSH, sans sudo :

    cd ~/immersive-studio/staging/20260906-domain
    docker compose ps
    docker compose logs --tail=30 web

Pour relancer ce seul service : bash activate.sh. Nginx public et certificats restent gérés côté machine.

## DNS et accès public

### Domaine principal opérationnel

Le propriétaire a enregistré `immersive-studio.fr` le 6 septembre 2026 et a terminé les réglages IONOS. Les DNS publics vérifiés via 1.1.1.1 sont A `91.197.6.63`, aucun AAAA, et CNAME `www` vers `immersive-studio.fr`. Le raccordement est terminé : HTTPS 200 sur `https://immersive-studio.fr`, HTTP et www redirigent en 301 vers HTTPS sans www, avec conservation du chemin et des paramètres. Le certificat est accepté normalement. Les 24 ressources de la page ont répondu 200.

Les métadonnées ont été publiées avec la nouvelle adresse : metadataBase, canonical et og:url. Le HTML public et les 6 CSS/JS qu'il référence ont été revérifiés après publication. L'export a été transféré sous `immersive-studio-fr-20260906.tar.gz` dans le dossier actif, extrait sous `releases/20260906-immersive-fr`, puis chaque fichier remplacé atomiquement dans `public` sans redémarrage du service. Les anciens fichiers hashés sont conservés pour les onglets déjà ouverts. Sauvegarde précédente : `backups/before-20260906-immersive-fr.tar.gz`.

### Ancienne adresse : redirection à rétablir

Le propriétaire a ajouté chez IONOS l'entrée A immersive vers 91.197.6.63, TTL 60 secondes. Résolution vérifiée, pas d'AAAA ni de CNAME détecté.

Cette adresse fonctionnait avant la bascule. Après activation du nouveau domaine, `https://immersive.heritagedepoudlard.fr/` présente un certificat pour `c.yoshun.fr` et échoue à la validation TLS. Yoshun doit conserver un hôte et un certificat valides pour l'ancienne adresse, puis la rediriger en 301 vers `https://immersive-studio.fr` avec conservation du chemin et des paramètres. Cela ne bloque pas le nouveau domaine. Nginx public et certificats restent gérés par Yoshun ; leur configuration n'a pas été modifiée par Codex. Le renouvellement automatique du certificat n'a pas été inspecté dans cette vérification externe.

POUR-YOSHUN.txt conserve l'historique de la demande de raccordement. Aucun message n'a été envoyé par Codex.

Les fichiers http.conf et https.conf décrivent l'ancienne proposition d'installation directe administrateur, jamais exécutée ; ils ne sont pas utilisés par le Compose. La configuration active est nginx-container.conf avec static-locations.conf.

Le TTL est une durée de cache, pas une expiration du sous-domaine. Domaine/DNS et serveur doivent rester actifs. Les sources restent sur le PC ; le site public est servi par la machine distante. Aucun serveur Node, base de données, Vercel ou abonnement ChatGPT n'est nécessaire pour ce déploiement.
