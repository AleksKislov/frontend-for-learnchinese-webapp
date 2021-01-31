import {
  GET_COMMENTS_ERR,
  GET_COMMENTS,
  GET_10COMMENTS,
  SET_COMMENT_TO_DEL
} from "../actions/types";

const initialState = {
  currentComments: [],
  lastComments: [],
  commentToDelete: null
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
