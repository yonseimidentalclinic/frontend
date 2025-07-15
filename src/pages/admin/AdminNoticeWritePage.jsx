// =================================================================
// 프론트엔드 기능 개선: SunEditor 한글 언어팩 로딩 오류 수정
// 파일 경로: /src/pages/admin/AdminNoticeWritePage.jsx
// =================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import ko from 'suneditor/src/lang/ko'; // [핵심 수정] 한글 언어팩 직접 임포트

const API_URL = import.meta.env.VITE_API_URL;

const AdminNoticeWritePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || content === '<p><br></p>') {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(
        `${API_URL}/api/admin/notices`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('공지사항이 성공적으로 등록되었습니다.');
      navigate('/admin/notices');
    } catch (err) {
      console.error("공지사항 등록 중 오류 발생:", err);
      alert('등록에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">새 공지사항 작성</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block text-lg font-semibold text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="제목을 입력하세요"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              내용
            </label>
            <SunEditor
              lang={ko} // [핵심 수정] lang="ko" 대신 직접 임포트한 ko 객체 사용
              setOptions={{
                height: '400',
                buttonList: [
                  ['undo', 'redo'],
                  ['font', 'fontSize', 'formatBlock'],
                  ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                  ['removeFormat'],
                  '/', 
                  ['fontColor', 'hiliteColor'],
                  ['outdent', 'indent'],
                  ['align', 'horizontalRule', 'list', 'lineHeight'],
                  ['table', 'link'],
                  ['fullScreen', 'showBlocks', 'codeView'],
                ],
              }}
              onChange={setContent}
              placeholder="내용을 입력하세요..."
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/notices')}
              className="px-6 py-2 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminNoticeWritePage;
