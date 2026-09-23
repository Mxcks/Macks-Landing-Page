# Macks Studios Logo Package

Version 1.0.0

This package uses Max's adjusted seven-bar artwork as the geometry source. It contains the mark only. No wordmark was invented because no approved Macks Studios wordmark or type lockup was supplied.

## Start here

| Need | Use |
|---|---|
| Transparent color logo | `png/transparent/mark/macks-studios-mark-color-1600x1200.png` |
| Transparent square logo for profile images | `png/transparent/icon/macks-studios-icon-color-1024x1024.png` |
| Vector master | `vector/mark/macks-studios-mark-color.svg` |
| Solid black | `vector/mark/macks-studios-mark-black.svg` or a matching PNG |
| Solid white | `vector/mark/macks-studios-mark-white.svg` or a matching PNG |
| Dark background preview | `backgrounds/macks-studios-color-on-dark-2048x2048.png` |
| Light background preview | `backgrounds/macks-studios-black-on-light-2048x2048.png` |
| Website favicon | `web/favicon.svg` plus the PNG and ICO fallbacks |
| Apple touch icon | `web/apple-touch-icon.png` |
| Web app icon | `web/icon-192x192.png` and `web/icon-512x512.png` |
| Maskable web app icon | `web/icon-maskable-512x512.png` |
| Print handoff | `print/` |

## Transparency rules

- Every file inside `png/transparent/` has a real alpha channel. The pixels outside the seven bars are alpha 0.
- `public/macks-studios-logo-transparent.png` and `public/macks-studios-icon-transparent.png` are the implementation-ready transparent copies.
- Files inside `backgrounds/` are intentionally opaque presentation exports.
- `web/apple-touch-icon.png` is intentionally opaque for predictable device rendering.
- Files named `icon-maskable-*` are intentionally opaque. Maskable icons need a background because operating systems may crop them into different shapes.
- Preview images are intentionally opaque and must not be used as source artwork.

Some image viewers display transparent pixels against black, white, or a checkerboard. That viewer background is not part of the transparent PNG.

## Variant guidance

| Surface | Preferred | Alternate |
|---|---|---|
| Dark graphite | Color or white | Sage |
| Light neutral | Black or color | Sage |
| Single-color production | Black | White when reversed |
| Circle profile image | Square icon files | Do not crop the 4:3 mark file |
| Small favicon | `web/favicon.svg` | PNG or ICO fallback |

Pure black and pure white files are utility logo variants requested for production. They are not general Macks interface color tokens.

## Clear space and handling

- Keep the seven bars together as one mark.
- Do not change individual bar heights, spacing, slants, or baseline alignment.
- Do not add shadows, glows, outlines, textures, or a semi-transparent background.
- Use the square icon exports when the destination applies a circular crop.
- Use the 4:3 mark exports when the destination accepts the full mark without forced cropping.
- Use SVG whenever the destination supports it. Use PNG when a raster file is required.

## Web implementation

The `web/` folder contains:

- SVG, PNG, and ICO favicon options
- 180 pixel Apple touch icon
- 192 and 512 pixel install icons
- 512 and 1024 pixel maskable icons
- a manifest template
- an HTML link snippet

The matrix follows current platform guidance:

- Google Search requires a square favicon and recommends a size larger than 48 by 48 pixels: https://developers.google.com/search/docs/appearance/favicon-in-search
- Chromium installability guidance calls for 192 and 512 pixel icons: https://web.dev/articles/add-manifest
- Apple documents a 180 pixel touch icon for high-density iPhone displays: https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html
- Maskable icons keep the important mark inside the centered safe zone: https://web.dev/articles/maskable-icon

## Package structure

| Folder | Contents |
|---|---|
| `source/` | Preserved adjusted source artwork |
| `vector/` | SVG mark and square icon masters in color, sage, black, and white |
| `png/transparent/` | Transparent mark and circle-safe square exports |
| `webp/` | Lossless web-ready transparent exports |
| `backgrounds/` | Opaque light-mode and dark-mode presentation exports |
| `web/` | Favicons, touch icons, web app icons, maskable icons, and integration templates |
| `print/` | PDF and EPS vector handoff files |
| `previews/` | Contact sheet, transparency proof, and circle-crop proof |
| `tools/` | Reproducible package builder |

`asset-manifest.json` records file dimensions, formats, hashes, and byte sizes for verification.
