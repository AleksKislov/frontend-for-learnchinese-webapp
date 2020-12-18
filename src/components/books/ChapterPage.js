import React, { useEffect, Fragment } from "react";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { loadBook, setLoading, loadChapter, getComments } from "../../actions/books";

const ChapterPage = ({ match, loadBook, loading, setLoading, loadChapter, chapter, book }) => {
  useEffect(() => {
    loadChapter(match.params.chapterId);
    if (!book) {
      setLoading();
      loadBook(match.params.bookId);
    }
    // getComments(match.params.id);
  }, [loadBook, setLoading, loadChapter]);

  return (
    <Fragment>
      {loading || !book ? (
        <Spinner />
      ) : (
        <div className='row'>
          <div className='col-sm-3'>
            <div className='card bg-light mb-3'>
              <img className='mr-3' src={`${book.pictureUrl}`} style={imgStyle} alt='Picture' />
              <div className='card-body'>
                <h6 className='card-subtitle mb-2'>
                  <span className='text-muted'>Автор: </span>
                  {book.authorName.nameRus}
                </h6>

                <h6 className='card-subtitle mb-2'>
                  <span className='text-muted'>Кол-во знаков: </span>
                  {book.length}
                </h6>
                {
                  // for editing
                  // isAuthenticated &&
                  // (currentUser._id === text.user || currentUser.role === "admin") && (
                  //   <Link to='/create-book'>
                  //     <button className='btn btn-sm btn-outline-warning'>Edit</button>
                  //   </Link>
                  // )
                }
              </div>
            </div>
          </div>

          <div className='col-sm-9'>
            <h2>{book.russianTitle}</h2>

            <Link to={`/books/${match.params.bookId}`}>
              <div className='btn btn-sm btn-outline-info'>Назад</div>
            </Link>

            <div></div>
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
  book: state.books.book,
  chapter: state.books.chapter,
  loading: state.books.loading,
  isAuthenticated: state.auth.isAuthenticated,
  currentUser: state.auth.user
  // comments: state.texts.currentComments
});

export default connect(mapStateToProps, { loadBook, setLoading, loadChapter })(ChapterPage);
