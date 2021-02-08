import {
  GET_COMMENTS_ERR,
  GET_COMMENTS,
  GET_10COMMENTS,
  SET_COMMENT_TO_DEL,
  SET_MENTIONS_LEN
} from "../actions/types";

const initialState = {
  currentComments: [],
  lastComments: [],
  commentToDelete: null,
  mentionsLen: 0
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_10COMMENTS:
      return {
        ...state,
        lastComments: payload
      };
    case GET_COMMENTS:
      return {
        ...state,
        currentComments: payload,
        commentToDelete: null
      };
    case SET_MENTIONS_LEN:
      return {
        ...state,
        mentionsLen: payload
      };
    case GET_COMMENTS_ERR:
      return {
        ...state
      };
    case SET_COMMENT_TO_DEL:
      return { ...state, commentToDelete: payload };
    default:
      return state;
  }
}
