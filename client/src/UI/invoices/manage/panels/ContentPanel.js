import React, { Fragment } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import ScrollUp from '../../../../components/ScrollUp';
import PDFViewer from '../../../../components/PDFViewer';
import { base64String } from '../../../../utils/Functions';
import CustomButton from '../../../../components/CustomButton';
import { EditIconGrey } from '../../../../components/SVG_Icons';
// import b64 from './data.json'

const ContentPanel = ({ data, onEdit }) => {
    const { invoiceId, invoicePdf } = data
    const pdf = base64String(invoicePdf?.data, 'application/pdf')
    // const pdf = b64.data

    return (
        <Fragment>
            <div className='content-header-bar'>
                <span className='title'>{invoiceId}</span>
                <div className='menu-panel'>
                    <CustomButton onClick={() => onEdit(invoiceId)} className='app-cancel-btn' text='Edit' icon={<EditIconGrey />} />
                </div>
            </div>

            <div className='content-body'>
                <Scrollbars renderThumbVertical={Thumb}>
                    <ScrollUp parent='.document-viewer' dep={invoiceId} />
                    <PDFViewer pdf={pdf} />
                </Scrollbars>
            </div>
        </Fragment>
    )
}

const Thumb = (props) => <div {...props} className="thumb-vertical" />

export default ContentPanel