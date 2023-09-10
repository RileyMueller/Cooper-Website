import React from "react";
import Image, { ImageProps } from "./Image";
import styled from 'styled-components';

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); // Adjust minmax values as needed
  gap: 16px; // Adjust the gap as needed
  width: 100%;
`;

const Gallery: React.FC<{ images: ImageProps[] }> = ({ images }) => {
  return (
    <GalleryGrid>
      {images.map((image, index) => (
        <Image key={index} image={image} width="200px" height="200px" />
      ))}
    </GalleryGrid>
  );
}

export default Gallery;
