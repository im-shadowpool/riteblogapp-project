import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
      <ul className='footer__categories'>
          <li><Link to='posts/categories/Blogging'>Blogging</Link></li>
          <li><Link to='posts/categories/SEO'>SEO</Link></li>
          <li><Link to='posts/categories/Digital-Marketing'>Digital Marketing</Link></li>
          <li><Link to='posts/categories/On-Page SEO'>On-Page SEO</Link></li>
          <li><Link to='posts/categories/Off-Page SEO'>Off-Page SEO</Link></li>
          <li><Link to='posts/categories/Youtube SEO'>Youtube SEO</Link></li>
          <li><Link to='posts/categories/Hosting'>Hosting</Link></li>
          <li><Link to='posts/categories/Wordpress'>Wordpress</Link></li>
      </ul>
      <div className="footer__copyright">
        <small>All Rights Reserved &copy; RiteBlogApp. Made Using MERN Stack</small>
      </div>
    </footer>
  )
}

export default Footer