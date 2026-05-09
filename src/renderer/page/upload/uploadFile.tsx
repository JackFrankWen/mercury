import React from 'react';
import { Modal, Upload, UploadProps, message } from 'antd';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { handleToTable } from './classification';
import { WechatOutlined, AlipayCircleOutlined, CloudUploadOutlined } from '@ant-design/icons';
import './index.css';

const { Dragger } = Upload;

interface UploadSectionProps {
  onUploadSuccess: (obj: { tableHeader: any; tableData: any; fileName: string }) => void;
  setLoading: (loading: boolean) => void;
}

// 获取文件扩展名
function getFileExtension(fileName: string): string {
  return fileName.toLowerCase().split('.').pop() || '';
}

function padDateNumber(value: number): string {
  return String(value).padStart(2, '0');
}

function formatExcelDateSerial(value: number): string | undefined {
  const date = XLSX.SSF.parse_date_code(value);
  if (!date) {
    return undefined;
  }

  let seconds = Math.round(date.S);
  let minutes = date.M;
  let hours = date.H;

  if (seconds === 60) {
    seconds = 0;
    minutes += 1;
  }
  if (minutes === 60) {
    minutes = 0;
    hours += 1;
  }

  return `${date.y}-${padDateNumber(date.m)}-${padDateNumber(date.d)} ${padDateNumber(
    hours
  )}:${padDateNumber(minutes)}:${padDateNumber(seconds)}`;
}

function formatDateValue(value: Date): string {
  return `${value.getFullYear()}-${padDateNumber(value.getMonth() + 1)}-${padDateNumber(
    value.getDate()
  )} ${padDateNumber(value.getHours())}:${padDateNumber(value.getMinutes())}:${padDateNumber(
    value.getSeconds()
  )}`;
}

function isDateColumnHeader(value: unknown): boolean {
  return typeof value === 'string' && /(时间|日期|date|time)/i.test(value);
}

function isExcelDateSerial(value: unknown): value is number {
  return typeof value === 'number' && value > 1 && value < 2958466;
}

function getXlsxCellValue(
  cell: XLSX.CellObject | undefined,
  columnIndex: number,
  dateColumnIndexes: Set<number>
): string {
  if (!cell) {
    return '';
  }

  if (cell.v instanceof Date) {
    return formatDateValue(cell.v);
  }

  const isFormattedDate =
    isExcelDateSerial(cell.v) && typeof cell.z === 'string' && XLSX.SSF.is_date(cell.z);
  const isDateColumnValue = isExcelDateSerial(cell.v) && dateColumnIndexes.has(columnIndex);
  if (isFormattedDate || isDateColumnValue) {
    return formatExcelDateSerial(cell.v) || String(cell.w || cell.v || '');
  }

  return String(cell.w ?? cell.v ?? '');
}

function trimEmptyCells(row: string[]): string[] {
  const result = [...row];
  while (result.length > 0 && result[result.length - 1] === '') {
    result.pop();
  }
  return result;
}

function sheetToStringArray(worksheet: XLSX.WorkSheet): string[][] {
  const rangeText = worksheet['!ref'];
  if (!rangeText) {
    return [];
  }

  const range = XLSX.utils.decode_range(rangeText);
  const dateColumnIndexes = new Set<number>();
  const rows: string[][] = [];

  for (let rowIndex = range.s.r; rowIndex <= range.e.r; rowIndex += 1) {
    const row: string[] = [];

    for (let columnIndex = range.s.c; columnIndex <= range.e.c; columnIndex += 1) {
      const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: columnIndex });
      const cell = worksheet[cellAddress];
      const value = getXlsxCellValue(cell, columnIndex, dateColumnIndexes);
      row.push(value);

      if (isDateColumnHeader(value)) {
        dateColumnIndexes.add(columnIndex);
      }
    }

    rows.push(trimEmptyCells(row));
  }

  return rows;
}

// 解析xlsx文件
function parseXlsxFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellNF: true });
        
        // 获取第一个工作表
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // 转换为数组格式，保持与CSV解析一致的格式
        const jsonData = sheetToStringArray(worksheet);
        console.log(jsonData, 'jsonData====');
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsArrayBuffer(file);
  });
}

// 解析CSV文件（保持原有方式）
function parseCsvFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: false,
      encoding: 'gb18030',
      skipEmptyLines: true,
      complete: function (results: any) {
        resolve(results.data || []);
      },
      error: function (error: any) {
        reject(error);
      }
    });
  });
}

function UploadSection({ onUploadSuccess, setLoading }: UploadSectionProps) {
  const uploadProps: UploadProps = {
    name: 'file',
    fileList: [],
    className: 'upload-cus',
    beforeUpload: async file => {
      const fileList = await window.mercury.store.getUploadFileList() || [];
      console.log(fileList, '==fileList');
      if (fileList.some(item => item.fileName === file.name)) {
        Modal.error({
          title: '提示',
          content: `文件【${file.name}】已存在, 如需继续上传请去设置中已经上传的文件列表删除`,
        });
        return false;
      }

      // 检查文件类型
      const fileExtension = getFileExtension(file.name);
      const supportedTypes = ['csv', 'xlsx', 'xls'];
      
      if (!supportedTypes.includes(fileExtension)) {
        message.error('不支持的文件格式，仅支持CSV、XLSX文件');
        return false;
      }

      setLoading(true);

      try {
        let parsedData: any[] = [];
        
        // 根据文件类型选择解析方式
        if (fileExtension === 'csv') {
          // CSV文件使用原有的Papa.parse方式
          parsedData = await parseCsvFile(file);
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
          // Excel文件使用xlsx库解析
          parsedData = await parseXlsxFile(file);
        }

        console.log(file, '====aaa');
        console.log(parsedData, '====parsedData');
        const { tableHeader, tableData, success } = handleToTable(parsedData, file.name);
        if (!success) {
          message.error('上传错误文件');
          setLoading(false);
          return false;
        }

        onUploadSuccess({ tableHeader, tableData, fileName: file.name });
        setLoading(false);
      } catch (error) {
        console.error('文件解析错误:', error);
        message.error('文件解析失败，请检查文件格式');
        setLoading(false);
      }

      return false;
    },
  };

  return (
    <div className="upload-wrap mt8">
      <Dragger {...uploadProps}>
        <div className="upload-cus-container">
          <p className="ant-upload-drag-icon">
            <CloudUploadOutlined />
          </p>
          <p className="ant-upload-text">上传账单</p>
          <p className="ant-upload-hint">目前支持微信、支付宝，支持CSV、XLSX文件格式</p>
        </div>
      </Dragger>
    </div>
  );
}

export default UploadSection;
