import React, { useReducer, useEffect } from "react";

import { validate } from '../../util/validators';

import "./MultiInput.css";

const inputReducer = (state, action) => {
    switch (action.type) {
      case 'CHANGE':
        return {
          ...state,
          value: action.val,
          isValid: validate(action.val, action.validators)
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

const MultiInput = (props) => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue || [{tier: ""}],
        isTouched: false,
        isValid: props.initialValid || true
      });

    const { id, onInput } = props;
    const { value, isValid } = inputState;

    useEffect(() => {
        onInput(id, value, isValid)
      }, [id, value, isValid, onInput]);
    
    const changeHandler = index => event => {
        console.log(inputState);
        const newValues = inputState.value.map((tierName, sindex) => {
            if (index !== sindex) {
                return tierName;
            } 
            return { ...tierName, tier: event.target.value};
        });

        dispatch({
            type: 'CHANGE',
            val: newValues,
            validators: props.validators
        });

    };

    const touchHandler = () => {
        dispatch({
            type: 'TOUCH'
        });
    };

    const addTierHandler = () => {
        console.log(inputState);
        inputState.value.push({tier: ""})
        dispatch({
            type: 'CHANGE',
            val: inputState.value,
            validators: props.validators
        });
    };

    const removeTierHandler = index => () => {
        dispatch({
            type: 'CHANGE',
            val: inputState.value.filter((tierName, sindex) => sindex !== index),
            validators: props.validators
        });
    };

    //console.log(inputState);
    const elements = inputState.value.map((tierName, index) => (
        <>
            <div>
                <input
                    type="text"
                    placeholder={`Requirement ${index + 1}`}
                    value={tierName.tier}
                    onChange={changeHandler(index)}
                    onBlur={touchHandler}
                />
                <button type="button" onClick={removeTierHandler(index)}>
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
                <button type="button" onClick={addTierHandler}>
                    Add Requirement
                </button>
            </div>
            
            {!inputState.isValid && inputState.isTouched && (
                <p>{props.errorText}</p>
            )}
        </div>
    );

}

export default MultiInput;