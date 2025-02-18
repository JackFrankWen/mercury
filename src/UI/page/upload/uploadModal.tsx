import React, { useState } from 'react'
import { Alert, Modal, Upload, UploadProps } from 'antd'
import Papa from 'papaparse'
import { formateToTableJd } from './upload-util'
const { Dragger } = Upload;

const UploadModal = (props: {
    visible: boolean
    onCancel: () => void
    onOk: (type: string, data: any) => void
    needTransferData: {
        hasJingdong: boolean
        hasPdd: boolean
    }
}) => {
    const { visible, onCancel, onOk, needTransferData } = props
    const [fileList, setFileList] = useState([])
    const [tableData, setTableData] = useState([])
    const uploadProps: UploadProps = {
        name: 'file',
        fileList: fileList,
        className: 'upload-cus',
        beforeUpload: (file) => {
            Papa.parse(file, {
                header: false,
                // encoding: 'gb18030',
                skipEmptyLines: true,
                complete: function (results: any) {
                    console.log(results);
                    const csvData = results.data || [];
                    // const csvHeader = csvData.slice(0, 1)
                    try {
                        const csvContent = csvData.slice(1)
                        console.log(csvData, 'csvData');
                        const { name, } = file
                        // 如果文件名包含jd_，则认为是京东的文件
                        const data = formateToTableJd(csvContent)
                        console.log(data,'formateToTableJd');
                    
                    setTableData(data)
                    if (name.includes('jd')) {
                        onOk('jd', tableData)
                        //jd
                    } else if (name.includes('pdd')) {
                        // pdd
                        onOk('pdd', tableData)
                    }

                        setFileList([file])
                    } catch (error) {
                        console.log(error, 'error');
                    }
                },
            });

            // Prevent upload
            return false;
        },
    };
    const handleOk = () => {

    }

    return (<Modal
        open={visible}
        title="上传文件"
        width={500}
        onCancel={onCancel}
        onOk={handleOk}
    >
        <div>
            {
                needTransferData.hasJingdong && (
                    <Alert message="需要上传京东交易记录" type="warning" />
                )
            }
            {
                needTransferData.hasPdd && (
                    <Alert message="需要上传拼多多交易记录" type="warning" />
                )
            }

        </div>
        <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon"></p>
            <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
        </Dragger>

    </Modal>
    )
}

export default UploadModal