// =================================================================
// 프론트엔드 기능 개선: SunEditor 한글 언어팩 로딩 오류 수정
// 파일 경로: /src/pages/admin/AdminNoticeEditPage.jsx
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import ko from 'suneditor/src/lang/ko'; // [핵심 수정] 한글 언어팩 직접 임포트

const API_URL = import.meta.env.VITE_API_URL;

const AdminNoticeEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotice = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/notices/${id}`);
      setTitle(response.data.title);
      setContent(response.data.content);
    } catch (err) {
      setError("공지사항 정보를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchNotice();
  }, [fetchNotice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || content === '<p><br></p>') {
      alert('제목과 내용을 모두 입력해주세요.');
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
      alert('수정에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) return <div className="p-10 text-center">로딩 중...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

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
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              내용
            </label>
            <SunEditor
              lang={ko} // [핵심 수정]
              setContents={content}
              onChange={setContent}
              setOptions={{
                height: '400',
                buttonList: [
                  ['undo', 'redo'], ['font', 'fontSize', 'formatBlock'], ['bold', 'underline', 'italic', 'strike'],
                  ['removeFormat'], '/', ['fontColor', 'hiliteColor'], ['align', 'list'], ['table', 'link'],
                ],
              }}
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/notices')}
              className="px-6 py-2 rounded-md bg-gray-200 text-gray-700 font-semibold"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold"
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
