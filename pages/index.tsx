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

  const config = await prisma.config.findMany({
    where: {
      key: {
        in: ['homepageImageId', 'homepageDescription']
      }
    }
  });
  
  const imageConfig = config.find(item => item.key === 'homepageImageId');
  const imageId = imageConfig?.value;
  
  const descConfig = config.find(item => item.key === 'homepageDescription');
  const description = descConfig?.value || 'Need to set a description in /config';
  

  
  const homepageImage: ImageProps = imageId ? gallery.find(item => item.id === imageId) : null;
  
  
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

const Homepage = (props: Props) => {
  const personalImages = props.gallery.filter(image => image.personal);
  const professionalImages = props.gallery.filter(image => image.professional);

  return (
    <Layout>
        <h1>Cooper Mueller</h1>
        <p>
          {props.description}
        </p>
        <Image image={props.homepageImage} width="400px" height="400px" variant="homepage"/>
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
