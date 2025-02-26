import React, { useState } from 'react'
import { Alert, message, Modal, Upload, UploadProps } from 'antd'
import Papa from 'papaparse'
import { formateToTableJd } from './upload-util'
const { Dragger } = Upload;

const UploadModal = (props: {
    visible: boolean
    goStep3: () => void
    onCancel: () => void
    onOk: (type: string, data: any) => void
    needTransferData: {
        hasJingdong: boolean
        hasPdd: boolean
    }
}) => {
    const { visible, onCancel, onOk, needTransferData, goStep3 } = props
    const [fileList, setFileList] = useState([])
    const uploadProps: UploadProps = {
        name: 'file',
        fileList: fileList,
        className: 'upload-cus mt8',
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
                        let data 
                    
                    if (name.includes('jd')) {
                        data = formateToTableJd(csvContent, 'jd')
                        if (needTransferData.hasJingdong) {
                            onOk('jd', data)

                        }  else {
                            message.error('上传错误文件')
                        }
                       //jd
                    } else if (name.includes('pdd')) {
                        if (needTransferData.hasPdd) {
                            data = formateToTableJd(csvContent, 'pdd')
                            onOk('pdd', data)
                        } else {
                            message.error('上传错误文件')
                        }
                        // pdd
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
        goStep3()
    }

    return (<Modal
        open={visible}
        title="上传文件"
        width={500}
        onCancel={onCancel}
        onOk={handleOk}
        okText="开始AI分类"
    >
        <div className="mb8">
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