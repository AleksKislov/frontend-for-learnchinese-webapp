import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import store from "../../store";
import { setAlert } from "../../actions/alert";
import { loadPost, getComments, addComment } from "../../actions/posts";
import Post from "./Post";
import Comment from "./Comment";

const PostPage = ({
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
    setTimeout(() => {
      loadPost(match.params.id);
      getComments(match.params.id);
    }, 100);
  }, [loadPost, loading, getComments]);

  const [text, setText] = useState("");

  const onChange = e => setText(e.target.value);

  const onSubmit = e => {
    e.preventDefault();

    if (isAuthenticated) {
      const newtext = text.replace(/\n/g, "<br />");

      if (text.length < 281) {
        // id, text
        addComment(post._id, newtext);
      } else {
        store.dispatch(setAlert("Сообщение не должно превышать лимит", "danger"));
      }
    } else {
      store.dispatch(setAlert("Авторизуйтесь, чтобы оставлять комментарии.", "danger"));
    }

    const textForm = document.getElementById("textForm");
    textForm.value = "";
    setText("");
    getComments(post._id);
  };

  return (
    post && (
      <div className='row'>
        <div className='col-sm-6'>
          <Link to='/posts'>
            <button className='btn btn-outline-info my-2'>Назад</button>
          </Link>
          <Post post={post} />

          <div className='card my-2'>
            <div className='card-body'>
              <h4 className='card-title'>Ваш Комментарий</h4>

              <form onSubmit={e => onSubmit(e)}>
                <div className='form-group'>
                  <textarea
                    className='form-control'
                    rows='3'
                    id='textForm'
                    onChange={e => onChange(e)}
                    placeholder='Текст'
                    name='text'
                    value={text}
                    required
                  ></textarea>

                  <small className={`text-${text.length < 281 ? "mute" : "danger"}`}>
                    {text.length}/280
                  </small>

                  <button type='submit' className='btn btn-primary float-right mt-3'>
                    Опубликовать
                  </button>
                </div>
              </form>
            </div>
          </div>
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
  comments: state.posts.currentComments,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { loadPost, getComments, addComment })(PostPage);
