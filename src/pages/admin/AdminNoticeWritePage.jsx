// =================================================================
// 프론트엔드 기능 개선: SunEditor 텍스트 에디터 적용
// 파일 경로: /src/pages/admin/AdminNoticeWritePage.jsx
// 주요 개선사항:
// 1. 'suneditor-react' 라이브러리를 이용한 웹 에디터 도입
// 2. 기존 textarea를 SunEditor 컴포넌트로 교체
// 3. 사용자가 편리하게 글 서식을 지정하고 이미지를 추가할 수 있는 환경 제공
// =================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 1. SunEditor와 CSS 임포트
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // 에디터 스타일 import

// API 기본 URL 환경변수에서 가져오기
const API_URL = import.meta.env.VITE_API_URL;

const AdminNoticeWritePage = () => {
  const [title, setTitle] = useState('');
  // 2. content 상태가 이제 에디터의 HTML 내용을 관리합니다.
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!content.trim() || content === '<p><br></p>') { // 에디터의 기본 빈 값 체크
      alert('내용을 입력해주세요.');
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
            {/* 3. 기존 textarea를 SunEditor 컴포넌트로 교체 */}
            <SunEditor
              lang="ko"
              setOptions={{
                height: '400',
                buttonList: [
                  ['undo', 'redo'],
                  ['font', 'fontSize', 'formatBlock'],
                  ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                  ['removeFormat'],
                  '/', // 줄바꿈
                  ['fontColor', 'hiliteColor'],
                  ['outdent', 'indent'],
                  ['align', 'horizontalRule', 'list', 'lineHeight'],
                  ['table', 'link' /*, 'image' */], // 이미지 버튼은 서버 설정이 필요하므로 우선 주석 처리
                  ['fullScreen', 'showBlocks', 'codeView'],
                ],
              }}
              onChange={setContent} // 에디터 내용이 변경될 때마다 content 상태 업데이트
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
