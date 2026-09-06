# Immersive Studio

Vitrine multilingue des projets roleplay du studio, version 2.

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
Le défilement reste natif. L’animation peut être passée et rejouée. Elle est réduite automatiquement lorsque le système demande moins de mouvement.
La version SVG autonome est livrée dans le dossier parent. Le logo d’origine et le PNG de la première version sont conservés.
Les nouveaux décors thématiques des Nations et de la Survie ont été créés avec ImageGen ; ils ne sont pas présentés comme des captures de jeu. Sources et prompts : `ASSETS.md`.
Les polices latines et les images WebP sont incluses dans l’export. Les caractères asiatiques utilisent aussi les polices disponibles sur l’appareil.

## Hébergement

Le site fonctionne sans base de données ni serveur applicatif en production.

- Vercel : importer le dossier avec Node 22.x ; `vercel.json` est prêt.
- Hébergeur existant : déposer tout le contenu de `dist/client` à la racine du domaine ou sous-domaine, en conservant `_next`.
- `../immersive-studio-site.zip` contient la dernière version autonome.
- Le domaine et l’hébergeur définitifs restent à confirmer. Les DNS n’ont pas été modifiés.
- L’aperçu Sites conserve son accès privé.

## Vérification

Construction statique avec Node 22, vérification TypeScript, lint du code de la vitrine, contrôle des 90 clés pour chaque langue et des ressources/liens de l’export.
Adaptations mobile, navigation clavier, FAQ accessible et réduction des mouvements implémentées.
Aucun test visuel automatisé de navigateur n’a été exécuté.
