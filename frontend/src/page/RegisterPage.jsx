import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/register', { email, password });
      alert('Kayıt başarılı, lütfen e-posta onayını bekleyin.');
      navigate('/login');  // Kayıttan sonra login sayfasına yönlendir
    } catch (error) {
      alert('Hata: ' + error.response.data);
    }
  };

  return (
    <div>
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Kayıt Ol</button>
      </form>
    </div>
  );
};

export default RegisterPage;
