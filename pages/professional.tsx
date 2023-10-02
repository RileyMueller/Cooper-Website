import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Gallery from "../components/Gallery"
import Image, { ImageProps } from "../components/Image"
import prisma from "../lib/prisma"

export const getStaticProps: GetStaticProps = async () => {
    const gallery = (await prisma.image.findMany({
      where: {
        professional: true
      }
    }));
  
  return { 
    props: { gallery }, 
    revalidate: 10 
  }
}

type Props = {
  gallery: ImageProps[]
}

const ProfessionalGallery: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>Gallery</h1>
        <main>
            <Gallery images={props.gallery}/>
        </main>
      </div>
    </Layout>
  )
}

export default ProfessionalGallery;
