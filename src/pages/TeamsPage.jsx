import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import UserBar from "../components/UserBar";
import ChatArea from "../components/ChatArea";
import { Checkbox, FormControlLabel, Button, TextField } from "@mui/material";
import axios from "axios";
import TeamBar from "../components/TeamBar";

const TeamsPage = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const [team, setTeam] = useState();
  const [teamName, setTeamName] = useState("");
  const [teams, setTeams] = useState([]);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [isChecked, setIsChecked] = useState({});
  const [error, setError] = useState(null);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${url}/teams`, {
        withCredentials: true,
      });
      setTeams(response.data);
    } catch (error) {
      setError("Failed to load teams. Please try again later.");
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${url}/users`, {
          withCredentials: true,
        });
        setUsers(response.data);
      } catch (error) {
        console.log("Unauthorized");
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowTeamForm(false);

    const checkedUserIds = Object.keys(isChecked).filter(
      (userId) => isChecked[userId]
    );

    if (checkedUserIds.length < 2) {
      alert("Please select at least 2 members for your team!");
      return;
    }

    if (!teamName.trim()) {
      alert("Team name cannot be empty!");
      return;
    }

    try {
      await axios.post(
        `${url}/teams`,
        {
          teamName,
          members: checkedUserIds.map((userId) => ({ user: userId })),
        },
        { withCredentials: true }
      );
      setIsChecked({});
      fetchTeams();
    } catch (error) {
      console.log("Error while creating the team:", error);
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
              Your Teams
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

          {showTeamForm ? (
            <form onSubmit={(e) => handleSubmit(e)}>
              <TextField
                id="teamName"
                label="Team Name"
                variant="standard"
                onChange={(e) => setTeamName(e.target.value)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "90%",
                  margin: "1rem",
                }}
                required
              />
              {error && (
                <p style={{ color: "red", paddingLeft: "2rem" }}>{error}</p>
              )}

              <Button
                variant="outlined"
                onClick={() => {
                  setShowTeamForm(true);
                }}
                style={{ width: "100%", marginTop: "2rem" }}
                disabled={Object.values(isChecked).filter(Boolean).length < 2}
                type="submit"
              >
                Create Team
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowTeamForm(false);
                }}
                color="error"
                style={{ width: "100%", marginTop: "1rem" }}
              >
                Close
              </Button>
              <p
                style={{
                  paddingLeft: "2rem",
                  color: "#7D7D7D",
                  fontSize: "12px",
                  marginTop: "2rem",
                  marginBottom: "2rem",
                }}
              >
                {" "}
                Choose two or more members
              </p>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {users.map((user) => (
                  <FormControlLabel
                    key={user._id}
                    sx={{ justifyContent: "space-between", width: "90%" }}
                    label={<UserBar user={user} />}
                    labelPlacement="start"
                    control={
                      <Checkbox
                        checked={!!isChecked[user._id]}
                        onChange={() =>
                          setIsChecked((prev) => ({
                            ...prev,
                            [user._id]: !prev[user._id],
                          }))
                        }
                      />
                    }
                  />
                ))}
              </div>
            </form>
          ) : (
            <Button
              variant="outlined"
              onClick={() => {
                setShowTeamForm(true);
              }}
              style={{ width: "100%", marginTop: "2rem" }}
              type="submit"
            >
              Create Team
            </Button>
          )}
        </div>
        <div style={{ width: "100%" }}>
          <ChatArea receiver={team} isTeam={true} />
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
