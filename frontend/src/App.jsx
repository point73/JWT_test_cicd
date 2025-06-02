import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import AdminRolePage from './components/AdminRolePage';
import MainPage from './components/MainPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AutoLogout from './components/AutoLogout';
import { useState } from 'react';
import { api } from './api';
import { jwtDecode } from 'jwt-decode';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('accessToken'));

  const handleLogin = (newToken) => {
    localStorage.setItem('accessToken', newToken);
    setToken(newToken);
  };

  // ✅ 이게 바로 네가 작성한 handleLogout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const decoded = jwtDecode(token);
      const username = decoded.sub;  // 실제 claim명 확인 후 맞게 수정

      await api.post('/logout', { username });

    } catch (err) {
      console.error("서버 로그아웃 실패", err);
    } finally {
      localStorage.removeItem("accessToken");
      setToken(null);
      window.location.href = "/login";
    }
  };

  return (
    <Router>
      <div>
        <h1>JWT Access/Refresh 인증 예제</h1>

        {token && <AutoLogout token={token} onLogout={handleLogout} />}

        {/* ✅ 여기에 수동 로그아웃 버튼 */}
        {token && (
          <button onClick={handleLogout} style={{ marginBottom: '20px' }}>
            로그아웃
          </button>
        )}

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/admin" element={<AdminRolePage />} />
        </Routes>

        <ToastContainer />
      </div>
    </Router>
  );
}
