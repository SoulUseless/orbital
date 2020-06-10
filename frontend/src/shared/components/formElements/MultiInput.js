import React, { useState } from "react";

import Input from "./Input";
import Button from "./Button";

const MultiInput = (props) => {
    const { numberRepetitions, setNumberReptitions } = useState(1);

    const upRep = () => setNumberReptitions(numberRepetitions + 1);
    const downRep = () => ! numberRepetitions === 1 && setNumberReptitions(numberRepetitions - 1);

    return (
        <label htmlFor={props.id}>{props.label}</label>

    );

}

export default MultiInput;