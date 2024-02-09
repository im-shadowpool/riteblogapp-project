import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa6";
import { AiOutlineClose } from "react-icons/ai";
import Logo from "../images/logo.png";
import { UserContext } from "../context/userContext";

const Header = () => {

  const {currentUser} = useContext(UserContext)


  const [isNavShowing, setIsNavShowing] = useState(
    window.innerWidth > 800 ? true : false
  );
  const closeNavHandler = () => {
    if (window.innerWidth < 800) {
      setIsNavShowing(false);
    } else {
      setIsNavShowing(true);
    }
  };
  return (
    <nav>
      <div className="container nav__container">
        <Link to="/" className="nav__logo" onClick={closeNavHandler}>
          <img src={Logo} alt="Rite Blog" />
        </Link>
        { currentUser?.id && isNavShowing && (
          <ul className="nav__menu">
            <li onClick={closeNavHandler}>
              <Link to={`/profile/${currentUser.id}`}>{currentUser.name}</Link>
            </li>
            <li onClick={closeNavHandler}>
              <Link to="/create">Create Post</Link>
            </li>
            <li onClick={closeNavHandler}>
              <Link to="/authors">Authors</Link>
            </li>
            <li onClick={closeNavHandler}>
              <Link to="/logout">Sign out</Link>
            </li>
          </ul>
        )}
        { !currentUser?.id && isNavShowing && (
          <ul className="nav__menu">
            <li onClick={closeNavHandler}>
              <Link to="/authors">Authors</Link>
            </li>
            <li onClick={closeNavHandler}>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        )}
        <button
          className="nav__toggle-btn"
          onClick={() => setIsNavShowing(!isNavShowing)}
        >
          {isNavShowing ? <AiOutlineClose /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Header;
