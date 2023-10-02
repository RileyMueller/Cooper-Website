import React from "react";
import Image, { ImageProps } from "./Image";
import styled from 'styled-components';

interface GalleryProps {
  images: ImageProps[];
  minWidth?: string;
  gap?: string;
}

const GalleryGrid = styled.div<{ minWidth: string, gap: string }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${props => props.minWidth || '200px'}, 1fr));
  gap: ${props => props.gap || '16px'};
  width: 100%;
`;

const Gallery = ({ images, minWidth, gap }: GalleryProps) => {
  return (
    <GalleryGrid minWidth={minWidth} gap={gap}>
      {images.map((image) => (
        <Image key={image.id} image={image} width="200px" height="200px" />
      ))}
    </GalleryGrid>
  );
}

export default Gallery;
