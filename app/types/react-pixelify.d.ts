declare module 'react-pixelify' {
  export interface PixelifyProps {
    src: string;
    pixelSize?: number;
    width?: number;
    height?: number;
    centered?: boolean;
    fillTransparencyColor?: string;
    styled?: boolean;
  }

  export const Pixelify: React.FC<PixelifyProps>;
} 