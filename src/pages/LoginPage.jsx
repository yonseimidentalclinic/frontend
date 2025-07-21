import React, { useState } from 'react'; // 'useState'를 {}로 감싸도록 수정했습니다.
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 원장님 코드의 AuthContext를 그대로 사용합니다.

/**
 * 로그인 페이지 컴포넌트
 * 사용자가 이메일과 비밀번호를 입력하여 로그인합니다.
 */
const LoginPage = () => {
  // 1. 상태 관리 (State Management)
  // 사용자가 입력하는 이메일, 비밀번호를 저장합니다.
  const [formData, setFormData] = useState({ email: '', password: '' });
  // 로그인 시도 중 에러가 발생하면 메시지를 저장합니다.
  const [error, setError] = useState('');
  // 로그인 API 요청이 진행 중인지 여부를 저장합니다. (로딩 인디케이터 표시용)
  const [loading, setLoading] = useState(false);

  // 2. 훅 초기화 (Hook Initialization)
  // AuthContext에서 로그인 함수를 가져옵니다.
  const { login } = useAuth();
  // React Router의 페이지 이동 함수를 가져옵니다.
  const navigate = useNavigate();

  // 3. 이벤트 핸들러 (Event Handlers)
  // input 필드의 값이 변경될 때마다 formData 상태를 업데이트합니다.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 로그인 버튼 클릭 시 실행될 메인 함수입니다.
  const handleSubmit = async (e) => {
    e.preventDefault(); // form 태그의 기본 동작(페이지 새로고침)을 방지합니다.
    
    // 이전 에러 메시지 초기화 및 로딩 상태 시작
    setError('');
    setLoading(true);

    try {
      // AuthContext에 있는 login 함수를 호출합니다.
      await login(formData.email, formData.password);
      
      // ★★★ 핵심 수정 사항 ★★★
      // 로그인이 성공하면 홈 화면('/')으로 이동시킵니다.
      // 만약 마이페이지로 보내고 싶으시면 navigate('/mypage') 로 변경하시면 됩니다.
      navigate('/'); 

    } catch (err) {
      // login 함수에서 에러가 발생하면 (네트워크 문제, 비밀번호 오류 등)
      // 사용자에게 에러 메시지를 보여줍니다.
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      console.error('Login failed:', err); // 개발자 확인을 위해 콘솔에 에러를 출력합니다.
    } finally {
      // 요청이 성공하든 실패하든 로딩 상태를 종료합니다.
      setLoading(false);
    }
  };

  // 4. JSX 렌더링 (UI Rendering)
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          로그인
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className="text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <input 
              id="email"
              type="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label 
              htmlFor="password" 
              className="text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <input 
              id="password"
              type="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Password"
            />
          </div>

          {/* 에러 메시지가 있을 경우에만 표시됩니다. */}
          {error && (
            <p className="text-sm font-medium text-center text-red-600 bg-red-100 p-3 rounded-md">
              {error}
            </p>
          )}

          <div>
            <button 
              type="submit" 
              disabled={loading} // 로딩 중일 때는 버튼 비활성화
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </div>
          <p className="text-sm text-center text-gray-600">
            아직 회원이 아니신가요?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
