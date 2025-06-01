import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import { api } from './api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const callUserApi = async () => {
    try {
      const res = await api.get('/user/hello');
      toast.success("유저 API 성공: " + res.data);
    } catch (err) {
      toast.error("유저 API 호출 실패");
    }
  }

  const callAdminApi = async () => {
    try {
      const res = await api.get('/admin/hello');
      toast.success("어드민 API 성공: " + res.data);
    } catch (err) {
      toast.error("어드민 API 호출 실패");
    }
  }

  const logout = async () => {
    const username = prompt("로그아웃할 username 입력:");
    if (!username) return;

    try {
      await api.post('/logout', { username }, { withCredentials: true });
      localStorage.removeItem('accessToken');
      toast.success("로그아웃 완료");
    } catch (err) {
      toast.error("로그아웃 실패");
    }
  }

  return (
    <div>
      <h1>JWT Access/Refresh 인증 예제</h1>
      <SignupForm />
      <LoginForm />
      <button onClick={callUserApi}>유저 API 호출</button>
      <button onClick={callAdminApi}>어드민 API 호출</button>
      <button onClick={logout}>로그아웃</button>
      <ToastContainer />
    </div>
  );
}

export default App;
