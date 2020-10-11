import { LOAD_TEXTS, LOAD_TEXT, LOAD_TEXTS_ERR, LOAD_TEXT_ERR, SET_LOADING } from "./types";
import axios from "axios";

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
  dispatch({ type: SET_LOADING, payload: true });

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