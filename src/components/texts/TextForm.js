import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import store from "../../store";
import axios from "axios";
import PropTypes from "prop-types";
import WordModal from "../translation/WordModal";
import { setAlert } from "../../actions/alert";
import { loadUserWords } from "../../actions/userWords";
import Paragraph from "./Paragraph";
import { v4 as uuid } from "uuid";
import { unsplash } from "../../apikeys.json";
import "./style.css";

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
          theme_word
        } = textToEdit;
        document.getElementById("description").value = description;
        document.getElementById("level").value = level;
        document.getElementById("tags").value = tags.join(", ");
        document.getElementById("title").value = title;
        document.getElementById("textArea").value = origintext.join("\n");
        document.getElementById("translationArea").value = translation.join("\n");
        document.getElementById("theme_word").value = theme_word;

        setFormData({
          ...formData,
          textId: _id
        });
      }
    }, 0);
  }, [textToEdit]);

  const [isToEdit, setIsToEdit] = useState(false);
  const [textLen, setTextLen] = useState(0);
  const [formData, setFormData] = useState({
    chineseChunkedWords: [],
    chunkedTranslation: [],
    description: "",
    title: "",
    level: 1,
    chunkedOriginText: [],
    tags: [],
    length: 0,
    allwords: [],
    textId: "",
    pic_url: "",
    theme_word: ""
  });

  const onSubmit = async e => {
    e.preventDefault();
    const textArea = document.getElementById("textArea");
    const translationArea = document.getElementById("translationArea");
    const tagsId = document.getElementById("tags");

    if (textLen > 800) {
      store.dispatch(setAlert("Максимум 800 знаков в китайском тексте, удалите лишние", "danger"));
    } else {
      let originText = textArea.value.trim();
      let translationTrimed = translationArea.value.trim();

      let allwords = await segmenter(originText);
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

      const length = originText.length;
      let tags = tagsId.value.split(",");
      tags = tags.map(tag => tag.trim()); // array of words
      const chineseChunkedWords = chunkArrayFunc(newArr); // array of object arrays
      const chunkedTranslation = translationTrimed.split("\n"); // array of strings
      const chunkedOriginText = originText.split("\n"); // array of strings
      const title = document.getElementById("title").value; // string
      const description = document.getElementById("description").value; // string
      const level = parseInt(document.getElementById("level").value); // number
      const pic_theme = document.getElementById("pic_theme").value;
      const theme_word = document.getElementById("theme_word").value;

      getPhotos(pic_theme);

      setFormData({
        ...formData,
        chineseChunkedWords,
        chunkedTranslation,
        tags,
        chunkedOriginText,
        title,
        description,
        level,
        length,
        allwords,
        theme_word
      });
    }

    // textArea.value = "";
    // setTextLen(0);
  };

  const getPhotos = async pic_theme => {
    const config = { headers: { Authorization: unsplash } };

    const photosDiv = document.getElementById("photosDiv");
    photosDiv.innerHTML = "";

    try {
      const { data } = await axios.get(
        `https://api.unsplash.com/search/photos?query=${pic_theme}&per_page=5&orientation=portrait`,
        config
      );

      // console.log(data.results[1].urls.small);

      data.results.forEach(el => {
        const img = document.createElement("img");
        img.src = el.urls.small;
        photosDiv.appendChild(img);
        img.classList.add("imgToChoose");
      });
    } catch (err) {
      console.log(err);
    }
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

  const chunkArrayFunc = arr => {
    // get indexes for \n in the array of words
    let inds = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === "\n") {
        inds.push(i);
      }
    }
    // console.log(inds);

    let chunkedArr = [];

    for (let i = 0; i < inds.length; i++) {
      if (i === 0) {
        chunkedArr.push(arr.slice(0, inds[i]));
      } else {
        chunkedArr.push(arr.slice(inds[i - 1] + 1, inds[i]));
      }
    }
    chunkedArr.push(arr.slice(inds[inds.length - 1] + 1));

    return chunkedArr;
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
      theme_word
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
      theme_word
    });

    try {
      const { data } = await axios.post(`/api/texts`, body, config);

      alert("Текст опубликован!");
      // console.log(data);
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
      theme_word
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
      theme_word
    });

    try {
      const { data } = await axios.post(`/api/texts`, body, config);

      alert("Текст успешно изменен!");
      // console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Fragment>
      {user && user.role !== "admin" ? (
        "Страница доступна пока только админу"
      ) : (
        <Fragment>
          <div className='row'>
            <WordModal />

            <form onSubmit={e => onSubmit(e)} style={{ width: "100%" }}>
              <fieldset>
                <div className='form-row'>
                  <div className='form-group col-md-6'>
                    <label htmlFor='title'>Заголовок текста</label>
                    <input
                      type='text'
                      className='form-control'
                      id='title'
                      placeholder='Заголовок'
                      autoComplete='off'
                    />
                  </div>
                  <div className='form-group col-md-6'>
                    <label htmlFor='description'>Краткое описание</label>
                    <input
                      type='text'
                      className='form-control'
                      id='description'
                      autoComplete='off'
                      placeholder='О чем текст...'
                    />
                  </div>
                </div>
                <div className='form-row'>
                  <div className='form-group col-md-6'>
                    <label htmlFor='tags'>Тэги</label>
                    <input
                      type='text'
                      className='form-control'
                      id='tags'
                      placeholder='Тэги через запятую'
                    />
                  </div>
                  <div className='form-group col-md-6'>
                    <label htmlFor='level'>Уровень</label>
                    <select className='form-control' id='level'>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                    </select>
                  </div>
                </div>
                <div className='form-row'>
                  <div className='form-group col-md-3'>
                    <label htmlFor='pic_theme'>Тема для картинки</label>
                    <input
                      type='text'
                      className='form-control'
                      id='pic_theme'
                      placeholder='На английском'
                      autoComplete='off'
                    />
                  </div>
                  <div className='form-group col-md-3'>
                    <label htmlFor='theme_word'>Тема для картинки</label>
                    <input
                      type='text'
                      className='form-control'
                      id='theme_word'
                      placeholder='На китайском'
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
                      onChange={e => onChange(e)}
                      className='form-control'
                      id='textArea'
                      rows='3'
                      placeholder='汉字。。。'
                    ></textarea>
                    <small className='text-muted'>{textLen}/800</small>
                  </div>
                  <div className='form-group col-md-6'>
                    <label htmlFor='translationArea'>Вставьте перевод:</label>
                    <textarea
                      className='form-control'
                      id='translationArea'
                      rows='3'
                      placeholder='Перевод...'
                    ></textarea>
                    <small className='text-muted'>не забывайте про параграфы</small>
                  </div>
                </div>
                <div className='form-row'>
                  <button type='submit' className='btn btn-primary mx-1'>
                    Предобработка
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
          <hr />

          <button className='btn btn-primary mx-1' onClick={e => publishText(formData)}>
            Опубликовать
          </button>
          {isToEdit && (
            <button className='btn btn-primary mx-1' onClick={e => editText(formData)}>
              Изменить текст
            </button>
          )}

          <hr />

          <div className='row'>
            {formData &&
              formData.chineseChunkedWords.map((chunk, index) => (
                <Paragraph
                  chunk={chunk}
                  key={uuid()}
                  translation={formData.chunkedTranslation[index]}
                />
              ))}
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
