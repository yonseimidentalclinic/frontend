import React from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // suneditor-react CSS import

const Editor = ({ value, onChange }) => {
  return (
    <SunEditor
      setContents={value || ''}
      onChange={onChange}
      setDefaultStyle="font-family: Arial; font-size: 16px;"
      setOptions={{
        height: '400',
        buttonList: [
          ['undo', 'redo'],
          ['font', 'fontSize', 'formatBlock'],
          ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
          ['removeFormat'],
          ['fontColor', 'hiliteColor'],
          ['outdent', 'indent'],
          ['align', 'horizontalRule', 'list', 'lineHeight'],
          ['table', 'link', 'image', 'video'],
          ['fullScreen', 'showBlocks', 'codeView'],
        ],
      }}
      placeholder="내용을 입력해주세요..."
    />
  );
};

export default Editor;
