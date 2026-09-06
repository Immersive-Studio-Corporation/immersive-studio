# Immersive Studio

Vitrine multilingue des sept projets Minecraft du studio, version 6.

## Développement

Node.js **22.x** et npm. Node 24 présente un problème d’arrêt du processus de construction Vinext sous Windows.

- `npm ci`
- `npm run dev`
- `npm run build` produit le site statique dans `dist/client`.
- `npm start` sert le résultat via Vinext pour une prévisualisation locale.
- `npx oxlint app vite.config.ts next.config.ts` vérifie le code de la vitrine.
- `npx tsc --noEmit` vérifie les types.
  Les composants du starter non utilisés par la vitrine ont des avertissements de lint préexistants.

## Contenu et langues

Les liens du studio et les visuels des projets sont dans `app/page.tsx`.
Les textes sont dans `app/locales/{langue}.json` : français, anglais, allemand, espagnol, chinois simplifié, coréen, japonais, portugais européen, italien, néerlandais, polonais, russe, turc, arabe, hindi et indonésien.
Le sélecteur traduit toute la page, adapte sa langue, son sens de lecture et son titre, et mémorise le choix localement. Une URL avec `?lang=en`, par exemple, permet de partager un choix de langue.
L’export HTML initial est en français ; la langue sélectionnée est appliquée à l’hydratation côté navigateur.
Poudlard est présenté dans sa propre section, en développement ; les cinq autres univers roleplay sont en préparation. Newgen est un projet futur de mini-jeux, encore au stade du concept. Aucune date d’ouverture n’est promise.
Le nouveau logo Percy Jackson vient du dossier Bureau/Percy Jackson RP/LOGO.png.
Le projet des éléments est présenté sous le nom « Avatar — Les Quatre Nations » ; le menu utilise « Avatar ».

## Identité et animation

Le monogramme IS et son cube sont redessinés en SVG net, à partir de la géométrie du logo fourni.
La séquence de défilement est une animation vectorielle, pas une vidéo : le cube et les lettres se déplacent et se réassemblent dans une scène fixe.
La scène d’ouverture comporte trois temps sur environ quatre hauteurs d’écran. Un fond Canvas de cubes à facettes et de pixels accompagne le logo. Le dessin suit la cadence native de requestAnimationFrame (sans plafond à 30 images/seconde), avec moins de particules sur mobile et arrêt hors écran ou en arrière-plan. Trois chemins unitaires sont réutilisés pour les faces des cubes. Le défilement est interpolé dans le temps et les déplacements du logo utilisent translate3d au lieu de left/top animés. La géométrie de la scène est mesurée au redimensionnement.
Le défilement reste natif. L’animation peut être passée, rejouée et mise en pause depuis le bouton du menu. Sur écran très court, l’introduction reste dans le flux de la page. Elle est réduite automatiquement lorsque le système demande moins de mouvement.
La version SVG autonome est livrée dans le dossier parent. Le logo d’origine et le PNG de la première version sont conservés.
Les sept projets disposent du même format de bandeau panoramique, avec parallaxe au défilement et effets au pointeur : étincelles dorées, bulles océaniques, griffures effilées, quatre éléments, arcs d’énergie et feuilles naturelles. Les bulles sont limitées à Percy Jackson ; l’intro ne contient que des cubes et des pixels. Tous sont directement accessibles depuis le menu avec leur nom et leur logo.
Le studio présente une mosaïque de ses univers ; la carte Discord réunit l’identité du studio et les sept projets, sans compteurs ni messages fictifs.
Les décors thématiques de Poudlard, Avatar, de la Survie, de Percy Jackson, de Teen Wolf, d’Avengers et de Newgen ont été créés avec ImageGen ; ils sont identifiés comme des illustrations d’ambiance. Sources et prompts : `ASSETS.md`.
Les polices latines et les images WebP sont incluses dans l’export. Les caractères asiatiques utilisent aussi les polices disponibles sur l’appareil.

## Hébergement

Le site fonctionne sans base de données ni serveur applicatif en production.

- Vercel : importer le dossier avec Node 22.x ; `vercel.json` est prêt.
- Hébergeur existant : déposer tout le contenu de `dist/client` à la racine du domaine ou sous-domaine, en conservant `_next`.
- `../immersive-studio-site.zip` contient la dernière version autonome.
- Hébergement retenu : OG-YOSHUN (91.197.6.63), sous immersive.heritagedepoudlard.fr. Le propriétaire a ajouté le DNS A chez IONOS ; sa résolution est vérifiée. Activation administrateur Nginx/HTTPS encore nécessaire.
- L’ancien aperçu Sites est public ; le domaine choisi pointe directement vers OG-YOSHUN.

## Vérification

Construction statique avec Node 22, vérification TypeScript, lint du code de la vitrine, contrôle des 113 clés pour chaque langue et des ressources/liens de l’export.
Adaptations mobile, navigation clavier, FAQ accessible et réduction des mouvements implémentées.
Contrôles navigateur effectués sur mobile (390 × 844) et bureau (1600 × 950) : changement des seize langues, lecture RTL arabe, titres longs, absence de débordement horizontal, menu mobile, ancres des projets, transparence de Percy et nouveau décor de Poudlard. L’en-tête reste sur une seule ligne sur écran large. Les contenus italiens et russes ont été ajustés après détection de débordements.

## Logos détourés et effets

Les silhouettes de Teen Wolf, Avengers, Avatar, Percy Jackson et Newgen sont définies dans `assets/wordmark-masks/`. `node scripts/export-wordmarks.mjs` exporte ces découpes vectorielles sur les pixels d’origine vers des PNG transparents et leurs versions WebP. Les textures restent opaques. Les PNG livrés se trouvent dans `public/images/` ; les originaux sont conservés.
Les feuilles utilisent une photographie détourée CC0, décrite dans `ASSETS.md`. Les effets au pointeur ne capturent pas les clics, s’arrêtent après dissipation, hors écran, lors de la pause et lorsque le système réduit les animations. Les Canvas sont décoratifs et masqués aux lecteurs d’écran.

Le bandeau supérieur est stylé dans `app/header.css`, avec une navigation compacte à partir de 1551 pixels et un menu mobile en dessous. La barre de défilement utilise les couleurs du studio. Les illustrations générées ne représentent pas des captures de gameplay.

V5 : l’aperçu de développement a été mesuré à environ 120 images/s sur ce navigateur ; le dessin des cubes prenait environ 0,3–0,4 ms par image. Ces mesures dépendent de l’appareil et de l’écran. Les compteurs de diagnostic ne sont actifs qu’en développement. Pause pendant le défilement, reprise, redémarrage, variantes mobile et conservation du logo vérifiés.

V6 : nom complet de L’Héritage de Poudlard dans le menu, logos agrandis, collection centrée sur grand écran et fond dégradé lavande/violet. Le menu se replie sur les écrans plus étroits pour préserver la lisibilité.

## Installation indépendante de ChatGPT

La procédure et les configurations sont dans `hosting/yoshun/README.md`. Les fichiers publics sont déposés sur OG-YOSHUN sous `/home/hdpbots/immersive-studio/staging/20260906-domain`. La configuration Nginx a passé sa validation, et un serveur local temporaire a servi la page et ses 24 ressources distinctes avec succès. Ce serveur de test est arrêté. Le compte SSH disponible ne permet pas l’activation administrateur ; aucun hôte virtuel public n’a été changé.
