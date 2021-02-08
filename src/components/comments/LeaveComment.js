import React, { useState, useEffect } from "react";
import { addComment, getComments } from "../../actions/comments";
import { connect } from "react-redux";
import store from "../../store";
import { setAlert } from "../../actions/alert";
import { commentLength, commentEmojis } from "../../apikeys.json";

// path is from/for book Chapterpage
const LeaveComment = ({ addComment, getComments, isAuthenticated, _id, where, path }) => {
  const [text, setText] = useState("");
  const [addressedUsers, setAddressedUsers] = useState([]);

  useEffect(() => {
    setAddressedUsers(checkIfAddressed(text));
  }, [text]);

  const onSubmit = () => {
    // e.preventDefault();

    if (isAuthenticated) {
      let newtext = text.replace(/\n/g, "<br />");

      addressedUsers.forEach(user => {
        newtext = newtext.replace(user.str, `<strong class='text-info'>${user.name}</strong>`);
      });

      if (text.length <= commentLength) {
        // id, text
        addComment(where, _id, newtext, path, addressedUsers);
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
    const previousTxt = document.getElementById("textForm").value;
    setText(`${previousTxt} ${e.target.innerHTML}`);
  };

  const checkAuthorized = () => {
    if (!isAuthenticated) store.dispatch(setAlert("Войдите, чтобы комментировать", "danger"));
  };

  const checkIfAddressed = txt => {
    const resArr = txt.split("@@");
    const onlyNames = resArr.filter(x => x[0] === "[" && x[x.length - 1] === "}");
    const userSet = Array.from(new Set(onlyNames));
    return userSet.map(x => {
      const id = x.slice(1, x.indexOf("]"));
      const name = x.slice(x.indexOf("{") + 1, x.length - 1);
      return { id, name, str: `@@${x}@@` };
    });
  };

  return (
    <div className='card my-2'>
      <div className='card-body'>
        <div className='mb-3'>
          <span className='h6' id='yourCommentId'>
            Ваш Комментарий
          </span>
          <button type='submit' className='btn btn-primary btn-sm float-right' onClick={onSubmit}>
            Опубликовать
          </button>
        </div>

        <div className='mb-1 text-info'>
          {addressedUsers.length === 0 ? "" : "Вы обращаетесь к: "}

          {addressedUsers.length > 0 &&
            addressedUsers.map((user, ind) => (
              <span className='badge badge-pill badge-primary mr-1 ' key={ind}>
                {user.name}
              </span>
            ))}
        </div>
        <form>
          <div className='form-group'>
            <textarea
              className='form-control'
              rows='3'
              id='textForm'
              onClick={e => setText(e.target.value)}
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
