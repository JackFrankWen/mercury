import React from 'react';
import {  Button, Result } from 'antd';

const Done: React.FC<{
    reSubmit: () => void
}> = (prop) => (
  <Result
    status="success"
    title="导入成功"
    subTitle="可以去首页查看"

    extra={[
      <Button type="primary" key="console" onClick={prop.reSubmit}>
        再次提交
      </Button>,
      <Button key="buy" onClick={prop.reSubmit}>再次提交</Button>,
    ]}
  />
);

export default Done;