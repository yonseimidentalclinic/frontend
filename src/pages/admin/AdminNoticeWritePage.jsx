// =================================================================
// 관리자 공지사항 작성 페이지 (AdminNoticeWritePage.jsx)
// 최종 업데이트: 2025년 7월 18일
// 주요 개선사항:
// 1. 글 작성 시 카테고리를 선택할 수 있는 드롭다운 메뉴 추가
// =================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import ko from 'suneditor/src/lang/ko';

const API_URL = import.meta.env.VITE_API_URL;
const NOTICE_CATEGORIES = ['병원소식', '의료상식', '이벤트'];

const AdminNoticeWritePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(NOTICE_CATEGORIES[0]); // [핵심 추가]
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category) {
      alert('제목, 카테고리, 내용을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(
        `${API_URL}/api/admin/notices`,
        { title, content, category }, // [핵심 수정] category 정보 포함
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('공지사항이 성공적으로 등록되었습니다.');
      navigate('/admin/notices');
    } catch (err) {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
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
            {/* [핵심 추가] 카테고리 선택 */}
            <div>
              <label htmlFor="category" className="block text-lg font-semibold text-gray-700 mb-2">
                카테고리
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white"
              >
                {NOTICE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              내용
            </label>
            <SunEditor
              lang={ko}
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
            <button type="button" onClick={() => navigate('/admin/notices')} className="px-6 py-2 rounded-md bg-gray-200" disabled={isSubmitting}>
              취소
            </button>
            <button type="submit" className="px-6 py-2 rounded-md bg-blue-600 text-white" disabled={isSubmitting}>
              {isSubmitting ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminNoticeWritePage;
