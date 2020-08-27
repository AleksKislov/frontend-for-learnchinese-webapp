import React from "react";
import Moment from "moment";
import { connect } from "react-redux";
import { deleteComment } from "../../actions/posts";

const Comment = ({ comment, currentUser, isAuthenticated, deleteComment }) => {
  const { avatar, text, name, date, user, post_id, _id } = comment;
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
            {name} | <em>{Moment(date).format("lll")}</em>
          </h6>
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

export default connect(mapStateToProps, { deleteComment })(Comment);
