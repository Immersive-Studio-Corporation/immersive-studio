# Apparence dans les résultats de recherche

Le 7 septembre 2026, le titre français devient « Immersive Studio | Vivez le roleplay Minecraft ». Le titre HTML initial et les métadonnées Open Graph/Twitter utilisent la même traduction que le titre après hydratation.

Le favicon est une pastille violet profond (#24103F), avec le monogramme existant en tons clairs. Sa géométrie vient de `public/images/studio-mark.svg` ; aucun changement du logo utilisé dans la page. `node scripts/export-favicons.mjs` exporte le SVG de travail, le PNG carré 192 × 192 référencé par rel=icon et le PNG 180 × 180 pour Apple. Conserver ces URL stables lors des prochaines mises à jour.

Google doit explorer de nouveau la page et l’icône pour prendre en compte les changements. Son titre affiché peut différer du titre fourni ; cette mise à jour ne garantit ni un délai ni un classement.

Sources : [favicon Google](https://developers.google.com/search/docs/appearance/favicon-in-search) et [titres Google](https://developers.google.com/search/docs/appearance/title-link).
