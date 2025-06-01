import { useState } from 'react';
import { api } from '../api';
import { toast } from 'react-toastify';

export default function LoginForm() {
  const [form, setForm] = useState({ username: '', password: '' });

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
      localStorage.setItem('accessToken', res.data.accessToken);
      toast.success("로그인 성공");
    } catch (err) {
      if (err.response && err.response.status === 401) {
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
    </form>
  );
}
