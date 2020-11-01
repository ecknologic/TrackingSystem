import React, { useEffect } from 'react';
import { Row, Button } from 'antd';
import InputField from '../../components/inputField';
import CustomSelectComponent from '../../components/selectComponent';
const DeliveryDetailsForm = (props) => {
    useEffect(() => {
    }, [props])
    const { routesOptions, errors, saveDeliveryDetails, dropDownChange, deliveryDaysList, deliveryInputChange, disabled, delivery, index } = props;
    let arr = []
    if (delivery.deliveryDays) {
        Object.entries(delivery.deliveryDays).map(([key, value]) => {
            if (value == 1) arr.push(key)
        })
    }
    return <div>
        <Row>
            <InputField colSpan={10} label='GST NO' disabled={disabled} placeholder="GST No" name="gstNo" value={delivery.gstNo} onChange={deliveryInputChange} />
        </Row>
        <Row>
            <InputField colSpan={10} label='DELIVERY LOCATION' disabled={disabled} placeholder="Add Delivery Location" name="deliveryLocation" value={delivery.deliveryLocation} onChange={deliveryInputChange} />
            <CustomSelectComponent
                onChange={(e) => dropDownChange(e, 'routingId', null, index)}
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
            <InputField colSpan={21} label='ADDRESS' disabled={disabled} placeholder="Add Address" name="address" value={delivery.address} onChange={deliveryInputChange} />
        </Row>
        <Row>
            <InputField colSpan={10} label='PHONE NUMBER' disabled={disabled} placeholder="Add Phone Number" name="phoneNumber" value={delivery.phoneNumber} onChange={deliveryInputChange} />
            <InputField colSpan={10} offset={1} label='CONTACT PERSON' disabled={disabled} placeholder="Contact Person Name" name="contactPerson" value={delivery.contactPerson} onChange={deliveryInputChange} />
        </Row>
        <Row>
            {/* {delivery.products.length && delivery.products.map((product, productIndex) =>
                <Col span={2}>
                    <InputField colSpan={12} label={product.productName} disabled={disabled} placeholder="Add" name={product.noOfJarsTobePlaced} value={product.noOfJarsTobePlaced} onChange={(e) => deliveryInputChange(e, product.productName, productIndex)} />
                    <InputField colSpan={12} className='priceInput' label='PRICE' disabled={disabled} placeholder="Rs" name={product.productPrice} value={product.productPrice} onChange={(e) => deliveryInputChange(e, product.productName, productIndex)} />
                </Col>
            )} */}
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
                onChange={(e) => dropDownChange(e, 'deliveryDays', null, index)}
                label="DELIVERY DAYS"
                mode="multiple"
                value={arr || undefined}
                colSpan={10}
                options={deliveryDaysList}
                error={errors.deliveryDays}
                disabled={disabled}
            />
            <InputField colSpan={10} offset={1} label='DEPOSIT AMOUNT' disabled={disabled} placeholder="Amount" name="depositAmount" value={delivery.depositAmount} onChange={deliveryInputChange} />

        </Row>
        {/* <Button onClick={() => saveDeliveryDetails(index)}>Save Details</Button> */}
    </div>
}
export default DeliveryDetailsForm;