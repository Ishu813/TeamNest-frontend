import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TeamBar from "../components/TeamBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import ProjectForm from "../components/ProjectForm";
import TaskForm from "../components/TaskForm";
import TaskBar from "../components/TaskBar";

const ProjectsPage = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const [team, setTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamProjects, setTeamProjects] = useState([]);
  const [showTasksForm, setShowTasksForm] = useState([]);
  const [showTasks, setShowTasks] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsRes, projectsRes] = await Promise.all([
          axios.get(`${url}/teams`, { withCredentials: true }),
          axios.get(`${url}/projects`, { withCredentials: true }),
        ]);
        setTeams(teamsRes.data);
        setProjects(projectsRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const fetchProjectTasks = async (projectId) => {
    try {
      const response = await axios.get(`${url}/tasks?projectId=${projectId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  };

  useEffect(() => {
    if (team) {
      const proj = projects.filter((project) => project.team._id === team._id);
      setTeamProjects(proj);
    }
  }, [team, projects]);

  const handleDelete = async (project) => {
    try {
      await axios.post(
        `${url}/projects/delete`,
        { id: project._id },
        { withCredentials: true }
      );
      setProjects((prevProjects) =>
        prevProjects.filter((p) => p._id !== project._id)
      );
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div>
      <Sidebar />
      <div style={{ display: "flex", marginLeft: "6rem" }}>
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "#F4F5F7",
            width: "28rem",
          }}
        >
          <div
            style={{
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3>Teams</h3>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p
              style={{
                paddingLeft: "2rem",
                color: "#7D7D7D",
                fontSize: "12px",
                marginBottom: "1rem",
              }}
            >
              {" "}
              Select Your Team
            </p>{" "}
            {teams.map((team) => (
              <div
                key={team._id}
                onClick={() => {
                  setTeam(team);
                }}
              >
                <TeamBar team={team} showMem={true} />
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            padding: "2rem",
          }}
        >
          <div>
            <h2 style={{ paddingBottom: "8px" }}>Projects :</h2>
            <p>
              Projects assigned to your team{" "}
              {team ? `"${team.teamName}"` : null}
            </p>
          </div>
          <div>
            {teamProjects.map((project) => (
              <div key={project._id}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "2rem",
                    padding: "2rem",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    backgroundColor: "aliceblue",
                    borderRadius: "1rem",
                    fontSize: "20px",
                    boxShadow: "0px 0px 10px grey",
                  }}
                >
                  <div style={{ display: "flex", width: "100%", gap: "2rem" }}>
                    <FontAwesomeIcon icon={faFile} />
                    <p>{project.title}</p>
                  </div>

                  <p style={{ fontSize: "1rem" }}>
                    Description: {project.description}
                  </p>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div
                      style={{
                        fontSize: "1rem",
                        color: "#7D7D7D",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setShowTasksForm((prev) => ({
                          ...prev,
                          [project._id]: !prev[project._id],
                        }));
                      }}
                    >
                      Add Tasks
                    </div>
                    <div
                      style={{
                        fontSize: "1rem",
                        color: "#7D7D7D",
                        cursor: "pointer",
                      }}
                      onClick={async () => {
                        const fetchedTasks = await fetchProjectTasks(
                          project._id
                        );
                        setTasks(fetchedTasks);
                        setShowTasks((prev) => ({
                          ...prev,
                          [project._id]: !prev[project._id],
                        }));
                      }}
                    >
                      Show Tasks
                    </div>
                    <div
                      style={{
                        fontSize: "1rem",
                        color: "red",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDelete(project)}
                    >
                      Delete Project
                    </div>
                    <div
                      style={{
                        fontSize: "1rem",
                        color: "#7D7D7D",
                      }}
                    >
                      Deadline: {project.deadline}
                    </div>
                  </div>
                </div>

                {showTasksForm[project._id] ? (
                  <div>
                    <TaskForm project={project} />
                  </div>
                ) : null}

                <div>
                  {showTasks[project._id]
                    ? tasks.map((task) => (
                        <div key={task._id}>
                          <TaskBar task={task} />
                        </div>
                      ))
                    : null}
                </div>
              </div>
            ))}

            <ProjectForm team={team} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
