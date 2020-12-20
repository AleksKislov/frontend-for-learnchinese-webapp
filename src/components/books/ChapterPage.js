import React, { useEffect, Fragment, useState } from "react";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { loadBook, setLoading, getComments, loadPage } from "../../actions/books";
import WordModal from "../translation/WordModal";
import { loadUserWords } from "../../actions/userWords";
import axios from "axios";
import { v4 as uuid } from "uuid";
import Paragraph from "../texts/Paragraph";
import ImageCard from "./ImageCard";

const ChapterPage = ({
  match,
  loadBook,
  loading,
  setLoading,
  book,
  loadPage,
  page,
  isAuthenticated,
  currentUser
}) => {
  useEffect(() => {
    const { chapterId, pageInd, bookId } = match.params;
    if (!book) {
      setLoading();
      loadBook(bookId);
    } else {
      loadPage(book.contents[parseInt(chapterId)].pages[parseInt(pageInd)]);
    }
    // getComments(match.params.id);
  }, [loadBook, setLoading, book]);

  useEffect(() => {
    if (page) {
      setTimeout(async () => {
        const wordsFromDB = await getWords(page.chinese_arr);
        // console.log(wordsFromDB);
        let newArr = page.chinese_arr.map(word => {
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
  }, [page]);

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
      {loading || !book ? (
        <Spinner />
      ) : (
        <Fragment>
          <div className='row'>
            <div className='col-sm-3 my-auto'>
              <Link to={`/books/${match.params.bookId}`}>
                <div className='btn btn-sm btn-outline-info'>Назад</div>
              </Link>
            </div>
            <div className='col-sm-9'>
              <h2>{book.russianTitle}</h2>
            </div>
          </div>

          <div className='row'>
            <WordModal />

            <ImageCard book={book} />

            <div className='col-sm-9'>
              <div className='clearfix'>
                <div className='float-left'>
                  <h4>{book.contents[parseInt(match.params.chapterId)].russianTitle}</h4>
                </div>

                <div className='btn btn-sm btn-outline-info float-right' onClick={onClick}>
                  {hideFlag ? "Показать Перевод" : "Скрыть Перевод"}
                </div>
              </div>

              <div className='row'>
                {!chineseChunkedArr.length ? (
                  <Spinner />
                ) : (
                  chineseChunkedArr.map((chunk, index) => (
                    <Paragraph
                      chunk={chunk}
                      index={index}
                      key={uuid()}
                      translation={page.translation[index]}
                      hideFlag={hideFlag}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </Fragment>
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
  book: state.books.book,
  loading: state.books.loading,
  isAuthenticated: state.auth.isAuthenticated,
  currentUser: state.auth.user,
  page: state.books.page
  // comments: state.texts.currentComments
});

export default connect(mapStateToProps, { loadBook, setLoading, loadPage })(ChapterPage);
