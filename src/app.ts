// Type definitions for our color palette system
interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

interface ColorPalette {
  colors: Color[];
  size: number;
}

interface NotificationOptions {
  message: string;
  duration?: number;
}

// Color utility functions with proper typing
class ColorUtils {
  /**
   * Generates a random hex color
   */
  static generateRandomHex(): string {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  /**
   * Converts hex to RGB values
   */
  static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1]!, 16),
          g: parseInt(result[2]!, 16),
          b: parseInt(result[3]!, 16),
        }
      : null;
  }

  /**
   * Converts RGB to HSL values
   */
  static rgbToHsl(
    r: number,
    g: number,
    b: number
  ): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number = 0;
    let s: number = 0;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  /**
   * Creates a complete Color object from hex
   */
  static createColor(hex: string): Color {
    const rgb = this.hexToRgb(hex);
    if (!rgb) {
      throw new Error(`Invalid hex color: ${hex}`);
    }

    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);

    return { hex, rgb, hsl };
  }

  /**
   * Generates complementary colors based on a base color
   */
  static generateComplementaryColors(baseHex: string, count: number): string[] {
    const baseRgb = this.hexToRgb(baseHex);
    if (!baseRgb) return [];

    const baseHsl = this.rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
    const colors: string[] = [baseHex];

    // Generate variations by adjusting hue, saturation, and lightness
    for (let i = 1; i < count; i++) {
      const hueShift = (360 / count) * i;
      const newHue = (baseHsl.h + hueShift) % 360;

      // Add some randomness to saturation and lightness
      const saturationVariation = (Math.random() - 0.5) * 40;
      const lightnessVariation = (Math.random() - 0.5) * 30;

      const newSaturation = Math.max(
        20,
        Math.min(100, baseHsl.s + saturationVariation)
      );
      const newLightness = Math.max(
        20,
        Math.min(80, baseHsl.l + lightnessVariation)
      );

      const newColor = this.hslToHex(newHue, newSaturation, newLightness);
      colors.push(newColor);
    }

    return colors;
  }

  /**
   * Converts HSL to hex
   */
  private static hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b)
      .toString(16)
      .slice(1)
      .toUpperCase()}`;
  }
}

// Main ColorPaletteGenerator class with proper DOM typing
class ColorPaletteGenerator {
  private paletteContainer: HTMLElement;
  private generateButton: HTMLButtonElement;
  private paletteSizeInput: HTMLInputElement;
  private paletteSizeDisplay: HTMLElement;
  private notificationElement: HTMLElement;
  private notificationText: HTMLElement;

  private currentPalette: ColorPalette;

  constructor() {
    // Get DOM elements with proper typing and null checks
    this.paletteContainer =
      this.getRequiredElement<HTMLElement>("colorPalette");
    this.generateButton =
      this.getRequiredElement<HTMLButtonElement>("generateBtn");
    this.paletteSizeInput =
      this.getRequiredElement<HTMLInputElement>("paletteSize");
    this.paletteSizeDisplay =
      this.getRequiredElement<HTMLElement>("paletteSizeValue");
    this.notificationElement =
      this.getRequiredElement<HTMLElement>("notification");
    this.notificationText =
      this.getRequiredElement<HTMLElement>("notificationText");

    // Initialize with empty palette
    this.currentPalette = { colors: [], size: 5 };

    // Set up event listeners
    this.initializeEventListeners();

    // Generate initial palette
    this.generatePalette();
  }

  /**
   * Helper method to get DOM elements with proper error handling
   */
  private getRequiredElement<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id) as T | null;
    if (!element) {
      throw new Error(`Required element with id '${id}' not found`);
    }
    return element;
  }

  /**
   * Initialize all event listeners with proper typing
   */
  private initializeEventListeners(): void {
    // Generate button click handler
    this.generateButton.addEventListener("click", () => {
      this.generatePalette();
    });

    // Palette size input change handler
    this.paletteSizeInput.addEventListener("input", (event: Event) => {
      const target = event.target as HTMLInputElement;
      const newSize = parseInt(target.value, 10);
      this.paletteSizeDisplay.textContent = newSize.toString();
      this.currentPalette.size = newSize;
      this.generatePalette();
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.code === "Space" && !event.repeat) {
        event.preventDefault();
        this.generatePalette();
      }
    });
  }

  /**
   * Generates a new color palette using array methods
   */
  private generatePalette(): void {
    const size = this.currentPalette.size;

    // Generate base color and complementary colors
    const baseHex = ColorUtils.generateRandomHex();
    const hexColors = ColorUtils.generateComplementaryColors(baseHex, size);

    // Create Color objects using array map
    this.currentPalette.colors = hexColors.map((hex) =>
      ColorUtils.createColor(hex)
    );

    // Render the palette
    this.renderPalette();
  }

  /**
   * Renders the color palette in the DOM
   */
  private renderPalette(): void {
    // Clear existing content
    this.paletteContainer.innerHTML = "";

    // Create color items using array forEach
    this.currentPalette.colors.forEach((color, index) => {
      const colorItem = this.createColorElement(color, index);
      this.paletteContainer.appendChild(colorItem);
    });
  }

  /**
   * Creates a single color element with proper event handling
   */
  private createColorElement(color: Color, index: number): HTMLElement {
    const colorItem = document.createElement("div");
    colorItem.className = "color-item";
    colorItem.setAttribute("data-color-index", index.toString());

    const colorPreview = document.createElement("div");
    colorPreview.className = "color-preview";
    colorPreview.style.backgroundColor = color.hex;

    const colorInfo = document.createElement("div");
    colorInfo.className = "color-info";

    const colorHex = document.createElement("div");
    colorHex.className = "color-hex";
    colorHex.textContent = color.hex;

    const colorCopyHint = document.createElement("div");
    colorCopyHint.className = "color-copy-hint";
    colorCopyHint.textContent = "Click to copy";

    // Add click handler for copying
    colorItem.addEventListener("click", () => {
      this.copyColorToClipboard(color.hex);
    });

    // Add accessibility attributes
    colorItem.setAttribute("role", "button");
    colorItem.setAttribute("tabindex", "0");
    colorItem.setAttribute(
      "aria-label",
      `Copy color ${color.hex} to clipboard`
    );

    // Handle keyboard navigation
    colorItem.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.code === "Enter" || event.code === "Space") {
        event.preventDefault();
        this.copyColorToClipboard(color.hex);
      }
    });

    colorInfo.appendChild(colorHex);
    colorInfo.appendChild(colorCopyHint);
    colorItem.appendChild(colorPreview);
    colorItem.appendChild(colorInfo);

    return colorItem;
  }

  /**
   * Copies color hex code to clipboard with proper error handling
   */
  private async copyColorToClipboard(hex: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(hex);
      this.showNotification({
        message: `Copied ${hex} to clipboard!`,
        duration: 2000,
      });
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      this.fallbackCopyToClipboard(hex);
    }
  }

  /**
   * Fallback copy method for older browsers
   */
  private fallbackCopyToClipboard(text: string): void {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      this.showNotification({
        message: `Copied ${text} to clipboard!`,
        duration: 2000,
      });
    } catch (error) {
      this.showNotification({
        message: "Failed to copy to clipboard",
        duration: 3000,
      });
    } finally {
      document.body.removeChild(textArea);
    }
  }

  /**
   * Shows a notification with animation
   */
  private showNotification(options: NotificationOptions): void {
    this.notificationText.textContent = options.message;
    this.notificationElement.classList.add("show");

    setTimeout(() => {
      this.notificationElement.classList.remove("show");
    }, options.duration || 3000);
  }

  /**
   * Public method to get current palette colors as array
   */
  public getCurrentColors(): string[] {
    return this.currentPalette.colors.map((color) => color.hex);
  }

  /**
   * Public method to generate palette with specific colors
   */
  public generatePaletteFromColors(colors: string[]): void {
    try {
      this.currentPalette.colors = colors.map((hex) =>
        ColorUtils.createColor(hex)
      );
      this.currentPalette.size = colors.length;
      this.paletteSizeInput.value = colors.length.toString();
      this.paletteSizeDisplay.textContent = colors.length.toString();
      this.renderPalette();
    } catch (error) {
      console.error("Invalid colors provided:", error);
      this.showNotification({
        message: "Invalid color format provided",
        duration: 3000,
      });
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  try {
    const generator = new ColorPaletteGenerator();

    // Make generator available globally for debugging (optional)
    (window as any).colorGenerator = generator;

    console.log("Color Palette Generator initialized successfully!");
  } catch (error) {
    console.error("Failed to initialize Color Palette Generator:", error);
  }
});
