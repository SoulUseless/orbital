import React, { useRef, useState, useEffect } from "react";

import "./FileUpload.css";
import Button from './Button';

const ImageUpload = (props) => {
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setisValid] = useState(false);

    const filePickerRef = useRef(); 

    useEffect(() => {
        if (!file) { 
            return;
        }
        const fileReader = new FileReader(); //browser side js
        fileReader.onload = (event) => {
            setPreviewUrl(file.name);
        }; //pseudo callback that runs when function below is called
        fileReader.readAsText(file);
    }, [file]);



    const pickedHandler = (event) => {
        //console.log(event.target.files);
        let pickedFile;
        let fileIsValid = isValid;
        // event.target.files stores the file that use uploaded
        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setisValid(true);
            fileIsValid = true;
        } else {
            setisValid(false);
            fileIsValid = false;
        }
        props.onInput(props.id, pickedFile, fileIsValid);
    };

    const pickImageHandler = () => {
        filePickerRef.current.click();
    };

    return (
        <div className="form-control">
            <label htmlFor={props.id}>{props.label}</label>
            <input
                id={props.id}
                ref={filePickerRef}
                style={{ display: "none" }}
                type="file"
                accept=".json"
                onChange={pickedHandler}
            />

            <div className={`file-upload ${props.center && "center"}`}>
                {previewUrl && (
                    <div className="file-upload__preview">
                        <p> {"Uploaded: " + previewUrl} </p>
                    </div>
                )}
                <Button type="button" onClick={pickImageHandler}>
                    Select File
                </Button>
            </div>

            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
};

export default ImageUpload;