import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import store from "../../store";
import axios from "axios";
import PropTypes from "prop-types";
import WordModal from "./WordModal";
import { setAlert } from "../../actions/alert";
import { loadUserWords } from "../../actions/userWords";
import { getWords, segmenter, itirateWordsFromDB } from "../../actions/helpers";
import TippyTooltip from "./TippyTooltip";
import { v4 as uuid } from "uuid";
import { Widget, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import "./style.css";

const TranslateForm = ({ loadUserWords }) => {
  useEffect(() => {
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
      let allwords = await segmenter(originText);
      allwords = allwords.filter(word => word !== " ");
      const wordsFromDB = await getWords(allwords);
      const newArr = itirateWordsFromDB(allwords, wordsFromDB);
      setWordsFromText(newArr);
    }

    textArea.value = "";
    setTextLen(0);
  };

  const handleNewUserMessage = async newMessage => {
    // console.log(`New message incoming! ${newMessage}`);
    // Now send the message throught the backend API

    let res;
    try {
      res = await axios.get("/api/dialogflow?text=" + newMessage);

      if (res) {
        // console.log(res.data.response);
        addResponseMessage(res.data.response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onChange = e => setTextLen(e.target.value.length);

  return (
    <div className='row'>
      <WordModal />

      <div className='col-sm-3'>
        <div className='card bg-light mb-3'>
          <div className='card-body'>
            <h4 className='card-title'>Pop-up Перевод</h4>
            <p className='card-text'>
              Введите до 350 иероглифов и получите перевод для каждого слова. Чтобы увидеть перевод
              - наведите курсор на иероглифы.
            </p>
            <p className='card-text'>
              Кнопка "Больше" покажет примеры и еще больше значений слова (если есть).
            </p>
            <p className='card-text'>
              Кнопка "+" добавит слово в личный вокабуляр для последующего повторения.
            </p>
            <p className='card-text text-success'>
              При необходимости разделяйте слова на отдельные иероглифы при помощи пробелов.
            </p>
          </div>
        </div>

        <div className='card text-white bg-primary mb-3'>
          <div className='card-body'>
            <h4 className='card-title'>Чат с AI</h4>
            <p className='card-text'>
              В нижнем правом углу кнопка для вызова чата с AI. Поддерживаемые темы будут
              расширяться.
            </p>
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
          <div className='result'>
            <p>
              {wordsFromText &&
                wordsFromText.map(word => <TippyTooltip word={word} key={uuid()} />)}
            </p>
          </div>
        </div>

        <Widget
          handleNewUserMessage={handleNewUserMessage}
          title='AI-чат Buyilehu'
          subtitle='Пообщайтесь с AI на китайском'
          senderPlaceHolder='Ваше сообщение...'
        />
      </div>
    </div>
  );
};

TranslateForm.propTypes = {
  userwords: PropTypes.array.isRequired,
  loadUserWords: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  userwords: state.userwords.userwords,
  wordsLoading: state.userwords.loading
});

export default connect(mapStateToProps, { loadUserWords })(TranslateForm);
