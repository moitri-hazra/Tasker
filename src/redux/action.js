import { GET_TASKS, DELETE_TASK, ADD_TASK, GET_SINGLE_TASK } from "./actionTypes";
import axios from 'axios';

const getTasks = (tasks) =>({
  type: GET_TASKS,
  payload: tasks,
});

const taskDelete = () => ({
  type: DELETE_TASK,

});

const taskAdd = () => ({
  type: ADD_TASK,
});

const singleTask =(task) =>({
  type:GET_SINGLE_TASK,
  payload: task,
})


export const loadTasks = () =>{
  return function (dispatch) {
    axios.get('https://my-json-server.typicode.com/moitri-hazra/tasker-server/todo/').then((response)=>{
      
      dispatch(getTasks(response.data));
   
    }).catch((error)=> console.log(error));
    };
  };

  export const deleteTask = (taskID) =>{
    return function (dispatch) {
      
      axios.delete(`https://my-json-server.typicode.com/moitri-hazra/tasker-server/todo/${taskID}`).then((response)=>{
        
        dispatch(taskDelete());
        dispatch(loadTasks());
        console.log(response.data);
      }).catch((error)=> console.log(error));
      };
    };
  
    export const addTask = (task) =>{
      return function (dispatch) {
        axios.post(`https://my-json-server.typicode.com/moitri-hazra/tasker-server/todo/`, task).then((response)=>{
          
          dispatch(taskAdd()); 
          dispatch(loadTasks());
          console.log(response.data);
        }).catch((error)=> console.log(error));
        };
      };

       export const getSingleTask = (taskID) =>{
    return function (dispatch) {
      axios.get(`https://my-json-server.typicode.com/moitri-hazra/tasker-server/todo/${taskID}`).then((response)=>{
        
        dispatch(singleTask(response.data));
        // dispatch(loadTasks());
      }).catch((error)=> console.log(error));
      };
    };
  
    
