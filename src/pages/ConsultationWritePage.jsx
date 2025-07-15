// =================================================================
// 프론트엔드 기능 개선: SunEditor 한글 언어팩 로딩 오류 수정
// 파일 경로: /src/pages/ConsultationWritePage.jsx
// =================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import ko from 'suneditor/src/lang/ko'; // [핵심 수정]

const API_URL = import.meta.env.VITE_API_URL;

const ConsultationWritePage = () => {
  const [author, setAuthor] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSecret, setIsSecret] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author.trim() || !password.trim() || !title.trim() || !content.trim() || content === '<p><br></p>') {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/consultations`, { author, password, title, content, isSecret });
      alert('상담이 성공적으로 접수되었습니다.');
      navigate('/consultation');
    } catch (err) {
      alert('상담 접수에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">온라인 상담하기</h1>
      </div>
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="author" className="block text-md font-semibold text-gray-700 mb-2">작성자</label>
              <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
            </div>
            <div>
              <label htmlFor="password" className="block text-md font-semibold text-gray-700 mb-2">비밀번호</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="title" className="block text-md font-semibold text-gray-700 mb-2">제목</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
          </div>
          <div className="mb-6">
            <label className="block text-md font-semibold text-gray-700 mb-2">상담 내용</label>
            <SunEditor
              lang={ko} // [핵심 수정]
              setOptions={{
                height: '350',
                buttonList: [
                  ['undo', 'redo'], ['font', 'fontSize'], ['bold', 'underline', 'italic', 'strike'],
                  ['removeFormat'], ['fontColor', 'hiliteColor'], ['align', 'list'], ['link'],
                ],
              }}
              onChange={setContent}
              placeholder="상담 내용을 자세하게 입력해주세요..."
            />
          </div>
          <div className="mb-6 flex items-center">
            <input type="checkbox" id="isSecret" checked={isSecret} onChange={(e) => setIsSecret(e.target.checked)} className="h-4 w-4" />
            <label htmlFor="isSecret" className="ml-2 block text-sm text-gray-900">비밀글로 설정</label>
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => navigate('/consultation')} className="px-6 py-2 rounded-md bg-gray-200" disabled={isSubmitting}>취소</button>
            <button type="submit" className="px-6 py-2 rounded-md bg-blue-600 text-white" disabled={isSubmitting}>
              {isSubmitting ? '접수 중...' : '상담 접수하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsultationWritePage;
