import React, { useState, useEffect } from "react";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import Gallery from "../components/Gallery";
import { ImageProps } from "../components/Image";
import prisma from "../lib/prisma";

export const getStaticProps: GetStaticProps = async () => {
  const gallery = await prisma.image.findMany({
    
    orderBy: {
      uploadDate: 'desc',
    },
  });

  return {
    props: { gallery },
    revalidate: 10,
  };
};

type Props = {
  gallery: ImageProps[];
};

const Homepage: React.FC<Props> = (props) => {
  const personalImages = props.gallery.filter(image => image.personal);
  const professionalImages = props.gallery.filter(image => image.professional);

  return (
    <Layout>
      <div className="page">
        <h1>All Images</h1>
        <main>
          <h2>Personal Images</h2>
          <Gallery images={personalImages} />

          <h2>Professional Images</h2>
          <Gallery images={professionalImages} />
        </main>
      </div>
    </Layout>
  );
};

export default Homepage;
