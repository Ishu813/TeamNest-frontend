import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Account from "./pages/Account";
import ChatsPage from "./pages/ChatsPage";
import TeamsPage from "./pages/TeamsPage";
import ProjectsPage from "./pages/ProjectsPage";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChatBot from "./pages/ChatBot";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Account />} />
        <Route exact path="/account" element={<Account />} />
        <Route exact path="/chats" element={<ChatsPage />} />
        <Route exact path="/teams" element={<TeamsPage />} />
        <Route exact path="/projects" element={<ProjectsPage />} />
        <Route exact path="/search" element={<Search />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/chatbot" element={<ChatBot />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
