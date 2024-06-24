import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('https://weatherapp-server-su8d.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMessage("Login successful");
          onLogin();
          navigate('/home');
        } else {
          setMessage("Invalid credentials");
        }
      } else {
        setMessage("Error during login");
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage("Error during login");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">Login to Weather Station</div>
        <div className="login-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email address:</label>
              <input type="email" className="form-control" id="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input type="password" className="form-control" id="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
          {message && <div className={`alert ${message === "Login successful" ? "alert-success" : "alert-danger"}`}>{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default Login;
