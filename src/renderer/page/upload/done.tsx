import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const Done: React.FC<{
  reSubmit: () => void;
  goYear: string;
}> = (prop) => {
  const navigate = useNavigate();
  console.log(prop.goYear, 'goYear');
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
            navigate(`/?year=${prop.goYear}`);
          }}
        >
          去首页
        </Button>,
      ]}
    />
  );
};

export default Done;
