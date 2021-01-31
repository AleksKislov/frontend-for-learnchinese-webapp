import { GET_COMMENTS_ERR, GET_COMMENTS, GET_10COMMENTS, SET_COMMENT_TO_DEL } from "./types";
import axios from "axios";
import { setAlert } from "./alert";

/**
 *
 * @param {string} where    - destination: post, text or book (Chapterpage)
 * @param {string} id       - of destination page
 */
export const getComments = (where, id) => async dispatch => {
  try {
    const { data } = await axios.get(`/api/comments?where=${where}&id=${id}`);

    dispatch({
      type: GET_COMMENTS,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: GET_COMMENTS_ERR
    });
  }
};

/**
 *
 * @param {string} where    - destination: post, text or book (Chapterpage)
 * @param {string} id       - of destination page
 * @param {string} text     - text of a comment
 * @param {string} path     - relative path to book page (only)
 */
export const addComment = (where, id, text, path) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ text, path });

  try {
    await axios.post(`/api/comments?where=${where}&id=${id}`, body, config);
    const { data } = await axios.get(`/api/comments?where=${where}&id=${id}`);

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
    dispatch({ type: GET_COMMENTS_ERR });
  }
};

/**
 *
 * @param {string} where        - destination: post, text or a book (page)
 * @param {string} where_id     - id of destination: post, text or a book (page)
 * @param {string} comment_id   - comment id
 */
export const deleteComment = (where, where_id, comment_id) => async dispatch => {
  try {
    await axios.delete(`/api/${where}s/comment/${where_id}/${comment_id}`);
    const { data } = await axios.get(`/api/comments?where=${where}&id=${where_id}`);

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
    dispatch({ type: GET_COMMENTS_ERR });
  }
};

export const getLastComments = () => async dispatch => {
  try {
    const { data } = await axios.get("/api/comments/last");

    dispatch({
      type: GET_10COMMENTS,
      payload: data
    });
  } catch (err) {
    console.log(err);
    dispatch({ type: GET_COMMENTS_ERR });
  }
};

export const setCommentToDelete = obj => async dispatch => {
  dispatch({
    type: SET_COMMENT_TO_DEL,
    payload: obj
  });
};
