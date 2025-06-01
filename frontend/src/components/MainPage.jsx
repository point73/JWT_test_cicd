import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

export default function MainPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState(undefined);  // 초기 undefined

  // localStorage → state로 먼저 옮김 (안정적 타이밍 확보)
  useEffect(() => {
    const timer = setTimeout(() => {
      const storedToken = localStorage.getItem('accessToken');
      setToken(storedToken || null);
    }, 0);  // 마이크로태스크 큐로 넘겨서 타이밍 꼬임 최소화
    return () => clearTimeout(timer);
  }, []);

  // 토큰 값이 바뀔 때마다 권한 검사 실행
  useEffect(() => {
    if (token === undefined) return;  // 아직 초기 로딩중
    if (token === null) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const roles = decoded.roles || [];

      if (roles.includes('ROLE_ADMIN')) {
        navigate('/admin');
      }
      // 일반 유저는 그냥 메인 페이지에 머무름
    } catch (err) {
      localStorage.removeItem('accessToken');
      navigate('/login');
    }
  }, [token]);

  // 로딩중 표시
  if (token === undefined) return <div>로딩 중...</div>;

  return (
    <div>
      <h1>메인 페이지입니다.</h1>
      <Link to="/login">다시 로그인</Link>
    </div>
  );
}
