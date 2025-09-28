/**
 * Color palette interfaces for the PixiJS project
 */

// Base color palette interface
export interface ColorPalette {
  [key: string]: number; // Hex color values like 0xFF0000
}

// Specific palette interfaces for different themes/contexts
export interface BasicPalette extends ColorPalette {
  red: number;
  blue: number;
  green: number;
}
