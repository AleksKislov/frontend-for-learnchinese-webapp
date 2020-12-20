import React, { useEffect, Fragment } from "react";
import Spinner from "../layout/Spinner";
import ChapterItem from "./ChapterItem";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { loadBook, setLoading, clearPage } from "../../actions/books";
import ImageCard from "./ImageCard";

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
        <Fragment>
          <div className='row'>
            <div className='col-sm-3 my-auto'>
              <Link to='/books'>
                <div className='btn btn-sm btn-outline-info'>Назад</div>
              </Link>
            </div>
            <div className='col-sm-9'>
              <h2>{book.russianTitle}</h2>
            </div>
          </div>
          <div className='row'>
            <ImageCard book={book} />

            <div className='col-sm-9'>
              <div>
                <p className='card-text'>
                  <span className='text-muted'>Аннотация: </span>
                  {book.annotation}
                </p>
                <table className='table table-hover'>
                  <thead>
                    <tr>
                      <th colSpan='2'>Содержание</th>
                      <th scope='col'>字数</th>
                      <th scope='col'>Страницы</th>
                    </tr>
                  </thead>
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
        </Fragment>
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
