# PixiJS Demo - AI Agent Instructions

## Architecture Overview

This is a **PixiJS 8.x** game engine with a plugin-based architecture built on top of the standard PixiJS Application class.

### Core Engine (`src/engine/`)
- **`CreationEngine`** extends PixiJS Application with custom plugins
- **Plugin System**: Audio, Navigation, Resize, and UI plugins auto-register via `extensions.add()`
- **Global Access**: Use `engine()` function from `src/app/getEngine.ts` to access the main instance anywhere

### Screen Management Pattern
All screens implement the `AppScreen` interface with lifecycle methods:
```typescript
// Required structure for screens
class MyScreen extends Container {
  static assetBundles = ["bundle-name"]; // Auto-loads assets
  prepare() {} // Setup before showing
  show() {} // Animate in (async)
  hide() {} // Animate out (async)  
  resize(width, height) {} // Handle viewport changes
  update(ticker) {} // Frame updates
  pause/resume() {} // Popup interaction states
}
```

Navigation: `engine().navigation.showScreen(ScreenClass)` handles asset loading and transitions automatically.

### Asset Pipeline (AssetPack)
- **Source**: `raw-assets/` → **Output**: `public/assets/` + `src/manifest.json`
- **Auto-processing**: Images get multiple formats/resolutions, audio gets compressed
- **Bundle loading**: Screens declare `assetBundles` for automatic asset management
- **Background loading**: All bundles load in background after preload bundle

## Development Workflows

### Essential Commands
```bash
pnpm dev        # Start dev server (auto-rebuilds assets via AssetPack)
pnpm build      # Lint + TypeScript check + production build
pnpm lint       # ESLint with Prettier integration
```

### Asset Development
1. Add assets to `raw-assets/main{m}/` or `raw-assets/preload{m}/`
2. AssetPack auto-generates optimized versions in `public/assets/`
3. Reference assets by filename (e.g., `Texture.from("logo.svg")`)

### Adding New Screens
1. Create screen in `src/app/screens/`
2. Extend `Container` and implement `AppScreen` interface
3. Declare `static assetBundles = ["bundle-name"]` for required assets
4. Use `engine().navigation.showScreen(NewScreen)` to display

## Project-Specific Patterns

### Global Engine Access
```typescript
import { engine } from "./app/getEngine";
// Access anywhere: engine().navigation, engine().audio, engine().canvas
```

### Audio Management
- **BGM**: `engine().audio.bgm.play("path/to/music")`  
- **SFX**: `engine().audio.sfx.play("path/to/sound")`
- **Persistent settings**: Use `userSettings` singleton for volume persistence

### Popup System
```typescript
// Present popup (auto-pauses current screen)
engine().navigation.presentPopup(PopupClass);
// Dismiss popup (auto-resumes screen)  
engine().navigation.dismissPopup();
```

### UI Components
- Use `@pixi/ui` components: `FancyButton`, `CircularProgressBar`
- Custom components in `src/app/ui/`: `Button`, `Label`, `RoundedBox`, `VolumeSlider`
- Animation library: `motion` for smooth transitions

## Key Files & Integration Points

- **`src/main.ts`**: Entry point, engine initialization
- **`vite.config.ts`**: AssetPack plugin integration  
- **`src/manifest.json`**: Auto-generated asset manifest (don't edit manually)
- **`src/engine/utils/storage.ts`**: LocalStorage wrapper for persistence
- **`src/app/utils/userSettings.ts`**: Centralized settings management

## Critical Dependencies
- **Node.js**: Requires >=22.0.0 (specified in package.json engines)
- **PNPM**: Package manager (not NPM/Yarn)
- **TypeScript**: Strict mode enabled with comprehensive linting rules