import { GET_COMMENTS_ERR, GET_COMMENTS, GET_10COMMENTS } from "../actions/types";

const initialState = {
  currentComments: [],
  lastComments: []
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
        currentComments: payload
      };
    case GET_COMMENTS_ERR:
      return {
        ...state
      };
    default:
      return state;
  }
}
