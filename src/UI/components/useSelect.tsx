import { Radio, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import type { SelectProps, } from 'antd'


export function useSelect(props: {
  options: SelectProps['options']
  placeholder?: string
}) {
  const { options, placeholder = '成员' } = props
  const [value, setValue] = useState()
  const cpt = (
    <Select
      allowClear
      value={value}
      onChange={(val) => setValue(val)}
      placeholder={placeholder}
      options={options}
    />
  )
  return [value, cpt]
}

export default useSelect
