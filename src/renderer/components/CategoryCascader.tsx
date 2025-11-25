import React, { useState, useEffect, useMemo } from 'react';
import { Popover, Input, Empty, Spin } from 'antd';
import { SearchOutlined, CloseCircleFilled } from '@ant-design/icons';
import { renderIcon } from './FontIcon';
import './CategoryCascader.css';

export interface CategoryOption {
    value: number;
    label: string;
    icon?: string;
    color?: string;
    children?: CategoryOption[];
    disabled?: boolean;
}

interface CategoryCascaderProps {
    options: CategoryOption[];
    value?: number[];
    onChange?: (value: number[] | undefined) => void;
    placeholder?: string;
    style?: React.CSSProperties;
    allowClear?: boolean;
    showSearch?: boolean;
    popupClassName?: string;
    disabled?: boolean;
    compact?: boolean;
}

const CategoryCascader: React.FC<CategoryCascaderProps> = ({
    options,
    value,
    onChange,
    placeholder = '请选择',
    style,
    allowClear = true,
    showSearch = false,
    popupClassName = '',
    disabled = false,
    compact = false,
}) => {
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<number[] | undefined>(value);
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResultOption[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        setSelectedValue(value);
    }, [value]);

    // 获取选中项的显示文本
    const displayText = useMemo(() => {
        if (!selectedValue || selectedValue.length === 0) return '';

        // 如果只有第一级选中
        if (selectedValue.length === 1) {
            const parent = options.find(opt => opt.value === selectedValue[0]);
            return parent ? parent.label : '';
        }

        // 如果有第二级选中
        if (selectedValue.length === 2) {
            const parent = options.find(opt => opt.value === selectedValue[0]);
            if (!parent || !parent.children) return '';

            const child = parent.children.find(child => child.value === selectedValue[1]);
            return child ? child.label : '';
        }

        return '';
    }, [selectedValue, options]);

    // 获取选中项的图标
    const selectedIcon = useMemo(() => {
        if (!selectedValue || selectedValue.length === 0) return null;

        if (selectedValue.length === 2) {
            const parent = options.find(opt => opt.value === selectedValue[0]);
            if (!parent || !parent.children) return null;

            const child = parent.children.find(child => child.value === selectedValue[1]);
            if (!child || !child.icon) return null;

            return renderIcon(child.icon, child.color);
        }

        return null;
    }, [selectedValue, options]);

    // 处理搜索
    // 扩展类型以支持搜索结果
    interface SearchResultOption extends CategoryOption {
        parentValue?: number;
        parentLabel?: string;
    }

    useEffect(() => {
        if (!showSearch || !searchValue) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);

        // 简单的延迟模拟搜索过程
        const timer = setTimeout(() => {
            const results: SearchResultOption[] = [];

            options.forEach(parent => {
                // 搜索父级
                if (parent.label.toLowerCase().includes(searchValue.toLowerCase())) {
                    results.push(parent);
                }

                // 搜索子级
                if (parent.children) {
                    parent.children.forEach(child => {
                        if (child.label.toLowerCase().includes(searchValue.toLowerCase())) {
                            // 创建一个新对象，包含父级信息和子级信息
                            results.push({
                                ...child,
                                parentValue: parent.value,
                                parentLabel: parent.label
                            });
                        }
                    });
                }
            });

            setSearchResults(results);
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchValue, options, showSearch]);

    // 处理选择
    const handleSelect = (parentValue: number, childValue?: number) => {
        let newValue: number[] | undefined;

        if (childValue !== undefined) {
            newValue = [parentValue, childValue];
        } else {
            newValue = [parentValue];
        }

        setSelectedValue(newValue);
        onChange?.(newValue);
        setOpen(false);
        setSearchValue('');
    };

    // 处理搜索结果选择
    const handleSearchResultSelect = (result: SearchResultOption) => {
        if (result.parentValue) {
            // 这是一个子项搜索结果
            handleSelect(result.parentValue, result.value);
        } else if (result.children) {
            // 这是一个父项
            setSearchValue('');
        } else {
            // 这是一个没有子项的父项
            handleSelect(result.value);
        }
    };

    // 清除选择
    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedValue(undefined);
        onChange?.(undefined);
    };

    const content = (
        <div className="category-cascader-dropdown" style={{ minWidth: 320, maxWidth: 480 }}>
            {showSearch && (
                <div className="category-cascader-search">
                    <Input
                        placeholder="搜索"
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        prefix={<SearchOutlined />}
                        allowClear
                    />
                </div>
            )}

            {isSearching ? (
                <div className="category-cascader-loading">
                    <Spin size="small" />
                </div>
            ) : searchValue ? (
                // 搜索结果
                <div className="category-cascader-search-results">
                    {searchResults.length > 0 ? (
                        searchResults.map(result => (
                            <div
                                key={`${result.parentValue || ''}-${result.value}`}
                                className="category-cascader-search-item"
                                onClick={() => handleSearchResultSelect(result)}
                            >
                                {result.icon && renderIcon(result.icon, result.color)}
                                <span>
                                    {result.parentLabel
                                        ? `${result.parentLabel} / ${result.label}`
                                        : result.label}
                                </span>
                            </div>
                        ))
                    ) : (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="无匹配结果" />
                    )}
                </div>
            ) : (
                // 网格布局展示所有分类
                <div className="category-cascader-grid-content">
                    {options.map(category => (
                        <div key={category.value} className="category-cascader-category-section">
                            <div
                                className="category-cascader-category-title"
                                onClick={() => {
                                    if (category.disabled) return;
                                    if (!category.children || category.children.length === 0) {
                                        handleSelect(category.value);
                                    }
                                }}
                            >
                                {category.label}
                            </div>
                            <div className="category-cascader-subcategory-grid">
                                {category.children?.map(subCategory => (
                                    <div
                                        key={subCategory.value}
                                        className={`category-cascader-grid-item ${subCategory.disabled ? 'disabled' : ''}`}
                                        onClick={() => {
                                            if (subCategory.disabled) return;
                                            handleSelect(category.value, subCategory.value);
                                        }}
                                    >
                                        <div className="category-cascader-grid-icon">
                                            {subCategory.icon && renderIcon(subCategory.icon, subCategory.color)}
                                        </div>
                                        <div className="category-cascader-grid-label">
                                            {subCategory.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <Popover
            content={content}
            trigger="click"
            open={disabled ? false : open}
            onOpenChange={setOpen}
            placement="bottomLeft"
            overlayClassName={`category-cascader-popup ${open ? 'category-cascader-popup-open' : ''} ${popupClassName}`}
        >
            <div
                className={`category-cascader ${disabled ? 'disabled' : ''} ${compact ? 'compact' : ''}`}
                style={style}
                onClick={() => !disabled && setOpen(true)}
            >
                <div className="category-cascader-selector">
                    {selectedValue && selectedValue.length > 0 ? (
                        <div className="category-cascader-selected">
                            {selectedIcon && <span className="category-cascader-icon">{selectedIcon}</span>}
                            <span className="category-cascader-label">{displayText}</span>
                        </div>
                    ) : (
                        <span className="category-cascader-placeholder">{placeholder}</span>
                    )}

                    {allowClear && selectedValue && selectedValue.length > 0 && !disabled && (
                        <CloseCircleFilled className="category-cascader-clear" onClick={handleClear} />
                    )}
                </div>
            </div>
        </Popover>
    );
};

export default CategoryCascader;
