import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/userContext";


const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState('');
  const navigate = useNavigate()
  const {setCurrentUser} = useContext(UserContext)

  const loginUser = async (e) =>{
    e.preventDefault()
    // console.log(e)
    setError('')
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/login`, userData)
      const user = response.data
    // console.log(user)
    // console.log(response)

      setCurrentUser(user)
      navigate('/'); 
    } catch (err) {
      setError(err.response.data.message)
    }
  }



  const changeInputHandler = (e) => {
    setUserData((Prev) => {
      return { ...Prev, [e.target.name]: e.target.value };
    });
  };

  return (
    <section className="login">
      <div className="container">
        <h2>Sign In</h2>
        <form className="form login__form" onSubmit={loginUser}>
         {error && <p className="form__error-message">{error}</p> }

          <input
            type="email"
            placeholder="Email Id"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
          />

          <button type="submit" className="btn primary">
            Login
          </button>
        </form>
        <small>
          Don't have an accorunt? <Link to="/register">Sign Up here</Link>
        </small>
      </div>
    </section>
  );
};

export default Login;
