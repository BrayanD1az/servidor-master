import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { fetchIpData, verifyIp } from './api';

const Login = ({ setIsAuthenticated }) => {
  const [credentials, setCredentials] = useState({ user: '', password: '' });
  const [ipAddress, setIpAddress] = useState('');
  const [ipError, setIpError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getIpAndVerify = async () => {
      setLoading(true);
      try {
        const data = await fetchIpData();
        setIpAddress(data.ip);

        const ipCheckResponse = await verifyIp(data.ip);
        if (ipCheckResponse.status === 403) {
          setIpError(ipCheckResponse.error);
        }
      } catch (error) {
        console.error('Error al verificar la IP:', error);
        setIpError('Error de conexión con el servidor.');
      } finally {
        setLoading(false);
      }
    };

    getIpAndVerify();
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (ipError) {
      alert('Acceso denegado: La IP está bloqueada.');
      return;
    }

    const { user, password } = credentials;
    if (user === 'admin' && password === '12345678') {
      setIsAuthenticated(true);
      navigate('/');
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Iniciar sesión con tu cuenta docente</h2>
      {loading && <p className="loading-message">Verificando IP...</p>}
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Usuario</label>
          <input
            type="text"
            id="username"
            name="user"
            className="form-control"
            value={credentials.user}
            onChange={handleChange}
            placeholder="Ingresa tu usuario"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>

        {ipError && (
          <p className="error-message" style={{ color: 'red' }}>
            {ipError}
          </p>
        )}

        <div className="form-group text-center">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
