import { Input } from 'antd';
import React, { useEffect, useState } from 'react';

const ProductAndPrice = ({ data, getId, onGet }) => {

    const [product1, setProduct1] = useState('')
    const [product2, setProduct2] = useState('')
    const [product3, setProduct3] = useState('')
    const [price1, setPrice1] = useState('')
    const [price2, setPrice2] = useState('')
    const [price3, setPrice3] = useState('')

    useEffect(() => { // To pre-fill the form
        if (data) {
            data.map((item) => {
                const { productName, noOfJarsTobePlaced, productPrice } = item
                if (productName === '20L') { setProduct1(noOfJarsTobePlaced); setPrice1(productPrice) }
                else if (productName === '1L') { setProduct2(noOfJarsTobePlaced); setPrice2(productPrice) }
                else if (productName === '500ML') { setProduct3(noOfJarsTobePlaced); setPrice3(productPrice) }
            })
        }
    }, [data])

    useEffect(() => { // send data to parent
        if (getId) {
            const item1 = { productName: '20L', productPrice: price1, noOfJarsTobePlaced: product1 }
            const item2 = { productName: '1L', productPrice: price2, noOfJarsTobePlaced: product2 }
            const item3 = { productName: '500ML', productPrice: price3, noOfJarsTobePlaced: product3 }
            const data = []
            if (price1 && product1) data.push(item1)
            if (price2 && product2) data.push(item2)
            if (price3 && product3) data.push(item3)
            onGet(data)
        }
    }, [getId])

    return (
        <>
            <div className='column'>
                <div className='input-container'>
                    <label className='app-input-label-name'>20 Ltrs</label>
                    <Input size='large' value={product1} placeholder='Add' onChange={({ target: { value } }) => setProduct1(value)} />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Price</label>
                    <Input size='large' value={price1} placeholder='Rs' onChange={({ target: { value } }) => setPrice1(value)} />
                </div>
            </div>
            <div className='column'>
                <div className='input-container'>
                    <label className='app-input-label-name'>1 Ltrs</label>
                    <Input size='large' value={product2} placeholder='Add' onChange={({ target: { value } }) => setProduct2(value)} />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Price</label>
                    <Input size='large' value={price2} placeholder='Rs' onChange={({ target: { value } }) => setPrice2(value)} />
                </div>
            </div>
            <div className='column'>
                <div className='input-container'>
                    <label className='app-input-label-name'>500 Ml</label>
                    <Input size='large' value={product3} placeholder='Add' onChange={({ target: { value } }) => setProduct3(value)} />
                </div>
                <div className='input-container'>
                    <label className='app-input-label-name'>Price</label>
                    <Input size='large' value={price3} placeholder='Rs' onChange={({ target: { value } }) => setPrice3(value)} />
                </div>
            </div>
        </>
    )
}

export default ProductAndPrice