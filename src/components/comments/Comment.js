import React from "react";
import { connect } from "react-redux";
import { setCommentToDelete, setCommentReply } from "../../actions/comments";
import { dateToStr, addressToUser } from "../../actions/helpers";
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react";
import { HashLink } from "react-router-hash-link";

const Comment = ({
  comment,
  currentUser,
  isAuthenticated,
  setCommentToDelete,
  setCommentReply
}) => {
  const { avatar, text, name, date, user, _id, commentIdToReply } = comment;
  const dateAndTime = dateToStr(date);

  return (
    <div className='card my-2' id={_id}>
      <div className='commentIdNum'>{`#${_id.slice(-3)}`}</div>
      <div className='card-body' style={customStyle}>
        <div>
          <Tippy
            content='Кликните, чтобы обратиться к пользователю в комментарии'
            placement='bottom'
          >
            <HashLink to='#yourCommentId'>
              <img
                className='mr-3'
                src={`https:${avatar}`}
                style={imgStyle}
                alt='Avatar'
                onClick={() => addressToUser(user, name)}
              />
            </HashLink>
          </Tippy>
        </div>
        <div style={{ width: "100%" }}>
          {commentIdToReply && (
            <small className='text-info'>
              Ответ на комментарий{" "}
              <HashLink to={`#${commentIdToReply.commentId}`}>
                <span className='badge badge-pill badge-primary'>
                  {`#${commentIdToReply.commentId.slice(-3)}`}
                </span>
              </HashLink>
            </small>
          )}
          <p className='card-text' dangerouslySetInnerHTML={{ __html: text }}></p>

          <div className='row'>
            <div className='col-8 mt-2'>
              <h6 className='card-subtitle text-muted'>
                <Link to={`/user/${user}`}>{name}</Link> | <em>{dateAndTime}</em>
              </h6>
            </div>
            <div className='col-4'>
              {isAuthenticated && (currentUser._id === user || currentUser.role === "admin") && (
                <button
                  className='btn btn-sm btn-danger float-right ml-1'
                  data-toggle='modal'
                  data-target='#confirmModal'
                  onClick={e => setCommentToDelete(comment)}
                >
                  <i className='fas fa-trash-alt'></i>
                </button>
              )}
              {isAuthenticated && currentUser._id !== user && (
                <HashLink
                  to='#yourCommentId'
                  className='btn btn-outline-primary btn-sm float-right'
                  onClick={() => setCommentReply(_id, user, name)}
                >
                  Ответ
                </HashLink>
              )}
            </div>
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

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  currentUser: state.auth.user
});

export default connect(mapStateToProps, { setCommentToDelete, setCommentReply })(Comment);
