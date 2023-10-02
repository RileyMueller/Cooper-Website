import React, { useState, useEffect } from "react";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import Gallery from "../components/Gallery";
import { ImageProps } from "../components/Image";
import prisma from "../lib/prisma";
import Image from "../components/Image";

export const getStaticProps: GetStaticProps = async () => {
  const gallery = await prisma.image.findMany({
    
    orderBy: {
      uploadDate: 'desc',
    },
  });

  const config = await prisma.config.findMany({});

  const imageJSON = config.find(item => item.key === 'homepageImageId');

  const imageId = imageJSON ? imageJSON.value : null;

  const homepageImage: ImageProps = imageId ? gallery.find(item => item.id === imageId) : null;
  
  const descJSON = config.find(item => item.key === 'homepageDescription');
  
  const description = descJSON ? descJSON.value : 'Need to set a description in /config';

  return {
    props: { gallery, description, homepageImage },
    revalidate: 10,
  };
};

type Props = {
  gallery: ImageProps[];
  description: string;
  homepageImage: ImageProps;
};

const Homepage: React.FC<Props> = (props) => {
  const personalImages = props.gallery.filter(image => image.personal);
  const professionalImages = props.gallery.filter(image => image.professional);

  return (
    <Layout>
        <h1>Cooper Mueller</h1>
        <p>
          {props.description}
        </p>
        <Image image={props.homepageImage} width="400px" height="400px" />
        <div>
          <h2>Personal Images</h2>
          <Gallery images={personalImages} />

          <h2>Professional Images</h2>
          <Gallery images={professionalImages} />
        </div>
    </Layout>
  );
};

export default Homepage;
