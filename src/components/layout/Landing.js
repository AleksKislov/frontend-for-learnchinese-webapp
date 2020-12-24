import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) return <Redirect to='/dashboard' />;

  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'>Добро пожаловать в клуб Chinese+</h1>
          <p className='lead'>Web-приложение для изучающих китайский язык от ChinesePlus</p>
          <div className='buttons'>
            <Link to='/register' className='btn btn-dark'>
              Регистрация
            </Link>
            <Link to='/login' className='btn btn-light'>
              Войти
            </Link>
          </div>

          <div className='card text-primary bg-light mt-3'>
            <div className='card-header'>
              <h5>Место, где вы сможете</h5>
            </div>
            <div className='card-body'>
              <p className='card-text' style={{ marginRight: "2rem", textAlign: "left" }}>
                <ul>
                  <li>Почитать тексты и книги на китайском языке со встроенным переводом</li>
                  <li>Изучать любые слова, добавляя их в личные списки для изучения</li>
                  <li>Пользоваться словарем с анимированными иероглифами</li>
                  <li>Проходить тесты на знание китайского языка</li>
                  <li>И многое другое, так как проект каждый день развивается!</li>
                </ul>
              </p>
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
