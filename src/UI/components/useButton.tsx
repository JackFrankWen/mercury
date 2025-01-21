import { Button, ButtonProps } from 'antd'
import React from 'react'

export default function useLoadingButton() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const setLoadingFalse = () => setLoading(false)
  const setBtnLoading = () => setLoading(true)
  const LoadingBtn = (props: ButtonProps) => {
    const { onClick, type = 'default' } = props
    return (
      <Button
        loading={loading}
        type={type}
        onClick={(e) => {
          if (onClick) onClick(e)
          setLoading(true)
        }}
      >
        {props.children}
      </Button>
    )
  }

  return {
    LoadingBtn,
    setBtnLoading,
    setLoadingFalse,
  }
}
