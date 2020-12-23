import React, { useEffect, Fragment, useState } from "react";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { loadBook, setLoading, loadPage } from "../../actions/books";
import { getComments } from "../../actions/comments";
import { parseChineseWords } from "../../actions/helpers";
import WordModal from "../translation/WordModal";
import { loadUserWords } from "../../actions/userWords";
import { v4 as uuid } from "uuid";
import Paragraph from "../texts/Paragraph";
import ImageCard from "./info/ImageCard";
import LeaveComment from "../comments/LeaveComment";
import Comment from "../comments/Comment";
import BookTitle from "./info/BookTitle";

const ChapterPage = ({
  match,
  loadBook,
  loading,
  setLoading,
  book,
  loadPage,
  page,
  comments,
  getComments,
  loadUserWords,
  isAuthenticated
}) => {
  useEffect(() => {
    const { chapterId, pageInd, bookId } = match.params;
    if (!book) {
      setLoading();
      loadBook(bookId);
    } else {
      loadPage(book.contents[parseInt(chapterId)].pages[parseInt(pageInd)]);
    }
  }, [loadBook, setLoading, book]);

  useEffect(() => {
    if (page) {
      setTimeout(async () => {
        const chineseChunkedWords = await parseChineseWords(page);
        setChineseChunkedArr(chineseChunkedWords);
        if (isAuthenticated) loadUserWords();
      }, 0);
      getComments("book", page._id);
    }
  }, [page]);

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
              <h2>
                <BookTitle russianTitle={book.russianTitle} chineseTitle={book.chineseTitle} />
              </h2>
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

              {page && (
                <div className='my-2 mx-2'>
                  <LeaveComment
                    _id={page._id}
                    where={"book"}
                    path={window.location.pathname.slice(7)}
                  />
                  <h4>Комментарии:</h4>
                  {comments.length > 0 &&
                    comments.map(comment => <Comment key={comment._id} comment={comment} />)}
                </div>
              )}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

const mapStateToProps = state => ({
  book: state.books.book,
  loading: state.books.loading,
  isAuthenticated: state.auth.isAuthenticated,
  currentUser: state.auth.user,
  page: state.books.page,
  comments: state.comments.currentComments
});

export default connect(mapStateToProps, {
  loadBook,
  setLoading,
  loadPage,
  getComments,
  loadUserWords
})(ChapterPage);
