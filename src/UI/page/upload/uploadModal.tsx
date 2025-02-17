import React, { useState } from 'react'
import { Modal, Upload, UploadProps } from 'antd'
import Papa from 'papaparse'
const { Dragger } = Upload;

const UploadModal = (props: {
    visible: boolean
    onCancel: () => void
}) => {
    const { visible, onCancel } = props
    const [fileList, setFileList] = useState([])
    const uploadProps: UploadProps = {
        name: 'file',
        fileList: [],
        className: 'upload-cus',
        beforeUpload: (file) => {
            Papa.parse(file, {
                header: false,
                // encoding: 'gb18030',
                skipEmptyLines: true,
                complete: function (results: any) {
                    console.log(results);
                    const csvData = results.data || [];
                    console.log(csvData, 'csvData');
                    console.log(file,'aaa');
                    
                    setFileList(csvData)
                },
            });

            // Prevent upload
            return false;
        },
    };

        return (<Modal
            open={visible}
            title="上传文件"
            width={500}
            // onOk={onOk}
            onCancel={onCancel}
        >
            <div>
             
            </div>
                <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon"></p>
                    <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
            </Dragger>

        </Modal>    
    )
}

export default UploadModal