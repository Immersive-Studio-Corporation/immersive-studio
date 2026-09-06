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
