import {
  LOAD_TEXTS,
  LOAD_TEXT,
  LOAD_TEXTS_ERR,
  LOAD_TEXT_ERR,
  SET_LOADING,
  CLEAR_TEXT,
  LOAD_NOT_APPROVED,
  GET_COMMENTS,
  ADD_COMMENT
} from "../actions/types";

const initialState = {
  texts: [],
  not_approved: [],
  moreTexts: true,
  moreNotApproved: true,
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
        texts: [...state.texts, ...payload],
        moreTexts: payload.length === 10 ? true : false
      };
    case GET_COMMENTS:
      return {
        ...state,
        currentComments: payload,
        loading: false
      };
    case ADD_COMMENT:
      return {
        ...state,
        currentComments: payload
      };
    case CLEAR_TEXT:
      return {
        ...state,
        text: null,
        currentComments: []
      };
    case LOAD_NOT_APPROVED:
      console.log(payload);
      return {
        ...state,
        text: null,
        loading: false,
        not_approved: [...state.not_approved, ...payload],
        moreNotApproved: payload.length === 10 ? true : false
      };
    case SET_LOADING:
      return {
        ...state,
        text: null,
        currentComments: [],
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
