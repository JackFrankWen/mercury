import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const Done: React.FC<{
  reSubmit: () => void;
}> = (prop) => {
  const navigate = useNavigate();
  return (
    <Result
      status="success"
      title="导入成功"
      subTitle="可以去首页查看"
      extra={[
        <Button type="primary" key="console" onClick={prop.reSubmit}>
          再次提交
        </Button>,
        <Button
          key="buy"
          onClick={() => {
            navigate("/");
          }}
        >
          去首页
        </Button>,
      ]}
    />
  );
};

export default Done;
