import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Post from "./Post";
import store from "../../store";
import { loadPosts, addPost } from "../../actions/posts";
import { setAlert } from "../../actions/alert";
import Spinner from "../layout/Spinner";

const Posts = ({ loadPosts, posts, loading, isAuthenticated, addPost, user }) => {
  useEffect(() => {
    setTimeout(() => {
      loadPosts();
    }, 100);
  }, [loadPosts]);

  const [formData, setFormData] = useState({
    text: "",
    title: ""
  });
  const [hideFlag, setHideFlag] = useState({
    wish: true,
    bug: true,
    news: true
  });
  const { title, text } = formData;
  const [postTag, setPostTag] = useState("wish");
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onClick = e => {
    const badges = [...document.getElementsByClassName("badge")];
    setPostTag(e.currentTarget.id);
    for (let i = 0; i < badges.length; i++) {
      if (badges[i].classList.contains("badge-warning")) {
        badges[i].classList.remove("badge-warning");
        badges[i].classList.add("badge-primary");
      }
    }
    e.currentTarget.classList.remove("badge-primary");
    e.currentTarget.classList.add("badge-warning");
  };

  const onSubmit = e => {
    e.preventDefault();

    if (isAuthenticated) {
      const newtext = text.replace(/\n/g, "<br />");

      if (user.role === "admin") {
        addPost(title, newtext, postTag);
        return;
      }

      if (formData.text.length < 281 && formData.title.length < 91) {
        // title, text, theme
        addPost(title, newtext, postTag);
      } else {
        store.dispatch(setAlert("Сообщение и заголовок не должны превышать лимит", "danger"));
      }
    } else {
      store.dispatch(setAlert("Авторизуйтесь, чтобы оставлять комментарии.", "danger"));
    }

    const titleForm = document.getElementById("titleForm");
    const textForm = document.getElementById("textForm");
    titleForm.value = "";
    textForm.value = "";
    setFormData({
      text: "",
      title: ""
    });
  };

  const displayTags = e => {
    const tagButtonsDiv = document.getElementById("tagButtons");
    const buttons = [...tagButtonsDiv.getElementsByClassName("btn-outline-info")];

    buttons.forEach(el => {
      el.classList.remove("active");
    });
    e.target.classList.add("active");

    const currentTag = e.target.id.split("-")[0];
    switch (currentTag) {
      case "wish":
        setHideFlag({
          wish: true,
          bug: false,
          news: false
        });
        break;
      case "news":
        setHideFlag({
          wish: false,
          bug: false,
          news: true
        });
        break;
      case "bug":
        setHideFlag({
          wish: false,
          bug: true,
          news: false
        });
        break;
      default:
        setHideFlag({
          wish: true,
          bug: true,
          news: true
        });
        break;
    }
  };

  return (
    <div className='row'>
      <div className='col-sm-12'>
        <h2>Гостевая и Новости Проекта</h2>
      </div>
      <div className='col-sm-6'>
        <div className='card bg-light mb-3'>
          <div className='card-body'>
            <p className='card-text'>
              Здесь можно сообщать о багах, пожеланиях.
              <br />О последних новостях проекта админ также будет сообщать здесь.
            </p>
          </div>
        </div>

        <div className='card'>
          <div className='card-body'>
            <h4 className='card-title'>Поделитесь своим мнением</h4>
            <div className='mb-3'>
              <span className='mr-2 text-muted'>Выберите тэг: </span>

              <span
                className='badge badge-warning'
                id='wish'
                onClick={e => onClick(e)}
                style={badgeStyle}
              >
                Пожелание
              </span>
              <span
                className='badge badge-primary mx-2'
                id='bug'
                onClick={e => onClick(e)}
                style={badgeStyle}
              >
                Недочет на Сайте
              </span>
              {user && user.role === "admin" && (
                <span
                  className='badge badge-primary'
                  id='news'
                  onClick={e => onClick(e)}
                  style={badgeStyle}
                >
                  Новости Проекта
                </span>
              )}
            </div>

            <form onSubmit={e => onSubmit(e)}>
              <div className='form-group'>
                <input
                  type='text'
                  id='titleForm'
                  className='form-control'
                  placeholder='Тема сообщения'
                  onChange={e => onChange(e)}
                  name='title'
                  value={title}
                  autoComplete='off'
                  required
                />
                <small className={`text-${formData.title.length < 91 ? "mute" : "danger"}`}>
                  {formData.title.length}/90
                </small>
              </div>
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
                <small className={`text-${formData.text.length < 281 ? "mute" : "danger"}`}>
                  {formData.text.length}/280
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
        <div className='my-3' id='tagButtons' onClick={e => displayTags(e)}>
          <strong>Фильтр:</strong>
          <button
            type='button'
            className='btn btn-outline-info btn-sm mx-1 active mb-1'
            id='all-btn'
          >
            Все
          </button>
          <button type='button' className='btn btn-outline-info btn-sm mx-1 mb-1' id='wish-btn'>
            Пожелания
          </button>
          <button type='button' className='btn btn-outline-info btn-sm mx-1 mb-1' id='bug-btn'>
            Баги
          </button>
          <button type='button' className='btn btn-outline-info btn-sm mx-1 mb-1' id='news-btn'>
            Новости
          </button>
        </div>
        <div>
          {loading ? (
            <Spinner />
          ) : (
            posts.map(post => hideFlag[post.tag] && <Post key={post._id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
};

Posts.propTypes = {};

const badgeStyle = {
  cursor: "pointer"
};

const mapPropsToState = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  posts: state.posts.posts,
  loading: state.posts.loading,
  user: state.auth.user
});
export default connect(mapPropsToState, { loadPosts, addPost })(Posts);
