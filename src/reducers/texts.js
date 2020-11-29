import {
  LOAD_TEXTS,
  LOAD_TEXT,
  LOAD_TEXTS_ERR,
  LOAD_TEXT_ERR,
  SET_LOADING,
  CLEAR_TEXT
} from "../actions/types";

const initialState = {
  texts: [],
  text: null,
  loading: true,
  currentComments: []
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOAD_TEXTS:
      return {
        ...state,
        text: null,
        loading: false,
        texts: payload
      };
    case CLEAR_TEXT:
      return {
        ...state,
        text: null
      };
    case SET_LOADING:
      return {
        ...state,
        text: null,
        loading: payload
      };
    case LOAD_TEXTS_ERR:
    case LOAD_TEXT_ERR:
      return {
        ...state,
        loading: false
      };

    case LOAD_TEXT:
      return {
        ...state,
        text: payload,
        loading: false
      };
    default:
      return {
        ...state
      };
  }
}
