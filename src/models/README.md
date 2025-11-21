# 3D Models

This folder contains 3D models for the Cosmic Houses visualization.

## Zodiac Sign Models (GLB Format)

Place your zodiac sign 3D models here with the following naming convention:

- `aries.glb`
- `taurus.glb`
- `gemini.glb`
- `cancer.glb`
- `leo.glb`
- `virgo.glb`
- `libra.glb`
- `scorpio.glb`
- `sagittarius.glb`
- `capricorn.glb`
- `aquarius.glb`
- `pisces.glb`

## Usage

These models will be loaded using React Three Fiber's `useGLTF` hook and positioned at the center of each house layer in the spiral visualization.

The component `ZodiacModel3D.tsx` handles:
- Loading GLB models from this folder
- Animating each model with gentle rotation and floating
- Applying layer-specific colors as point lights
- Fallback to wireframe placeholders if models aren't found

## Format Requirements

- **File Format**: GLB (binary glTF)
- **Recommended Size**: Keep models optimized (< 500KB each)
- **Scale**: Models should be designed around 1 unit size (will be scaled to 1.5x in code)
- **Origin**: Center the model at origin (0, 0, 0)
- **Textures**: All textures should be embedded in the GLB file

## After Adding Models

Once you add your GLB files to this folder:

1. The models will automatically load and replace the wireframe placeholders
2. Each zodiac model will float at the center of its corresponding house layer
3. Models will have a gentle rotation animation (configurable via `rotationSpeed` prop)
4. Each model will be illuminated by a colored point light matching its house color

## Installation in Your Environment

**Figma Make does not support GLB file uploads.** To use your models:

1. Export this entire project from Figma Make
2. Set up the project in your local development environment (e.g., Next.js, Vite, etc.)
3. Add your GLB files to the `/public/models/` folder (or `/models/` depending on your setup)
4. The code is already configured and ready to load your models!

## Testing

To verify your models are loading correctly, check the browser console for:
- ✅ Success: Models load silently
- ⚠️ Warning: `"GLB model not found: /models/{name}.glb"` - Add the missing model file