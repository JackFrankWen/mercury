import React from 'react';
import { BorderOutlined, CloseOutlined, MinusOutlined } from '@ant-design/icons';
import { theme } from 'antd';
import './TitleBar.css';

const TitleBar: React.FC = () => {
  const { token } = theme.useToken();
  const handleMinimize = async () => {
    try {
      await window.mercury.window.minimize();
    } catch (error) {
      console.error('Failed to minimize window:', error);
    }
  };

  const handleMaximize = async () => {
    try {
      await window.mercury.window.maximize();
    } catch (error) {
      console.error('Failed to maximize window:', error);
    }
  };

  const handleClose = async () => {
    try {
      await window.mercury.window.close();
    } catch (error) {
      console.error('Failed to close window:', error);
    }
  };

  return (
    <div className="title-bar">
      <div className="title-bar-title"></div>
      <div className="title-bar-controls" style={{ color: token.colorTextTertiary }}>
        <button onClick={handleMinimize} aria-label="Minimize">
          <MinusOutlined />
        </button>
        <button onClick={handleMaximize} aria-label="Maximize">
          <BorderOutlined />
        </button>
        <button onClick={handleClose} className="close-btn" aria-label="Close">
          <CloseOutlined />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;


