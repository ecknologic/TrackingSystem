import dayjs from 'dayjs';
import { Collapse } from 'antd';
import React, { useEffect } from 'react';
import InputValue from '../../../components/InputValue';
import InputLabel from '../../../components/InputLabel';
import CustomInput from '../../../components/CustomInput';
import SelectInput from '../../../components/SelectInput';
import { DDownIcon } from '../../../components/SVG_Icons';
import CollapseHeader from '../../../components/CollapseHeader';
import CustomTextArea from '../../../components/CustomTextArea';
import { getStatusColor, resetTrackForm, trackAccountFormOnce } from '../../../utils/Functions';

const ProductionQCForm = (props) => {

    const { QCList, data, errors, disabled, onChange, batchOptions, testResultOptions, onBlur } = props
    const { phLevel, TDS, ozoneLevel, testResult, managerName, testType, description, productionQcId } = data

    useEffect(() => {
        resetTrackForm()
        trackAccountFormOnce()

        return () => {
            resetTrackForm()
        }
    }, [])

    return (
        <>
            <div className='app-form-container qc-form-container'>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Select Batch No' error={errors.productionQcId} mandatory />
                        <SelectInput track value={productionQcId} options={batchOptions}
                            disabled={disabled} error={errors.productionQcId}
                            onSelect={(value) => onChange(value, 'productionQcId')}
                        />
                    </div>
                </div>
                <Collapse
                    accordion
                    className='accordion-container'
                    expandIcon={({ isActive }) => isActive ? <DDownIcon className='rotate-180' /> : <DDownIcon className='app-trans' />}
                    expandIconPosition='right'
                >
                    {
                        QCList.map((item) => {
                            const { qcLevel, ozoneLevel, phLevel, tds, managerName, testedDate, testResult } = item
                            const date = testedDate ? dayjs(testedDate).format('DD/MM/YYYY') : null
                            const time = testedDate ? dayjs(testedDate).format('hh:mm A') : null

                            const color = getStatusColor(testResult)

                            return (
                                <Panel key={qcLevel} header={<CollapseHeader title={`Level-${qcLevel} Test`} extra={<InputValue size='smaller' value={testResult} />} />}>
                                    <>
                                        <div className='row half-stretch'>
                                            <div className='input-container'>
                                                <InputLabel name='Date' />
                                                <InputValue size='larger' value={date || '--'} />
                                            </div>
                                            <div className='input-container'>
                                                <InputLabel name='Time' />
                                                <InputValue size='larger' value={time || '--'} />
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='input-container'>
                                                <InputLabel name='PH' />
                                                <InputValue size='larger' value={phLevel || '--'} />
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='input-container'>
                                                <InputLabel name='Ozone Level (Mg/Litre)' />
                                                <InputValue size='larger' value={ozoneLevel || '--'} />
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='input-container'>
                                                <InputLabel name='Total Dissolved Solids (TDS - mg/litre)' />
                                                <InputValue size='larger' value={tds || '--'} />
                                            </div>
                                        </div>
                                        <div className='row half-stretch'>
                                            <div className='input-container'>
                                                <InputLabel name='Manager' />
                                                <InputValue size='larger' value={managerName || '--'} />
                                            </div>
                                            <div className='input-container'>
                                                <InputLabel name='Status' />
                                                <span className='app-dot' style={{ background: color }}></span>
                                                <InputValue size='smaller' value={testResult} />
                                            </div>
                                        </div>
                                    </>
                                </Panel>
                            )
                        })
                    }
                </Collapse>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='PH' error={errors.phLevel} mandatory />
                        <CustomInput value={phLevel} placeholder='Add PH'
                            disabled={disabled} error={errors.phLevel}
                            onBlur={(value) => onBlur(value, 'phLevel')}
                            onChange={(value) => onChange(value, 'phLevel')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Ozone Level (mg/Litre)' error={errors.ozoneLevel} mandatory />
                        <CustomInput value={ozoneLevel} placeholder='Add Ozone Level'
                            disabled={disabled} error={errors.ozoneLevel}
                            onBlur={(value) => onBlur(value, 'ozoneLevel')}
                            onChange={(value) => onChange(value, 'ozoneLevel')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Total Dissolved Solids (TDS - mg/litre)' mandatory />
                        <CustomInput value={TDS} placeholder='Add Total Dissolved Solids'
                            disabled={disabled} error={errors.TDS}
                            onBlur={(value) => onBlur(value, 'TDS')}
                            onChange={(value) => onChange(value, 'TDS')}
                        />
                        <InputLabel error={errors.TDS} />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Test Results' error={errors.testResult} mandatory />
                        <SelectInput track value={testResult} options={testResultOptions}
                            disabled={disabled} error={errors.testResult}
                            onSelect={(value) => onChange(value, 'testResult')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container'>
                        <InputLabel name='Test Type' error={errors.testType} mandatory />
                        <CustomInput value={testType} placeholder='Add Test Type'
                            disabled={disabled} error={errors.testType}
                            onChange={(value) => onChange(value, 'testType')}
                        />
                    </div>
                    <div className='input-container'>
                        <InputLabel name='Manager Name' error={errors.managerName} mandatory />
                        <CustomInput value={managerName} placeholder='Add Manager Name'
                            disabled={disabled} error={errors.managerName}
                            onChange={(value) => onChange(value, 'managerName')}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='input-container stretch'>
                        <InputLabel name='Test Description' error={errors.description} mandatory />
                        <CustomTextArea maxLength={100} error={errors.description} placeholder='Add Description' value={description}
                            maxRows={4} onChange={(value) => onChange(value, 'description')}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
const { Panel } = Collapse
export default ProductionQCForm