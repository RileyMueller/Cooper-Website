import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Gallery from "../components/Gallery"
import Image, { ImageProps } from "../components/Image"
import prisma from "../lib/prisma"

export const getStaticProps: GetStaticProps = async () => {
    const gallery = (await prisma.image.findMany({
      where: {
        personal: true
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

const PersonalGallery: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>Gallery</h1>
        <main>
            <Gallery images={props.gallery}/>
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export default PersonalGallery;
