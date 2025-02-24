import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../components/supabaseClient";

function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="page-container">
      <div className="content-box">
        <h2 className="page-title">Sign In</h2>
        {message && <span className="message">{message}</span>}
        <form onSubmit={handleSubmit} className="form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
            autoComplete="current-password"
          />
          <button type="submit" className="form-button">
            Log in
          </button>
        </form>
        <span className="footer-text">Don't have an account?</span>
        <Link to="/signup" className="footer-link">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Signin;
