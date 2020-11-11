import React, { useEffect } from 'react'
import { Row, Col, Button } from 'antd';
import CustomSelectComponent from '../../components/selectComponent'
import InputField from '../../components/inputField'
import UploadImage from '../../components/UploadImage'
import './customer.css'
const OtherCustomerForm = (props) => {
    useEffect(() => { }, [props])
    const { dropDownChange, inputData, idProofsList, customImageUpload, errors, frontImage, backImage, gstProof, invoiceTypeList, deliveryDetails,
        deliveryInputChange, disabled, inputChange, routesOptions, deliveryDaysList } = props
    let arr = []
    if (deliveryDetails[0].deliveryDays) {
        Object.entries(deliveryDetails[0].deliveryDays).map(([key, value]) => {
            if (value == 1) arr.push(key)
        })
    }
    return <div>
        <Row>
            <CustomSelectComponent
                onChange={(e) => dropDownChange(e, 'idProofType', 'customerData')}
                label="Select Id Proof"
                value={inputData.idProofType}
                colSpan={10}
                options={idProofsList}
                error={errors.idProofType}
            // disabled={disabled}
            />
        </Row>
        <Row>
            <UploadImage
                onUpload={customImageUpload}
                error={errors.frontImage}
                imageValue={frontImage}
                name='frontImage'
                label='Front side'
                colSpan={3}
            />
            <UploadImage
                onUpload={customImageUpload}
                error={errors.backImage}
                imageValue={backImage}
                name='backImage'
                label='Back side'
                colSpan={3}
            />
        </Row>
        <Row>
            <Col span={24}>
                <div>
                    <h4>Please help us verify your identity</h4>
                </div>
                <p>(kindly upload the documents either in JPEG,PNG,PDF format. The file should be lessthan 5MB) Need to be upload front and back.</p>
            </Col>
        </Row>
        <Row>
            {inputData.idProofType == 'Aadhar' ? <InputField colSpan={21} error={errors.adharNo} label="Aadhar NUMBER" disabled={disabled} placeholder="Add Aadhar No" name="adharNo" value={inputData.adharNo} onChange={inputChange} />
                : inputData.idProofType !== '' ? <InputField colSpan={21} error={errors.panNo} label="PAN NUMBER" disabled={disabled} placeholder="Add PAN No" name="panNo" value={inputData.panNo} onChange={inputChange} /> : null
            }
        </Row>
        <Row>
            <Col span={24}>
                <Row>
                    <InputField colSpan={10} error={errors.gstNo} label="GST NUMBER" disabled={disabled} placeholder="Add GST No" name="gstNo" value={inputData.gstNo} onChange={inputChange} />
                    <Col span={2}><Button type="default" style={{ marginTop: "2em" }}>Verify</Button></Col>
                    <UploadImage
                        onUpload={customImageUpload}
                        error={errors.gstProof}
                        imageValue={gstProof}
                        name='gstProof'
                        label='GST Proof'
                        colSpan={3}
                    />
                </Row>
            </Col>
        </Row>
        <InputField colSpan={10} error={errors.customerName} label="NAME" disabled={disabled} placeholder="Add Name" name="customerName" value={inputData.customerName} onChange={inputChange} />
        <Row>
            <InputField colSpan={21} label="ADDRESS" disabled={disabled} error={errors.address} placeholder="Add Address" name="address" value={inputData.address} onChange={inputChange} />
        </Row>
        <Row>
            <InputField colSpan={10} label="PHONE NUMBER" disabled={disabled} error={errors.phoneNumber} placeholder="Add Phone Number" name="phoneNumber" value={inputData.phoneNumber} onChange={inputChange} />
            <InputField colSpan={10} offset={1} label="EMAIL" disabled={disabled} error={errors.email} placeholder="Add Email" name="email" value={inputData.email} onChange={inputChange} />
        </Row>
        <Row>
            <InputField colSpan={10} label='REGISTERED DATE' error={errors.registeredDate} disabled={disabled} placeholder="YYYY-MM-DD" name="registeredDate" value={inputData.registeredDate} onChange={inputChange} />
            <CustomSelectComponent
                onChange={(e) => dropDownChange(e, 'invoicetype', 'customerData')}
                label="Select Invoice Type"
                value={inputData.invoicetype}
                colSpan={10}
                offset={1}
                options={invoiceTypeList}
                error={errors.invoicetype}
            // disabled={disabled}
            />
        </Row>

        <div>
            {deliveryDetails.length ? deliveryDetails.map((delivery, i) =>
                <div>
                    <Row>
                        <InputField colSpan={10} error={errors.referredBy} disabled={disabled} label='REFERED BY' placeholder="Name" name="referredBy" value={inputData.referredBy} onChange={inputChange} />
                        <CustomSelectComponent
                            onChange={(e) => dropDownChange(e, 'routingId')}
                            label="Select Route"
                            offset={1}
                            value={delivery.routingId}
                            colSpan={10}
                            options={routesOptions}
                            error={errors.routingId}
                            disabled={disabled}
                        />
                    </Row>
                    <Row>
                        {/* <InputField colSpan={21} label='ADDRESS' disabled={disabled} placeholder="Add Address" name="address" value={delivery.address} onChange={deliveryInputChange} /> */}
                    </Row>
                    <Row>
                        <InputField colSpan={10} label='PHONE NUMBER' disabled={disabled} placeholder="Add Phone Number" name="phoneNumber" value={delivery.phoneNumber} onChange={deliveryInputChange} />
                        <InputField colSpan={10} offset={1} label='CONTACT PERSON' disabled={disabled} placeholder="Contact Person Name" name="contactPerson" value={delivery.contactPerson} onChange={deliveryInputChange} />
                    </Row>
                    <Row>
                        <InputField colSpan={2} label='20LTRS' disabled={disabled} placeholder="Add" name="quantity20L" value={delivery.quantity20L} onChange={deliveryInputChange} />
                        <InputField colSpan={2} className='priceInput' label='PRICE' disabled={disabled} placeholder="Rs" name="price20L" value={delivery.price20L} onChange={deliveryInputChange} />
                        <InputField colSpan={2} offset={1} label='1LTR' disabled={disabled} placeholder="Add" name="quantity1L" value={delivery.quantity1L} onChange={deliveryInputChange} />
                        <InputField colSpan={2} className='priceInput' label='PRICE' disabled={disabled} placeholder="Rs" name="price1L" value={delivery.price1ML} onChange={deliveryInputChange} />
                        <InputField colSpan={2} offset={1} label='500ML' disabled={disabled} placeholder="Add" name="quantity500ML" value={delivery.quantity500ML} onChange={deliveryInputChange} />
                        <InputField colSpan={2} className='priceInput' label='PRICE' disabled={disabled} placeholder="Rs" name="price500ML" value={delivery.price500ML} onChange={deliveryInputChange} />
                        <InputField colSpan={2} offset={1} label='250ML' disabled={disabled} placeholder="Add" name="quantity250ML" value={delivery.quantity250ML} onChange={deliveryInputChange} />
                        <InputField colSpan={2} className='priceInput' label='PRICE' disabled={disabled} placeholder="Rs" name="price250ML" value={delivery.price250ML} onChange={deliveryInputChange} />
                    </Row>
                    <Row>
                        <CustomSelectComponent
                            onChange={(e) => dropDownChange(e, 'deliveryDays')}
                            label="DELIVERY DAYS"
                            mode="multiple"
                            value={arr}
                            colSpan={10}
                            options={deliveryDaysList}
                            error={errors.deliveryDays}
                            disabled={disabled}
                        />
                        <InputField colSpan={10} offset={1} label='DEPOSIT AMOUNT' disabled={disabled} placeholder="Amount" name="depositAmount" value={delivery.depositAmount} onChange={deliveryInputChange} />
                    </Row>
                </div>
            ) : null}
        </div>
    </div>
}
export default OtherCustomerForm;