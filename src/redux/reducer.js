import { ADD_TASK, DELETE_TASK, GET_SINGLE_TASK, GET_TASKS } from "./actionTypes";

const initialState ={
  tasks :[],
  task: {},
  loading : true,

}

const taskReducer = (state = initialState, action) =>{
  switch (action.type){
    case GET_TASKS:
      return{
          ...state,
          tasks: action.payload,
          loading: false,
      };
    case DELETE_TASK: 
    case ADD_TASK:
      return{
        ...state,
        loading: false,
      };
      case GET_SINGLE_TASK:
        return{
          ...state,
          task: action.payload,
          loading: false,
        }
      default: 
          return state;
  }
};

export default taskReducer