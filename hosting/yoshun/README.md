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

## DNS et étape restante

Le propriétaire a ajouté chez IONOS l'entrée A immersive vers 91.197.6.63, TTL 60 secondes. Résolution vérifiée, pas d'AAAA ni de CNAME détecté.

Il reste à demander à Yoshun la route HTTPS immersive.heritagedepoudlard.fr vers http://127.0.0.1:8088. Message prêt dans POUR-YOSHUN.txt. Aucun message n'a été envoyé.

Les fichiers http.conf et https.conf décrivent l'ancienne proposition d'installation directe administrateur, jamais exécutée ; ils ne sont pas utilisés par le Compose. La configuration active est nginx-container.conf avec static-locations.conf.

Le TTL est une durée de cache, pas une expiration du sous-domaine. Domaine/DNS et serveur doivent rester actifs. Les sources restent sur le PC ; le site public est servi par la machine distante. Aucun serveur Node, base de données, Vercel ou abonnement ChatGPT n'est nécessaire pour ce déploiement.
