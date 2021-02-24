import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { parseChineseWords } from "../../actions/helpers";
import TippyTooltip from "../translation/TippyTooltip";
import WordModal from "../translation/WordModal";

const Landing = ({ isAuthenticated }) => {
  const [word, setWord] = useState(null);

  const setTooltip = async () => {
    const res = await parseChineseWords({ chinese_arr: ["我"] });
    setWord(res[0][0]);
  };

  useEffect(() => {
    setTooltip();
  }, []);

  if (isAuthenticated) return <Redirect to='/dashboard' />;

  return (
    <section className='landing' style={{ marginRight: "0", marginLeft: "0" }}>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Chinese+ Клуб изучения китайского языка</title>
      </Helmet>
      <div className='container'>
        <div className='row'>
          <WordModal />
          <div className='col-sm-4'>
            <div className='card border-light mb-3'>
              <div className='card-header h5'>Умный перевод</div>
              <div className='card-body row'>
                <div className='col-md-2'>
                  <h3>{word && <TippyTooltip word={word} />}</h3>
                </div>
                <div className='col-md-10'>
                  <p className='card-text'>
                    Все тексты с параллельным переводом. И это еще не всё! Кликните на иероглиф -
                    появится перевод.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='col-sm-4'>
            <div className='card border-light mb-3'>
              <div className='card-header h5'>Можно делиться текстами</div>
              <div className='card-body'>
                <p className='card-text'>
                  Участники клуба ежедневно добавляют новые тексты и переводы. Разных уровней
                  сложности. У нас есть и целые книги!
                </p>
              </div>
            </div>
          </div>
          <div className='col-sm-4'>
            <div className='card border-light mb-3'>
              <div className='card-header h5'>Личный вокабуляр</div>
              <div className='card-body'>
                <h4 className='card-title'>Light card title</h4>
                <p className='card-text'>
                  Some quick example text to build on the card title and make up the bulk of the
                  card's content.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-4'>
            <div className='card border-light mb-3'>
              <div className='card-header h5'>Словарь с анимацией</div>
              <div className='card-body'>
                <h4 className='card-title'>Light card title</h4>
                <p className='card-text'>
                  Some quick example text to build on the card title and make up the bulk of the
                  card's content.
                </p>
              </div>
            </div>
          </div>
          <div className='col-sm-4'>
            <div className='card border-light mb-3'>
              <div className='card-header h5'>Для начинающих</div>
              <div className='card-body'>
                <h4 className='card-title'>Light card title</h4>
                <p className='card-text'>Озвученный пиньинь и слова HSK</p>
              </div>
            </div>
          </div>
          <div className='col-sm-4'>
            <div className='card border-light mb-3'>
              <div className='card-header h5'>Тесты и квизы</div>
              <div className='card-body'>
                <h4 className='card-title'>Light card title</h4>
                <p className='card-text'>Проверьте свои знания при помощи тестов</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// <div className='dark-overlay'>
// <div className='landing-inner'>
//   <h1 className='x-large'>Добро пожаловать в клуб Chinese+</h1>

//   <div className='embed-responsive embed-responsive-16by9' style={{ maxWidth: "60rem" }}>
//     <iframe
//       className='embed-responsive-item'
//       width='560'
//       height='315'
//       src='https://www.youtube.com/embed/fxM8lH17fUY'
//       frameBorder='0'
//       allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
//       allowFullScreen
//     ></iframe>
//   </div>

//   <p className='lead'>Web-приложение для изучающих китайский язык от ChinesePlus</p>
//   <div className='buttons'>
//     <Link to='/register' className='btn btn-dark'>
//       Регистрация
//     </Link>
//     <Link to='/login' className='btn btn-light'>
//       Войти
//     </Link>
//   </div>

//   <div className='card text-primary bg-light mt-4'>
//     <div className='card-header'>
//       <h5>Здесь вы сможете</h5>
//     </div>
//     <div className='card-body'>
//       <ul className='card-text' style={{ marginRight: "2rem", textAlign: "left" }}>
//         <li>Почитать тексты и книги на китайском языке со встроенным переводом</li>
//         <li>Изучать любые слова, добавляя их в личные списки для изучения</li>
//         <li>Пользоваться словарем с анимированными иероглифами</li>
//         <li>Проходить тесты на знание китайского языка</li>
//         <li>И многое другое, так как проект каждый день развивается!</li>
//       </ul>
//     </div>
//   </div>
// </div>
// </div>

Landing.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Landing);
