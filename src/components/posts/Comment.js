import React from "react";
import { connect } from "react-redux";
import { deleteComment } from "../../actions/posts";

const Comment = ({ comment, currentUser, isAuthenticated, deleteComment }) => {
  const { avatar, text, name, date, user, post_id, _id } = comment;

  const dateAndTime = dateToStr(date);

  return (
    <div className='card my-2'>
      <div className='card-body' style={customStyle}>
        <div>
          <img className='mr-3' src={`https:${avatar}`} style={imgStyle} alt='Avatar' />
        </div>
        <div style={{ width: "100%" }}>
          {isAuthenticated && (currentUser._id === user || currentUser.role === "admin") && (
            <button
              className='btn btn-sm btn-danger float-right'
              onClick={e => deleteComment(post_id, _id)}
            >
              <i className='fas fa-trash-alt'></i>
            </button>
          )}

          <p className='card-text' dangerouslySetInnerHTML={{ __html: text }}></p>
          <h6 className='card-subtitle mb-2 text-muted'>
            {name} | <em>{dateAndTime}</em>
          </h6>
        </div>
      </div>
    </div>
  );
};

const dateToStr = date => {
  const str = new Date(date);
  const options = { year: "numeric", month: "short", day: "numeric" };
  const rusDate = str.toLocaleDateString("ru-RU", options); // 22 авг. 2020 г.
  return `${rusDate}, ${date.slice(11, 16)}`;
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

export default connect(mapStateToProps, { deleteComment })(Comment);
