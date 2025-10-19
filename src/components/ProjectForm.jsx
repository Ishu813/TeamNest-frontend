import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";

const ProjectForm = ({ team }) => {
  const url = import.meta.env.VITE_BACKEND_URL;
  if (!team) {
    return null;
  }

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [showProjectsForm, setShowProjectsForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !deadline.trim()) {
      alert("All fields are required!");
      return;
    }
    try {
      await axios.post(
        `${url}/projects`,
        {
          title: title,
          description: description,
          deadline: deadline,
          team: team._id,
        },
        { withCredentials: true }
      );
      setShowProjectsForm(false);
      window.location.reload();
    } catch (error) {
      console.log("Error while creating the team:", error);
    }
  };

  return (
    <div>
      {showProjectsForm ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "2rem",
          }}
        >
          <div>
            <p style={{ fontSize: "20px" }}>Add Project Details : </p>
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                width: "90%",
                gap: "2rem",
                padding: "2rem",
              }}
              onSubmit={(e) => handleSubmit(e)}
            >
              <TextField
                id="title"
                label="Project Name"
                variant="outlined"
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                id="description"
                label="Project Description"
                minRows={5}
                variant="outlined"
                onChange={(e) => setDescription(e.target.value)}
                multiline
              />
              <TextField
                id="deadline"
                label="Project Deadline"
                variant="outlined"
                type="text"
                onChange={(e) => setDeadline(e.target.value)}
              />
              <Button variant="outlined" type="submit">
                Assign Project
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setShowProjectsForm(false)}
              >
                Close
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: "2rem" }}>
          <Button
            variant="outlined"
            onClick={() => {
              setShowProjectsForm(true);
            }}
            disabled={team ? false : true}
          >
            Assign Project
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectForm;
