import { Radio } from "antd";
import React, { useState } from "react";
import type { RadioChangeEvent } from "antd";

export function useRadio(props: {
    options: { label: string; value: string | number }[];
    defaultValue?: string | number;
    style?: React.CSSProperties;
}) {
    const { options, defaultValue, style } = props;
    const [value, setValue] = useState(defaultValue);

    const handleChange = (e: RadioChangeEvent) => {
        setValue(e.target.value);
    };

    const cpt = (
        <Radio.Group
            value={value}
            onChange={handleChange}
            style={style}
            block
            buttonStyle="solid"
        >
            {options.map((option) => (
                <Radio.Button key={option.value} value={option.value}>
                    {option.label}
                </Radio.Button>
            ))}
        </Radio.Group>
    );

    return [value, cpt];
}

export default useRadio;
