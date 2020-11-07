import { Input } from 'antd';
import React, { useState } from 'react';
import { deepClone } from '../utils/Functions';

const ProductAndPrice = ({ onChange }) => {

    const [items, setItems] = useState([])

    const handleProduct = (value, type) => {
        const clone = deepClone(items)
        const product = { productName: type, noOfJarsTobePlaced: value }
        const item = clone.find(item => item.productName === type)

        if (item) {
            const index = clone.indexOf(item)
            const newItem = { ...item, ...product }
            clone[index] = newItem
        } else clone.push(product)

        setItems(clone)
        onChange(clone, 'products')
    }

    const handlePrice = (value, type) => {
        const clone = deepClone(items)
        const price = { productName: type, productPrice: value }
        const item = clone.find(item => item.productName === type)

        if (item) {
            const index = clone.indexOf(item)
            const newItem = { ...item, ...price }
            clone[index] = newItem
        } else clone.push(price)

        setItems(clone)
        onChange(clone, 'products')
    }

    return (
        <>
            <div className='column'>
                <div className='input-container'>
                    <label className='app-input-label-name'>20 Ltrs</label>
                    <Input size='large' placeholder='Add' onChange={({ target: { value } }) => handleProduct(value, '20L')} />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Price</label>
                    <Input size='large' placeholder='Rs' onChange={({ target: { value } }) => handlePrice(value, '20L')} />
                </div>
            </div>
            <div className='column'>
                <div className='input-container'>
                    <label className='app-input-label-name'>1 Ltrs</label>
                    <Input size='large' placeholder='Add' onChange={({ target: { value } }) => handleProduct(value, '1L')} />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Price</label>
                    <Input size='large' placeholder='Rs' onChange={({ target: { value } }) => handlePrice(value, '1L')} />
                </div>
            </div>
            <div className='column'>
                <div className='input-container'>
                    <label className='app-input-label-name'>500 Ml</label>
                    <Input size='large' placeholder='Add' onChange={({ target: { value } }) => handlePrice(value, '500ML')} />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Price</label>
                    <Input size='large' placeholder='Rs' onChange={({ target: { value } }) => handleProduct(value, '500ML')} />
                </div>
            </div>
        </>
    )
}

export default ProductAndPrice