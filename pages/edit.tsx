import React, { useState } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import { ImageProps } from "../components/Image";

type Props = {
    image: ImageProps;
};
const Edit: React.FC<Props> = (props) => {

    if (!props.image) {
        return;
    }

    const [title, setTitle] = useState(props.image.title);
    const [description, setDescription] = useState(props.image.description);
    const [imageUploaded, setImageUploaded] = useState();
    const [isPersonal, setIsPersonal] = useState(props.image.personal);
    const [isProfessional, setIsProfessional] = useState(props.image.professional);

    const handleChange = (event) => {
        setImageUploaded(event.target.files[0]);
    };

    const submitData = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            if (imageUploaded) formData.append("image", imageUploaded);
            if (title !== props.image.title) formData.append("title", title);
            if (description !== props.image.description) formData.append("description", description);
            if (isPersonal !== props.image.personal) formData.append("personal", String(isPersonal));
            if (isProfessional !== props.image.professional) formData.append("professional", String(isProfessional));

            await fetch("/api/image", {
                method: "PUT",
                body: formData,
            });

            await Router.push("/");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Layout>
            <div className="page">
                <form onSubmit={submitData}>
                    <h1>Edit Image</h1>

                    <input onChange={handleChange} accept=".jpg, .png, .gif, .jpeg" type="file"></input>

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

                    <input type="submit" value="Upload" />
                </form>
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
