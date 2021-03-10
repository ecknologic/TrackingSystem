import React, { Component, Fragment, useRef } from 'react';
import ReactToPrint from "react-to-print";
import Scrollbars from 'react-custom-scrollbars-2';
import ScrollUp from '../../../../../components/ScrollUp';
import PDFViewer from '../../../../../components/PDFViewer';
import { base64String } from '../../../../../utils/Functions';
import CustomButton from '../../../../../components/CustomButton';
import Spinner from '../../../../../components/Spinner';
import NoContent from '../../../../../components/NoContent';

class ContentPanel extends Component {

    render() {
        const { data, onPrint, isLoading } = this.props
        const { invoiceId, invoicePdf } = data
        const pdf = base64String(invoicePdf?.data, 'application/pdf')

        return (
            <Fragment>
                <div className='content-header-bar'>
                    <span className='title'>{invoiceId}</span>
                    <div className='menu-panel'>
                        <ReactToPrint content={() => this.componentRef} trigger={() => <CustomButton onClick={(e) => onPrint(e, pdf)} className='app-cancel-btn' text='Print' />} />
                    </div>
                </div>
                <div className='content-body'>
                    <Scrollbars renderThumbVertical={Thumb}>
                        <ScrollUp parent='.document-viewer' dep={pdf} />
                        {
                            isLoading ? <NoContent content={<Spinner />} />
                                : <PDFViewer ref={(el) => (this.componentRef = el)} pdf={pdf} />
                        }
                    </Scrollbars>
                </div>
            </Fragment>
        )
    }
}

const Thumb = (props) => <div {...props} className="thumb-vertical" />

export default ContentPanel