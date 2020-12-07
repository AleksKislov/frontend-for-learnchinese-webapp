import React from "react";
import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  const {
    chineseTitle,
    russianTitle,
    pictureUrl,
    year,
    authorName: { nameRus, nameChinese },
    genre, // array
    length,
    annotation,
    _id // book id
  } = book;
  return (
    <div className='card my-2'>
      <div className='card-body row'>
        <div style={{ position: "relative" }} className='col-md-3'>
          <Link to={`/books/${_id}`}>
            <img className='mr-3 textCardImg' src={`${pictureUrl}`} alt='Picture' />
          </Link>
        </div>
        <div className='col-md-9'>
          <Link to={`/books/${_id}`}>
            <h4 className='card-title'>{russianTitle}</h4>
          </Link>
          <div className='mb-2'>
            <span className='text-muted'>Жанр: </span>
            {genre.map((genreName, ind) => (
              <span key={ind} className='badge badge-pill badge-info ml-1'>
                {genreName}
              </span>
            ))}
          </div>
          <h6 className='card-subtitle mb-2'>
            <span className='text-muted'>Автор: </span>
            {nameRus}
          </h6>
          <h6 className='card-subtitle mb-2'>
            <span className='text-muted'>Кол-во знаков: </span>
            {length}
          </h6>
          <p className='card-text'>{annotation}</p>

          <div className=''>
            <Link to={`/books/${_id}`}></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
