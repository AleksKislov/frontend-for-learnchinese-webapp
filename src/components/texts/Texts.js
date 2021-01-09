import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { loadTexts, clearText } from "../../actions/texts";
import Spinner from "../layout/Spinner";
import TextCard from "./TextCard";
import ReadingCard from "../dashboard/ReadingCard";
import { Helmet } from "react-helmet";

const Texts = ({ loadTexts, texts, loading, clearText }) => {
  useEffect(() => {
    clearText();
    loadTexts();
  }, [loadTexts]);

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
      <Helmet>
        <meta charSet='utf-8' />
        <title>Тексты на китайском языке с переводом | Chinese+</title>
      </Helmet>

      <div className='col-md-3'>
        <div className='card bg-light mb-3'>
          <div className='card-body'>
            <p className='card-text'>
              Чтение текстов на китайском языке с параллельным переводом каждого параграфа, а также
              с буквальным переводом каждого слова (по клику).
            </p>
          </div>
        </div>
        <ReadingCard />
      </div>

      <div className='col-md-9'>
        <h2>Тексты на китайском языке с переводом</h2>

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
          texts.map(text => hideFlag[text.level] && <TextCard key={text._id} text={text} />)
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  texts: state.texts.texts,
  loading: state.texts.loading
});

export default connect(mapStateToProps, { loadTexts, clearText })(Texts);
