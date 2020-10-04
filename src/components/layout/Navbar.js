import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
import { loadLengths } from "../../actions/hskTable";
import { loadUserWordsLen } from "../../actions/userWords";

const Navbar = ({
  logout,
  auth: { isAuthenticated, loading },
  loadLengths,
  allWordsLen,
  loadUserWordsLen,
  userWordsLen
}) => {
  if (isAuthenticated) {
    loadLengths();
    loadUserWordsLen();
  }

  const authLinks = (
    <Fragment>
      <ul className='navbar-nav mr-auto' style={{ textAlign: "center" }}>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/dashboard' activeStyle={activeNavLink}>
            <i className='fas fa-user'></i> ЛК
          </NavLink>
        </li>

        <li className='nav-item'>
          <NavLink className='nav-link' to='/pinyin' activeStyle={activeNavLink}>
            Таблица Пиньиня
          </NavLink>
        </li>

        <li className='nav-item'>
          <NavLink className='nav-link' to='/hsk-table' activeStyle={activeNavLink}>
            Слова HSK
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/hsk-words' activeStyle={activeNavLink}>
            <span className='badge badge-pill badge-warning'>{allWordsLen}</span> Мой HSK
          </NavLink>
        </li>

        <li className='nav-item dropdown'>
          <NavLink
            className='nav-link dropdown-toggle'
            data-toggle='dropdown'
            to='/pinyin-tests'
            activeStyle={activeNavLink}
          >
            Тесты
          </NavLink>

          <div className='dropdown-menu'>
            <NavLink className='dropdown-item' to='/pinyin-tests' activeStyle={activeNavLink}>
              Пиньинь
            </NavLink>
            <NavLink className='dropdown-item' to='/hsk-tests' activeStyle={activeNavLink}>
              Лексика HSK
            </NavLink>
          </div>
        </li>

        <li className='nav-item'>
          <NavLink className='nav-link' to='/userwords' activeStyle={activeNavLink}>
            <span className='badge badge-pill badge-warning'>{userWordsLen}</span> Мой Вокабуляр
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/translate' activeStyle={activeNavLink}>
            Перевод
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/search' activeStyle={activeNavLink}>
            Словарь
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/texts' activeStyle={activeNavLink}>
            Читалка
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/posts' activeStyle={activeNavLink}>
            Гостевая
          </NavLink>
        </li>
      </ul>
      <ul className='navbar-nav float-right'>
        <li className='nav-item'>
          <a onClick={logout} className='nav-link' href='#!'>
            <i className='fas fa-sign-out-alt'></i>
            <span className='hide-sm'> Logout</span>
          </a>
        </li>
      </ul>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <ul className='navbar-nav mr-auto' style={{ textAlign: "center" }}>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/pinyin' activeStyle={activeNavLink}>
            Таблица Пиньиня
          </NavLink>
        </li>

        <li className='nav-item'>
          <NavLink className='nav-link' to='/hsk-table' activeStyle={activeNavLink}>
            Слова HSK
          </NavLink>
        </li>
        <li className='nav-item dropdown'>
          <NavLink
            className='nav-link dropdown-toggle'
            data-toggle='dropdown'
            to='/pinyin-tests'
            activeStyle={activeNavLink}
          >
            Тесты
          </NavLink>

          <div className='dropdown-menu'>
            <NavLink className='dropdown-item' to='/pinyin-tests' activeStyle={activeNavLink}>
              Пиньинь
            </NavLink>
            <NavLink className='dropdown-item' to='/hsk-tests' activeStyle={activeNavLink}>
              Лексика HSK
            </NavLink>
          </div>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/translate' activeStyle={activeNavLink}>
            Перевод
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/search' activeStyle={activeNavLink}>
            Словарь
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/texts' activeStyle={activeNavLink}>
            Читалка
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/posts' activeStyle={activeNavLink}>
            Гостевая
          </NavLink>
        </li>
      </ul>
      <ul className='navbar-nav float-right'>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/register' activeStyle={activeNavLink}>
            Register
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/login' activeStyle={activeNavLink}>
            Login
          </NavLink>
        </li>
      </ul>
    </Fragment>
  );

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
      <NavLink className='navbar-brand' to='/'>
        <i className='fas fa-yin-yang'></i> Chinese+Club{" "}
        <span style={{ fontSize: "50%" }}>1.0.2</span>
      </NavLink>
      <button
        className='navbar-toggler'
        type='button'
        data-toggle='collapse'
        data-target='#navbarColor01'
        aria-controls='navbarColor01'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <span className='navbar-toggler-icon'></span>
      </button>

      <div className='collapse navbar-collapse' id='navbarColor01'>
        {!loading && <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>}
      </div>
    </nav>
  );
};

const activeNavLink = {
  color: "#18BC9C"
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  allWordsLen: state.hskTable.allWordsLen,
  userWordsLen: state.userwords.userWordsLen
});

export default connect(mapStateToProps, { logout, loadLengths, loadUserWordsLen })(Navbar);
