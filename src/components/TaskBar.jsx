import React, { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const TaskBar = ({ task }) => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const [isDone, setIsDone] = useState(task.isDone);

  const handleTaskDone = async () => {
    try {
      const newIsDone = !isDone;
      setIsDone(newIsDone);

      await axios.patch(
        `${url}/tasks`,
        { taskId: task._id, isDone: newIsDone },
        { withCredentials: true }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task status!");
      setIsDone(!isDone); // Revert on failure
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmed) return;

    try {
      await axios.post(
        `${url}/tasks/delete`,
        { id: task._id },
        { withCredentials: true }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task!");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "90%",
        backgroundColor: "#F5FFFF",
        margin: "2rem",
        borderRadius: "1rem",
        padding: "1rem 2rem 1rem 2rem",
        color: "#1C1C1E",
        boxShadow: "0px 0px 10px #D9D9D9",
      }}
    >
      <p style={{ color: "#7D7D7D", paddingLeft: "0.5rem" }}>
        Project: {task.project?.title || "N/A"}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex" }}>
          <Checkbox name="isDone" checked={isDone} onChange={handleTaskDone} />
          <p
            style={{
              padding: "1rem",
              textDecoration: isDone ? "line-through" : "none",
              color: isDone ? "gray" : "black",
              transition: "0.3s",
            }}
          >
            {task.content}
          </p>
        </div>
        <FontAwesomeIcon
          icon={faTrash}
          style={{
            justifySelf: "flex-end",
            opacity: "0.8",
            cursor: "pointer",
            transition: "0.3s",
          }}
          color="red"
          fontSize="1.5rem"
          onMouseEnter={(e) => (e.target.style.opacity = "1")}
          onMouseLeave={(e) => (e.target.style.opacity = "0.8")}
          onClick={handleDelete}
        />
      </div>
      <p style={{ color: "#7D7D7D", marginLeft: "auto" }}>
        Deadline: {task.deadline || "No deadline"}
      </p>
    </div>
  );
};

export default TaskBar;
