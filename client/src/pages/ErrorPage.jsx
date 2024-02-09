import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ErrorPage = () => {
  return (
    <>
      <Header />
      <section className="error-page">
        <div className="center">
          <h2>Page Not Found</h2>
          <Link to="/" className="btn primary">
            Go Back Home
          </Link>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default ErrorPage;
