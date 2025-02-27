import { Radio, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import type { SelectProps, } from 'antd'


export function useSelect(props: {
  options: SelectProps['options']
  placeholder?: string
  style?: React.CSSProperties
}) {
  const { options, placeholder = '成员', style } = props
  const [value, setValue] = useState()
  const cpt = (
    <Select
      allowClear
      value={value}
      onChange={(val) => setValue(val)}
      placeholder={placeholder}
      options={options}
      style={style}
    />
  )
  return [value, cpt]
}

export default useSelect
