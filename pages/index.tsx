import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import Image, { ImageProps } from "../components/Image"
import prisma from "../lib/prisma"

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    // only include Posts where published is true
    where: {published : true},
    include: {
      // author is a ref to a User
      author: {
        // Users have a name attribute and we want that included as well.
        select: { name: true},
      },
    }
  });
  const gallery = (await prisma.image.findMany({})).map(image=>{
    return {
      ...image,
      uploadDate: image.uploadDate.toISOString(),
    }
  })
  
  return { 
    props: { feed, gallery }, 
    revalidate: 10 
  }
}

type Props = {
  feed: PostProps[]
  gallery: ImageProps[]
}

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          {props.feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
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

export default Blog
