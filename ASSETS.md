# Sources des visuels

Les originaux des projets ont été fournis dans les dossiers Bureau correspondants. Les dérivés WebP sont optimisés pour le site et n’altèrent pas les originaux.

- Poudlard : Visuels launcher/launcher-hero-bg.png et heritage-logo-full.png.
- Teen Wolf RP : b4d3ce0d-3082-4bcc-b778-eb8393d568ce.png.
- Les Quatres Nations : 15aabaa8-d899-4232-87eb-65b25526e26a.png.
- Avengers RP : 65cd8e89-f7ba-42d5-b8b8-2216faef336d.png.
- The Last of Us RP : 9bf6b9ba-44f5-40fb-be01-022d56e61f41.png.

## ImageGen intégré — monogramme

Édition de 3021fe2c-7acf-4dc8-a503-a366f8852102.png.
Prompt : Use case: background-extraction. Asset type: transparent brand monogram for a premium French roleplay portfolio website. Input image: the supplied file is the EDIT TARGET. Primary request: extract only the existing purple angular IS monogram with its floating cube above. Remove the full IMMERSIVE STUDIO wordmark, both small decorative horizontal rules, all background, and background glow. Invariants: preserve the exact original geometry of the I, S and cube, their relative placement, spacing, proportions, silhouette, edge angles and existing violet/amethyst gradients. Do not redesign or add any element. Keep the three cube faces and their original shading exactly. Output: actual alpha transparency, not a painted checkerboard or black/white background. Tightly bounded portrait canvas around the cube plus IS monogram with only a slight transparent margin. Crisp clean premium edges. No text, no wordmark, no decorative rules.
Sortie : public/images/studio-mark.webp et PNG dans le dossier parent. La génération a éclairci les violets et laisse quelques petits artefacts de bord.

## ImageGen intégré — décor d’accueil original

Prompt : Use case: stylized-concept. Asset type: wide landscape website hero backdrop, at least 1536x1024, widest landscape composition available. Primary request: an original premium cinematic dark fantasy roleplay world at night violet twilight. A monumental ancient gothic castle stands atop a remote cliff in the RIGHT THIRD of the composition, across expansive layered misty forest mountains. Distant subtle purple cosmic aurora and deep starry indigo sky. Style/medium: strong realistic AAA game concept art, grounded detailed architecture and landscape, rich contrast and restrained cinematic atmosphere. Composition: wide landscape. Reserve expansive empty dark space across the LEFT HALF for website headline text. Place castle and grounded detail at bottom-right; layered mountains and forest recede softly through mist. The castle must be visible and recognizable, majestic but distant. Lighting and palette: black obsidian and amethyst palette, restrained violet glow, subtle warm castle window lights, deep night, atmospheric mist. Constraints: no text, no logos, no UI, no watermark, no people, no specific existing intellectual-property location. Do not make a cartoon.
Sortie : public/images/hero-world.webp.

## Version 2 — sources complémentaires

- Percy Jackson RP : Bureau/Percy Jackson RP/LOGO.png, converti en public/images/percy.webp.
- Le monogramme animé et le favicon utilisent maintenant une géométrie SVG nette (app/studio-mark.tsx), inspirée directement du logo fourni. Les anciens fichiers de la première version sont conservés.
- Décors Nations et Survie : génération avec l’outil ImageGen intégré, deux demandes sans variantes. Résultats : public/images/nations-world.webp et public/images/survival-world.webp. Illustrations thématiques, pas des captures du jeu.

### Prompts exacts des deux décors

Built-in image_gen. Exactly two calls issued together in one parallel batch. No variants or retries.

ELEMENTAL NATIONS — elemental-nations-v2.png
Use case: stylized-concept
Asset type: thematic landscape illustration for a roleplay game portfolio background, not a gameplay capture.
Primary request: A sophisticated stylized voxel game environment evoking four elemental nations. Lush mountain terraces and ancient Asian-inspired stone temples, a waterfall on the left, a warm distant volcanic glow on the right, swirling pale clouds in the sky and a mossy stone foreground.
Style/medium: Beautiful handcrafted voxel game-world concept art, visibly block-built yet artistically refined, neither photorealistic nor glossy.
Composition/framing: Landscape 1536x1024 or widest available landscape; expansive wide view. Keep the middle third fairly low-detail and visually calm, suitable for a large circular elemental emblem overlay later. Do not render an emblem.
Lighting/mood: Bright clear colorful cinematic daylight, inviting and epic.
Color palette: Turquoise, jade and amber, balanced natural color.
Constraints: No people, text, logos, watermarks, UI or borders. Avoid photorealism, overdone AI glows, oversaturated neon and excessive haze.

OVERGROWN CITY — overgrown-city-v2.png
Use case: stylized-concept
Asset type: thematic landscape illustration for a survival roleplay game portfolio background, not a gameplay capture.
Primary request: A cinematic painterly abandoned city avenue reclaimed by lush vegetation, warm daylight breaking through a tree canopy, mossy building facades and a distant ruined watchtower.
Style/medium: Detailed painterly environmental concept art with grounded architecture and a quiet human-scale survival mood.
Composition/framing: Wide landscape 1536x1024 or widest available landscape. Buildings and foliage frame a broad calm avenue center, leaving enough visual breathing room for a title logo overlay later. Do not render a title or logo.
Lighting/mood: Warm cinematic daylight, well-lit detailed scene, still and contemplative.
Color palette: Olive-green and amber, natural tonal separation.
Constraints: No people, zombies, blood, text, logos, UI, watermarks or borders. Avoid photorealism, overdone AI glows, dark muddy shadows and exaggerated post-apocalyptic spectacle.

## Version 3 — panoramas cinématiques

Trois illustrations originales créées avec ImageGen, sans personnages, texte ou logo. Elles évoquent les thèmes des projets et ne sont pas des captures de gameplay. Les logos fournis sont superposés séparément, leurs fichiers restent inchangés.

- mythological-ocean.png → public/images/percy-world.webp
- supernatural-town.png → public/images/teen-world.webp
- emerald-city.png → public/images/avengers-world.webp

Prompts et provenance exacts :

```json
{
  "mode": "built-in image_gen",
  "purpose": "Original atmosphere illustrations, not actual gameplay",
  "assets": [
    {
      "key": "mythological-ocean",
      "prompt": "Use case: stylized-concept. Asset type: premium cinematic full-width website project banner, original atmosphere illustration, 16:9 landscape. Primary request: mythological ocean adventure, spectacular deep turquoise crashing sea around ancient Greek marble temple ruins on a rocky island. Dawn storm parting, radiant gold sunlight through clouds, subtle godly scale expressed through immense waves and architecture. Sophisticated detailed game environment concept art, dramatic natural textures and believable depth. Composition: wide panoramic view, place the marble island temple and most spectacular breaking wave in the right 55%; the left 45% remains open darker atmospheric storm sky and shadowy sea, with low visual detail and ample negative space for white website text. Keep important right focal details within the central vertical 65% for cropping to a wide 600px banner. Color palette: deep turquoise, navy, weathered ivory marble, restrained gold dawn light. Rich darks but readable details, atmospheric perspective, premium cinematic art direction. Constraints: no people, no characters, no words, no typography, no logos, no UI, no watermark; not a screenshot or actual gameplay. Landscape 16:9 image, edge-to-edge environment.",
      "path": "C:/Users/Derek/Desktop/IMMERSIVE STUDIOS/work-v3/assets/mythological-ocean.png"
    },
    {
      "key": "supernatural-town",
      "prompt": "Use case: stylized-concept. Asset type: premium cinematic full-width website project banner, original atmosphere illustration, 16:9 landscape. Primary request: supernatural small-town mystery on conifer forest outskirts, a distant American town at night beneath a huge luminous moon and drifting mist. Sophisticated detailed game environment concept art, cinematic dark yet readable. Right side focal scene: silver moon hanging above misty mountains, tall conifers framing the distant town and faint street lights, eerie restrained blood-red glow in low fog near town. Left 45% is open shadowy blue-black forest-edge mist and subdued night sky, low detail atmospheric negative space for white website text. Keep important focal details in right 55%, within central vertical 65% for wide 600px-tall banner crop. Color palette: cold blue, ink navy, silver, very muted deep crimson accents; believable depth, rich tonal gradients, atmospheric photography-inspired lighting. Constraints: no people, no characters, no creatures, no words, no logos, no text, no UI, no watermark; no recognizable franchise imagery. Original cinematic world atmosphere, not actual gameplay. Landscape 16:9, edge-to-edge environment.",
      "path": "C:/Users/Derek/Desktop/IMMERSIVE STUDIOS/work-v3/assets/supernatural-town.png"
    },
    {
      "key": "emerald-city",
      "prompt": "Use case: stylized-concept. Asset type: premium cinematic full-width website project banner, original atmosphere illustration, 16:9 landscape. Primary request: a vast contemporary futuristic superhero-world city skyline at late dusk, towering original skyscrapers, striking green and teal energy aurora weaving through a cloudy sky. Sophisticated detailed game environment concept art, cinematic scale, believable architectural material textures, urban depth, restrained glowing emerald highlights. Composition: panoramic elevated distant view, dramatic tallest skyscrapers and luminous green energy cloud formations in the right 55%; left 45% stays open darker atmospheric dusk sky and distant low city silhouettes, subdued enough for white text. Keep focal scene in central vertical 65% so cropping to a wide 600px banner retains skyline and energy aurora. Color palette: midnight blue, charcoal, teal and emerald luminous accents; dark but legible buildings and softly lit windows. Constraints: original city and building silhouettes only, no recognizable franchise buildings, no people, no heroes or characters, no logos, no words, no text, no UI, no watermark. Original environment illustration, not gameplay. Landscape 16:9, edge-to-edge environment.",
      "path": "C:/Users/Derek/Desktop/IMMERSIVE STUDIOS/work-v3/assets/emerald-city.png"
    }
  ]
}
```

Le fond de l’introduction est un Canvas procédural de géométrie abstraite (cubes et pixels) ; aucune vidéo externe n’est téléchargée.

## Version 3 — silhouettes et feuille

- Teen Wolf RP et Avengers RP : lettres et textures des logos fournis, isolées par des contours vectoriels éditables (`assets/wordmark-masks/`), export PNG/WebP via `scripts/export-wordmarks.mjs`.
- Les Quatres Nations : cercle et quatre pointes du médaillon conservés opaques ; extérieur transparent, export PNG/WebP.
- Les tentatives ImageGen de détourage avec damier peint n’ont pas été utilisées. Aucun logo n’a été remplacé par leur résultat.
- Feuille naturelle : `leaf-sprite.webp`, dérivée par redimensionnement de `plant_17.png`, source [OpenGameArt](https://opengameart.org/node/20070), contributeur rubberduck, photographie burningwell selon la collection. Licence [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).


## V4 — luminous Hogwarts and Newgen

# Hogwarts luminous banner v4

Generator: built-in image_gen.imagegen
Date: 2026-09-06
Intent: one new project-bound cinematic Minecraft panorama
Original: C:/Users/Derek/.codex/generated_images/01a0773b-6262-7973-9a84-0c4563955a6a/exec-24394d80-1234-470e-80c8-144677915340.png
Selected workspace asset: C:/Users/Derek/Desktop/IMMERSIVE STUDIOS/work-v4/assets/hogwarts-luminous-v4.png
Dimensions: 1672 × 941 pixels, approximately 16:9

## Exact prompt

Use case: stylized-concept
Asset type: premium website cinematic project banner, wide 16:9 landscape.
Primary request: a breathtaking luminous Hogwarts (Poudlard) castle panorama, the recognizable majestic 2010 Harry Potter film-era Hogwarts silhouette faithfully reimagined as an exceptionally sophisticated Minecraft build, with refined small-scale voxel architecture and beautiful cinematic shader rendering. This is a polished aspirational showcase of a Minecraft world.
Scene/backdrop: Highland lake, green steep hills, distant blue mountains and a stone viaduct approaching the castle across the water. Lush natural landscape, beautiful tranquil lake reflections.
Subject: monumental intricately detailed Hogwarts castle dominating center-right, iconic clustered soaring towers with pointed slate roofs, large central tower, Great Hall, layered courtyards and arched stone bridge, pale honey limestone. Clear and coherent castle silhouette, refined construction with visible subtle voxel steps and block-built stonework, not a generic fantasy castle.
Style/medium: premium cinematic Minecraft architectural screenshot, very high fidelity path-traced shaders, tangible fine voxel geometry, delicately detailed stone, physically beautiful light and water, filmic color grading and tremendous sense of scale.
Composition/framing: expansive wide elevated establishing shot, castle centered around 66% across the frame with its complete tallest tower visible and generous sky above. Left third relatively quiet with broad lake and atmospheric blue-green hills for later white headline overlay. No foreground object obstructing the landscape. Beautiful balanced panorama, not a centered postcard crop.
Lighting/mood: bright early golden daylight after clearing clouds, airy luminous blue and cream sky, warm sunbeams illuminate castle stone and green hills, a restrained trace of golden magical shimmer gently catching the air around the turrets. Optimistic, wondrous, elegant, vividly alive.
Color palette: luminous ivory and warm gold, verdant green, atmospheric blue, soft cream clouds. Rich but refined, natural highlights.
Constraints: no text, no typography, no logos, no watermark, no UI, no people, no characters. Bright daylight, never nighttime, avoid oppressive shadows, avoid garish purple effects, avoid cartoon toy castle, avoid large crude chunky blocks or muddy low-detail geometry. Preserve recognizable Minecraft construction while delivering cinema-quality light and atmosphere.

## Visual QA

Passed: bright golden daylight; coherent recognizable Hogwarts castle; fine voxel stone and terraced terrain; center-right dominant castle; calm left lake and mountains for text placement; blue and cream cloud sky; green highlands, bridge, lake reflections; restrained gold magical sparkles; no text, logo, watermark or UI visible. The tallest turret sits near the top edge, so use object-fit positioning that preserves the tower in taller crops. Text on the bright upper-left sky will benefit from a local subtle contrast treatment; lower-left water naturally carries white copy more readily.



# Newgen world concept v4

Generator: built-in image_gen.imagegen
Date: 2026-09-06
Intent: one new speculative concept backdrop for a future Minecraft minigame project; not evidence of an actual game world or gameplay screenshot.
Reference image: C:/Users/Derek/Desktop/NEW GEN/7e89996d-e97e-439d-b98d-dcb3ec653e82.png (tropical atmosphere and palette only)
Generated original: C:/Users/Derek/.codex/generated_images/01a0773b-6262-7973-9a84-0c4563955a6a/exec-a97e6730-5ab5-4433-b8d3-b4647580c215.png
Selected workspace asset: C:/Users/Derek/Desktop/IMMERSIVE STUDIOS/work-v4/assets/newgen-world-v4.png
Dimensions: 1672 × 941 pixels, approximately 16:9

## Exact prompt

Use case: stylized-concept
Asset type: one 16:9 wide panoramic concept-art backdrop for a future Minecraft minigame project website.
Primary request: an elegant premium cinematic Minecraft tropical dreamworld, serene and mysterious, floating voxel islands over a beautiful turquoise lagoon, palms, ancient stone gateways and imaginative parkour stepping platforms suspended over water. It is evocative future-world concept art, not documentary gameplay.
Input images: Image 1 is a visual reference ONLY for tropical atmosphere and warm wood / turquoise / ivory / gold palette. Do not reproduce or include any part of its lettering, logo or wooden sign. Generate only a NEW scenic environment, without lettering.
Scene/backdrop: inviting clear lagoon, distant hazy tropical islands and luminous clouds, pale golden beaches, block-built floating islands with green grass, small detailed palm trees and weathered stone arches; a few elegant stepping platforms tracing a playful route between the main islands, waterfalls dropping into the lagoon. Mysterious imaginative world on the horizon, expansive and serene.
Composition/framing: broad 16:9 panorama. Rich visual subject in the right 60 percent: several distinct floating islands, temple gateways and suspended paths over water. Quieter atmospheric left 40 percent with broad lagoon, distant silhouettes and open sky for later copy overlay. Strong sense of depth, refined coherent architecture, generous sky with all tall structures visible.
Style/medium: sophisticated voxel environment concept art with recognizable Minecraft blocks, finely built architecture and blocky palm leaves, cinematic physically rendered shaders, beautiful volumetric atmosphere, exquisite water reflections, natural rather than cartoonish, premium project showcase.
Lighting/mood: luminous late afternoon, warm golden sunlight playing on ivory stone and lush green vegetation, rich turquoise water grading into cobalt distance, subtle lavender cloud shadows and a restrained magical glow inside stone gateways. Hopeful, mysterious and inviting.
Constraints: Absolutely no words, no text, no logos, no watermark, no wooden sign, no people, no avatars, no characters, no UI, no frame. Avoid garish neon, crude chunky geometry, dark nighttime, excessive magical particles or busy left foreground. Preserve serene cinematic sophistication and clear voxel construction.

## Visual QA

Passed: recognizable sophisticated voxel construction; luminous gold afternoon light; turquoise lagoon and cobalt distance; subtle lavender clouds; floating temple islands and palm trees on the right; glowing stone gateway; parkour stepping platforms; quiet left water and distant atmospheric silhouettes; no words, logos, sign, watermark, people, avatars or UI. The scene is a generated speculative concept; label as a future project/concept if needed in the page context. Preserve the top of the large center-right stone gateway when cropping. White copy over the upper-left sunlight needs a local contrast treatment; lower-left water is calmer and darker.



Integration: generated images exported as heritage-luminous.webp and newgen-world.webp (WebP quality90). These are labeled atmospheric illustrations, not gameplay captures.

Percy Jackson: the supplied original percy.webp is preserved behind editable assets/wordmark-masks/percy.svg. The silhouette follows the medallion and four jewels; exported to transparent percy-emblem.png and .webp by scripts/export-wordmarks.mjs. No internal opacity, blend or fade mask.

Newgen: supplied by the user in Desktop/NEW GEN/7e89996d-e97e-439d-b98d-dcb3ec653e82.png. Original stored as newgen-original.webp; the existing artwork is preserved behind assets/wordmark-masks/newgen.svg to isolate the wooden sign and grass block. Native vector export produces transparent newgen-wordmark.png and .webp. The palm and beach are not part of the isolated sign.
