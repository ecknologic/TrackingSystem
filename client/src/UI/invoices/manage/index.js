import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import Header from './header';
import '../../../sass/invoices.scss';

const Invoices = () => {

    const history = useHistory()

    const onAdd = () => history.push('/invoices/2')
    const handleBack = () => history.push('/invoices')

    return (
        <Fragment>
            <Header onAdd={onAdd} onClick={handleBack} />
            <div className='invoice-manage-content'>

            </div >
        </Fragment >
    )
}
export default Invoices