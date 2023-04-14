import React, { useState } from 'react';
import {ProTable} from '@ant-design/pro-table';
import enUS from 'antd/lib/locale/en_US';
import { ConfigProvider } from 'antd';
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import {Modal, Button, Input, Select, Tag} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { SearchOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { addTask, deleteTask, getSingleTask, loadTasks } from '../redux/action';




const Todo = () => {

  // I am using the useDispatch and useSelector hooks from react-redux to get access to the store and dispatch actions to update it.
  const dispatch = useDispatch();
  const {tasks} = useSelector(state => state.tasks);
  const {task} = useSelector(state=> state.tasks);

  // Boolean value to determine if user is currently editing a task
const [isEditting, setIsEditting] = useState(false);

// Boolean value to determine if new task creation form is currently open
const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

// Object to store the record being edited
const [edittingRecord, setEdittingRecord] = useState(null);

// Counter variable used for some functionality, initialized to 17
const [counter, setCounter] = useState(17);

// Error object used for error handling
const [error, setError] = useState(null);

// String value used to store user search input
const [searchText, setSearchText] = useState('');

// Error object used for error handling in editing task functionality
const [errorForEditTask, setErrorforEditTask] = useState(null);

// Defining state variables to manage new task data, task list data, and pre-built tags
const [newTaskData, setNewTaskData] = useState({
  "id": "",
  "timestamp": "",
  "Title": "",
  "Description": "",
  "DueDate": "",
  "Tags": [],
  "Status": "",
});
const [data, setData] = useState();
const [prebuiltTags, setPrebuiltTags] = useState([
  { text: 'Personal', value: 'Personal' },
  { text: 'Work', value: 'Work' },
  { text: 'Study', value: 'Study' }
]);

// Destructuring newTaskData object to get individual values
const { timestamp, Title, Description, DueDate, Tags, Status } = newTaskData;

// Defining options for the task status select input
const statusOptions = [ "OPEN", "WORKING", "DONE", "OVERDUE"];

// Destructuring Select component from antd library for later use
const { Option } = Select;


// This useEffect runs only once when the component is mounted and loads all the tasks.
useEffect(() => {
  dispatch(loadTasks());
}, []);

// This useEffect runs every time there is a change in the `tasks` state variable and updates the `data` state variable accordingly.
useEffect(() => {
  // setCounter(lastTask.id);
  setData(tasks);
}, [tasks]);

// This useEffect runs every time there is a change in the `task` state variable and sets the `edittingRecord` state variable accordingly.
useEffect(() => {
  if (task) {
    setEdittingRecord(task);
  }
}, [task]);

const columns = [

  // Column for the timestamp of the task
  {
    title: 'Time stamp',
    key:'timeStamp',
    dataIndex: 'timestamp',
    // Sorter for timestamp column
    sorter: (a, b) => a.timestamp.localeCompare(b.timestamp),
    sortDirections: ['descend', 'ascend'],
  },
  // Column for the title of the task
  {
    title: 'Title',
    key:'title',
    dataIndex: 'Title',
    // Sorter for title column
    sorter: (a, b) => a.Title.localeCompare(b.Title),
    sortDirections: ['descend', 'ascend'],
  },
  // Column for the description of the task
  {
    title: 'Description',
    key:'description',
    dataIndex: 'Description',
    // Sorter for description column
    sorter: (a, b) => a.Description.localeCompare(b.Description),
    sortDirections: ['descend', 'ascend'],
  },
  // Column for the due date of the task
  {
    title: 'Due Date',
    key:'duedate',
    dataIndex: 'DueDate',
    // Sorter for due date column
    sorter: (a, b) => a.DueDate.localeCompare(b.DueDate),
    sortDirections: ['descend', 'ascend'],
  },
  // Column for the tags associated with the task
  {
    title: 'Tags',
    key: "tags",
    dataIndex: 'Tags',
    // Pre-built filter options for tags
    filters: prebuiltTags,
    // Function to filter tasks based on selected tag
    onFilter: (value, record) => record.Tags.includes(value),
    // Function to render tags as an array of <Tag> components
    render: (tags) => (
      <>
        {tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </>
    ),
  },
  // Column for the status of the task
  {
    title: 'Status',
    dataIndex: 'Status',
    key: 'status',
    // Pre-built filter options for task status
    filters: [
      { text: 'OPEN', value: 'OPEN' },
      { text: 'WORKING', value: 'WORKING' },
      { text: 'DONE', value: 'DONE' },
      { text: 'OVERDUE', value: 'OVERDUE' },
    ],
    // Function to filter tasks based on selected status
    onFilter: (value, record) => record.Status === value,
  },
  // Column for the edit and delete buttons for each task record
  {
    
    render: (taskRecord)=>{
      return <>
      <EditOutlined onClick={()=> onEditTask(taskRecord)}/>
      <DeleteOutlined onClick={()=> onDeleteTask(taskRecord)} style={{color:"red", marginLeft:12 }}/>
      </>
    }
  },
];

const validateNewTask = () => {
  // Checking if required fields are empty
  if (!Title || !Description || !Status) {
    setError(' This field is required');
    return false;
  } else {
    setError(null);
    return true;
  }
};


  // Function to validate whether required fields are empty or not while editing a task
const validateEditTask = () => {
  if (!edittingRecord.Title || !edittingRecord.Description || !edittingRecord.Status) { // check if required fields are empty
    setErrorforEditTask(' This field is required'); // setting an error message if any of the required fields are empty
    return false; // returns false if validation fails
  } else {
    setErrorforEditTask(null); // clearing the error message if all required fields are filled
    return true; // returning true if validation succeeds
  }
};

 // This function is called when the user clicks the "Add" button to create a new task.
const onAddTask = () => {
  // Check if the new task data is valid.
  if (validateNewTask()) {
    // If it is, dispatch an action to add the new task to the Redux store.
    dispatch(addTask(newTaskData));
    
    // Reset the new task form to its initial state.
    resetAdding();
  }
};

// This function is called when the user types in the search bar to filter tasks.
const handleSearch = (value) => {
  // Set the search text to the lowercase version of the user's input.
  setSearchText(value.toLowerCase());
};

/* This code filters an array of records based on the value of a search text, creating a 
new array that only includes records with at least one property matching the search text value, 
regardless of case. */

  const filteredData = data?.filter((record) => {
    return Object.values(record).some((column) => {
      if (typeof column === 'string') {
        return column.toLowerCase().includes(searchText);
      } else if (Array.isArray(column)) {
        return column.some((item) =>
          typeof item === 'string' && item.toLowerCase().includes(searchText)
        );
      } else {
        return false;
      }
    });
  });
  

/*   This code filters an array of records based on a search text, returning only
   the records that have at least one property with a value that matches the search text. */
const onDeleteTask =(taskRecord) =>{
  Modal.confirm({
    title:'Are you Sure, you want to delete this task?',
    onOk:()=>{
      dispatch(deleteTask(taskRecord.id));
      console.log(tasks);
    },
    okText:'Yes',
    okType:'danger',
  })
  
}


const onEditTask =( taskRecord )=>{
    setIsEditting(true);
    dispatch(getSingleTask(taskRecord.id));
}

//Resets the state variables isEditting and edittingRecord to their initial values.
const resetEditting = () => {
  setIsEditting(false);

}

//Increments the counter state variable and sets isNewTaskOpen to true.
const toggleNewTAskModal=() =>{
  setCounter(counter + 1);
  setIsNewTaskOpen(true);
}

//Sets the isNewTaskOpen state variable to false.
const resetAdding =()=>{
  setIsNewTaskOpen(false);

}

//Updates the newTaskData state variable with the provided key-value pair, and generates a new ID and timestamp for the new task.

const handleNewTaskInputChange = (key, value) => {
  setNewTaskData((prevData) => ({
    ...prevData,
    id: Math.floor(Math.random() * 100) ,
    timestamp: new Date().toLocaleDateString(),
    [key]: value
  }));
};



  return (
    <>
     <ConfigProvider locale={enUS}>
     <div className="bg-gray-900 mx-auto px-4 py-6 rounded-lg shadow-md text-center sm:w-3/4 md:w-4/5 lg:w-3/4 xl:w-2/3">
  <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
    <Input
      placeholder="Search Tasks"
      prefix={<SearchOutlined />}
      onChange={(e) => handleSearch(e.target.value)}
      className="w-full sm:mr-4 mb-2 sm:mb-0"
    />
    <Button className="bg-white border" ghost  type="primary"  onClick={toggleNewTAskModal}>ADD A NEW TASK</Button>
  </div>
  {data && (
    <div className="overflow-x-auto">
      <ProTable
        key={filteredData? filteredData.id : data.id}
        locale={enUS}
        columns={columns}
        dataSource={filteredData ? filteredData : data}
        search={false}
        pagination={{ pageSize: 5 }}
        className="w-full"
        
      />
    </div>
  )}
</div>

<Modal
  title="Edit Task"
  open={isEditting}
  okText="Save"
  onCancel={() => {
    resetEditting();
  }}
  onOk={() => {
    if (validateEditTask()) {
      setData((pre) => {
        return pre.map((task) => {
          if (task.id === edittingRecord.id) {
            return edittingRecord;
          } else {
            return task;
          }
        });
      });
      resetEditting();
    }
  }}
>
  <div className="flex flex-col space-y-2">
    <div className="flex flex-col space-y-1">
      <label className="text-gray-700">Title</label>
      <Input
        value={edittingRecord?.Title}
        required
        aria-label="Title"
        maxLength={100}
        placeholder='ENTER TITLE'
        type="text"
        onChange={(e) => {
          setEdittingRecord((pre) => {
            return { ...pre, Title: e.target.value };
          });
        }}
      />
      {!edittingRecord?.Title ? (
        <h5 className="text-red-600">{errorForEditTask}</h5>
      ) : (
        <h5 className="text-gray-500">Please fill out this field</h5>
      )}
    </div>
    <div className="flex flex-col space-y-1">
      <label className="text-gray-700">Description</label>
      <Input
        value={edittingRecord?.Description}
        required
        aria-label="Description"
        maxLength={1000}
        placeholder='ENTER DESCRIPTION'
        type="text"
        onChange={(e) => {
          setEdittingRecord((pre) => {
            return { ...pre, Description: e.target.value };
          });
        }}
      />
      {!edittingRecord?.Description ? (
        <h5 className="text-red-600">{errorForEditTask}</h5>
      ) : (
        <h5 className="text-gray-500">Please fill out this field</h5>
      )}
    </div>
    <div className="flex flex-col space-y-1">
      <label className="text-gray-700">Due Date</label>
      <Input
        value={edittingRecord?.DueDate}
        aria-label="DueDate"
        type="date"
        min={new Date().toISOString().split("T")[0]}
        onChange={(e) => {
          setEdittingRecord((pre) => {
            return { ...pre, DueDate: e.target.value };
          });
        }}
      />
    </div>
    <div className="flex flex-col space-y-1">
      <label className="text-gray-700">Tags</label>
      <Select
        mode="tags"
        style={{ width: "100%" }}
        placeholder="Add tags"
        value={edittingRecord?.Tags}
        onChange={(value) => {
          const newTags = [...prebuiltTags];
          const uniqueTags = new Set(value);
          uniqueTags.forEach((tag) => {
            if (!newTags.find((item) => item.value === tag)) {
              newTags.push({ value: tag, text: tag });
            }
          });
          setPrebuiltTags(newTags);
          setEdittingRecord((pre) => {
            return { ...pre, Tags: [...uniqueTags] };
          });
        }}
      >
        {prebuiltTags.map((tag) => (
          <Option key={tag.value} value={tag.value}>
            {tag.text}
          </Option>
        ))}
      </Select>
    </div>
    <div className="flex flex-col space-y-1">
      <label className="text-gray-700">Status</label>

      <Select
  className="w-full mb-4"
  required
  style={{ width: "100px" }}
  value={edittingRecord?.Status}
  defaultValue="OPEN"
  onChange={(value) => {
    setEdittingRecord((pre) => {
      return { ...pre, Status: value };
    });
  }}
>
  {statusOptions?.map((option) => (
    <Option key={option} value={option}>
      {option}
    </Option>
  ))}
</Select>

{!edittingRecord?.Status ? (
  <h5 className="text-red-500 mb-4">Please select a status</h5>
) : (
  <h5 className="mb-4">please select an option.</h5>
)}

</div>
</div>
</Modal>

{/* ADDING NEW TASK */} 

    
    <Modal 
  open={isNewTaskOpen}
  okText="Add"
  title="Add New Task"
  onCancel={()=>{
    resetAdding();
  }}
  onOk={()=>{
    onAddTask();
    resetAdding();
  }}
>
  <div className="mb-4">
    <label className="block text-gray-700 font-bold mb-2">Title</label>
    <Input 
      value={Title} 
      required 
      placeholder="Enter Title" 
      max={100} 
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      onChange={(e) => handleNewTaskInputChange("Title", e.target.value)}
    />
    {!Title? <h5 className="text-red-500 text-xs italic">{error}</h5> : <h5>Please fill this field.</h5>}
  </div>
  <div className="mb-4">
    <label className="block text-gray-700 font-bold mb-2">Description</label>
    <Input 
      value={Description} 
      maxLength={1000}  
      placeholder="Enter Description" 
      required 
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      onChange={(e) => handleNewTaskInputChange("Description", e.target.value)}
    />
    {!Description? <h5 className="text-red-500 text-xs italic">{error}</h5> : <h5>Please fill this field.</h5>}
  </div>
  <div className="mb-4">
    <label className="block text-gray-700 font-bold mb-2">Due Date (optional)</label>
    <Input 
      type="date" 
      min={new Date().toISOString().split('T')[0]} 
      value={DueDate} 
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      onChange={(e) => handleNewTaskInputChange("DueDate", e.target.value)}
    />
  </div>
  <div className="mb-4">
    <label className="block text-gray-700 font-bold mb-2">Tags</label>
    <Select
      mode="tags"
      style={{ width: '100%' }}
      placeholder="Add tags"
      value={Tags}
      onChange={(value) => {
        const newTags = [...prebuiltTags];
        const uniqueTags = new Set(value);
        uniqueTags.forEach(tag => {
          if (!newTags.find(item => item.value === tag)) {
            newTags.push({ value: tag, text: tag });
          }
        });
        setPrebuiltTags(newTags);
        handleNewTaskInputChange("Tags", value);
      }}
    >
      {prebuiltTags.map(tag => (
        <Option key={tag.value} value={tag.value}>
          {tag.text}
        </Option>
      ))}
    </Select>
  </div>
  <div className="mt-4">
  <label className="block font-medium mb-2">Status</label>
  <Select className="w-32" required value={Status} defaultValue="OPEN" onChange={(value) => handleNewTaskInputChange("Status", value)}>
    {statusOptions?.map((option) => (
      <Option key={option} value={option}>
        {option}
      </Option>
    ))}
  </Select>
  {!Status ? (
    <h5 className="text-red-600 mt-2">{error}</h5>
  ) : (
    <h5 className="mt-2"> Please select an option.</h5>
  )}
</div>

  
 
</Modal>
    </ConfigProvider>
   </>
    
  );
};

export default Todo;
