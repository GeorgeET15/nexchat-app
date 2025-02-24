import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";
import supabase from "../components/supabaseClient";

const Dashboard = () => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [activeChat, setActiveChat] = useState("private"); // State to toggle chats
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        navigate("/signin");
        return;
      }

      setUserId(user.id);

      const { data: userData, error: fetchError } = await supabase
        .from("app_data")
        .select("username")
        .eq("user_id", user.id)
        .single();

      if (fetchError) {
        console.error("Error fetching username:", fetchError);
        setUsername("Unknown");
      } else {
        setUsername(userData.username);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!userId || !username) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h1 className="sidebar-title">NexChat</h1>
        <nav className="sidebar-nav">
          <button
            className={`sidebar-button ${
              activeChat === "private" ? "active" : ""
            }`}
            onClick={() => setActiveChat("private")}
          >
            Private Chat
          </button>
          <button
            className={`sidebar-button ${
              activeChat === "public" ? "active" : ""
            }`}
            onClick={() => setActiveChat("public")}
          >
            Public Chat
          </button>
        </nav>
        <button onClick={handleLogout} className="sidebar-logout">
          Logout
        </button>
      </aside>
      <main className="dashboard-main">
        <div className="chat-content">
          {activeChat === "private" ? (
            <ChatWindow
              userId={userId}
              username={username}
              isPublicChat={false}
            />
          ) : (
            <ChatWindow
              userId={userId}
              username={username}
              isPublicChat={true}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
