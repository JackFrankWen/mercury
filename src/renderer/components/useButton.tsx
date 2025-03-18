import { Button, ButtonProps } from "antd";
import React from "react";

export default function useLoadingButton(): [
  (props: ButtonProps) => React.ReactNode,
  () => void,
  () => void,
] {
  const [loading, setLoading] = React.useState<boolean>(false);
  const setLoadingFalse = () => setLoading(false);
  const setBtnLoading = () => setLoading(true);

  const LoadingBtn = (props: ButtonProps) => {
    const { onClick, type = "default" } = props;

    const handleClick = async (e: React.MouseEvent<HTMLElement>) => {
      setLoading(true);
      if (onClick) {
        await onClick(e);
      }
    };

    return (
      <Button loading={loading} type={type} onClick={handleClick}>
        {props.children}
      </Button>
    );
  };

  return [LoadingBtn, setBtnLoading, setLoadingFalse];
}
