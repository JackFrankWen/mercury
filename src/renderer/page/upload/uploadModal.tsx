import React, { useState } from 'react'
import { Alert, message, Modal, Upload, UploadProps, Spin } from 'antd'
import Papa from 'papaparse'
import { formateToTableJd } from './upload-util'
const { Dragger } = Upload;

const UploadModal = (props: {
    goStep3: () => void
    onCancel: () => void
    onOk: (type: string, data: any) => void
    setLoading: (loading: boolean) => void
    visible: boolean
    needTransferData: {
        hasJingdong: boolean
        hasPdd: boolean
    }
}) => {
    const { visible, onCancel, onOk, needTransferData, goStep3, setLoading, } = props
    const [modalLoading, setModalLoading] = useState(false)
    const [fileList, setFileList] = useState([])
    const uploadProps: UploadProps = {
        name: 'file',
        fileList: fileList,
        className: 'upload-cus mt8',
        beforeUpload: (file) => {
            setModalLoading(true)
            setLoading(true)
            setTimeout(() => {
                Papa.parse(file, {
                    header: false,
                    // encoding: 'gb18030',
                    skipEmptyLines: true,
                    complete: function (results: any) {
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

                                } else {
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
                            } else {
                                message.error('上传错误文件')
                            }

                            setFileList([file])
                        } catch (error) {
                            console.log(error, 'error');
                        }
                    },
                });
            }, 0)

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
        okText="直接跳过"
    >
        <Spin spinning={modalLoading}>
            <div className="mb8">
                {
                    needTransferData.hasJingdong && (
                        <Alert message="请上传京东csv文件，或者跳过替换，直接提交！" type="warning" />
                    )
                }
                {
                    needTransferData.hasPdd && (
                        <Alert message="请上传拼多多csv文件，或者跳过替换，直接提交！！！" type="warning" />
                    )
                }

            </div>
            <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon"></p>
                <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
            </Dragger>
        </Spin>

    </Modal>
    )
}

export default UploadModal