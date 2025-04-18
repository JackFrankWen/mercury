import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import emitter from "src/renderer/events";

const Done: React.FC<{
  reSubmit: () => void;
  goYear: string;
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
            navigate(`/?year=${prop.goYear}`);
            emitter.emit('updateDate', {
              date: prop.goYear,
              trans_time: [prop.goYear + '-01-01 00:00:00', prop.goYear + '-12-31 23:59:59'],
              type: 'year',
            });
          }}
        >
          去查看
        </Button>,
      ]}
    />
  );
};

export default Done;
