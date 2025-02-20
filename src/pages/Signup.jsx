import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !username || !password || !confirmPassword) {
      setIsError(true);
      setErrorMsg("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setIsError(true);
      setErrorMsg("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${url}/signup`,
        { name, username, password, confirmPassword },
        { withCredentials: true }
      );
      localStorage.setItem("currUser", response.data.user.username);
      navigate("/account");
    } catch (err) {
      setIsError(true);
      setErrorMsg(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#5A5F79",
        backdropFilter: "blur(10px)",
        minHeight: "100vh",
      }}
    >
      {isError ? (
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setIsError(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2, mt: 4 }}
          severity="error"
        >
          {errorMsg}
        </Alert>
      ) : null}
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          height: "44rem",
          width: "44rem",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          margin: "2rem",
          borderRadius: "1rem",
        }}
      >
        <Box
          component="form"
          sx={{ "& > :not(style)": { m: 1, width: "50ch" } }}
          noValidate
          autoComplete="off"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "2rem",
            gap: "1rem",
            textAlign: "center",
          }}
          onSubmit={(e) => handleSubmit(e)}
        >
          <div>
            <h2>Register Now !</h2>
            <br />
            <p>Create your free account on TeamNest.</p>
          </div>
          <br />
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            placeholder="Enter a unique Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            placeholder="Enter Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            id="confirmPassword"
            label="Confirm Password"
            variant="outlined"
            placeholder="Enter Password"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button
            variant="contained"
            style={{ width: "96%" }}
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </Box>
        <p>
          Already have an account ? <a href="/login">Login</a>{" "}
        </p>
        <p style={{ marginTop: "auto", padding: "1rem" }}>
          &copy; 2025 TeamNest Crafted with &#x2764;&#xfe0f; by Ishu Agrawal
        </p>
      </Box>
    </Box>
  );
};

export default Signup;
