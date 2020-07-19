import React, { useRef, useState, useEffect } from 'react';

import Button from './Button';
import './SubmitFile.css';

const SubmitFile = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickFileHandler = () => {
    filePickerRef.current.click();
  };
  return (
    <div className='form-control'>
      <label htmlFor={props.id}>{props.label}</label>
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type='file'
        accept={props.ext}
        onChange={pickedHandler}
      />

      <div className={`file-upload ${props.center && 'center'}`}>
        <div className='file-upload__preview'>
          {!isValid && <p> {props.errorText}</p>}

          {previewUrl && <p> {'Uploaded: ' + previewUrl} </p>}
        </div>

        <Button type='button' onClick={pickFileHandler}>
          Select File
        </Button>
      </div>
    </div>
  );
};

export default SubmitFile;
