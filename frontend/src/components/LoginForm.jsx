import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode'; // ✅ 여기서 import는 이렇게 (default export)

export default function LoginForm({ onLogin }) {  // ✅ 상위 컴포넌트에서 props로 받아옴
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.username || !form.password) {
      toast.warning("아이디와 비밀번호를 입력하세요");
      return;
    }

    try {
      const res = await api.post('/login', form, { withCredentials: true });
      const token = res.data.accessToken;

      localStorage.setItem('accessToken', token);
      toast.success("로그인 성공");

      // ✅ 상위 App으로 전달해서 App이 token 상태관리 시작
      if (onLogin) onLogin(token);

      // ✅ 토큰 디코딩 및 권한 확인
      const decoded = jwtDecode(token);
      const roles = decoded?.roles || [];

      if (roles.includes('ROLE_ADMIN')) {
        navigate('/admin');
      } else {
        navigate('/');
      }

    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("아이디 또는 비밀번호가 틀립니다.");
      } else {
        toast.error("로그인 실패: 서버 오류");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>로그인</h3>
      <input name="username" placeholder="username" onChange={handleChange} /><br />
      <input name="password" type="password" placeholder="password" onChange={handleChange} /><br />
      <button>로그인</button>

      <div style={{ marginTop: '10px' }}>
        <Link to="/signup">회원가입 하기</Link>
      </div>
    </form>
  );
}
