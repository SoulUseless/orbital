import React, { useRef, useState } from "react";

import "./FileUpload.css";
import Button from './Button';

/*
async function parse(file) {
    const reader = new FileReader();
    reader.readAsText(file);
    const result = await new Promise((resolve, reject) => {
      reader.onload = function(event) {
      resolve(reader.result)
      }
    })
    console.log(result)
  }

  */

const readFile = async (file) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    const result = await new Promise((resolve, reject) => {
        fileReader.onloadend = (event) => {
            resolve(fileReader.result);
        }
    });
    return result;
}

const FileUpload = (props) => {
    //const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setisValid] = useState(false);

    const filePickerRef = useRef(); 

    const pickedHandler = async (event) => {
        //console.log(event.target.files);
        let parsedData;
        let dataIsValid = isValid;
        // event.target.files stores the file that use uploaded
        if (event.target.files && event.target.files.length === 1) {
            const targetFile = event.target.files[0];
            try {
                const data = await readFile(targetFile);
                console.log(data);

                parsedData = JSON.parse(data);
                //console.log(parsedData);

                //setFile(parsedData);
                setPreviewUrl(targetFile.name);
                setisValid(true);
                dataIsValid = true;
            } catch (err) {
                console.log(err);
            }
        } else {
            setisValid(false);
            dataIsValid = false;
        }
        console.log(parsedData);
        props.onInput(props.id, parsedData, dataIsValid);
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

                <div className="file-upload__preview">
                    {!isValid && <p> {props.errorText}</p>}
                    
                    {previewUrl && <p> {"Uploaded: " + previewUrl} </p>}
                </div>
                
                <Button type="button" onClick={pickImageHandler}>
                    Select File
                </Button>
            </div>
        </div>
    );
};

export default FileUpload;