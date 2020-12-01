import {
  LOAD_TEXTS,
  LOAD_TEXT,
  LOAD_TEXTS_ERR,
  LOAD_TEXT_ERR,
  SET_LOADING,
  CLEAR_TEXT,
  GET_COMMENTS,
  ADD_COMMENT_ERR
} from "./types";
import axios from "axios";
import { setAlert } from "./alert";

export const loadTexts = () => async dispatch => {
  try {
    const { data } = await axios.get("/api/texts");
    dispatch({
      type: LOAD_TEXTS,
      payload: data
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: LOAD_TEXTS_ERR
    });
  }
};

export const loadText = id => async dispatch => {
  // dispatch({ type: SET_LOADING, payload: true });

  try {
    const { data } = await axios.get(`/api/texts/${id}`);
    dispatch({
      type: LOAD_TEXT,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: LOAD_TEXT_ERR
    });
  }
};

export const setLoading = _ => async dispatch => {
  dispatch({ type: SET_LOADING, payload: true });
};

export const clearText = _ => async dispatch => {
  dispatch({ type: CLEAR_TEXT });
};

export const addComment = (id, text) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ text });

  try {
    await axios.post(`/api/comments?where=text&id=${id}`, body, config);

    const { data } = await axios.get(`/api/comments?where=text&id=${id}`);

    // console.log(data);
    dispatch({
      type: GET_COMMENTS,
      payload: data
    });
  } catch (err) {
    const errors = err.response.data.errors;

    console.log(err);
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    } else {
    }
    dispatch({ type: ADD_COMMENT_ERR });
  }
};

export const getComments = id => async dispatch => {
  try {
    const { data } = await axios.get(`/api/comments?where=text&id=${id}`);

    // console.log(data);
    dispatch({
      type: GET_COMMENTS,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: LOAD_TEXT_ERR
    });
  }
};

export const deleteComment = (text_id, id) => async dispatch => {
  try {
    await axios.delete(`/api/texts/comment/${text_id}/${id}`);
    const { data } = await axios.get(`/api/comments?where=text&id=${text_id}`);

    dispatch({
      type: GET_COMMENTS,
      payload: data
    });
  } catch (err) {
    const errors = err.response.data.errors;

    console.log(err);
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    } else {
    }
    dispatch({ type: ADD_COMMENT_ERR });
  }
};
