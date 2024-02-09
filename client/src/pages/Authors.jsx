import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import axios from 'axios'

//Social Icons
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";


const Authors = () => {
  
const [authors, setAuthors] = useState([])
const [isLoading, setIsLoading] = useState(false)

useEffect(() =>{
  setIsLoading(true)
  const fetchAuthors = async () =>{
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`)
    setAuthors(response.data);
  }
  setIsLoading(false)
  fetchAuthors()
}, [])

if(isLoading){
  return <Loader />
}

  return (
    <section className='authors'>
{  authors.length > 0 ?    <div className='container authors__container'>
      {
        authors.map(({_id: id, avatar, name, posts}) =>{
          return <Link key={id} to={`/posts/users/${id}`} className='author'>

            <div className='author__social_info'>
            <div className="author__avatar">
              <img src={`${process.env.REACT_APP_ASSETS}uploads/${avatar}`} alt={`Image of ${name}`}/>
            </div>
            <h4>{name}</h4>
            <div className='author__social_info_icons'>
            <FaXTwitter className='author__social_icon' />
              <FaInstagram className='author__social_icon' />
              <FaTelegram className='author__social_icon' />
            </div>
              
            </div>
            <div className="author__info">
              <p>Posts: {posts}</p>
            </div>
          </Link>
        })
      }
      </div> : <h2 className='center'>No Users/Authors are found</h2>}
    </section>

  )
}

export default Authors