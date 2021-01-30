import React, { useState } from "react";
import { addComment, getComments } from "../../actions/comments";
import { connect } from "react-redux";
import store from "../../store";
import { setAlert } from "../../actions/alert";
import { commentLength, commentEmojis } from "../../apikeys.json";

// path is from/for book Chapterpage
const LeaveComment = ({ addComment, getComments, isAuthenticated, _id, where, path }) => {
  const [text, setText] = useState("");

  const onSubmit = () => {
    // e.preventDefault();

    if (isAuthenticated) {
      const newtext = text.replace(/\n/g, "<br />");

      if (text.length <= commentLength) {
        // id, text
        addComment(where, _id, newtext, path);
      } else {
        store.dispatch(setAlert("Сообщение не должно превышать лимит", "danger"));
      }
    } else {
      store.dispatch(setAlert("Авторизуйтесь, чтобы оставлять комментарии.", "danger"));
    }

    const textForm = document.getElementById("textForm");
    textForm.value = "";
    setText("");
    getComments(where, _id);
  };

  const sizeUp = e => (e.target.style.fontSize = "2rem");
  const sizeDown = e => (e.target.style.fontSize = "0.9375rem");

  const addEmoToText = e => {
    setText(`${text} ${e.target.innerHTML}`);
  };

  const checkAuthorized = () => {
    if (!isAuthenticated) store.dispatch(setAlert("Войдите, чтобы комментировать", "danger"));
  };

  return (
    <div className='card my-2'>
      <div className='card-body'>
        <div className='mb-3'>
          <span className='h6'>Ваш Комментарий</span>
          <button type='submit' className='btn btn-primary btn-sm float-right' onClick={onSubmit}>
            Опубликовать
          </button>
        </div>

        <form>
          <div className='form-group'>
            <textarea
              className='form-control'
              rows='3'
              id='textForm'
              onChange={e => {
                checkAuthorized();
                setText(e.target.value);
              }}
              placeholder='Текст'
              name='text'
              value={text}
              required
            ></textarea>

            <div className=''>
              <small className={`text-${text.length <= commentLength ? "mute" : "danger"}`}>
                {text.length}/{commentLength}
              </small>
              <p className='float-right'>
                {commentEmojis.map((emo, ind) => (
                  <span
                    key={ind}
                    onMouseEnter={e => sizeUp(e)}
                    onMouseLeave={e => sizeDown(e)}
                    onClick={e => addEmoToText(e)}
                  >
                    {emo}{" "}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { addComment, getComments })(LeaveComment);
