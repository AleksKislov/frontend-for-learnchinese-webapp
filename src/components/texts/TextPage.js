import React, { useEffect, Fragment, useState } from "react";
import { connect } from "react-redux";
import { loadText, setLoading } from "../../actions/texts";
import Spinner from "../layout/Spinner";
import { v4 as uuid } from "uuid";
import Paragraph from "./Paragraph";
import { Link } from "react-router-dom";
import WordModal from "../translation/WordModal";
import { loadUserWords } from "../../actions/userWords";
import axios from "axios";

const TextPage = ({
  text,
  loadText,
  match,
  loading,
  setLoading,
  loadUserWords,
  isAuthenticated,
  currentUser
}) => {
  useEffect(() => {
    setLoading();
    loadText(match.params.id);
  }, [loadText, setLoading]);

  useEffect(() => {
    if (text) {
      setTimeout(async () => {
        const wordsFromDB = await getWords(text.chinese_arr);
        // console.log(wordsFromDB);
        let newArr = text.chinese_arr.map(word => {
          for (let i = 0; i < wordsFromDB.length; i++) {
            if (word === wordsFromDB[i].chinese) {
              return wordsFromDB[i];
            }
          }
          return word;
        });

        const chineseChunkedWords = chunkArrayFunc(newArr); // array of object arrays
        setChineseChunkedArr(chineseChunkedWords);

        loadUserWords();
      }, 0);
    }
  }, [text]);

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

  const clearText = () => {
    setLoading();
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

  const [chineseChunkedArr, setChineseChunkedArr] = useState([]);

  const [hideFlag, setHideFlag] = useState(false);

  const onClick = () => setHideFlag(!hideFlag);

  return (
    <Fragment>
      {loading || !text || chineseChunkedArr.length === 0 ? (
        <Spinner />
      ) : (
        <div className='row'>
          <WordModal />

          <div className='col-sm-3'>
            <div className='card bg-light mb-3'>
              <img className='mr-3' src={`${text.pic_url}`} style={imgStyle} alt='Picture' />
              <div className='card-body'>
                <p className='card-text text-center'>
                  {text.tags.map((tag, ind) => (
                    <span key={ind} className='badge badge-pill badge-info mx-1'>
                      {tag}
                    </span>
                  ))}
                </p>
                <h6 className='card-subtitle mb-2'>
                  <span className='text-muted'>Автор: </span>
                  {text.name}
                </h6>
                <h6 className='card-subtitle mb-2'>
                  <span className='text-muted'>Уровень: </span>
                  {text.level}
                </h6>
                <h6 className='card-subtitle mb-2'>
                  <span className='text-muted'>Кол-во знаков: </span>
                  {text.length}
                </h6>
                {isAuthenticated &&
                  (currentUser._id === text.user || currentUser.role === "admin") && (
                    <Link to='/create-text'>
                      <button className='btn btn-sm btn-outline-warning'>Edit</button>
                    </Link>
                  )}
              </div>
            </div>
          </div>

          <div className='col-sm-9'>
            <h2>{text.title}</h2>

            <Link to='/texts'>
              <div className='btn btn-sm btn-outline-info' onClick={clearText}>
                Назад
              </div>
            </Link>
            <div className='btn btn-sm btn-outline-info float-right' onClick={onClick}>
              {hideFlag ? "Показать Перевод" : "Скрыть Перевод"}
            </div>
            <div className='row'>
              {//text.wordsarr.map((chunk, index) => (
              chineseChunkedArr.map((chunk, index) => (
                <Paragraph
                  chunk={chunk}
                  key={uuid()}
                  translation={text.translation[index]}
                  hideFlag={hideFlag}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

const imgStyle = {
  width: "100%",
  borderRadius: "0.20rem 0.20rem 0 0"
  // opacity: "0.6"
};

const mapStateToProps = state => ({
  text: state.texts.text,
  loading: state.texts.loading,
  isAuthenticated: state.auth.isAuthenticated,
  currentUser: state.auth.user
});

export default connect(mapStateToProps, { loadText, loadUserWords, setLoading })(TextPage);
