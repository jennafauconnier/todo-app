import React from "react";
import { Paper, TextField } from "@material-ui/core";
import { Checkbox, Button } from "@material-ui/core";

import { 
  addTask, 
  getTasks, 
  updateTask, 
  deleteTask 
} from "./services/taskServices";
import './App.css';


class App extends React.Component {
  state = {tasks: [], currentTask: "" }

  async componentDidMount() {
    try {
        const {data} = await getTasks();
        this.setState({tasks: data});
    } catch (error) {
        console.log(error);
    }
  }

  handleChange = ({currentTarget: input}) => {
      this.setState({currentTask: input.value});
  }

  handleSubmit = async (e) => {
      e.preventDefault();
      const originalTasks = this.state.tasks;
      try {
          const {data} = await addTask({task : this.state.currentTask});
          const tasks = originalTasks;
          tasks.push(data);
          this.setState({tasks, currentTask: ""});
      } catch (error) {
          console.log(error)
      }
  }

  handleUpdate = async (currentTask) => {
      const originalTasks = this.state.tasks;
      try {
          const tasks = [...originalTasks];
          const index = tasks.findIndex((task) => task.id === currentTask);
          tasks[index] = {...tasks[index]};
          tasks[index].completed = !tasks[index].completed;
          this.setState({tasks});
          await updateTask(currentTask, {completed: tasks[index].completed})
      } catch (error) {
          this.setState({tasks: originalTasks});
          console.log(error);
      }
  }

  handleDelete  = async (currentTask) => {
      const originalTasks = this.state.tasks;
      try {
          const tasks = originalTasks.filter(
              (task) => task.id !== currentTask
          );
          this.setState({tasks});
          await deleteTask(currentTask);
      } catch (error) {
          this.setState({tasks: originalTasks});
          console.log(error);
      }
  }

  render() {
    const {tasks} = this.state;
    return (
      <div className="App flex">
        <Paper elevation={3} className="container">
          <div className="heading">TO-DO</div>
          <form 
          onSubmit={this.handleSubmit}
          className="flex"
          style={{margin: "15px 0"}}
          >
            <TextField 
            variant="outlined"
            size="small"
            style={{width: "150px"}}
            value={this.state.currentTask}
            required={true}
            onChange={this.handleChange}
            placeholder="Add New TO-DO"
            />
            <Button 
            style={{height: "40px"}}
            color="primary"
            variant="outlined"
            type="submit"
            >
              Add task
            </Button>
          </form>
          <div>
            {tasks.map((task) => (
              <Paper key={task.id} className="flex task_container">
                <Checkbox 
                  checked={task.completed}
                  onClick={() => this.handleUpdate(task.id)}
                  color="primary"
                />
                <div
                className={task.completed ? "task line_through" : "task"}
                >
                  {task.task}
                </div>
                <Button
                onClick={() => this.handleDelete(task.id)}
                color="secondary"
                >
                  delete
                </Button>
              </Paper>
            ))}
          </div>
        </Paper>
      </div>
    );
  }
}

export default App;