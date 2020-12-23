import React, { Fragment, useState, useEffect } from "react";
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
  userWordsLen,
  user
}) => {
  const [readPath, setReadPath] = useState("/texts");
  const [testPath, setTestPath] = useState("/pinyin-tests");
  const [totalWordsLen, setTotalWordsLen] = useState(0);

  useEffect(() => {
    const url = window.location.pathname;
    if (url.includes("/books") || url.includes("/texts")) {
      setReadPath(url);
      setTestPath("/pinyin-tests");
    } else if (url.includes("/pinyin-tests") || url.includes("/hsk-tests")) {
      setReadPath("/texts");
      setTestPath(url);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (isAuthenticated) {
        // console.log("here");
        loadLengths();
        loadUserWordsLen();
        if ((userWordsLen && allWordsLen) || userWordsLen === 0 || allWordsLen === 0)
          setTotalWordsLen(userWordsLen + allWordsLen);
      }
    }, 500);
  }, [isAuthenticated, allWordsLen, userWordsLen]);

  const authLinks = (
    <Fragment>
      <ul className='navbar-nav mr-auto' style={{ textAlign: "center" }}>
        {isAuthenticated && (
          <li className='nav-item dropdown'>
            <NavLink
              className='nav-link dropdown-toggle my-auto'
              data-toggle='dropdown'
              to='/dashboard'
              activeStyle={activeNavLink}
            >
              {user && (
                <Fragment>
                  <span className='badge badge-pill badge-warning'>{totalWordsLen}</span>{" "}
                  <img className='' src={`https:${user.avatar}`} style={imgStyle} alt='Avatar' />
                </Fragment>
              )}
            </NavLink>
            <div className='dropdown-menu dropdown-menu-right'>
              <NavLink className='dropdown-item' to='/dashboard'>
                ЛК
              </NavLink>

              <NavLink className='dropdown-item' to='/hsk-words' activeStyle={activeNavLink}>
                Мой HSK <span className='badge badge-pill badge-warning'>{allWordsLen}</span>
              </NavLink>

              <NavLink className='dropdown-item' to='/userwords' activeStyle={activeNavLink}>
                Мои Слова <span className='badge badge-pill badge-warning'>{userWordsLen}</span>
              </NavLink>

              <NavLink onClick={logout} className='dropdown-item' to='/#' exact={true}>
                <i className='fas fa-sign-out-alt'></i>
                <span className='hide-sm'> Выйти</span>
              </NavLink>
            </div>
          </li>
        )}
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
            to={testPath}
            activeStyle={activeNavLink}
          >
            Тесты
          </NavLink>

          <div className='dropdown-menu'>
            <NavLink
              className='dropdown-item'
              to='/pinyin-tests'
              activeStyle={activeNavLink}
              onClick={() => setTestPath("/pinyin-tests")}
            >
              Пиньинь
            </NavLink>
            <NavLink
              className='dropdown-item'
              to='/hsk-tests'
              activeStyle={activeNavLink}
              onClick={() => setTestPath("/hsk-tests")}
            >
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
        <li className='nav-item dropdown'>
          <NavLink
            className='nav-link dropdown-toggle'
            data-toggle='dropdown'
            to={readPath}
            activeStyle={activeNavLink}
          >
            Читалка
          </NavLink>

          <div className='dropdown-menu'>
            <NavLink
              className='dropdown-item'
              to='/texts'
              activeStyle={activeNavLink}
              onClick={() => setReadPath("/texts")}
            >
              Тексты
            </NavLink>
            <NavLink
              className='dropdown-item'
              to='/books'
              activeStyle={activeNavLink}
              onClick={() => setReadPath("/books")}
            >
              Книги
            </NavLink>
          </div>
        </li>
        <li className='nav-item'>
          <NavLink className='nav-link' to='/posts' activeStyle={activeNavLink}>
            Гостевая
          </NavLink>
        </li>
      </ul>

      {!isAuthenticated && (
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
      )}
    </Fragment>
  );

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
      <NavLink className='navbar-brand' to='/'>
        <i className='fas fa-yin-yang'></i> Chinese+Club{" "}
        <span style={{ fontSize: "50%" }}>{appVersion}</span>
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
        {!loading && <Fragment>{authLinks}</Fragment>}
      </div>
    </nav>
  );
};

const appVersion = "1.2.0";

const activeNavLink = {
  color: "#18BC9C"
};

const imgStyle = {
  width: "3vh",
  borderRadius: "50%"
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.auth.user,
  allWordsLen: state.hskTable.allWordsLen,
  userWordsLen: state.userwords.userWordsLen
});

export default connect(mapStateToProps, { logout, loadLengths, loadUserWordsLen })(Navbar);
