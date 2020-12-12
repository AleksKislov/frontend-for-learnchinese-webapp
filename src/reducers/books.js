import {
  LOAD_BOOKS,
  LOAD_BOOK,
  LOAD_BOOKS_ERR,
  LOAD_BOOK_ERR,
  SET_LOADING,
  CLEAR_BOOK,
  GET_COMMENTS,
  ADD_COMMENT
} from "../actions/types";

const initialState = {
  books: [],
  book: null,
  loading: true,
  currentComments: []
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOAD_BOOKS:
      return {
        ...state,
        book: null,
        loading: false,
        books: payload
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
    case CLEAR_BOOK:
      return {
        ...state,
        book: null,
        currentComments: []
      };
    case SET_LOADING:
      return {
        ...state,
        // book: null,
        currentComments: [],
        loading: payload
      };
    case LOAD_BOOKS_ERR:
    case LOAD_BOOK_ERR:
      return {
        ...state,
        loading: false
      };
    case LOAD_BOOK:
      return {
        ...state,
        book: payload,
        loading: false
      };
    default:
      return {
        ...state
      };
  }
}
