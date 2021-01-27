import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { loadTexts, clearText } from "../../actions/texts";
import Spinner from "../layout/Spinner";
import TextCard from "./TextCard";
import ReadingCard from "../dashboard/ReadingCard";
import { Helmet } from "react-helmet";
import PleaseShareText from "./PleaseShareText";
import NumOfTexts from "./NumOfTexts";
import Tippy from "@tippyjs/react";
import { textCategories } from "../../apikeys.json";

const Texts = ({ loadTexts, texts, loading, clearText, moreTexts, user }) => {
  useEffect(() => {
    clearText();
    if (texts.length === 0) loadTexts(0);
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

  const [categoryFlag, setCategoryFlag] = useState(0);
  const [hideReadFlag, setHideReadFlag] = useState(0);
  const [hideFlag, setHideFlag] = useState(levelFilter[0]);
  const onLevelSelect = e =>
    setHideFlag(levelFilter[parseInt(e.target.options[e.target.options.selectedIndex].value)]);

  const onReadSelect = e =>
    setHideReadFlag(parseInt(e.target.options[e.target.options.selectedIndex].value));

  const onCategorySelect = e => {
    setCategoryFlag(parseInt(e.target.options[e.target.options.selectedIndex].value));
  };

  return (
    <div className='row'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Тексты на китайском языке с переводом | Chinese+</title>
      </Helmet>

      <div className='col-md-3'>
        <div className='card bg-light mb-3'>
          <div className='card-body'>
            <p className='card-text'>Чтение китайских текстов с умным переводом.</p>
            <p className='card-text text-info'>
              Если в текстах что-то не так, оставьте комментарий, и мы поправим.
            </p>

            <NumOfTexts />
          </div>
        </div>

        <PleaseShareText />
        <ReadingCard />
      </div>

      <div className='col-md-9'>
        <h2>Тексты на китайском языке с переводом</h2>

        <div className='form-group row'>
          <div className='col-sm-4'>
            <label htmlFor='levelFilt'>Уровень</label>
            <select className='custom-select' onChange={e => onLevelSelect(e)} id='levelFilt'>
              <option defaultValue='0' value='0'>
                Все Уровни
              </option>
              <option value='1'>1 Простой ⭐</option>
              <option value='2'>2 Средний ⭐⭐</option>
              <option value='3'>3 Сложный ⭐⭐⭐</option>
            </select>
          </div>

          <Tippy
            content='Только для авторизованных'
            placement='bottom'
            disabled={user ? true : false}
          >
            <div className='col-sm-4'>
              <label htmlFor='readFilt'>Прочитанные</label>
              <select
                className='custom-select'
                onChange={e => onReadSelect(e)}
                id='readFilt'
                disabled={user ? false : true}
              >
                <option defaultValue='0' value='0'>
                  Все тексты
                </option>
                <option value='1'>Непрочитанные</option>
                <option value='2'>Прочитанные</option>
              </select>
            </div>
          </Tippy>

          <div className='col-sm-4'>
            <label htmlFor='categoryFilt'>Категория</label>
            <select className='custom-select' onChange={e => onCategorySelect(e)} id='categoryFilt'>
              <option defaultValue='0' value='0'>
                Все Категории
              </option>
              {textCategories.map((x, ind) => (
                <option value={ind + 1} key={ind}>
                  {x}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className=''>
            {texts.map(
              text =>
                hideFlag[text.level] && (
                  <TextCard
                    key={text._id}
                    text={text}
                    hide={hideReadFlag}
                    category={categoryFlag}
                  />
                )
            )}
            <div className='text-center'>
              {moreTexts ? (
                <button
                  type='button'
                  className='btn btn-info btn-sm mb-1'
                  onClick={() => loadTexts(texts.length)}
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
  texts: state.texts.texts,
  loading: state.texts.loading,
  moreTexts: state.texts.moreTexts,
  user: state.auth.user
});

export default connect(mapStateToProps, { loadTexts, clearText })(Texts);
