import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import { useSession } from 'next-auth/react';
import Router from "next/router";

export type ImageProps = {
  id:           string;
  c_id:         string;
  title:        string;
  description:  string;
  format:       string;
  version:      string;
  uploadDate:   string;
  personal:     boolean;
  professional: boolean;
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


const Image: React.FC<{ image: ImageProps, width: string, height: string, checkForSession?: Boolean }> = ({ image, width, height, checkForSession = true }) => { 
  
  if (!image) {
    return <div>
      No Image Provided
    </div>
  }

  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState(false);
  const {data: session} = useSession();
  
  const userHasValidSession = (()=>{
    if (checkForSession) {
      
      return Boolean(session);
    } else return false;
  })();

  const MAX_RETRIES = 3;
  const url = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUD_NAME}/v${image.version}/${image.c_id}.${image.format}`;


  const handleError = () => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prevCount => prevCount + 1);
    } else {
      setError(true);
    }
  }

    
  return (
    <div>
        <ImageWrapper width={width} height={height}>
          {error ? 
            <div>Error loading image</div> : 
    
            <img src={url} onError={handleError}/>
          }
      <div className="info top">{image.title}</div>
      <div className="info bottom">{image.description}</div>
      
    </ImageWrapper>
        {userHasValidSession && 
          <button onClick={()=>{Router.push(`/i/${image.id}`)}}>
            Edit Image
          </button>
        }
    </div>
    
  );
};

export default Image;
