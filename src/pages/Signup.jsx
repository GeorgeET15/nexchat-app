import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../components/supabaseClient";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage(error.message);
    } else {
      navigate("/onboarding"); // 🚀 Redirecting immediately
    }
  };

  return (
    <div className="page-container">
      <div className="content-box">
        <h2 className="page-title">Sign Up</h2>
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
            autoComplete="new-password"
          />
          <button type="submit" className="form-button">
            Create Account
          </button>
        </form>
        <span className="footer-text">Have an account?</span>
        <Link to="/signin" className="footer-link">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default Signup;
