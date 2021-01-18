import React from "react";
import { Link } from "react-router-dom";

const PleaseShareText = () => {
  return (
    <div className='card bg-light border-primary mb-3'>
      <div className='card-body'>
        <h4 className='card-title'>Поделитесь?</h4>

        <p className='card-text'>
          <span>🙏🏻 внесите свой вклад, добавив новый текст в Читалку</span>
        </p>
        <Link className='card-link' to='/create-text'>
          Добавить Текст
        </Link>
      </div>
    </div>
  );
};

export default PleaseShareText;
