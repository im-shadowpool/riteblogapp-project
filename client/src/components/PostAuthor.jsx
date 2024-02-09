import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TimeAgo from 'javascript-time-ago'
import ReactTimeAgo from 'react-time-ago'

import en from 'javascript-time-ago/locale/en'
import hi from 'javascript-time-ago/locale/hi.json'
import te from 'javascript-time-ago/locale/te.json'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(hi)
TimeAgo.addLocale(te)

const PostAuthor = ({ authorID, createdAt }) => {
  const [author, setAuthor] = useState({});

  useEffect(() => {
    const getAuthor = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${authorID}`);
        setAuthor(response?.data)
      } catch (error) {
        console.log(error);
      }
    }
    getAuthor()
  }, []);

  return (
    <Link to={`/posts/users/${authorID}`} className="post__author">
      <div className="post__author-avatar">
        <img src={`${process.env.REACT_APP_ASSETS}uploads/${author?.avatar}`} alt='' />
      </div>
      <div className="post__author-details">
        <h5>By: {author?.name}</h5>
        <small><ReactTimeAgo date={new Date(createdAt)} locale="en-US"></ReactTimeAgo></small>
      </div>
    </Link>
  );
};

export default PostAuthor;