import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className='footer fixed-bottom' style={style}>
      <div className='container text-center'>
        <span className='text-muted'>
          Связь с <Link to='/contacts'>админом</Link>
        </span>
      </div>
      <div className='container text-center'>
        <span className='text-muted'>
          Следите за проектом:{" "}
          <a href='https://t.me/chineseplusnew' target='_blank'>
            <i className='fab fa-telegram'></i>
          </a>{" "}
          <a href='https://vk.com/buyilehu' target='_blank'>
            <i className='fab fa-vk'></i>
          </a>{" "}
          <a href='https://www.youtube.com/c/Buyilehuorg' target='_blank'>
            <i className='fab fa-youtube'></i>
          </a>{" "}
          <a href='https://www.facebook.com/buyilehu/' target='_blank'>
            <i className='fab fa-facebook-square'></i>
          </a>
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
