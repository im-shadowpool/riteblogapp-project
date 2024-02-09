import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UserContext } from "../context/userContext";
import axios from "axios";

const EditPost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [error, setError] = useState("");

  const { id } = useParams();

  //Auth
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const token = currentUser?.token;
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);
  // Auth End
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "clean",
  ];

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const POST_CATEGORIES = [
    "Blogging",
    "SEO",
    "Digital-Marketing",
    "On-Page SEO",
    "Off-Page SEO",
    "Youtube SEO",
    "Hosting",
    "Wordpress",
    "uncategorised",
  ];

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/${id}`
        );
        setTitle(response.data.title);
        setDescription(response.data.description);
        console.log('VEER');
      } catch (error) {
        console.log(error);
      }
    };
    getPost();
  }, []);

  const editPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.set("title", title);
    formData.set("category", category);
    formData.set("description", description);
    formData.set("thumbnail", thumbnail);
    console.log('sai');
    try {
      console.log('A');
      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/posts/${id}/`,
        formData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('B');
      if (response.status === 200) {
        return navigate('/');
      }
      console.log('pavan');
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit Post</h2>
        {error && <p className="form__error-message">{error}</p>}
        <form className="form create-post__form" onSubmit={editPost}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {POST_CATEGORIES.map((e) => {
              return <option key={e}>{e}</option>;
            })}
          </select>
          <ReactQuill
            modules={modules}
            formats={formats}
            value={description}
            onChange={setDescription}
          />
          <input
            type="file"
            onChange={(e) => setThumbnail(e.target.files[0])}
            accept="png, jpg, jpeg"
          />
          <button className="btn primary" type="submit">
            Edit Changes
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditPost;
