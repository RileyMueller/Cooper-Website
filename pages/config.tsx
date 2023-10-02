import React, { useState } from "react";
import { GetStaticProps } from "next";
import prisma from "../lib/prisma";
import { ImageProps } from "../components/Image";
import Layout from "../components/Layout";
import Link from "next/link";

type ConfigProps = {
    id: String;
    key: String;
    value: String;
};


type Props = {
    config: ConfigProps[];
    images: ImageProps[];
};

export const getStaticProps: GetStaticProps = async () => {
    const config = await prisma.config.findMany({});
    const images = await prisma.image.findMany({orderBy: {
        uploadDate: 'desc'
    }});

    return {
        props: { config, images },
        revalidate: 10,
    };
};

const Config: React.FC<Props> = (props) => {

    const currentHomePageImageId = props.config.find((elem)=>{elem.key==='homepageImageId'})?.value;
    const [selectedHomePageImageId, setSelectedHomePageImageId] = useState(null);

    const currentHomePageDescription = props.config.find((elem)=>{elem.key==='homepageDescription'})?.value.toString();
    const [updatedHomePageDescription, setUpdatedHomePageDescription] = useState(currentHomePageDescription);

    const updateHomePageImage = async () => {
        if (selectedHomePageImageId && selectedHomePageImageId != currentHomePageImageId) {
            await fetch('/api/config', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    key: 'homepageImageId',
                    value: selectedHomePageImageId
                })
            });
        }
    }

    const updateHomePageDescription = async () => {
        if (updatedHomePageDescription && updatedHomePageDescription != currentHomePageDescription) {
            await fetch('/api/config', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    key: 'homepageDescription',
                    value: updatedHomePageDescription
                })
            });
        }
    }

    return (
    <Layout>
        <h2>Set Homepage Image</h2>
        <select onChange={(e)=>setSelectedHomePageImageId(e.target.value)}>
            {props.images.map((image)=>(
                <option value={image.id} key={image.id}>
                    {image.title}
                </option>
            ))}
        </select>
        <button onClick={updateHomePageImage}>Set as Homepage Image</button>
        <h2>Set Homepage Description</h2>
        <input type="text" value={currentHomePageDescription} onChange={(e)=>setUpdatedHomePageDescription(e.target.value)}>
        </input>
        <button onClick={updateHomePageDescription}>Set as Homepage Description</button>
        <h2>
            Edit an image
        </h2>
        <div>
            <ul>
                {props.images.map((image)=>(
                    <li>
                        <Link href={`/i/${image.id}`}>
                            {image.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    </Layout>
    )
};

export default Config;
