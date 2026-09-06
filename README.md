# Immersive Studio
Vitrine française des six projets roleplay du studio.

## Développement
Node.js **22.x** et npm. Node 24 présente actuellement un problème d’arrêt du processus de construction Vinext sous Windows.
- `npm ci`
- `npm run dev`
- `npm run build` produit le site statique dans `dist/client`.
- `npx oxlint app vite.config.ts next.config.ts` vérifie le code de la vitrine.
- `npx tsc --noEmit` vérifie les types.
Les composants vendus avec le starter, non utilisés par la vitrine, ont leurs propres avertissements de lint préexistants.

## Contenu
Le lien du Discord du studio, fourni par le propriétaire, et les projets sont définis dans `app/page.tsx`.
Le site officiel de L’Héritage de Poudlard est https://heritagedepoudlard.fr/.
Les six projets sont présentés en développement conformément au brief. Aucune date d’ouverture n’est promise.
Les logos de Poudlard, Teen Wolf, Les Quatres Nations, Avengers et The Last of Us proviennent des fichiers du propriétaire.
Aucun logo Percy Jackson n’a été trouvé : sa carte utilise un titre typographique provisoire.
Le nom « Les Quatres Nations » reprend le nom fourni.

## Identité et visuels
Le fichier original du logo est conservé dans le dossier parent. Le PNG détouré est livré séparément sous `../logo-immersive-transparent.png`.
Le détourage ImageGen conserve le monogramme et le cube ; les nuances violettes sont légèrement plus lumineuses que l’original.
Le décor fantastique de l’accueil a été créé avec ImageGen. Prompts et provenance : `ASSETS.md`.
Les images livrées au navigateur sont en WebP. Aucune police externe n’est nécessaire à l’exécution : les polices sont incluses dans l’export.

## Hébergement
Le site fonctionne sans base de données, compte visiteur ni serveur Node en production.
- **Vercel :** importer ce dossier avec Node 22.x. `vercel.json` configure la commande et le dossier de sortie.
- **Hébergeur existant :** déposer le contenu de `dist/client` dans la racine web du domaine ou sous-domaine. Le dossier `_next` doit être conservé.
- Le fichier `../immersive-studio-site.zip` contient l’export prêt à héberger.
- Configurer le nom de domaine et HTTPS auprès de l’hébergeur choisi. Les réglages DNS dépendent du service exact ; ne pas modifier un enregistrement existant sans vérifier sa destination.
- L’aperçu Sites reste privé tant que son accès n’est pas modifié.

## Vérification
Construction statique réussie avec Node 22.23.2, vérification TypeScript et lint du code de la vitrine.
Ressources locales, liens internes et liens sortants contrôlés. Adaptation mobile, menu clavier, lien d’évitement et réduction des mouvements implémentés.
Aucun test visuel automatisé de navigateur n’a été exécuté.

