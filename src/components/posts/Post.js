import React from "react";
import { Link } from "react-router-dom";
import Moment from "moment";
import "moment/locale/ru";
import { connect } from "react-redux";
import { addLike, addDislike, loadPost } from "../../actions/posts";

const Post = ({ post, addLike, addDislike }) => {
  const { text, name, avatar, date, title, _id, tag, comments_id, likes, dislikes } = post;
  const tagTheme = {
    wish: "Пожелание",
    bug: "Недочет на Сайте",
    news: "Новости Проекта"
  };

  const badgeColor = tag === "news" ? "info" : tag === "bug" ? "danger" : "success";

  Moment.locale("ru");
  return (
    <div className='card my-2'>
      <div className='card-body' style={customStyle}>
        <div>
          <img className='mr-3' src={`https:${avatar}`} style={imgStyle} alt='Avatar' />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <h4 className='card-title'>{title}</h4>
            <span className={`mx-2 badge badge-${badgeColor}`}>{tagTheme[tag]}</span>
          </div>
          <h6 className='card-subtitle mb-2 text-muted'>
            {name} | <em>{Moment(date).format("lll")}</em>
          </h6>
          <p className='card-text' dangerouslySetInnerHTML={{ __html: text }}></p>
          <div className=''>
            <button className='btn btn-light' onClick={() => addLike(_id)}>
              <i className='fas fa-thumbs-up'></i> {likes.length > 0 && <span>{likes.length}</span>}
            </button>
            <button className='btn btn-light mx-2' onClick={() => addDislike(_id)}>
              <i className='fas fa-thumbs-down'></i>{" "}
              {dislikes.length > 0 && <span>{dislikes.length}</span>}
            </button>
            <Link to={`/posts/${_id}`}>
              <button className='btn btn-outline-info'>
                Комментарии {comments_id.length > 0 && <span>{comments_id.length}</span>}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const imgStyle = {
  width: "40px",
  borderRadius: "8px"
};

const customStyle = {
  display: "flex"
};

export default connect(null, { addDislike, addLike })(Post);
