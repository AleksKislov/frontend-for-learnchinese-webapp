import React from "react";
import { Link } from "react-router-dom";
import { levelStars } from "../../actions/helpers";
import { dateToStr } from "../../actions/helpers";
import Tippy from "@tippyjs/react";

const TextCard = ({ text }) => {
  const {
    title,
    pic_url,
    tags,
    length,
    description,
    level,
    date,
    name,
    comments_id,
    _id,
    theme_word,
    hits
  } = text;

  const dateAndTime = dateToStr(date);
  return (
    <div className='card my-2'>
      <Tippy content='Прочитано'>
        <h2 className='alreadyReadMark'>
          <i className='fas fa-check-circle text-success'></i>
        </h2>
      </Tippy>

      <div className='card-body row'>
        <div style={{ position: "relative" }} className='col-md-3'>
          <Link to={`/texts/${_id}`}>
            <img className='mr-3 textCardImg' src={`${pic_url}`} alt='text pic' />
            <div style={imgText}>{theme_word}</div>
          </Link>
        </div>
        <div className='col-md-9'>
          <h4 className='card-title'>
            <Link to={`/texts/${_id}`}>{title}</Link>{" "}
            <Tippy content={`просмотров: ${hits}`}>
              <small className='text-muted extra-smtext'>
                <i className='fas fa-eye'></i> {hits}
              </small>
            </Tippy>
          </h4>
          <h6 className='card-subtitle mb-1 text-muted'>
            <em>{dateAndTime}</em>
          </h6>
          <div className='mb-2'>
            <span className='text-muted'>Тэги: </span>
            {tags.map((tag, ind) => (
              <span key={ind} className='badge badge-pill badge-info ml-1'>
                {tag}
              </span>
            ))}
          </div>
          <h6 className='card-subtitle mb-2'>
            <span className='text-muted'>Опубликовал: </span>
            {name}
          </h6>
          <h6 className='card-subtitle mb-2'>
            <span className='text-muted'>Уровень: </span>
            {levelStars(level)}
          </h6>
          <h6 className='card-subtitle mb-2'>
            <span className='text-muted'>Кол-во знаков: </span>
            {length}
          </h6>
          <p className='card-text'>{description}</p>

          <div className=''>
            <Link to={`/texts/${_id}`}>
              <button className='btn btn-sm btn-outline-info'>
                Комментарии {comments_id.length > 0 && <span>{comments_id.length}</span>}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const imgText = {
  fontSize: "2rem",
  color: "black",
  fontWeight: "bold",
  textShadow: "1px 1px 1px white, 2px 2px 1px white",
  position: "absolute",
  width: "5rem",
  // top: "85%",
  // left: "25%",
  // transform: "translate(-50%, -50%)"
  marginTop: "-3.5rem",
  marginLeft: "1rem"
};

export default TextCard;
