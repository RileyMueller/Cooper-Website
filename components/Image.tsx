import React from "react";
import styled from 'styled-components';
import { useSession } from 'next-auth/react';

export type ImageProps = {
  id: string;
  c_id: string;
  title: string;
  description: string;
  format: string;
  version: string;
  published: boolean;
  uploadDate: string;
};

type ImageStyleProps = {
    width: string,
    height: string
}

const ImageWrapper = styled.div<ImageStyleProps>`
  position: relative;
  width: ${(props)=>props.width};
  height: ${(props)=>props.height};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .info {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.5s;
    background-color: #000000;
    color: #ffffff;

    &.top {
      top: 0;
    }

    &.bottom {
      bottom: 0;
    }
  }

  &:hover .info {
    opacity: .7;
  }
`;

async function deleteImage(id: string): Promise<void> {
    await fetch(`/api/image/${id}`, {
        method: 'DELETE',
    });
}

const Image: React.FC<{ image: ImageProps, width: string, height: string }> = ({ image, width, height }) => {  
    const {data: session, status} = useSession();
    const userHasValidSession = Boolean(session);
    
  return (
    <div>
        <ImageWrapper width={width} height={height}>
      <img src={`https://res.cloudinary.com/${process.env.CLOUD_NAME}/v${image.version}/${image.c_id}.${image.format}`} />
      <div className="info top">{image.title}</div>
      <div className="info bottom">{image.description}</div>
      
    </ImageWrapper>
        {userHasValidSession && <button onClick={()=>deleteImage(image.id)}>Delete</button>}
    </div>
    
  );
};

export default Image;
