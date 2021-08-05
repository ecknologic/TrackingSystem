import React from 'react';
import Spinner from '../../../../../components/Spinner';
import NoContent from '../../../../../components/NoContent';
import { base64String } from '../../../../../utils/Functions';

const ContentPanel = ({ data, isLoading }) => {
    const { invoicePdf } = data
    const pdf = base64String(invoicePdf?.data, 'application/pdf')

    return (
        <div className='content-body'>
            {
                isLoading ? <NoContent content={<Spinner />} />
                    : <iframe src={pdf} width="100%" height="100%"></iframe>
            }
        </div>
    )
}

const Thumb = (props) => <div {...props} className="thumb-vertical" />

export default ContentPanel