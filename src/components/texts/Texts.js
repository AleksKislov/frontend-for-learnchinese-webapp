import React from "react";

const Texts = ({}) => {
  return (
    <div className='row'>
      <div className='col-sm-3'>
        <div className='card bg-light mb-3'>
          <div className='card-body'>
            <p className='card-text'>
              Чтение текстов на китайском языке с параллельным переводом каждого параграфа, а также
              с буквальным переводом каждого слова (по клику).
            </p>
          </div>
        </div>
      </div>

      <div className='col-sm-9'>
        <h2>Чтение Текстов</h2>
      </div>
    </div>
  );
};

export default Texts;
