import React from 'react';
import { Cascader } from 'antd';
import { category_type } from 'src/renderer/const/categroy';
import { DefaultOptionType } from 'antd/es/cascader';

interface CategoryFilterProps {
    value: string[];
    onChange: (value: string[]) => void;
}

function CategoryFilter({ value, onChange }: CategoryFilterProps) {
    return (
        <Cascader
            options={category_type}
            allowClear
            multiple
            variant="filled"
            value={value}
            style={{ width: '140px' }}
            onChange={val => onChange(val as string[])}
            placeholder="分类"
            showSearch={{
                filter: (inputValue: string, path: DefaultOptionType[]) =>
                    path.some(
                        option =>
                            (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1
                    ),
            }}
        />
    );
}

export default CategoryFilter;
