import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className='footer fixed-bottom' style={style}>
      <div className='container text-center'>
        <span className='text-muted'>
          Связаться с <Link to='/contacts'>админом</Link>
        </span>
      </div>
    </footer>
  );
};

const style = {
  backgroundColor: "#2c3e50",
  padding: "0.5rem",
  width: "100%"
};

export default Footer;
