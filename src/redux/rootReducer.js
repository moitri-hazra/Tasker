import { combineReducers } from "redux";
import taskReducer from "./reducer";

const rootReducer = combineReducers ({
    tasks: taskReducer,
})

export default rootReducer;