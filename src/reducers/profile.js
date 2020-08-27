import { PROFILE_ERROR, GET_PROFILE, GET_DICTSTATS } from "../actions/types";

const initialState = {
  profile: null,
  profiles: [],
  loading: true,
  error: {},
  dictStats: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        dictStats: {}
      };
    case GET_DICTSTATS:
      return {
        ...state,
        loading: false,
        dictStats: payload
      };
    default:
      return state;
  }
}
