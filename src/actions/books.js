import {
  LOAD_BOOKS,
  LOAD_BOOK,
  LOAD_BOOKS_ERR,
  LOAD_BOOK_ERR,
  CLEAR_BOOK,
  GET_COMMENTS,
  ADD_COMMENT_ERR,
  SET_LOADING
} from "./types";
import axios from "axios";
import { setAlert } from "./alert";

export const loadBooks = () => async dispatch => {
  try {
    const { data } = await axios.get("/api/books/allbooks");
    dispatch({
      type: LOAD_BOOKS,
      payload: data
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: LOAD_BOOKS_ERR
    });
  }
};

export const loadBook = id => async dispatch => {
  setLoading();

  try {
    const { data } = await axios.get(`/api/books/get_book/${id}`);

    dispatch({
      type: LOAD_BOOK,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: LOAD_BOOK_ERR
    });
  }
};

export const clearBook = _ => async dispatch => {
  dispatch({ type: CLEAR_BOOK });
};

export const setLoading = _ => async dispatch => {
  dispatch({ type: SET_LOADING, payload: true });
};

// TODO
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
      type: LOAD_BOOK_ERR
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
