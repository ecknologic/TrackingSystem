import { useHistory } from 'react-router-dom';
import React, { Fragment, useState, useCallback } from 'react';
import Header from './header';
import CreateInvoice from '../tabs/CreateInvoice';
import { TRACKFORM } from '../../../../utils/constants';
import QuitModal from '../../../../components/CustomModal';
import ConfirmMessage from '../../../../components/ConfirmMessage';
import '../../../../sass/employees.scss'

const EditInvoice = () => {
    const history = useHistory()
    const [headerContent, setHeaderContent] = useState({})
    const [confirmModal, setConfirmModal] = useState(false)

    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])
    const handleConfirmModalOk = useCallback(() => { setConfirmModal(false); goBack() }, [])

    const handleBack = () => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged) {
            setConfirmModal(true)
        }
        else goBack()
    }

    const goBack = () => history.push('/invoices')

    return (
        <Fragment>
            <Header data={headerContent} onClick={handleBack} />
            <div className='invoice-content'>
                <CreateInvoice editMode setHeader={setHeaderContent} />
            </div>
            <QuitModal
                visible={confirmModal}
                onOk={handleConfirmModalOk}
                onCancel={handleConfirmModalCancel}
                title='Are you sure you want to leave?'
                okTxt='Yes'
            >
                <ConfirmMessage msg='Changes you made may not be saved.' />
            </QuitModal>
        </Fragment>
    )
}

export default EditInvoice
