import React, { Fragment } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import ScrollUp from '../../../../components/ScrollUp';
import PDFViewer from '../../../../components/PDFViewer';
import { base64String } from '../../../../utils/Functions';
import CustomButton from '../../../../components/CustomButton';
import Spinner from '../../../../components/Spinner';
import NoContent from '../../../../components/NoContent';

const ContentPanel = ({ data, onEdit, onPrint, isLoading }) => {
    const { invoiceId, invoicePdf } = data
    const pdf = base64String(invoicePdf?.data, 'application/pdf')

    return (
        <Fragment>
            <div className='content-header-bar'>
                <span className='title'>{invoiceId}</span>
                <div className='menu-panel'>
                    <CustomButton onClick={() => onEdit(invoiceId)} className='app-cancel-btn' text='Edit' />
                    <CustomButton onClick={(e) => onPrint(e, pdf)} className='app-cancel-btn' text='Print' />
                </div>
            </div>
            <div className='content-body'>
                <Scrollbars renderThumbVertical={Thumb}>
                    <ScrollUp parent='.document-viewer' dep={pdf} />
                    {
                        isLoading ? <NoContent content={<Spinner />} />
                            : <PDFViewer pdf={pdf} />
                    }
                </Scrollbars>
            </div>
        </Fragment>
    )
}

const Thumb = (props) => <div {...props} className="thumb-vertical" />

export default ContentPanel