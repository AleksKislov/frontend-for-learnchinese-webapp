import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profile";
import Spinner from "../layout/Spinner";
import CommentsCard from "./CommentsCard";
// import DashboardActions from "./DashboardActions";

const Dashboard = ({
  getCurrentProfile,
  auth: { user },
  profile: { loading, profile },
  allWordsLen,
  userWordsLen
  // dictStats,
  // getDictStats
}) => {
  useEffect(() => {
    getCurrentProfile();
    // getDictStats();
    // eslint-disable-next-line
  }, []);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <div className='row'>
      <div className='col-sm-6'>
        <h1 className='text-primary'>Личный Кабинет</h1>
        <p className='lead'>
          <i className='fas fa-user'></i> Добро пожаловать{user && ", " + user.name}
        </p>
        <p className='lead'>Роль: {user && user.role}</p>

        <div className='card bg-light mb-3'>
          <div className='card-body'>
            <h4 className='card-title'>Мой HSK</h4>
            <h6 className='card-subtitle mb-2 text-muted'>Личный список слов HSK</h6>
            <p className='card-text'>
              Сейчас для повторения вы отобрали столько слов:{" "}
              <span className='badge badge-pill badge-warning'>{allWordsLen}</span>
            </p>
            <Link to='/hsk-table' className='card-link'>
              Весь HSK
            </Link>
            <Link to='/hsk-words' className='card-link'>
              Мой HSK
            </Link>
          </div>
        </div>

        <div className='card bg-light mb-3'>
          <div className='card-body'>
            <h4 className='card-title'>Мой Вокабуляр</h4>
            <h6 className='card-subtitle mb-2 text-muted'>Список слов из текстов</h6>
            <p className='card-text'>
              Сейчас для повторения вы отобрали столько слов:{" "}
              <span className='badge badge-pill badge-warning'>{userWordsLen}</span>
            </p>
            <Link to='/userwords' className='card-link'>
              Мой Вокабуляр
            </Link>
          </div>
        </div>

        {/*

      {profile ? (
        <Fragment>
          <DashboardActions />
        </Fragment>
      ) : (
        <Fragment>
          <p>Нет никакой информации о Вас</p>

          
          <Link to='/create-profile' className='btn btn-primary my-1'>
            Расскажите о себе
          </Link>
          
        </Fragment>
      )}

      */}
      </div>

      <div className='col-sm-6'>
        <CommentsCard />
      </div>

      {
        // {dictStats.all ? (
        //   <div className='card bg-light mb-3'>
        //     <div className='card-body'>
        //       <h4 className='card-title'>Статистика</h4>
        //       <h6 className='card-subtitle mb-2 text-muted'>словаря БКРС</h6>
        //       <p className='card-text'>
        //         Всего слов:{" "}
        //         <span className='badge badge-pill badge-warning'>
        //           {new Intl.NumberFormat("ru-RU").format(dictStats.all)}
        //         </span>
        //       </p>
        //       <p className='card-text'>
        //         Слов без пиньиня:{" "}
        //         <span className='badge badge-pill badge-warning'>
        //           {new Intl.NumberFormat("ru-RU").format(dictStats.pinyin)}
        //         </span>
        //       </p>
        //       <p className='card-text'>
        //         Слов, где вместо русского перевода указан английский:{" "}
        //         <span className='badge badge-pill badge-warning'>
        //           {new Intl.NumberFormat("ru-RU").format(dictStats.eng)}
        //         </span>
        //       </p>
        //       <p className='card-text'>
        //         Слов, где вместо перевода указана ссылка:{" "}
        //         <span className='badge badge-pill badge-warning'>
        //           {new Intl.NumberFormat("ru-RU").format(dictStats.ref)}
        //         </span>
        //       </p>
        //       <Link to='/search' className='card-link'>
        //         К словарю
        //       </Link>
        //     </div>
        //   </div>
        // ) : (
        //   <Spinner />
        // )}
      }
    </div>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  allWordsLen: state.hskTable.allWordsLen,
  userWordsLen: state.userwords.userWordsLen,
  dictStats: state.profile.dictStats
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
