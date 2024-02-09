import React, { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import PostAuthor from "../components/PostAuthor";
import Loader from "../components/Loader";
import DeletePost from "./DeletePost";
import { UserContext } from "../context/userContext";
import axios from "axios";
import RelatedPosts from "./RelatedPosts";


const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/${id}`
        );
        setPost(response.data);
      } catch (err) {
        setError(err);
      }
      setIsLoading(false);
    };

    fetchPost();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
    <section className="post-detail">
      {error && <p>{error}</p>}
      {post && (
        <div className="container post-detail__container">
          <div className="post-detail__header">
            <PostAuthor  authorID={post.creator} createdAt={post.createdAt} />
            {currentUser?.id == post?.creator && (
              <div className="post-detail__buttons">
                <Link to={`/posts/${post?._id || id}/edit`} className="btn sm primary">
                  Edit
                </Link>
                <DeletePost postId={id} />
              </div>
            )}
          </div>
          <h1>{post.title}</h1>
          <div className="post-detail__thumbnail">
            <img src={`${process.env.REACT_APP_ASSETS}uploads/${post.thumbnail}`} alt={post.title} />
          </div>
          <p dangerouslySetInnerHTML={{__html: post.description}}></p>
          <div className="footer_category">
           <Link to={`/posts/categories/${post.category}`} className="btn category">
            {post.category}
          </Link>
          </div>
        </div>
      )}
    </section>
    
    {post &&  <div className="Related__Posts">
    <h2 className="container">Related Posts</h2>
      <RelatedPosts category={post.category}/>
    </div>}
    </>
  );
};

export default PostDetail;