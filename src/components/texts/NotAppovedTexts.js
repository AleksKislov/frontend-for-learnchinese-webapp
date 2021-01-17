import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { loadNotAppoved, clearText } from "../../actions/texts";
import Spinner from "../layout/Spinner";
import TextCard from "./TextCard";
import ReadingCard from "../dashboard/ReadingCard";

const NotApprovedTexts = ({ loadNotAppoved, texts, loading, clearText, moreTexts }) => {
  useEffect(() => {
    clearText();
    if (texts.length === 0) loadNotAppoved(0);
  }, []);

  const levelFilter = [
    {
      1: true,
      2: true,
      3: true
    },
    {
      1: true,
      2: false,
      3: false
    },
    {
      1: false,
      2: true,
      3: false
    },
    {
      1: false,
      2: false,
      3: true
    }
  ];

  const [hideFlag, setHideFlag] = useState(levelFilter[0]);
  const onSelect = e =>
    setHideFlag(levelFilter[parseInt(e.target.options[e.target.options.selectedIndex].value)]);

  return (
    <div className='row'>
      <div className='col-md-3'>
        <div className='card bg-light mb-3'>
          <div className='card-body'>
            <p className='card-text'>Эти тексты ожидают проверки модератором</p>
          </div>
        </div>

        <div className='card bg-light mb-3'>
          <div className='card-body'>
            <p className='card-text'>
              <Link className='card-link' to='/texts'>
                Назад к проверенным
              </Link>
            </p>
          </div>
        </div>

        <ReadingCard />
      </div>

      <div className='col-md-9'>
        <h2>Тексты, ожидающие проверки</h2>

        <div className='form-group'>
          <select className='custom-select' onChange={e => onSelect(e)}>
            <option defaultValue='0' value='0'>
              Все Уровни
            </option>
            <option value='1'>1 Простой ⭐</option>
            <option value='2'>2 Средний ⭐⭐</option>
            <option value='3'>3 Сложный ⭐⭐⭐</option>
          </select>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className=''>
            {texts.map(text => hideFlag[text.level] && <TextCard key={text._id} text={text} />)}
            <div className='text-center'>
              {moreTexts ? (
                <button
                  type='button'
                  className='btn btn-info btn-sm mb-1'
                  onClick={() => loadNotAppoved(texts.length)}
                >
                  Загрузить Ещё
                </button>
              ) : (
                <button type='button' className='btn btn-warning btn-sm mb-1' disabled>
                  Больше нетути
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  texts: state.texts.not_approved,
  loading: state.texts.loading,
  moreTexts: state.texts.moreTexts
});

export default connect(mapStateToProps, { loadNotAppoved, clearText })(NotApprovedTexts);
