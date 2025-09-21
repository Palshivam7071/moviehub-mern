import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import formStyles from "../styles/Forms.module.css";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 new state
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/register", { name, email, password });
      login(response.data.user, response.data.token);
      navigate("/login");
    } catch (err) {
      setError("Failed to register. Please check your details.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={formStyles.form}
      style={{ maxWidth: "400px", margin: "2rem auto" }}
    >
      <h2>Registration to MovieHub</h2>

      {/* Full Name */}
      <div className={formStyles.formGroup}>
        <label htmlFor="name" className={formStyles.label}>Full Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={formStyles.input}
          autoComplete="name"
          required
        />
      </div>

      {/* Email */}
      <div className={formStyles.formGroup}>
        <label htmlFor="email" className={formStyles.label}>Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={formStyles.input}
          autoComplete="email"
          required
        />
      </div>

      {/* Password with toggle */}
      <div className={formStyles.formGroup} style={{ position: "relative" }}>
        <label htmlFor="password" className={formStyles.label}>Password</label>
        <input
          id="password"
          type={showPassword ? "text" : "password"} // 👈 toggle type
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={formStyles.input}
          autoComplete="new-password"
          required
        />
        {/* Toggle button */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: "5px",
            top: "70%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.5rem"
          }}
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>

      {/* Submit */}
      <button type="submit" className={formStyles.button}>Start Now</button>

      {error && <p className={formStyles.errorMessage}>{error}</p>}

      <p style={{ textAlign: "center" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
};

export default RegisterPage;
