import React, { useEffect, Fragment } from "react";
import Spinner from "../layout/Spinner";
import ChapterItem from "./ChapterItem";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { loadBook, setLoading, clearPage } from "../../actions/books";

const BookCardPage = ({ match, loadBook, loading, setLoading, book, clearPage }) => {
  useEffect(() => {
    setLoading();
    clearPage();
    loadBook(match.params.id);
  }, [loadBook, setLoading]);

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
              </div>
            </div>
          </div>

          <div className='col-sm-9'>
            <h2>{book.russianTitle}</h2>

            <Link to='/books'>
              <div className='btn btn-sm btn-outline-info'>Назад</div>
            </Link>

            <div>
              <div className='mb-2'>
                <span className='text-muted'>Жанр: </span>
                {book.genre.map((genreName, ind) => (
                  <span key={ind} className='badge badge-pill badge-info ml-1'>
                    {genreName}
                  </span>
                ))}
              </div>
              <h6 className='card-subtitle mb-2'>
                <span className='text-muted'>Автор: </span>
                {book.authorName.nameRus}
              </h6>
              <h6 className='card-subtitle mb-2'>
                <span className='text-muted'>Кол-во знаков: </span>
                {book.length}
              </h6>
              <p className='card-text'>
                <span className='text-muted'>Аннотация: </span>
                {book.annotation}
              </p>
              <h4>Содержание</h4>
              <table className='table table-hover'>
                <tbody>
                  {book.contents &&
                    book.contents.map((chapter, ind) => (
                      <ChapterItem
                        key={chapter.chapterId}
                        chapter={chapter}
                        ind={ind}
                        bookId={match.params.id}
                      />
                    ))}
                </tbody>
              </table>
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
};

const mapStateToProps = state => ({
  book: state.books.book,
  loading: state.books.loading
});

export default connect(mapStateToProps, { loadBook, setLoading, clearPage })(BookCardPage);
