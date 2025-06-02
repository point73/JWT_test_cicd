import { useState, useEffect } from 'react';
import { api } from '../api';
import { toast } from 'react-toastify';

export default function AdminRolePage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      console.log("유저목록:", res.data);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("유저 목록 불러오기 실패", err);
      toast.error('유저 목록 불러오기 실패');
    }
  };

  const handleRoleChange = async (action) => {
    if (!selectedUser || !role) {
      toast.warning('유저와 권한을 선택하세요');
      return;
    }
    try {
      await api.post(`/admin/${action}-role`, { username: selectedUser, role });
      toast.success(`권한 ${action === 'assign' ? '부여' : '제거'} 완료`);
      fetchUsers();
    } catch (err) {
      toast.error(`권한 ${action === 'assign' ? '부여' : '제거'} 실패`);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>🔐 권한 관리</h2>

      <div style={styles.formGroup}>
        <label style={styles.label}>유저 선택:</label>
        <select
          style={styles.select}
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">-- 유저 선택 --</option>
          {users.map((user, idx) => (
            <option key={idx} value={user.username}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>권한 선택:</label>
        <select
          style={styles.select}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">-- 권한 선택 --</option>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      <div style={styles.buttonGroup}>
        <button style={styles.assignBtn} onClick={() => handleRoleChange('assign')}>권한 부여</button>
        <button style={styles.removeBtn} onClick={() => handleRoleChange('remove')}>권한 제거</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '40px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#fafafa'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold'
  },
  select: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  assignBtn: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  removeBtn: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};
