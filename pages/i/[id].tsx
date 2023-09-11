import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Router from "next/router";
import Layout from "../../components/Layout";
import { useSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import Image, { ImageProps } from "../../components/Image";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const image = await prisma.image.findUnique({
        where: {
            id: String(params?.id),
        },
    });
    return {
        // errors if props is undefined
        props: image
            ? {
                  image: image,
              }
            : {},
    };
};

type Props = {
    image: ImageProps;
};
const Edit: React.FC<Props> = (props) => {

    if (!props.image) {
        return <div>
            No image found, return to homepage
        </div>;
    }

    const [title, setTitle] = useState(props.image.title);
    const [description, setDescription] = useState(props.image.description);
    const [isPersonal, setIsPersonal] = useState(props.image.personal);
    const [isProfessional, setIsProfessional] = useState(props.image.professional);

    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        setIsChanged(
            title !== props.image.title ||
                description !== props.image.description ||
                isPersonal !== props.image.personal ||
                isProfessional !== props.image.professional
        );
    }, [title, description, isPersonal, isProfessional]);

    const { data: session, status } = useSession();

    if (!props.image) {
        return <div>Loading ...</div>;
    }

    if (status === "loading") {
        return <div>Authenticating ...</div>;
    }

    const userHasValidSession = Boolean(session);

    if (!userHasValidSession) {
        return <div>You do not have permission to view this page</div>;
    }

    const submitData = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            if (title !== props.image.title) formData.append("title", title);
            if (description !== props.image.description) formData.append("description", description);
            if (isPersonal !== props.image.personal) formData.append("personal", String(isPersonal));
            if (isProfessional !== props.image.professional) formData.append("professional", String(isProfessional));

            await fetch(`/api/image/${props.image.id}`, {
                method: "PUT",
                body: formData,
            });

            await Router.push("/");
        } catch (error) {
            console.error(error);
        }
    };

    const deleteImage = async () => {
        await fetch(`/api/image/${props.image.id}`, {
            method: "DELETE",
        });

        await Router.push("/");
    };

    return (
        <Layout>
            <div className="page">
                <form onSubmit={submitData}>
                    <h1>Edit Image</h1>

                    <Image image={props.image} width="200px" height="200px" checkForSession={false} />

                    <input
                        autoFocus
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        type="text"
                        value={title}
                    />
                    <textarea
                        cols={50}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        rows={8}
                        value={description}
                    />

                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={isPersonal}
                                onChange={(e) => setIsPersonal(e.target.checked)}
                            />
                            Personal
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={isProfessional}
                                onChange={(e) => setIsProfessional(e.target.checked)}
                            />
                            Professional
                        </label>
                    </div>

                    <input type="submit" value="Save Changes" disabled={!isChanged} />
                </form>
                <button onClick={deleteImage}>Delete Image</button>
            </div>
            <style jsx>{`
                .page {
                    background: white;
                    padding: 3rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                label {
                    margin-right: 20px;
                }
            `}</style>
        </Layout>
    );
};

export default Edit;
