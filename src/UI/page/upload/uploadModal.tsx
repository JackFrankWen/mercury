import React from 'react'
import { Modal } from 'antd'
const UploadModal = (props: {
    visible: boolean
    onCancel: () => void
}) => {
    const { visible, onCancel } = props
    return <Modal
        open={visible}
        onCancel={onCancel}
    >
        
    </Modal>
}

export default UploadModal