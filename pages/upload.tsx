import React, { useState } from "react";
import Layout from "../components/Layout";
import Router from "next/router";

const Upload = () => {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUploaded, setImageUploaded] = useState();
  const [isPersonal, setIsPersonal] = useState(false);
  const [isProfessional, setIsProfessional] = useState(false);

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
      formData.append("personal", String(isPersonal));
      formData.append("professional", String(isProfessional));

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

export default Upload;
