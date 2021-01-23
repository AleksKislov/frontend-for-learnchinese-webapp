import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Post from "./Post";
import store from "../../store";
import { loadPosts, addPost } from "../../actions/posts";
import { setAlert } from "../../actions/alert";
import Spinner from "../layout/Spinner";
import { Helmet } from "react-helmet";
import { commentLength } from "../../apikeys.json";
import { Link } from "react-router-dom";

const Posts = ({ loadPosts, posts, loading, isAuthenticated, addPost, user, morePosts }) => {
  useEffect(() => {
    if (posts.length === 0) loadPosts(0);
  }, []);

  const [formData, setFormData] = useState({
    text: "",
    title: ""
  });
  const [emoji, setEmoji] = useState("");

  const [hideFlag, setHideFlag] = useState({
    wish: true,
    bug: true,
    news: true
  });
  let { title, text } = formData;
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
        title = emoji + " " + title;
        addPost(title, newtext, postTag);
        // loadPosts(0);
        return;
      }

      if (formData.text.length <= commentLength && formData.title.length < 91) {
        // title, text, theme
        title = emoji + " " + title;
        addPost(title, newtext, postTag);
        // loadPosts(0);
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
    document.getElementById("inputEmo").selectedIndex = 0;
    setEmoji("");
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

  const onSelect = e => {
    const selectedEmo = e.target.options[e.target.options.selectedIndex].innerHTML;
    setEmoji(selectedEmo);
  };

  return (
    <div className='row'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Фидбэк и новости проекта | Chinese+</title>
      </Helmet>

      <div className='col-sm-12'>
        <h2>Гостевая и Новости Проекта</h2>
      </div>
      <div className='col-sm-6'>
        <div class='alert alert-info'>
          <span>
            За проектом можно следить и в соцсетях:{" "}
            <a href='https://t.me/chineseplusnew' target='_blank'>
              <i className='fab fa-telegram'></i>
            </a>{" "}
            <a href='https://vk.com/buyilehu' target='_blank'>
              <i className='fab fa-vk'></i>
            </a>{" "}
            <a href='https://www.youtube.com/c/Buyilehuorg' target='_blank'>
              <i className='fab fa-youtube'></i>
            </a>{" "}
            <a href='https://www.facebook.com/buyilehu/' target='_blank'>
              <i className='fab fa-facebook-square'></i>
            </a>
          </span>
        </div>
        <div class='alert alert-success'>
          У проекта свой <Link to='/kanban'>канбан</Link> с текущими задачами. Здесь вы можете
          влиять на него, оставляя свои пожелания или сообщая о багах.
        </div>

        <div className='card'>
          <div className='card-body'>
            <div className='mb-3'>
              <span className='mr-2 font-weight-bold'>Вы хотите поделиться: </span>

              <span
                className='badge badge-warning'
                id='wish'
                onClick={e => onClick(e)}
                style={badgeStyle}
              >
                пожеланием
              </span>
              <span
                className='badge badge-primary mx-2'
                id='bug'
                onClick={e => onClick(e)}
                style={badgeStyle}
              >
                багом
              </span>
              {user && user.role === "admin" && (
                <span
                  className='badge badge-primary'
                  id='news'
                  onClick={e => onClick(e)}
                  style={badgeStyle}
                >
                  новостями
                </span>
              )}
            </div>

            <form onSubmit={e => onSubmit(e)}>
              <div className='form-row'>
                <div className='form-group col-md-2'>
                  <select id='inputEmo' className='custom-select' onChange={e => onSelect(e)}>
                    <option>..</option>
                    <option>🔥</option>
                    <option>🙏🏻</option>
                    <option>👍</option>
                    <option>💩</option>
                  </select>
                  <small className='mute'>эмо</small>
                </div>
                <div className='form-group col-md-10'>
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
                <small
                  className={`text-${formData.text.length <= commentLength ? "mute" : "danger"}`}
                >
                  {formData.text.length}/{commentLength}
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
            <div className=''>
              {posts.map(post => hideFlag[post.tag] && <Post key={post._id} post={post} />)}

              <div className='text-center'>
                {morePosts ? (
                  <button
                    type='button'
                    className='btn btn-info btn-sm mb-1'
                    onClick={() => loadPosts(posts.length)}
                  >
                    Загрузить Ещё
                  </button>
                ) : (
                  <button type='button' className='btn btn-warning btn-sm mb-1' disabled>
                    Больше нетути
                  </button>
                )}
              </div>
            </div>
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
  morePosts: state.posts.morePosts,
  loading: state.posts.loading,
  user: state.auth.user
});

export default connect(mapPropsToState, { loadPosts, addPost })(Posts);
