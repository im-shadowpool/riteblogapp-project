import React, { useEffect, useContext, useState } from "react";
import { useNavigate, Link, useLocation, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axios from 'axios';
import Loader from "../components/Loader";

const DeletePost = ({postId}) => {
  const navigate = useNavigate();
  const location = useLocation();
 const [isLoading, setIsLoading] = useState(false);
  ///aUth
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);
  // end auth


  const removePost = async () =>{
    setIsLoading(true)
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/posts/${postId}`, 
      {withCredentials: true, headers: {Authorization: `Bearer ${token}`}}
      )
      if(response.status == 200){
        if(location.pathname == `/myposts/${currentUser.id}`){
          navigate(0)
        } else {
          navigate('/')
        }

      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  if(isLoading){
  return <Loader />
  }

  return  (
    <Link className="btn sm danger" onClick={() => removePost(postId)}>Delete</Link>
  ) 
};

export default DeletePost;
