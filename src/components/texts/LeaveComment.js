import React, { useState } from "react";
import { addComment, getComments } from "../../actions/texts";
import { connect } from "react-redux";
import store from "../../store";
import { setAlert } from "../../actions/alert";

const LeaveComment = ({ addComment, getComments, isAuthenticated, _id }) => {
  const [text, setText] = useState("");

  const onChange = e => setText(e.target.value);

  const onSubmit = e => {
    e.preventDefault();

    if (isAuthenticated) {
      const newtext = text.replace(/\n/g, "<br />");

      if (text.length < 281) {
        // id, text
        addComment(_id, newtext);
      } else {
        store.dispatch(setAlert("Сообщение не должно превышать лимит", "danger"));
      }
    } else {
      store.dispatch(setAlert("Авторизуйтесь, чтобы оставлять комментарии.", "danger"));
    }

    const textForm = document.getElementById("textForm");
    textForm.value = "";
    setText("");
    getComments(_id);
  };

  return (
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
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { addComment, getComments })(LeaveComment);
