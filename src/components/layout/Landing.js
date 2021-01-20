import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) return <Redirect to='/dashboard' />;

  return (
    <section className='landing row' style={{ marginBottom: "3rem" }}>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Chinese+ Клуб изучения китайского языка</title>
      </Helmet>

      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'>Добро пожаловать в клуб Chinese+</h1>

          <div className='embed-responsive embed-responsive-16by9' style={{ maxWidth: "60rem" }}>
            <iframe
              className='embed-responsive-item'
              width='560'
              height='315'
              src='https://www.youtube.com/embed/fxM8lH17fUY'
              frameBorder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            ></iframe>
          </div>

          <p className='lead'>Web-приложение для изучающих китайский язык от ChinesePlus</p>
          <div className='buttons'>
            <Link to='/register' className='btn btn-dark'>
              Регистрация
            </Link>
            <Link to='/login' className='btn btn-light'>
              Войти
            </Link>
          </div>

          <div className='card text-primary bg-light mt-4'>
            <div className='card-header'>
              <h5>Здесь вы сможете</h5>
            </div>
            <div className='card-body'>
              <ul className='card-text' style={{ marginRight: "2rem", textAlign: "left" }}>
                <li>Почитать тексты и книги на китайском языке со встроенным переводом</li>
                <li>Изучать любые слова, добавляя их в личные списки для изучения</li>
                <li>Пользоваться словарем с анимированными иероглифами</li>
                <li>Проходить тесты на знание китайского языка</li>
                <li>И многое другое, так как проект каждый день развивается!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Landing);
