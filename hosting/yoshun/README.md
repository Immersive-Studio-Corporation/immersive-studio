# Hébergement sur OG-YOSHUN

## Publication du 21 septembre 2026 - accueil, salut, logos et volume

Version active : `20260921-011341-journey-sound`. Logo Minecraft en PNG à l’accueil, jambes écartées, salut unique au survol, logos cadrés et rendus en grand depuis leurs masters, centrage sur le texte, dix musiques harmonisées et volume initial de 15 %.

35 tests, TypeScript, lint applicatif et compilation réussis. 32 fichiers remplacés ; 271 ressources HTTPS et 74 requêtes partielles de médias validées. Sauvegarde : `backups/before-20260921-011341-journey-sound.tar.gz`. SHA-256 HTML : `e03a69b8f89e9a5bda01813ddef70c332ab24adc0bf587374c267d5efa9fa7d6`. Bilan : `../../../ARCHIVES TECHNIQUES/Update-20260921/polish/BILAN.md`.

Les sections suivantes sont historiques.

## Publication du 21 septembre 2026 - personnage et présentations

Version active : `20260921-002228-journey-sound`. Personnage Minecraft flottant en 3D, prologue Minecraft, logos continus du centre au texte, nouveau médaillon Avatar, 27 images avec grands aperçus, boucles continues et Sanji sans images noires.

33 tests, TypeScript, lint et build Node 22 réussis. 251 ressources HTTPS, 64 médias HTTP 206, 11 fichiers modifiés dans la dernière publication, après la livraison des fonctionnalités et les ajustements de cadrage. Sauvegarde : `backups/before-20260921-002228-journey-sound.tar.gz`. SHA-256 HTML : `52ab0a55195cc9eedebd9f3df426ff97e91b6464cbeef80730c4eaf90d8322d5`. Détails : `../../../ARCHIVES TECHNIQUES/Update-20260921/refinement/BILAN.md`.

Les publications suivantes sont historiques.

## Publication du 21 septembre 2026 — navigation et scènes corrigées

Version active : `20260920-225125-journey-sound`. Musique continue dans chaque univers, correction des scènes résiduelles lors des retours, navigation par logos, logos à gauche, nouveaux ordres des scènes et GIF à vitesse normale 60 images/s. 26 visuels fixes haute définition avec petits aperçus au survol. Bilan détaillé : `../../../ARCHIVES TECHNIQUES/Update-20260921/BILAN.md`.

32 tests, TypeScript, lint et build Node 22 réussis ; 48 exports vidéo vérifiés. Production : 245 ressources HTTPS et 64 lectures partielles HTTP 206. 131 fichiers remplacés ; sauvegarde `backups/before-20260920-225125-journey-sound.tar.gz`. Aucun redémarrage de service.

SHA-256 HTML : `fea21844e5c01fa5b07eb49554d5d86390ba3cfd57587a48a01b3e3523ab79d6`. Les publications suivantes sont historiques.

## Publication du 21 septembre 2026 — ralentis et galeries

Version précédente : `20260920-220041-journey-sound` (identifiant UTC), sur https://immersive-studio.fr/.

Cube flottant et son anneau retirés. Apparitions progressives, éclats lumineux discrets et trois vignettes ouvrables avec chaque description. Galerie native accessible au clavier, fermeture Échap et restauration du focus ; fond et lecture automatique suspendus pendant son ouverture. Commandes traduites dans les seize langues.

Les 16 GIF sont maintenant ralentis : ×4 pour les sources de six secondes ou moins, ×2,5 pour les deux plus longues. Interpolation calculée après étirement temporel, à 60 images/s ; débruitage, traitement des aplats, adaptation 16:9 et compression H.264. Les huit MP4 et les six fichiers vidéo Licaris sont conservés. Les URL vidéo ont une version de cache pour charger les nouveaux ralentis.

30 tests, TypeScript, lint et compilation Node 22 réussis ; 48 exports inspectés avec FFprobe. Contrôles à 1280 × 800, 1920 × 1080 et 390 × 844 : lecteur grand format, navigation clavier, fermeture et retour du focus, absence de débordement, une seule vidéo active dans la galerie, pause générale. Aucun avertissement ni erreur console relevé dans les contrôles finaux.

191 ressources publiques vérifiées en HTTPS, 64 lectures partielles HTTP 206 ; 76 fichiers mis à jour. Sauvegarde : `backups/before-20260920-220041-journey-sound.tar.gz`. Publication : `releases/20260920-220041-journey-sound/publication.json`. SHA-256 HTML : `c5d852c6ec5b376e9e23611fa08d958c61b5cba09bf7442db5f3fe33f2b877b3`.

Les services existants sont restés actifs sans redémarrage. Les sections suivantes documentent les publications antérieures.


## Publication du 20 septembre 2026 — neuf univers et profondeur 3D

Version publiée : `20260920-213819-journey-sound`, sur https://immersive-studio.fr/.

Ordre : Héritage, Licaris, One Piece, Teen Wolf, Avatar, Percy Jackson, Avengers, The Walking Dead, Narnia. NewGen et The Last of Us retirés. Six nouvelles pistes audio ; 24 nouvelles scènes en 1080p60 et 720p60 ; vidéos Licaris conservées. Fond calculé en perspective 3D, fondus entre les scènes, chargement borné aux univers voisins. Textes actualisés dans les seize langues.

33 tests, TypeScript, lint et compilation Node 22 réussis. 191 ressources HTTPS 200 ; 64 médias HTTP 206. 120 fichiers mis à jour, 137 anciens médias archivés hors de `public`. Aucun redémarrage de conteneur.

Sauvegarde : `backups/before-20260920-213819-journey-sound.tar.gz`. Publication : `releases/20260920-213819-journey-sound/publication.json`. SHA-256 HTML : `c85255f230a774652b65bf40003115e9ee4eac3d7e151b039e8574129df0b57a`.

Bilan détaillé local : `ARCHIVES TECHNIQUES/Update-20260920/BILAN.md`. Les sections suivantes conservent l’historique des versions précédentes.


## Dernière publication — 14 septembre 2026 (son et panoramas)

Version publiée : `20260914-144851-journey-sound` sur **https://immersive-studio.fr**.

- Son calé sur le temps du parcours lors de l’activation, d’un chargement tardif ou d’un déplacement manuel. Une scène immobile laisse la musique continuer. Volume initial 100 %, activation par défaut ; démarrage à la première interaction si le navigateur restreint l’autoplay.
- Signature originale de huit secondes « Cube Odyssey », lecture unique à l’introduction, rejouable avec celle-ci.
- Logos décodés avant leur apparition, mouvement lissé avec transform/opacity et masquage des logos inactifs.
- Licaris : trois panoramas de la galerie officielle Cobblemon (Pancham Family, Cobbled Farms, Metagross), remplissage de la scène et cadrages mobiles adaptés. Logo et piste Pokémon conservés.
- En-tête adapté aux huit projets pour garder les réglages du son accessibles ; position conservée lors du redimensionnement.

Validation : 29 tests, TypeScript, compilation Node 22, contrôles visuels grand écran et téléphone. Les 210 fichiers publics répondent en HTTP 200 avec la bonne taille ; les neuf pistes audio répondent en HTTP 206. Introduction sonore confirmée dans le navigateur public avec volume 100 %.

- Sauvegarde : `backups/before-20260914-144851-journey-sound.tar.gz`.
- Publication : `releases/20260914-144851-journey-sound/publication.json`.
- HTML SHA-256 : `0af5b3b06bdc523cda9261dee6c0d2c7ac9e5bc335dffbf3e02f51cc982e96cb`.
- 21 fichiers remplacés atomiquement ; aucun redémarrage du service.
- Rapports locaux : `ARCHIVES TECHNIQUES/Deploiements/20260914-144851-journey-sound/`.
- Sources et exports : `VISUELS MARKETING/13 - Univers et musiques/2026-09-14/` (Licaris/Panoramas et Signature sonore).

## Publication précédente — 14 septembre 2026 (Licaris)

Version publiée : `20260914-135708-journey-sound` sur **https://immersive-studio.fr/#licaris**. Ajout de Licaris (Minecraft/Cobblemon/Pokémon), ses trois illustrations et son logo du launcher, son Discord dédié et la piste native Pokémon Red / Blue — Opening. Les huit projets sont inclus dans la navigation et la visite automatique (3 min 28 s), avec les textes dans les 16 langues.

TypeScript, les 21 tests et la compilation Node 22 réussissent. Les 203 fichiers publics ont été vérifiés (HTTP 200 et tailles conformes), ainsi que les huit pistes audio (HTTP 206). Lecture native confirmée sur le site public et transition automatique Licaris → Newgen testée. Sauvegarde complète avant publication ; 22 fichiers remplacés, aucun redémarrage nécessaire.

- Sauvegarde : `backups/before-20260914-135708-journey-sound.tar.gz`.
- Manifeste et publication : `releases/20260914-135708-journey-sound/`.
- HTML public SHA-256 : `7389694cb20088af0841377e388e0ddf63c25538be20da2ae7089a06f2a511cd`.
- Archive et contrôles : `ARCHIVES TECHNIQUES/Deploiements/20260914-135708-journey-sound/`.

## Publication précédente — 13 septembre 2026

Version publiée : `20260913-174907-journey-sound`, publiée à la demande du propriétaire sur **https://immersive-studio.fr**. Elle comprend le parcours continu des sept univers, les nouveaux visuels, le défilement automatique et les sept musiques natives (Newgen : Iron de Woodkid). Le son est activé par défaut à l’entrée des projets ; si le navigateur bloque l’autoplay, une interaction sur la page autorise le démarrage. Couper le son reste respecté pendant la navigation.

Les 21 tests, TypeScript et la compilation Node 22 ont réussi. Archive vérifiée par SHA-256, sauvegarde complète avant remplacement des fichiers, ressources copiées avant le HTML et fichiers hashés précédents conservés. Aucun redémarrage du conteneur nécessaire.

- Sauvegarde : `backups/before-20260913-174907-journey-sound.tar.gz` dans le dossier actif indiqué ci-dessous.
- Publication et manifeste : `releases/20260913-174907-journey-sound/`.
- HTML public SHA-256 : `51e23146714428b649342757cf339e3b53c832d225d0de2323af98c6cdbe2acd`.
- Contrôles publics : 194 fichiers HTTP 200 et tailles conformes ; les sept musiques répondent aussi en HTTP 206 aux requêtes partielles. Parcours et lecture native confirmés dans le navigateur public ; aucune erreur de console.
- Archive et rapport local : `ARCHIVES TECHNIQUES/Deploiements/20260913-174907-journey-sound/` dans le dossier Immersive Studio.

`package-static.py` prépare l’export principal de `dist/client`. Les aperçus marketing autonomes et les anciennes ambiances non utilisées sont exclus. `publish-static.py`, exécuté sur la machine, vérifie les fichiers, sauvegarde la version précédente et restaure celle-ci en cas d’échec de validation.

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
