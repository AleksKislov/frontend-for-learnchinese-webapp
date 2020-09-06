import {
  LOAD_TEXTS,
  LOAD_TEXT,
  LOAD_TEXTS_ERR,
  LOAD_TEXT_ERR,
  SET_LOADING
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
        loading: false,
        texts: payload
      };
    case SET_LOADING:
      return {
        ...state,
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
