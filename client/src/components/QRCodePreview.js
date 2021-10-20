import React from 'react';
import { base64ToURL } from '../utils/Functions';
import { DownloadOutlined } from '@ant-design/icons';
import '../sass/qrCodePreview.scss'

const QRCodePreview = ({ base64, fileName, className }) => {

    const handleDownload = async () => {
        const link = document.createElement('a')
        link.href = await base64ToURL(base64)
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className={className}>
            <img src={base64} alt='QR code' />
            <DownloadOutlined className='qr-dw-icon' onClick={handleDownload} />
        </div>
    )
}

export default QRCodePreview