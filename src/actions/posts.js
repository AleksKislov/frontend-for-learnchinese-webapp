import {
  ADD_POST,
  ADD_POST_ERR,
  LOAD_POSTS,
  LOAD_POST,
  LOAD_POSTS_ERR,
  LOAD_POST_ERR,
  ADD_LIKE,
  ADD_DISLIKE
} from "./types";
import axios from "axios";
import { setAlert } from "./alert";

export const addPost = (title, text, tag) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ title, text, tag });

  try {
    const res = await axios.post("/api/posts", body, config);

    dispatch({
      type: ADD_POST,
      payload: res.data
    });

    dispatch(loadPosts());
  } catch (err) {
    const errors = err.response.data.errors;

    console.log(err);
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    } else {
    }
    dispatch({ type: ADD_POST_ERR });
  }
};

/**
 *
 * @param {number} len  - current length of posts array
 */
export const loadPosts = len => async dispatch => {
  let skip = len || "0";
  try {
    const { data } = await axios.get(`/api/posts/infinite?skip=${skip}`);
    dispatch({
      type: LOAD_POSTS,
      payload: data
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: LOAD_POSTS_ERR
    });
  }
};

export const loadPost = id => async dispatch => {
  try {
    const { data } = await axios.get(`/api/posts/${id}`);
    dispatch({
      type: LOAD_POST,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: LOAD_POST_ERR
    });
  }
};

export const addLike = id => async dispatch => {
  try {
    const { data } = await axios.put(`/api/posts/like/${id}`);

    dispatch({
      type: ADD_LIKE,
      payload: { id, likes: data }
    });
  } catch (err) {
    dispatch({
      type: LOAD_POST_ERR
    });
  }
};

export const addDislike = id => async dispatch => {
  try {
    const { data } = await axios.put(`/api/posts/dislike/${id}`);

    dispatch({
      type: ADD_DISLIKE,
      payload: { id, dislikes: data }
    });
  } catch (err) {
    dispatch({
      type: LOAD_POST_ERR
    });
  }
};
