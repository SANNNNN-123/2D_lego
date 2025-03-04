// Define types for our Lego pieces
export type PieceType = "Plate" | "Tile";
export type PieceSize = [number, number]; // [width, height]
export type PieceColor = string;

export interface LegoPiece {
  id: string;
  type: PieceType;
  size: PieceSize;
  color: PieceColor;
  position: [number, number]; // [x, y] on the board
}

export interface BoardState {
  pieces: LegoPiece[];
}

// Available piece sizes
export const PIECE_SIZES: PieceSize[] = [
  [1, 1], // 1x1
  [1, 2], // 1x2
  [1, 3], // 1x3
  [2, 1], // 2x1
  [2, 2], // 2x2
  [2, 3], // 2x3
];

// Available colors
export const COLORS = [
  "#333333", // Dark gray
  "#FFFFFF", // White
  "#FF0000", // Red
  "#FF6600", // Orange
  "#FFCC00", // Yellow
  "#00CC00", // Green
  "#0066FF", // Blue
  "#9900FF", // Purple
]; 