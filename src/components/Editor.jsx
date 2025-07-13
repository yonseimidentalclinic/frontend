// 파일 경로: src/components/Editor.jsx

import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // 에디터 스노우 테마 CSS

// 에디터에 사용될 툴바 옵션을 설정합니다.
const modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, 
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean'],
    [{ 'color': [] }, { 'background': [] }], 
  ],
};

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video',
  'color', 'background',
];

/**
 * React 18과 react-quill의 호환성 문제를 해결하기 위한 최종 버전의 컴포넌트입니다.
 */
const Editor = ({ value, onChange }) => {
  // onChange 핸들러를 수정하여 HTML 콘텐츠만 전달하도록 합니다.
  const handleChange = (html) => {
    onChange(html);
  };

  return (
    // Quill 에디터가 차지할 공간을 미리 확보하여 레이아웃 깨짐을 방지합니다.
    <div style={{ height: '450px' }}>
      <ReactQuill
        theme="snow"
        value={value || ''}
        modules={modules}
        formats={formats}
        onChange={handleChange}
        placeholder="내용을 입력해주세요..."
        style={{ height: '400px' }}
      />
    </div>
  );
};

export default Editor;
