import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import hskTable from "./hskTable";
import profile from "./profile";
import userwords from "./userwords";
import posts from "./posts";

export default combineReducers({ alert, auth, hskTable, profile, userwords, posts });
