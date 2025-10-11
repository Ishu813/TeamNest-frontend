import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import TaskBar from "../components/TaskBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

const Account = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState();
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [uncompletedTasks, setUncompletedTasks] = useState([]);

  // Fetch user data
  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/isauthuser`, {
        withCredentials: true,
      });
      setUser(response.data.user);
    } catch (error) {
      console.log("Unauthorized");
    }
  }, []);

  // Fetch tasks data
  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/tasks`, {
        withCredentials: true,
      });
      setTasks(response.data);
    } catch (error) {
      console.log("Unauthorized");
    }
  }, []);

  useEffect(() => {
    fetchUser();
    fetchTasks();
  }, [fetchUser, fetchTasks]);

  useEffect(() => {
    if (user && tasks.length) {
      const filteredTasks = tasks.filter(
        (task) => task.assign_to === user.username
      );
      setUncompletedTasks(filteredTasks.filter((task) => !task.isDone));
      setCompletedTasks(filteredTasks.filter((task) => task.isDone));
    }
  }, [tasks, user]);

  const handleLogout = async () => {
    try {
      await axios.get(`${url}/logout`, {
        withCredentials: true,
      });
      window.location.href = "/";
    } catch (error) {
      console.log("Log Out failed");
    }
  };

  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: "6rem", backgroundColor: "#F4F5F7" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "skyblue",
            width: "100%",
            height: "10rem",
            boxShadow: "0px 0px 10px grey",
          }}
        >
          <div>
            <h1 style={{ padding: "2rem", color: "white" }}>
              {user ? user.name : "Account"}
            </h1>
            <p>{user ? user.specification : null}</p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              color: "white",
              marginTop: "auto",
              marginBottom: "2rem",
              marginRight: "2rem",
              fontSize: "24px",
            }}
          >
            <div style={{ rotate: "90deg" }}>
              <FontAwesomeIcon icon={faEllipsis} />
            </div>
            {user ? (
              <button
                onClick={() => handleLogout()}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  color: "white",
                }}
              >
                Logout
              </button>
            ) : (
              <a style={{ textDecoration: "none" }} href="/login">
                Login
              </a>
            )}
          </div>
        </div>
        <div style={{ padding: "2rem", color: "#1C1C1E", minHeight: "100vh" }}>
          <h2>List of Tasks you have been assigned :</h2>
          <br />
          <br />
          {uncompletedTasks.length > 0 ? (
            <div>
              <h2>Uncompleted Tasks: </h2>
              {uncompletedTasks.map((task) => (
                <TaskBar key={task._id} task={task} />
              ))}
            </div>
          ) : null}
          {completedTasks.length > 0 ? (
            <div>
              <h2>Completed Tasks: </h2>
              {completedTasks.map((task) => (
                <TaskBar key={task._id} task={task} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Account;
