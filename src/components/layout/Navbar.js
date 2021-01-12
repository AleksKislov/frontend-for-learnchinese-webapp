import React, { Fragment, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
import { loadLengths } from "../../actions/hskTable";
import { loadUserWordsLen } from "../../actions/userWords";
import { appVersion } from "../../apikeys.json";

const Navbar = ({
  logout,
  auth: { isAuthenticated, loading },
  loadLengths,
  allWordsLen,
  loadUserWordsLen,
  userWordsLen,
  user
}) => {
  const [paths, setPaths] = useState({
    tests: "/pinyin-tests",
    reading: "/texts",
    login: "/register",
    private: "/dashboard"
  });
  const privateLinks = ["/dashboard", "/hsk-words", "userwords"];
  const [totalWordsLen, setTotalWordsLen] = useState(0);

  useEffect(() => {
    const url = window.location.pathname;
    if (url.includes("/books") || url.includes("/texts")) {
      setPaths({
        tests: "/pinyin-tests",
        reading: url,
        login: "/register",
        private: "/dashboard"
      });
    } else if (url.includes("/pinyin-tests") || url.includes("/hsk-tests")) {
      setPaths({
        tests: url,
        reading: "/texts",
        login: "/register",
        private: "/dashboard"
      });
    } else if (url === "/register" || url === "/login") {
      setPaths({
        tests: "/pinyin-tests",
        reading: "/texts",
        login: url,
        private: "/dashboard"
      });
    } else if (privateLinks.includes(url)) {
      setPaths({
        tests: "/pinyin-tests",
        reading: "/texts",
        login: "/register",
        private: url
      });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (isAuthenticated) {
        loadLengths();
        loadUserWordsLen();
        if ((userWordsLen && allWordsLen) || userWordsLen === 0 || allWordsLen === 0)
          setTotalWordsLen(userWordsLen + allWordsLen);
      }
    }, 500);
  }, [isAuthenticated, allWordsLen, userWordsLen]);

  const navbarId = document.getElementById("navbarId");
  const collapseIt = () => {
    if (navbarId.classList.contains("show")) {
      navbarId.classList.remove("show");
    } else {
      navbarId.classList.add("show");
    }
  };

  // for main menu and dropdown
  const setPathsAndCollapse = obj => {
    collapseIt();
    setPaths(obj);
  };

  const noAuthLinks = (
    <ul className='navbar-nav loginNavbar text-center'>
      <li className='nav-item dropdown'>
        <NavLink
          className='nav-link dropdown-toggle'
          data-toggle='dropdown'
          to={paths.login}
          activeStyle={activeNavLink}
        >
          <i className='fas fa-door-open'></i> Вход
        </NavLink>
        <div className='dropdown-menu dropdown-menu-right'>
          <NavLink
            className='dropdown-item'
            to='/register'
            activeStyle={activeNavLink}
            onClick={() => setPathsAndCollapse({ ...paths, login: "/register" })}
            exact={true}
          >
            Регистрация
          </NavLink>
          <NavLink
            className='dropdown-item'
            to='/login'
            activeStyle={activeNavLink}
            onClick={() => setPathsAndCollapse({ ...paths, login: "/login" })}
            exact={true}
          >
            Войти
          </NavLink>
        </div>
      </li>
    </ul>
  );

  const authLinks = (
    <ul className='navbar-nav loginNavbar text-center'>
      <li className='nav-item dropdown'>
        <NavLink
          className='nav-link dropdown-toggle my-auto'
          data-toggle='dropdown'
          to={paths.private}
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
          <NavLink
            className='dropdown-item'
            to='/dashboard'
            activeStyle={activeNavLink}
            onClick={() => setPathsAndCollapse({ ...paths, private: "/dashboard" })}
          >
            ЛК
          </NavLink>

          <NavLink
            className='dropdown-item'
            to='/hsk-words'
            activeStyle={activeNavLink}
            onClick={() => setPathsAndCollapse({ ...paths, private: "/hsk-words" })}
          >
            Мой HSK <span className='badge badge-pill badge-warning'>{allWordsLen}</span>
          </NavLink>

          <NavLink
            className='dropdown-item'
            to='/userwords'
            activeStyle={activeNavLink}
            onClick={() => setPathsAndCollapse({ ...paths, private: "/userwords" })}
          >
            Мои Слова <span className='badge badge-pill badge-warning'>{userWordsLen}</span>
          </NavLink>

          <NavLink onClick={logout} className='dropdown-item' to='/#' exact={true}>
            Выйти <i className='fas fa-sign-out-alt'></i>
          </NavLink>
        </div>
      </li>
    </ul>
  );

  const mainMenu = (
    <Fragment>
      <ul className='navbar-nav text-center mr-auto'>
        <li className='nav-item'>
          <NavLink
            onClick={collapseIt}
            className='nav-link'
            to='/pinyin'
            activeStyle={activeNavLink}
          >
            Таблица Пиньиня
          </NavLink>
        </li>
        <li className='nav-item'>
          <NavLink
            onClick={collapseIt}
            className='nav-link'
            to='/hsk-table'
            activeStyle={activeNavLink}
          >
            Слова HSK
          </NavLink>
        </li>
        <li className='nav-item dropdown'>
          <NavLink
            className='nav-link dropdown-toggle'
            data-toggle='dropdown'
            to={paths.tests}
            activeStyle={activeNavLink}
          >
            Тесты
          </NavLink>

          <div className='dropdown-menu'>
            <NavLink
              className='dropdown-item'
              to='/pinyin-tests'
              activeStyle={activeNavLink}
              onClick={() => setPathsAndCollapse({ ...paths, tests: "/pinyin-tests" })}
            >
              Пиньинь
            </NavLink>
            <NavLink
              className='dropdown-item'
              to='/hsk-tests'
              activeStyle={activeNavLink}
              onClick={() => setPathsAndCollapse({ ...paths, tests: "/hsk-tests" })}
            >
              Лексика HSK
            </NavLink>
          </div>
        </li>
        <li className='nav-item'>
          <NavLink
            onClick={collapseIt}
            className='nav-link'
            to='/search'
            activeStyle={activeNavLink}
          >
            Словарь
          </NavLink>
        </li>
        <li className='nav-item dropdown'>
          <NavLink
            className='nav-link dropdown-toggle'
            data-toggle='dropdown'
            to={paths.reading}
            activeStyle={activeNavLink}
          >
            Читалка
          </NavLink>

          <div className='dropdown-menu'>
            <NavLink
              className='dropdown-item'
              to='/texts'
              activeStyle={activeNavLink}
              onClick={() => setPathsAndCollapse({ ...paths, reading: "/texts" })}
            >
              Тексты
            </NavLink>
            <NavLink
              className='dropdown-item'
              to='/books'
              activeStyle={activeNavLink}
              onClick={() => setPathsAndCollapse({ ...paths, reading: "/books" })}
            >
              Книги
            </NavLink>
          </div>
        </li>
        <li className='nav-item'>
          <NavLink
            onClick={collapseIt}
            className='nav-link'
            to='/posts'
            activeStyle={activeNavLink}
          >
            Гостевая
          </NavLink>
        </li>
      </ul>

      {isAuthenticated && authLinks}

      {!isAuthenticated && noAuthLinks}
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
        data-target='#navbarId'
        aria-controls='navbarId'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <span className='navbar-toggler-icon'></span>
      </button>

      <div className='collapse navbar-collapse' id='navbarId'>
        {!loading && <Fragment>{mainMenu}</Fragment>}
      </div>
    </nav>
  );
};

// const appVersion = "2.1.0";

const activeNavLink = {
  color: "#18BC9C"
};

const imgStyle = {
  width: "3vh",
  borderRadius: "50%",
  border: "2px solid #18BC9C",
  marginLeft: "0.3rem"
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
