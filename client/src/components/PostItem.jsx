import React from "react";
import PostAuthor from "./PostAuthor";
import { Link } from "react-router-dom";

const PostItem = ({
  postId,
  title,
  thumbnail,
  description,
  authorID,
  category,
  createdAt
}) => {
  const shortDesc = description.length > 130 ? description.substr(0, 130) + "..." : description;
  const shortTitle = title.length > 50 ? title.substr(0, 50) + "..." : title;
  return (
    <article className="post">
      <div className="post__thumbnail">
        <img src={`${process.env.REACT_APP_ASSETS}uploads/${thumbnail}`} alt={title} />
      </div>
      <div className="post__content">
        <Link to={`/posts/${postId}`}>
          <h3>{shortTitle}</h3>
        </Link>
        <p dangerouslySetInnerHTML={{__html: shortDesc}}></p>
        <div className="post__footer">
          <PostAuthor authorID={authorID} createdAt={createdAt} />
          <Link to={`/posts/categories/${category}`} className="btn category">
            {category}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostItem;
