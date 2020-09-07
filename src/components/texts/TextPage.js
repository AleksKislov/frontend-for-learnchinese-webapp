import React, { useEffect, Fragment, useState } from "react";
import { connect } from "react-redux";
import { loadText } from "../../actions/texts";
import Spinner from "../layout/Spinner";
import { v4 as uuid } from "uuid";
import Paragraph from "./Paragraph";
import { Link } from "react-router-dom";
import WordModal from "../translation/WordModal";
import { loadUserWords } from "../../actions/userWords";

const TextPage = ({ text, loadText, match, loading, loadUserWords }) => {
  useEffect(() => {
    loadText(match.params.id);
    loadUserWords();
  }, [loadText]);

  const [hideFlag, setHideFlag] = useState(false);

  const onClick = () => setHideFlag(!hideFlag);

  return (
    <Fragment>
      {loading || !text ? (
        <Spinner />
      ) : (
        <div className='row'>
          <WordModal />

          <div className='col-sm-3'>
            <div className='card bg-light mb-3'>
              <img className='mr-3' src={`${text.pic_url}`} style={imgStyle} alt='Picture' />
              <div className='card-body'>
                <p className='card-text text-center'>
                  {text.tags.map((tag, ind) => (
                    <span key={ind} className='badge badge-pill badge-info mx-1'>
                      {tag}
                    </span>
                  ))}
                </p>
                <h6 className='card-subtitle mb-2'>
                  <span className='text-muted'>Автор: </span>
                  {text.name}
                </h6>
                <h6 className='card-subtitle mb-2'>
                  <span className='text-muted'>Уровень: </span>
                  {text.level}
                </h6>
                <h6 className='card-subtitle mb-2'>
                  <span className='text-muted'>Кол-во знаков: </span>
                  {text.length}
                </h6>
              </div>
            </div>
          </div>

          <div className='col-sm-9'>
            <h2>{text.title}</h2>

            <Link to='/texts'>
              <div className='btn btn-sm btn-outline-info'>Назад</div>
            </Link>
            <div className='btn btn-sm btn-outline-info float-right' onClick={onClick}>
              {hideFlag ? "Показать Перевод" : "Скрыть Перевод"}
            </div>
            <div className='row'>
              {text.wordsarr.map((chunk, index) => (
                <Paragraph
                  chunk={chunk}
                  key={uuid()}
                  translation={text.translation[index]}
                  hideFlag={hideFlag}
                />
              ))}
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

const mapStateToProps = state => ({
  text: state.texts.text,
  loading: state.texts.loading
});

export default connect(mapStateToProps, { loadText, loadUserWords })(TextPage);
