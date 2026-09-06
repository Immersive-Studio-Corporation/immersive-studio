# Hébergement sur OG-YOSHUN

Machine existante vérifiée le 6 septembre 2026 : `91.197.6.63`, Nginx 1.22.1,
HTTP/HTTPS déjà en service et Certbot installé. Les anciens documents de Familiers
décrivent Caddy sur OVH ; ils ne correspondent pas au serveur actuel.

Le site est un export statique. Aucun serveur Node, base de données, conteneur,
abonnement ChatGPT ou accès à Vercel n'est nécessaire pour le servir.

## DNS à saisir par le propriétaire dans IONOS

| Type | Nom | Valeur |
| --- | --- | --- |
| A | immersive | 91.197.6.63 |

Conserver les autres entrées, notamment `@`, `www` et les emails. Si un CNAME
`immersive` vers ChatGPT a déjà été ajouté, le remplacer par cette entrée A.
Ne pas ajouter d'AAAA sans avoir configuré et vérifié une IPv6 publique du serveur.
Les TXT de validation ChatGPT ne sont pas nécessaires pour cette installation.

## Activation administrateur

Le paquet contient `public/`, les configurations HTTP et HTTPS, les sommes SHA256
et `activate.sh`. Les accès disponibles à Codex permettent le dépôt des fichiers,
mais pas l'activation de Nginx : le compte `hdpbots` demande un mot de passe sudo.

Après propagation du DNS, ouvrir une console administrateur de **OG-YOSHUN** et lancer
le script du paquet préalablement relu. Il copie les fichiers dans une release
dédiée sous `/var/www/immersive-studio`, active son seul hôte virtuel, contrôle Nginx,
recharge sa configuration et demande le certificat avec le compte Certbot existant.
Le rechargement Nginx ne redémarre pas les applications et jeux.

Une validation TLS impossible laisse HTTP disponible et permet de relancer le script
après correction DNS. La configuration précédente de ce seul hôte est sauvegardée.
Le hook existant `/etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh` doit rester
en place pour les renouvellements de certificats.

Contrôler ensuite HTTPS, les images, les polices, les langues et les ancres ; vérifier
aussi les services existants. Le domaine/DNS et le serveur doivent rester actifs.
Les sources restent sur le PC ; le site public s'exécute sur la machine distante.
