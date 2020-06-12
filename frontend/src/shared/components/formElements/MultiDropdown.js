import React, { useReducer, useEffect } from "react";

import "./MultiInput.css";
//a infinite x 2 drop down input
const inputReducer = (state, action) => {
    switch (action.type) {
      case 'CHANGE':
        console.log(action);
        return {
          ...state,
          value: action.val,
          isValid: action.validity
        };
      case 'TOUCH': {
        return {
          ...state,
          isTouched: true
        }
      }
      default:
        return state;
    }
  };

const MultiDropdown = (props) => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue || [],
        isTouched: false,
        isValid: props.initialValid || false
      });

    const { id, onInput } = props;
    const { value, isValid } = inputState;

    const firstColOptions = props.options[0];
    const secondColOptions = props.options[1];

    useEffect(() => {
        onInput(id, value, isValid)
      }, [id, value, isValid, onInput]);
    
    const changeHandler = (type, index) => event => {
        //console.log(inputState);
        let newValues;
        if (type === "col1") {
            newValues = inputState.value.map((tierName, sindex) => {
                if (index !== sindex) {
                    return tierName;
                } 
                return { ...tierName, tier: event.target.value};
            });
        } else {
            newValues = inputState.value.map((tierName, sindex) => {
                if (index !== sindex) {
                    return tierName;
                } 
                return { ...tierName, level: event.target.value};
            });
        }

        dispatch({
            type: 'CHANGE',
            val: newValues,
            validators: props.validators,
            validity: true
        });

    };

    /*
    const touchHandler = () => {
        dispatch({
            type: 'TOUCH'
        });
    };
    */

    const addRowHandler = () => {
        inputState.value.push({tier: "", level: ""});
        dispatch({
            type: 'CHANGE',
            val: inputState.value,
            validators: props.validators,
            validity: false
        });
        
        //console.log(inputState);
    };

    const removeRowHandler = index => () => {
        dispatch({
            type: 'CHANGE',
            val: inputState.value.filter((row, sindex) => sindex !== index),
            validators: props.validators
        });
    };

    //console.log(inputState);
    const elements = inputState.value.map((tierName, index) => (
        <>
            {/*frontend formatting problems */}
            <div
                className="dropdown-container"
                key={`requirement-${index + 1}`}
            >
                <div className="form-group dropdn">
                    <select
                        className="form-control"
                        onChange={changeHandler("col1", index)}
                    >
                        {firstColOptions.map((opt, oindex) => (
                            <option
                                key={`col1-${index + 1}-col2-${oindex + 1}`}
                            >
                                {opt.toString()}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group dropdn">
                    <select
                        className="form-control"
                        onChange={changeHandler("col2", index)}
                    >
                        {secondColOptions.map((opt, oindex) => (
                            <option
                                key={`col2-${index + 1}-col2-${oindex + 1}`}
                            >
                                {opt.toString()}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="button" onClick={removeRowHandler(index)}>
                    -
                </button>
            </div>
        </>
    ));
    //console.log("elements");
    //console.log(numberRepetitions);
    //console.log(elements);

    return (
        <div
            className={`form-control ${
                !inputState.isValid &&
                inputState.isTouched &&
                "form-control--invalid"
            }`}
        >
            <label htmlFor={props.id}>{props.label}</label>
            {elements}
            
            <div>
                <button type="button" onClick={addRowHandler}>
                    Add Requirement
                </button>
            </div>
            
            {!inputState.isValid && inputState.isTouched && (
                <p>{props.errorText}</p>
            )}
        </div>
    );

}

export default MultiDropdown;