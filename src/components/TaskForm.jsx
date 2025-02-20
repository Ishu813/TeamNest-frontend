import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";

const TaskForm = ({ project }) => {
  const url = import.meta.env.VITE_BACKEND_URL;
  if (!project || !project.team || !project.team.members) {
    return null;
  }

  const [content, setContent] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() || !assignTo || !deadline.trim()) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${url}/tasks`,
        {
          content,
          deadline,
          project: project._id,
          assign_to: assignTo,
        },
        { withCredentials: true }
      );

      alert("Task added successfully!");
      setContent("");
      setAssignTo("");
      setDeadline("");
    } catch (error) {
      console.error("Error while creating the task:", error);
      alert("Failed to add task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p style={{ fontSize: "20px" }}>Add Task:</p>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          width: "90%",
          gap: "2rem",
          padding: "2rem",
        }}
        onSubmit={handleSubmit}
      >
        <TextField
          id="content"
          label="Write Task"
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <FormControl fullWidth>
          <InputLabel>Assign To</InputLabel>
          <Select
            id="assignTo"
            label="assignTo"
            value={assignTo}
            onChange={(e) => setAssignTo(e.target.value)}
          >
            {project.team.members.map((member) => (
              <MenuItem key={member._id} value={member.user.username}>
                {member.user.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          id="deadline"
          label="Task Deadline"
          variant="outlined"
          type="text"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <Button
          variant="outlined"
          type="submit"
          disabled={loading || !content || !assignTo || !deadline}
        >
          {loading ? "Adding..." : "Add Task"}
        </Button>
      </form>
    </div>
  );
};

export default TaskForm;
