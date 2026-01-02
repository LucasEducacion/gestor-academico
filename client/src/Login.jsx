import { useState } from 'react';
import axios from 'axios';
import { Container, Paper, TextField, Button, Typography, Box } from '@mui/material';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://192.168.0.3:3000/login', { email, password });
      // Si el login es correcto, guardamos el token y avisamos a App.jsx
      localStorage.setItem('token', res.data.token);
      onLoginSuccess();
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  const handleRegister = async () => {
    // Registro rápido para probar (Hardcodeado para el ejemplo)
    try {
        await axios.post('http://192.168.0.3:3000/registro', { 
            nombre: 'Nuevo Usuario', 
            email: email, 
            password: password 
        });
        alert("Usuario registrado! Ahora inicia sesión.");
    } catch(err) {
        alert("Error al registrar (quizás el email ya existe)");
    }
  }

  return (
    <Container maxWidth="xs" style={{ marginTop: '100px' }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" align="center" gutterBottom>Iniciar Sesión</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth label="Email" margin="normal"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth label="Contraseña" type="password" margin="normal"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
          
          <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Ingresar
          </Button>
          
          <Button fullWidth onClick={handleRegister} style={{ marginTop: '10px' }}>
            ¿No tienes cuenta? Crear una con estos datos
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Login;