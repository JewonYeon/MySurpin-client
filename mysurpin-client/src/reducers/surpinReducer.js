import {
  GET_NEW_LISTS,
  GET_BEST_TAGS,
  SHOW_USER_LISTS,
  SHOW_SURPIN,
} from "../actions/index";
import { surpinState } from "./initialState";

const createMySurpin = (state = surpinState, action) => {
  switch (action.type) {
    case GET_NEW_LISTS:
      return Object.assign({}, state, {
        newLists: action.payload.data,
      });

    case GET_BEST_TAGS:
      return Object.assign({}, state, {
        tags: "서버에서 받아온 값",
      });

    case SHOW_USER_LISTS:
      return Object.assign({}, state, {
        showUserLists: "서버에서 받아온 값",
      });

    case SHOW_SURPIN:
      return Object.assign({}, state, {
        showSurpin: "서버에서 받아온 값",
      });

    default:
      return state;
  }
};

export default createMySurpin;
