import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import store from "../../store";
import axios from "axios";
import PropTypes from "prop-types";
import WordModal from "../translation/WordModal";
import { setAlert } from "../../actions/alert";
import { loadUserWords } from "../../actions/userWords";
import TippyTooltip from "../translation/TippyTooltip";
import { v4 as uuid } from "uuid";

const TextForm = ({ loadUserWords }) => {
  useEffect(() => {
    console.log("汉语是世界上最难学的一个语言");
    loadUserWords();
  }, []);

  const [textLen, setTextLen] = useState(0);

  const [wordsFromText, setWordsFromText] = useState([]);

  const onSubmit = async e => {
    e.preventDefault();
    const textArea = document.getElementById("textArea");

    if (textLen > 350) {
      store.dispatch(setAlert("Максимум 350 знаков, удалите лишние", "danger"));
    } else {
      let originText = textArea.value.trim();
      // let allwords = hanzi.segment(originText);

      let allwords = await segmenter(originText);
      // console.log(allwords);
      allwords = allwords.filter(word => word !== " ");
      const wordsFromDB = await getWords(allwords);

      // console.log(wordsFromDB);
      let newArr = allwords.map(word => {
        for (let i = 0; i < wordsFromDB.length; i++) {
          if (word === wordsFromDB[i].chinese) {
            return wordsFromDB[i];
          }
        }
        return word;
      });

      console.log(newArr);
      setWordsFromText(newArr);
    }

    textArea.value = "";
    setTextLen(0);
  };

  const segmenter = async text => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    let res;
    try {
      res = await axios.post("/api/dictionary/segmenter", { text }, config);
    } catch (err) {
      console.log(err);
    }
    return res.data;
  };

  const getWords = async words => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    let res;
    try {
      res = await axios.post("/api/dictionary/allwords", words, config);
    } catch (err) {
      console.log(err);
    }
    return res.data;
  };

  const onChange = e => setTextLen(e.target.value.length);

  return (
    <div className='row'>
      <WordModal />

      <div className='col-sm-3'>
        <div className='card bg-light mb-3'>
          <div className='card-body'>
            <h4 className='card-title'>Pop-up Перевод</h4>
            <p className='card-text'>тесты</p>
          </div>
        </div>
      </div>

      <div className='col-sm-9'>
        <form onSubmit={e => onSubmit(e)}>
          <div className='form-group'>
            <label htmlFor='textArea'>Вставьте китайский текст для обработки:</label>
            <textarea
              onChange={e => onChange(e)}
              className='form-control'
              id='textArea'
              rows='3'
              placeholder='汉字。。。'
            ></textarea>
            <small className='text-muted'>{textLen}/350</small>
          </div>
          <button type='submit' className='btn btn-primary'>
            Перевести Слова
          </button>
        </form>
        <hr />

        <div>
          <h4>Перевод</h4>
          <div id='result'>
            <p>
              {wordsFromText &&
                wordsFromText.map(word => <TippyTooltip word={word} key={uuid()} />)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

TextForm.propTypes = {
  userwords: PropTypes.array.isRequired,
  loadUserWords: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  userwords: state.userwords.userwords,
  wordsLoading: state.userwords.loading
});

export default connect(mapStateToProps, { loadUserWords })(TextForm);
