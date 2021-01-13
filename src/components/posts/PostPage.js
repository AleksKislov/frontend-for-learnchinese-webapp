import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import store from "../../store";
import { setAlert } from "../../actions/alert";
import { loadPost, clearPost } from "../../actions/posts";
import { getComments, addComment } from "../../actions/comments";
import Post from "./Post";
import Comment from "../comments/Comment";
import LeaveComment from "../comments/LeaveComment";

const PostPage = ({
  clearPost,
  loadPost,
  post,
  match,
  loading,
  comments,
  getComments,
  isAuthenticated,
  addComment
}) => {
  useEffect(() => {
    clearPost();
    setTimeout(() => {
      loadPost(match.params.id);
      getComments("post", match.params.id);
    }, 100);
  }, [loading]);

  const [text, setText] = useState("");

  const onSubmit = e => {
    e.preventDefault();

    if (isAuthenticated) {
      const newtext = text.replace(/\n/g, "<br />");

      if (text.length < 281) {
        // id, text
        addComment("post", post._id, newtext);
      } else {
        store.dispatch(setAlert("Сообщение не должно превышать лимит", "danger"));
      }
    } else {
      store.dispatch(setAlert("Авторизуйтесь, чтобы оставлять комментарии.", "danger"));
    }

    const textForm = document.getElementById("textForm");
    textForm.value = "";
    setText("");
    getComments("post", post._id);
  };

  return (
    post && (
      <div className='row'>
        <div className='col-sm-6'>
          <Link to='/posts'>
            <button className='btn btn-outline-info my-2'>Назад</button>
          </Link>
          <Post post={post} />

          <LeaveComment _id={post._id} where={"post"} />
        </div>
        <div className='col-sm-6'>
          <div className='my-2 mx-2'>
            <h4>Комментарии:</h4>

            {comments.length > 0 &&
              comments.map(comment => <Comment key={comment._id} comment={comment} />)}
          </div>
        </div>
      </div>
    )
  );
};

PostPage.propTypes = {
  loadPost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  post: state.posts.post,
  loading: state.posts.loading,
  comments: state.comments.currentComments,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { loadPost, getComments, addComment, clearPost })(PostPage);
