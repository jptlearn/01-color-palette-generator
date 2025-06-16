# Color Palette Generator

A modern, TypeScript-based color palette generator that creates beautiful, harmonious color combinations with advanced array logic and proper DOM typing.

## Features

✨ **TypeScript Power**: Fully typed codebase with strict type checking
🎨 **Smart Color Generation**: Creates complementary colors using HSL color theory
📱 **Responsive Design**: Beautiful, modern UI that works on all devices
📋 **One-Click Copy**: Click any color to copy its hex code to clipboard
⌨️ **Keyboard Support**: Press spacebar to generate new palettes
🎯 **Array Logic**: Utilizes modern JavaScript array methods (map, forEach)
♿ **Accessibility**: Full keyboard navigation and screen reader support

## Installation & Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Build the TypeScript**:

   ```bash
   npm run build
   ```

3. **Start development**:

   ```bash
   # Watch for changes and rebuild automatically
   npm run dev

   # In another terminal, serve the files
   npm run serve
   ```

4. **Open in browser**: Navigate to `http://localhost:3000`

## Project Structure

```
├── src/
│   └── app.ts          # Main TypeScript application
├── dist/               # Compiled JavaScript (generated)
├── index.html          # HTML structure
├── styles.css          # Modern CSS with animations
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## TypeScript Features

### Interfaces

- `Color`: Complete color object with hex, RGB, and HSL values
- `ColorPalette`: Array-based palette management
- `NotificationOptions`: Type-safe notification system

### Proper DOM Typing

- Strict element type checking with `HTMLElement`, `HTMLButtonElement`, etc.
- Null safety with helper methods
- Event typing with `Event`, `KeyboardEvent`

### Array Logic

- `Array.map()` for color transformation
- `Array.forEach()` for DOM rendering
- Functional programming patterns

## Color Generation Algorithm

The palette generator uses advanced color theory:

1. **Base Color**: Generates a random starting color
2. **Hue Distribution**: Spreads colors evenly around the color wheel
3. **Saturation Variation**: Adds randomness to saturation (20-100%)
4. **Lightness Variation**: Varies lightness for visual interest (20-80%)
5. **HSL Conversion**: Precise color space conversion algorithms

## Keyboard Shortcuts

- **Spacebar**: Generate new palette
- **Tab**: Navigate between colors
- **Enter/Space**: Copy focused color to clipboard

## Browser Support

- Modern browsers with ES2020 support
- Clipboard API with fallback for older browsers
- CSS Grid and Flexbox for layout

## Development Commands

```bash
npm run build    # Compile TypeScript
npm run watch    # Watch for changes
npm run dev      # Development mode
npm run serve    # Serve files locally
```

## API Usage

The generator is available globally for programmatic access:

```javascript
// Get current palette colors
const colors = colorGenerator.getCurrentColors();

// Generate palette from specific colors
colorGenerator.generatePaletteFromColors(["#FF5733", "#33FF57", "#3357FF"]);
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript typing
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use in your projects!
