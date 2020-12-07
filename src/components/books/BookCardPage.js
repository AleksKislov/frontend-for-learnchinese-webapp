import React, { useEffect, Fragment, useState } from "react";
import Spinner from "../layout/Spinner";
import ChapterItem from "./ChapterItem";
import { Link } from "react-router-dom";
import axios from "axios";

const BookCardPage = ({ match }) => {
  useEffect(() => {
    getBook(match.params.id);
  }, []);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const getBook = async id => {
    try {
      const { data } = await axios.get(`/api/books/get_book/${id}`);
      setBook(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <Fragment>
      {loading ? (
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
              <h4>Содержание:</h4>
              <table className='table table-hover'>
                <tbody>
                  {book.contents &&
                    book.contents.map((chapter, ind) => (
                      <ChapterItem key={chapter.id} chapter={chapter} ind={ind} />
                    ))}
                </tbody>
              </table>
            </div>

            <hr />

            <div className='my-2'>
              <h4>Комментарии:</h4>
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

export default BookCardPage;
