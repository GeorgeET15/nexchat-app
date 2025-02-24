import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>NexChat</h1>
        <p style={styles.tagline}>Conversations Beyond the Horizon</p>
        <div style={styles.buttonContainer}>
          <Link to="/signup" style={styles.button} className="button">
            Sign Up
          </Link>
          <Link to="/signin" style={styles.button} className="button">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    background: "linear-gradient(120deg, #242038 0%, #9067C6 100%)", // Deep purple to bright purple
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Montserrat', sans-serif", // Sleek, modern font
    margin: 0,
    padding: 0,
    overflow: "hidden",
    position: "relative",
    border: "2px solid #8d86c9;",
  },
  content: {
    backgroundColor: "rgba(36, 32, 56, 0.9)", // Slightly transparent deep purple
    padding: "60px 40px",
    borderRadius: "15px",
    border: "2px solid #8D86C9", // Soft lavender border
    textAlign: "center",
    maxWidth: "500px",
    width: "90%",
  },
  title: {
    fontSize: "3.5rem",
    color: "#F7ECE1", // Creamy off-white
    marginBottom: "15px",
    fontWeight: "700",
    letterSpacing: "1.5px",
  },
  tagline: {
    fontSize: "1.4rem",
    color: "#CAC4CE", // Light gray
    marginBottom: "40px",
    fontWeight: "400",
    letterSpacing: "0.5px",
    fontStyle: "italic",
  },
  buttonContainer: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  button: {
    display: "inline-block",
    padding: "14px 35px",
    fontSize: "1.2rem",
    color: "#242038", // Deep purple text
    backgroundColor: "#8D86C9", // Soft lavender
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "600",
    transition: "all 0.3s ease",
    border: "1px solid #9067C6", // Bright purple outline
  },
};

export default Home;
