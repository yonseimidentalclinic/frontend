// =================================================================
// 사용자용 게시글 수정 페이지 (PostEditPage.jsx)
// 파일 경로: /src/pages/PostEditPage.jsx
// 주요 기능:
// 1. 기존 게시글 데이터를 불러와 에디터에 표시
// 2. SunEditor를 이용해 제목과 내용을 수정하고, 확인된 비밀번호와 함께 서버에 전송
// =================================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import ko from 'suneditor/src/lang/ko';

const API_URL = import.meta.env.VITE_API_URL;

const PostEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 이전 페이지(VerifyPage)에서 넘겨받은 비밀번호
  const verifiedPassword = location.state?.password;

  useEffect(() => {
    // 비밀번호 확인을 거치지 않고 직접 접속한 경우, 차단
    if (!verifiedPassword) {
      alert('잘못된 접근입니다. 비밀번호 확인 절차를 거쳐주세요.');
      navigate(`/community/posts/${id}`);
      return;
    }

    const fetchPost = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/posts/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (err) {
        alert('게시글 정보를 불러오는 데 실패했습니다.');
        navigate(`/community/posts/${id}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate, verifiedPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.put(`${API_URL}/api/posts/${id}`, {
        title,
        content,
        password: verifiedPassword // 확인된 비밀번호를 함께 전송
      });
      alert('게시글이 성공적으로 수정되었습니다.');
      navigate(`/community/posts/${id}`);
    } catch (err) {
      alert('수정에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-10">게시글 정보를 불러오는 중...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">게시글 수정</h1>
      </div>
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block text-md font-semibold text-gray-700 mb-2">제목</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
          </div>
          <div className="mb-6">
            <label className="block text-md font-semibold text-gray-700 mb-2">내용</label>
            <SunEditor
              lang={ko}
              setContents={content}
              onChange={setContent}
              setOptions={{
                height: '350',
                buttonList: [
                  ['undo', 'redo'], ['font', 'fontSize'], ['bold', 'underline', 'italic', 'strike'],
                  ['removeFormat'], ['fontColor', 'hiliteColor'], ['align', 'list'], ['link'],
                ],
              }}
            />
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => navigate(`/community/posts/${id}`)} className="px-6 py-2 rounded-md bg-gray-200" disabled={isSubmitting}>취소</button>
            <button type="submit" className="px-6 py-2 rounded-md bg-blue-600 text-white" disabled={isSubmitting}>
              {isSubmitting ? '저장 중...' : '수정 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostEditPage;
