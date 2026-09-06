# Immersive Studio

Vitrine multilingue des projets roleplay du studio, version 3.

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
Les textes sont dans `app/locales/{langue}.json` : français, anglais, allemand, espagnol, chinois simplifié, coréen, japonais et portugais européen.
Le sélecteur traduit toute la page, adapte sa langue et son titre, et mémorise le choix localement. Une URL avec `?lang=en`, par exemple, permet de partager un choix de langue.
L’export HTML initial est en français ; la langue sélectionnée est appliquée à l’hydratation côté navigateur.
Poudlard est présenté dans sa propre section, en développement ; les cinq autres univers sont en préparation. Aucune date d’ouverture n’est promise.
Le nouveau logo Percy Jackson vient du dossier Bureau/Percy Jackson RP/LOGO.png.
Le nom « Les Quatres Nations » reprend le nom fourni.

## Identité et animation

Le monogramme IS et son cube sont redessinés en SVG net, à partir de la géométrie du logo fourni.
La séquence de défilement est une animation vectorielle, pas une vidéo : le cube et les lettres se déplacent et se réassemblent dans une scène fixe.
La scène d’ouverture comporte trois temps sur environ quatre hauteurs d’écran. Un fond Canvas de cubes à facettes et de pixels accompagne le logo. Le calcul est limité à environ 30 images/seconde, avec moins de particules sur mobile et arrêt hors écran ou en arrière-plan.
Le défilement reste natif. L’animation peut être passée, rejouée et mise en pause depuis le bouton du menu. Sur écran très court, l’introduction reste dans le flux de la page. Elle est réduite automatiquement lorsque le système demande moins de mouvement.
La version SVG autonome est livrée dans le dossier parent. Le logo d’origine et le PNG de la première version sont conservés.
Les six univers disposent du même format de bandeau panoramique, avec parallaxe au défilement et effets au pointeur : étincelles dorées, bulles océaniques, griffures effilées, quatre éléments, arcs d’énergie et feuilles naturelles. Les bulles sont limitées à Percy Jackson ; l’intro ne contient que des cubes et des pixels. Tous sont directement accessibles depuis le menu avec leur nom et leur logo.
Le studio présente une mosaïque de ses univers ; la carte Discord réunit l’identité du studio et les six projets, sans compteurs ni messages fictifs.
Les décors thématiques des Nations, de la Survie, de Percy Jackson, de Teen Wolf et d’Avengers ont été créés avec ImageGen ; ils sont identifiés comme des illustrations d’ambiance. Sources et prompts : `ASSETS.md`.
Les polices latines et les images WebP sont incluses dans l’export. Les caractères asiatiques utilisent aussi les polices disponibles sur l’appareil.

## Hébergement

Le site fonctionne sans base de données ni serveur applicatif en production.

- Vercel : importer le dossier avec Node 22.x ; `vercel.json` est prêt.
- Hébergeur existant : déposer tout le contenu de `dist/client` à la racine du domaine ou sous-domaine, en conservant `_next`.
- `../immersive-studio-site.zip` contient la dernière version autonome.
- Le domaine et l’hébergeur définitifs restent à confirmer. Les DNS n’ont pas été modifiés.
- L’aperçu Sites conserve son accès privé.

## Vérification

Construction statique avec Node 22, vérification TypeScript, lint du code de la vitrine, contrôle des 102 clés pour chaque langue et des ressources/liens de l’export.
Adaptations mobile, navigation clavier, FAQ accessible et réduction des mouvements implémentées.
Aucun test visuel automatisé de navigateur n’a été exécuté.

## Logos détourés et effets

Les silhouettes de Teen Wolf, Avengers et des Nations sont définies dans `assets/wordmark-masks/`. `node scripts/export-wordmarks.mjs` exporte ces découpes vectorielles sur les pixels d’origine vers des PNG transparents et leurs versions WebP. Les textures restent opaques. Les PNG livrés se trouvent dans `public/images/` ; les originaux sont conservés.
Les feuilles utilisent une photographie détourée CC0, décrite dans `ASSETS.md`. Les effets au pointeur ne capturent pas les clics, s’arrêtent après dissipation, hors écran, lors de la pause et lorsque le système réduit les animations. Les Canvas sont décoratifs et masqués aux lecteurs d’écran.
