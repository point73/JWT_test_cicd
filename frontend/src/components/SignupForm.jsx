import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { toast } from 'react-toastify';

export default function SignupForm() {
  const [form, setForm] = useState({ username: '', password: '', email: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.username || !form.password || !form.email) {
      toast.warning("모든 항목을 입력해주세요");
      return;
    }

    try {
      await api.post('/signup', form, { withCredentials: true });
      toast.success("회원가입 성공");
      navigate('/login');  // 🔥 회원가입 성공 시 로그인 페이지로 이동
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("이미 존재하는 아이디입니다.");
      } else {
        toast.error("회원가입 실패: 서버 오류");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>회원가입</h3>
      <input name="username" placeholder="username" onChange={handleChange} /><br />
      <input name="password" type="password" placeholder="password" onChange={handleChange} /><br />
      <input name="email" placeholder="email" onChange={handleChange} /><br />
      <button>가입하기</button>
    </form>
  );
}
