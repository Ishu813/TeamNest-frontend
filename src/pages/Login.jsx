import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const Login = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${url}/login`,
        {
          username: formData.username.trim(),
          password: formData.password.trim(),
        },
        { withCredentials: true }
      );

      console.log("Login successful:", response.data);

      // Store user info and redirect
      localStorage.setItem("currUser", response.data.user.username);
      navigate("/account");
    } catch (err) {
      setIsError(true);
      setErrorMsg(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
      console.error("Login failed:", err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#5A5F79",
        backdropFilter: "blur(10px)",
        minHeight: "100vh",
      }}
    >
      {/* Error Message */}
      {isError && (
        <Alert
          severity="error"
          sx={{ mb: 2, mt: 4 }}
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={() => setIsError(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {errorMsg}
        </Alert>
      )}

      {/* Login Box */}
      <Box
        sx={{
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
            margin: "4rem",
            gap: "1rem",
            textAlign: "center",
          }}
          onSubmit={handleSubmit}
        >
          <div style={{ marginBottom: "4rem" }}>
            <h2>Welcome Back!</h2>
            <br />
            <p>Sign in to continue with TeamNest.</p>
          </div>

          {/* Input Fields */}
          <TextField
            id="username"
            label="Username"
            name="username"
            variant="outlined"
            placeholder="Enter Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          <TextField
            id="password"
            label="Password"
            name="password"
            variant="outlined"
            type="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          {/* Login Button */}
          <Button
            variant="contained"
            sx={{ width: "96%" }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </Box>

        <p>
          Don't have an account? <a href="/signup">Register</a>
        </p>
        <p style={{ marginTop: "auto", padding: "1rem" }}>
          &copy; 2025 TeamNest Crafted with &#x2764;&#xfe0f; by Ishu Agrawal
        </p>
      </Box>
    </Box>
  );
};

export default Login;
