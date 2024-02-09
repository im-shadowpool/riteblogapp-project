import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import PostItem from "./PostItem";
import axios from "axios";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/`
        );
        // console.log(response)
        setPosts(response?.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchPosts();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="posts">
      {posts.length > 0 ? (
        <div className="container posts__container">
          {posts.map(
            ({ _id, thumbnail, category, title, description, creator, createdAt }) => {
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
        <h2 className="center">No Posts are found</h2>
      )}
    </section>
  );
};

export default Posts;
