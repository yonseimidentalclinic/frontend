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

const Editor = ({ value, onChange }) => {
  return (
    <ReactQuill
      theme="snow"
      value={value || ''}
      modules={modules}
      formats={formats}
      onChange={onChange}
      placeholder="내용을 입력해주세요..."
      style={{ height: '400px', marginBottom: '4rem' }}
    />
  );
};

export default Editor;
