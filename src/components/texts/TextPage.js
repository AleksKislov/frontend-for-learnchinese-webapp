import React, { useEffect, Fragment, useState } from "react";
import { connect } from "react-redux";
import { loadText, setLoading } from "../../actions/texts";
import { getComments } from "../../actions/comments";
import { parseChineseWords } from "../../actions/helpers";
import Spinner from "../layout/Spinner";
import { v4 as uuid } from "uuid";
import Paragraph from "./Paragraph";
import { Link } from "react-router-dom";
import WordModal from "../translation/WordModal";
import { loadUserWords } from "../../actions/userWords";
import Comment from "../comments/Comment";
import LeaveComment from "../comments/LeaveComment";
import ReadingCard from "../dashboard/ReadingCard";

const TextPage = ({
  text,
  loadText,
  match,
  loading,
  setLoading,
  loadUserWords,
  isAuthenticated,
  currentUser,
  getComments,
  comments
}) => {
  useEffect(() => {
    setLoading();
    loadText(match.params.id);
    getComments("text", match.params.id);
  }, [loadText, setLoading, getComments]);

  useEffect(() => {
    if (text) {
      setTimeout(async () => {
        const chineseChunkedWords = await parseChineseWords(text);
        setChineseChunkedArr(chineseChunkedWords);
      }, 0);
    }
  }, [text]);

  useEffect(() => {
    if (isAuthenticated) loadUserWords();
  }, [isAuthenticated]);

  const [chineseChunkedArr, setChineseChunkedArr] = useState([]);
  const [hideFlag, setHideFlag] = useState(false);
  const onClick = () => setHideFlag(!hideFlag);

  return (
    <Fragment>
      {loading || !text || chineseChunkedArr.length === 0 ? (
        <Spinner />
      ) : (
        <div className='row'>
          <WordModal />

          <div className='col-sm-3'>
            <div className='card bg-light mb-3'>
              <img className='mr-3 cardImageStyle' src={`${text.pic_url}`} alt='text pic' />
              <div className='card-body'>
                <p className='card-text text-center'>
                  {text.tags.map((tag, ind) => (
                    <span key={ind} className='badge badge-pill badge-info mx-1'>
                      {tag}
                    </span>
                  ))}
                </p>
                <h6 className='card-subtitle mb-2'>
                  <span className='text-muted'>Опубликовал: </span>
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
                {isAuthenticated &&
                  (currentUser._id === text.user || currentUser.role === "admin") && (
                    <Link to='/create-text'>
                      <button className='btn btn-sm btn-outline-warning'>Edit</button>
                    </Link>
                  )}
              </div>
            </div>

            <ReadingCard />
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
              {chineseChunkedArr.map((chunk, ind) => (
                <Paragraph
                  chunk={chunk}
                  originTxt={text.origintext[ind]}
                  index={ind}
                  key={uuid()}
                  translation={text.translation[ind]}
                  hideFlag={hideFlag}
                />
              ))}
            </div>

            <div className='my-2 mx-2'>
              <LeaveComment _id={text._id} where={"text"} />
              <h4>Комментарии:</h4>
              {comments.length > 0 &&
                comments.map(comment => <Comment key={comment._id} comment={comment} />)}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

const mapStateToProps = state => ({
  text: state.texts.text,
  loading: state.texts.loading,
  isAuthenticated: state.auth.isAuthenticated,
  currentUser: state.auth.user,
  comments: state.comments.currentComments
});

export default connect(mapStateToProps, { loadText, loadUserWords, setLoading, getComments })(
  TextPage
);
