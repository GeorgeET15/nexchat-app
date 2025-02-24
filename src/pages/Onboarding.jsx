import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../components/supabaseClient";

const Onboarding = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) navigate("/signin");
    };
    checkUser();
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error("User not found");
      setLoading(false);
      return;
    }

    const userId = userData.user.id;
    const defaultChats = {
      interactions: [
        {
          message: `Hi, ${username}! Welcome to the chat.`,
          sender: "AI",
        },
      ],
    };

    const { data: existingData, error: fetchError } = await supabase
      .from("app_data")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error checking existing data:", fetchError);
      setLoading(false);
      return;
    }

    if (existingData) {
      const updatedFields = {
        username: existingData.username || username,
        name: existingData.name || name,
        age: existingData.age || age,
        chats: existingData.chats || defaultChats,
      };

      const { error: updateError } = await supabase
        .from("app_data")
        .update(updatedFields)
        .eq("user_id", userId);

      if (updateError) {
        console.error("Error updating user data:", updateError);
        setLoading(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase.from("app_data").insert([
        {
          user_id: userId,
          username,
          name,
          age,
          chats: defaultChats,
          created_at: new Date(),
        },
      ]);

      if (insertError) {
        console.error("Error creating user data:", insertError);
        setLoading(false);
        return;
      }
    }

    navigate("/dashboard");
  };

  return (
    <div className="page-container">
      <div className="content-box">
        <h2 className="page-title">Complete Your Profile</h2>
        <form onSubmit={handleSubmit} className="form">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-input"
          />
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-input"
          />
          <input
            placeholder="Age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            className="form-input"
          />
          <button type="submit" disabled={loading} className="form-button">
            {loading ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
