import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import React, { Fragment, useEffect, useMemo, useState, useCallback } from 'react';
import Header from './header';
import { http } from '../../../modules/http'
import CreateInvoice from '../tabs/CreateInvoice';
import QuitModal from '../../../components/CustomModal';
import ConfirmMessage from '../../../components/ConfirmMessage';
import { getMainPathname } from '../../../utils/Functions';
import { TRACKFORM } from '../../../utils/constants';
import '../../../sass/employees.scss'

const EditInvoice = () => {
    const history = useHistory()
    const { pathname } = useLocation()
    const [headerContent, setHeaderContent] = useState({})
    const [confirmModal, setConfirmModal] = useState(false)

    const mainUrl = useMemo(() => getMainPathname(pathname), [pathname])
    const source = useMemo(() => axios.CancelToken.source(), []);

    useEffect(() => {
        getInvoice()

        return () => {
            http.ABORT(source)
        }
    }, [])

    const getInvoice = async () => {

    }

    const handleConfirmModalCancel = useCallback(() => setConfirmModal(false), [])
    const handleConfirmModalOk = useCallback(() => { setConfirmModal(false); goBack() }, [])

    const handleBack = () => {
        const formHasChanged = sessionStorage.getItem(TRACKFORM)
        if (formHasChanged) {
            setConfirmModal(true)
        }
        else goBack()
    }

    const goBack = () => history.push(mainUrl)

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
