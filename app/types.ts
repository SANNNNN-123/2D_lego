// Define types for our Lego pieces
export type PieceType = 'Plate' | 'Tile';
export type PieceSize = [number, number]; // [width, height]
export type Position = [number, number]; // [x, y]

export const COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#CC0000', // Red
  '#006400', // Dark Green
  '#0000CC', // Blue
  '#FFA500', // Orange
  '#F5F5DC', // Beige
  '#8B4513', // Brown
  '#87CEEB', // Light Blue
  '#90EE90', // Light Green
  '#808080', // Gray
  '#696969', // Dark Gray
  '#FF69B4', // Pink
  '#FF4500', // Orange Red
  '#8A2BE2', // Purple
  '#800000', // Maroon
  '#F0E68C', // Khaki
] as const;

// Define the base color type from the COLORS array
export type BaseColor = typeof COLORS[number];

// Extend PieceColor to allow for both hex colors and string-based rgba colors
export type PieceColor = BaseColor | string;

export const PIECE_SIZES: PieceSize[] = [
  [1, 1],
  [2, 1],
  [2, 2],
  [2, 3],
  [2, 4],
  [4, 1],
  [4, 2],
  [6, 1],
  [6, 2],
  [8, 1],
];

export interface LegoPiece {
  id: string;
  type: PieceType;
  size: PieceSize;
  position: Position;
  color: PieceColor;
}

export interface BoardState {
  pieces: LegoPiece[];
} 