import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import store from "../../store";
import { Redirect } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import WordModal from "../translation/WordModal";
import { setAlert } from "../../actions/alert";
import { loadUserWords } from "../../actions/userWords";
import {
  getPhotos,
  getWords,
  chunkArrayFunc,
  segmenter,
  itirateWordsFromDB,
  getTranslation
} from "../../actions/helpers";
import Paragraph from "./Paragraph";
import { v4 as uuid } from "uuid";
import "./style.css";
import { countZnChars } from "../../actions/helpers";

const TextForm = ({ loadUserWords, user, textToEdit }) => {
  useEffect(() => {
    loadUserWords();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      // console.log(textToEdit);
      if (textToEdit) {
        setIsToEdit(true);
        const {
          level,
          origintext,
          tags,
          title,
          description,
          translation,
          _id,
          theme_word,
          isApproved
        } = textToEdit;
        document.getElementById("description").value = description;
        document.getElementById("level").value = level;
        document.getElementById("tags").value = tags.join(", ");
        document.getElementById("title").value = title;
        document.getElementById("textArea").value = origintext.join("\n");
        document.getElementById("translationArea").value = translation.join("\n");
        document.getElementById("theme_word").value = theme_word;
        document.getElementById("isApproved").value = isApproved ? "1" : "0";

        setFormData({
          ...formData,
          level,
          tags,
          title,
          description,
          theme_word,
          isApproved,
          textId: _id
        });
      }
    }, 0);
  }, [textToEdit]);

  const [isRedirected, setIsRedirected] = useState(false);
  const [okToPublish, setOkToPublish] = useState(false);
  const [isToEdit, setIsToEdit] = useState(false);
  const [textLen, setTextLen] = useState(0);
  const [photosUrls, setPhotosUrls] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [formData, setFormData] = useState({
    chineseChunkedWords: [],
    chunkedTranslation: [],
    description: "", // rewriten usestate
    title: "", // rewriten usestate
    level: 1, // rewriten usestate
    chunkedOriginText: [],
    tags: [], // rewriten usestate
    length: 0,
    allwords: [],
    textId: "",
    pic_theme: "", // in English for pic_url
    pic_url: "",
    theme_word: "" // rewriten usestate
  });

  const preprocessForm = async e => {
    e.preventDefault();
    const textArea = document.getElementById("textArea");

    if (textLen > 1000) {
      store.dispatch(setAlert("Максимум 1000 знаков в китайском тексте, удалите лишние", "danger"));
    } else {
      let originText = textArea.value.trim();
      const translationArea = document.getElementById("translationArea");
      originText = originText.replace(/\n\s*\n/g, "\n");

      let allwords = await segmenter(originText);
      allwords = allwords.filter(word => word !== " ");
      const wordsFromDB = await getWords(allwords);

      let chunkedOriginText = originText.split("\n"); // array of strings
      chunkedOriginText = chunkedOriginText.filter(chunk => chunk);
      textArea.value = chunkedOriginText.join("\n\n");
      let chunkedTranslation;
      if (!isTranslated) {
        const { translation } = await getTranslation(chunkedOriginText);
        setIsTranslated(true);
        // console.log(translation);
        translationArea.value = translation.join("\n\n");
        chunkedTranslation = translation;
        // translationArea.disabled = false;
      } else {
        let translationTrimed = translationArea.value.trim();
        chunkedTranslation = translationTrimed.split("\n"); // array of strings
        chunkedTranslation = chunkedTranslation.filter(chunk => chunk.length);
      }

      // console.log(wordsFromDB);
      const newArr = itirateWordsFromDB(allwords, wordsFromDB);
      const length = countZnChars(originText);
      // let tags = tagsId.value.replaceAll("，", ",");
      // tags = tags.replaceAll("、", ",");
      // tags = tags.split(",");
      // tags = tags.map(tag => tag.trim().toLowerCase()); // array of words

      let chineseChunkedWords = chunkArrayFunc(newArr); // array of object arrays
      chineseChunkedWords = chineseChunkedWords.filter(chunk => chunk.length);
      // console.log({ chineseChunkedWords });

      // const title = document.getElementById("title").value; // string
      // const description = document.getElementById("description").value; // string
      // const pic_theme = document.getElementById("pic_theme").value;
      // const level = parseInt(document.getElementById("level").value); // number
      // const theme_word = document.getElementById("theme_word").value;

      setFormData({
        ...formData,
        chineseChunkedWords,
        chunkedTranslation,
        // tags,
        chunkedOriginText,
        // title,
        // description,
        // level,
        length,
        allwords
        // theme_word
      });
    }
  };

  const loadPictures = () => {
    if (!photosUrls && formData.pic_theme) {
      getPhotos(formData.pic_theme);
      setPhotosUrls(true);
    }
  };

  const parseTags = text => {
    let tags = text.replaceAll("，", ",");
    tags = tags.replaceAll("、", ",");
    tags = tags.split(",");
    tags = tags.map(tag => tag.trim().toLowerCase()); // array of words
    setFormData({ ...formData, tags });
  };

  const choosePicUrl = e => {
    // console.log(e.target);
    if (e.target.className === "imgToChoose") {
      const selectedImg = document.getElementsByClassName("imgToChooseActive");
      if (selectedImg[0]) selectedImg[0].classList.remove("imgToChooseActive");
      document.getElementById("pic_theme_url").value = e.target.src;
      e.target.className += " imgToChooseActive";

      setFormData({
        ...formData,
        pic_url: e.target.src
      });
    }
  };

  const publishText = async formdata => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const {
      chunkedTranslation,
      tags,
      chunkedOriginText,
      title,
      description,
      level,
      length,
      allwords,
      pic_url,
      theme_word,
      isApproved
    } = formdata;

    const body = JSON.stringify({
      origintext: chunkedOriginText,
      title,
      description,
      level,
      tags,
      translation: chunkedTranslation,
      chinese_arr: allwords,
      length,
      pic_url,
      theme_word,
      isApproved,
      name: user.name
    });

    try {
      await axios.post(`/api/texts`, body, config);
      alert("Текст опубликован! Спасибо, что вносите свой вклад!");
      setIsRedirected(true);
    } catch (err) {
      console.log(err);
    }
  };

  const editText = async formdata => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const {
      chunkedTranslation,
      tags,
      chunkedOriginText,
      title,
      description,
      level,
      length,
      allwords,
      textId,
      pic_url,
      theme_word,
      isApproved
    } = formdata;

    const body = JSON.stringify({
      textId,
      origintext: chunkedOriginText,
      title,
      description,
      level,
      tags,
      translation: chunkedTranslation,
      chinese_arr: allwords,
      length,
      pic_url,
      theme_word,
      isApproved
    });

    try {
      await axios.post(`/api/texts`, body, config);
      alert("Текст успешно изменен!");
      setIsRedirected(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyDown = e => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  if (isRedirected) return <Redirect to='/texts' />;

  return (
    <Fragment>
      {!user ? (
        "Страница доступна только авторизованным пользователям"
      ) : (
        <Fragment>
          <div className='col-md-12'>
            <h2>Добавить текст</h2>
            {!textToEdit && !isToEdit && (
              <div className='card bg-light mb-3'>
                <div className='card-header'>Следуйте шагам ниже</div>
                <div className='card-body'>
                  <p className='card-text'>
                    {!formData.title && (
                      <span>
                        1️⃣ Минимум - заполнить красные поля. Начните с заголовка.
                        <br />
                        🙏🏻 вы хорошо поможете, если заполните все поля.
                      </span>
                    )}

                    {!formData.pic_theme &&
                      formData.title &&
                      "2️⃣ Теперь впишите тему картинки на английском языке"}

                    {formData.pic_theme &&
                      formData.title &&
                      !photosUrls &&
                      !formData.pic_url &&
                      "3️⃣ Загрузите картинки для выбора, нажав кнопку 'Загрузить'"}

                    {formData.title &&
                      photosUrls &&
                      !formData.pic_url &&
                      "4️⃣ Кликните одну из картинок, чтобы выбрать ее"}

                    {formData.title &&
                      formData.pic_url &&
                      textLen === 0 &&
                      "5️⃣ Теперь вы можете вставить китайский текст"}

                    {textLen > 0 &&
                      formData.chineseChunkedWords.length === 0 &&
                      "6️⃣ Обработаем и переведем китайский текст, нажав кнопку 'Предобработка'"}

                    {formData.chineseChunkedWords.length !== 0 && (
                      <span>
                        7️⃣ Поправьте русский перевод и китайский оригинал при необходимости (после
                        надо снова нажать 'Предобработка').
                        <br />
                        🔥 Если результат устраивает, то можете нажать 'Опубликовать'.
                        <br />
                        🛑 китайские слова можно отделить пробелами, если они выделены неверно.
                        <br />
                        🙏🏻 вы хорошо поможете, если заполните все поля (описание и тэги)
                      </span>
                    )}
                  </p>
                  <div className='progress'>
                    <div
                      className={`progress-bar bg-${
                        formData.chunkedOriginText.length && formData.chunkedOriginText[0] !== ""
                          ? "success"
                          : "info"
                      }`}
                      role='progressbar'
                      style={{
                        width: `${((formData.title ? 1 : 0) +
                          (formData.description ? 1 : 0) +
                          (formData.tags.length && formData.tags[0] !== "" ? 1 : 0) +
                          (formData.pic_theme ? 1 : 0) +
                          (formData.theme_word ? 1 : 0) +
                          (formData.pic_url ? 1 : 0) +
                          (photosUrls ? 1 : 0) +
                          (formData.chunkedOriginText.length && formData.chunkedOriginText[0] !== ""
                            ? 1
                            : 0) +
                          (formData.chunkedTranslation.length &&
                          formData.chunkedTranslation[0] !== ""
                            ? 1
                            : 0) +
                          1) *
                          10}%`
                      }}
                      aria-valuenow='25'
                      aria-valuemin='0'
                      aria-valuemax='100'
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div className='row'>
              <WordModal />
            </div>

            <form onSubmit={e => preprocessForm(e)} style={{ width: "100%" }}>
              <fieldset>
                {user && user.role === "admin" && isToEdit && (
                  <div className='form-row'>
                    <div className='form-group col-md-6'>
                      <label htmlFor='isApproved'>Одобрено</label>
                      <select
                        className='form-control'
                        id='isApproved'
                        onChange={e =>
                          setFormData({ ...formData, [e.target.id]: parseInt(e.target.value) })
                        }
                      >
                        <option>0</option>
                        <option>1</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className='form-row'>
                  <div className='form-group col-md-6'>
                    <label htmlFor='title'>Заголовок текста</label>
                    <input
                      onChange={e => {
                        setFormData({
                          ...formData,
                          [e.target.id]: e.target.value
                        });
                      }}
                      type='text'
                      className={`form-control ${!formData.title && !isToEdit && "is-invalid"}`}
                      id='title'
                      placeholder='Заголовок'
                      autoComplete='off'
                    />
                  </div>
                  <div className='form-group col-md-6'>
                    <label htmlFor='description'>Краткое описание</label>
                    <input
                      onChange={e => setFormData({ ...formData, [e.target.id]: e.target.value })}
                      type='text'
                      className={`form-control`}
                      id='description'
                      autoComplete='off'
                      placeholder='О чем или откуда этот текст...'
                    />
                  </div>
                </div>
                <div className='form-row'>
                  <div className='form-group col-md-6'>
                    <label htmlFor='tags'>Тэги через запятую</label>
                    <input
                      onChange={e => parseTags(e.target.value)}
                      type='text'
                      className={`form-control`}
                      id='tags'
                      placeholder='Список тэгов'
                    />
                  </div>
                  <div className='form-group col-md-6'>
                    <label htmlFor='level'>Уровень, от 1(простой) до 3(сложный)</label>
                    <select
                      className='form-control'
                      id='level'
                      onChange={e => setFormData({ ...formData, [e.target.id]: e.target.value })}
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                    </select>
                  </div>
                </div>
                <div className='form-row'>
                  <div className='form-group col-md-3'>
                    <label htmlFor='pic_theme'>Тема для картинки (1 слово Eng)</label>
                    <input
                      onChange={e => setFormData({ ...formData, [e.target.id]: e.target.value })}
                      type='text'
                      className={`form-control ${!formData.pic_theme && "is-invalid"}`}
                      id='pic_theme'
                      placeholder='На английском'
                      autoComplete='off'
                    />
                  </div>
                  <div className='form-group col-md-3'>
                    <label htmlFor='theme_word'>1 или 2 汉字 на картинку</label>
                    {
                      // `form-control ${!(formData.theme_word.length === 1 || formData.theme_word.length === 2) && "is-invalid"}`
                    }
                    <input
                      onChange={e => setFormData({ ...formData, [e.target.id]: e.target.value })}
                      type='text'
                      className={`form-control`}
                      id='theme_word'
                      placeholder='汉字'
                      autoComplete='off'
                    />
                  </div>
                  <div className='form-group col-md-6'>
                    <label htmlFor='pic_theme_url'>URL для картинки</label>
                    <input
                      type='text'
                      className='form-control'
                      id='pic_theme_url'
                      placeholder='Кликните картинку ниже'
                      autoComplete='off'
                      disabled
                    />
                  </div>
                </div>

                <div className='form-row' style={{ paddingLeft: "5px" }}>
                  {photosUrls ? (
                    <label className='text-success'>Выберите кликом 1 из картинок ниже:</label>
                  ) : (
                    <Fragment>
                      <label className={formData.pic_theme ? "text-warning" : "text-secondary"}>
                        Загрузить картинки для выбора:
                      </label>
                      <button
                        className='btn btn-sm btn-primary mx-1'
                        disabled={!formData.pic_theme && !photosUrls}
                        onClick={loadPictures}
                      >
                        Загрузить
                      </button>
                    </Fragment>
                  )}
                </div>

                <div className='form-row'>
                  <div
                    className='form-group col-md-12'
                    id='photosDiv'
                    onClick={e => choosePicUrl(e)}
                  ></div>
                </div>
                <div className='form-row'>
                  <div className='form-group col-md-6'>
                    <label htmlFor='textArea'>Вставьте китайский текст для обработки:</label>
                    <textarea
                      onClick={handleKeyDown}
                      onChange={e => {
                        setTextLen(e.target.value.length);
                        setOkToPublish(false);
                      }}
                      className='form-control'
                      id='textArea'
                      rows='3'
                      placeholder='汉字。。。'
                      disabled={(formData.pic_url && formData.title) || isToEdit ? false : true}
                    ></textarea>
                    <small className='text-muted'>{textLen}/1000</small>
                  </div>
                  <div className='form-group col-md-6'>
                    <label htmlFor='translationArea'>Исправьте автоматический перевод:</label>
                    <textarea
                      onClick={handleKeyDown}
                      onChange={() => setOkToPublish(false)}
                      className='form-control'
                      id='translationArea'
                      rows='3'
                      placeholder='Тут будет автоматический перевод, который нужно поправить!'
                      disabled={isTranslated || isToEdit ? false : true}
                    ></textarea>
                    <small className='text-muted'>не забывайте про параграфы</small>
                  </div>
                </div>
                <div className='form-row'>
                  {(textLen !== 0 || isToEdit) && (
                    <button
                      type='submit'
                      className='btn btn-primary mx-1'
                      onClick={() => setOkToPublish(true)}
                    >
                      Предобработка
                    </button>
                  )}
                </div>
              </fieldset>
            </form>
          </div>
          <hr />

          <div className='row'>
            {formData &&
              formData.chineseChunkedWords.map((chunk, ind) => (
                <Paragraph
                  chunk={chunk}
                  originTxt={formData.chunkedOriginText[ind]}
                  index={ind}
                  key={uuid()}
                  translation={formData.chunkedTranslation[ind]}
                  toEdit={true}
                />
              ))}
          </div>
          <hr />

          <div className='row'>
            {formData.chineseChunkedWords.length !== 0 && okToPublish && !isToEdit && (
              <Fragment>
                <button
                  className='btn btn-primary mx-1'
                  onClick={e => publishText(formData)}
                  disabled={
                    formData.chunkedTranslation.length !== formData.chineseChunkedWords.length
                  }
                >
                  Опубликовать
                </button>

                {formData.chunkedTranslation.length !== formData.chineseChunkedWords.length && (
                  <span className='text-danger'>
                    Кол-во параграфов оригинала и перевода не совпадает!
                  </span>
                )}
              </Fragment>
            )}
            {isToEdit && (
              <button className='btn btn-primary mx-1' onClick={e => editText(formData)}>
                Изменить текст
              </button>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

TextForm.propTypes = {
  userwords: PropTypes.array.isRequired,
  loadUserWords: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  userwords: state.userwords.userwords,
  wordsLoading: state.userwords.loading,
  user: state.auth.user,
  textToEdit: state.texts.text
});

export default connect(mapStateToProps, { loadUserWords })(TextForm);
