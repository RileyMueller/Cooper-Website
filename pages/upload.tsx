import React, { useState } from "react";
import Layout from "../components/Layout";
import Router from "next/router";

const Upload = () => {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUploaded, setImageUploaded] = useState();

  const handleChange = (event) => {
    setImageUploaded(event.target.files[0]);
  };

  const submitData = async (e) => {
    e.preventDefault();

    if (!imageUploaded || title === '') {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", imageUploaded);
      formData.append("title", title);
      formData.append("description", description);

      await fetch("/api/image", {
        method: "POST",
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
          <h1>Upload Image</h1>

          <input
            onChange={handleChange}
            accept=".jpg, .png, .gif, .jpeg"
            type="file"
          ></input>
          
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

      `}</style>
    </Layout>
  );
};

export default Upload;