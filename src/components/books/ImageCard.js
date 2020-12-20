import React from "react";

const ImageCard = ({ book }) => {
  const { genre, pictureUrl, authorName, length } = book;

  return (
    <div className='col-sm-3'>
      <div className='card bg-light mb-3'>
        <img className='mr-3 cardImageStyle' src={`${pictureUrl}`} alt='Picture' />
        <div className='card-body'>
          <p className='card-text text-center'>
            {genre.map((genreName, ind) => (
              <span key={ind} className='badge badge-pill badge-info ml-1'>
                {genreName}
              </span>
            ))}
          </p>
          <h6 className='card-subtitle mb-2'>
            <span className='text-muted'>Автор: </span>
            {authorName.nameRus}
          </h6>

          <h6 className='card-subtitle mb-2'>
            <span className='text-muted'>Кол-во знаков: </span>
            {length}
          </h6>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
