import React, { useState, useEffect } from "react";
import axios from "axios";
import PostItem from "../components/PostItem";


const RelatedPosts = ({ category }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/categories/${category}`
        );
        setPosts(response?.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, [category]);

  return (
    
    <div className="posts">
    {posts.length > 0 ? (
      <div className="container posts__container">
        {posts.map(
          ({
            _id,
            thumbnail,
            category,
            title,
            description,
            creator,
            createdAt,
          }) => {
            return (
              <PostItem
                key={_id}
                thumbnail={thumbnail}
                category={category}
                title={title}
                description={description}
                authorID={creator}
                postId={_id}
                createdAt={createdAt}
              />
            );
          }
        )}
      </div>
    ) : (
      <h2 className="center">No Related Posts are found</h2>
    )}
  </div>

  )
};

export default RelatedPosts;
