import React from "react";
import { Link } from "react-router-dom";
import Length from "./info/Length";
import AuthorRus from "./info/AuthorRus";

const BookCard = ({ book }) => {
  const {
    chineseTitle,
    russianTitle,
    pictureUrl,
    year,
    authorName,
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

          <AuthorRus authorName={authorName} />
          <Length length={length} />
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
