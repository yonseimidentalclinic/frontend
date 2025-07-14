// =================================================================
// 프론트엔드 기능 개선: SunEditor 텍스트 에디터 적용 (수정 페이지)
// 파일 경로: /src/pages/admin/AdminNoticeEditPage.jsx
// 주요 개선사항:
// 1. 기존 공지사항 데이터를 불러와 에디터에 채워넣는 기능 추가
// 2. SunEditor를 이용해 내용을 수정하고 서버에 업데이트하는 기능 구현
// 3. 데이터 로딩 및 오류 상태 처리로 안정성 강화
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// 1. SunEditor와 CSS 임포트
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

// API 기본 URL 환경변수에서 가져오기
const API_URL = import.meta.env.VITE_API_URL;

const AdminNoticeEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  // 2. content 상태가 에디터의 HTML 내용을 관리
  const [content, setContent] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 기존 공지사항 데이터를 불러오는 함수
  const fetchNotice = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/notices/${id}`);
      setTitle(response.data.title);
      setContent(response.data.content);
    } catch (err) {
      console.error("공지사항 정보를 불러오는 중 오류 발생:", err);
      setError("공지사항 정보를 불러오지 못했습니다. 목록으로 돌아가 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchNotice();
  }, [fetchNotice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!content.trim() || content === '<p><br></p>') {
      alert('내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(
        `${API_URL}/api/admin/notices/${id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('공지사항이 성공적으로 수정되었습니다.');
      navigate('/admin/notices');
    } catch (err) {
      console.error("공지사항 수정 중 오류 발생:", err);
      alert('수정에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <div className="text-center p-10">공지사항 정보를 불러오는 중...</div>;
  }
  
  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">공지사항 수정</h1>
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
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              내용
            </label>
            {/* 3. SunEditor에 불러온 content를 defaultValue로 설정 */}
            <SunEditor
              lang="ko"
              setContents={content} // 기존 내용을 에디터에 설정
              onChange={setContent} // 내용 변경 시 상태 업데이트
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
              {isSubmitting ? '저장 중...' : '수정 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminNoticeEditPage;
