import React, { useRef } from 'react';
import Slider from "react-slick";
import PanelHeader from '../../../../components/PanelHeader';
import EmptyBottlesStockCard from '../../../../components/EmptyBottlesStockCard';
import { LeftChevronIconGrey, RightChevronIconGrey } from '../../../../components/SVG_Icons';

const EmptyBottlesStock = () => {
    const sliderRef = useRef()

    const props = {
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        prevArrow: <LeftChevronIconGrey />,
        nextArrow: <RightChevronIconGrey />,
    }

    return (
        <>
            <PanelHeader title='Empty Bottles Stock' hideShift />
            <div className='panel-body'>
                <Slider className='dashboard-slider empty-bottles-stock-slider' {...props} ref={sliderRef}>
                    <EmptyBottlesStockCard title='20 Ltrs new' total='2345' strokeColor='#F7B500' />
                    <EmptyBottlesStockCard title='20 Ltrs new' total='2345' strokeColor='#4C9400' />
                    <EmptyBottlesStockCard title='1 Ltrs new' total='2345' strokeColor='#41B9AD' />
                    <EmptyBottlesStockCard title='500 ml new' total='2345' strokeColor='#0091FF' />
                    <EmptyBottlesStockCard title='300 ml new' total='2345' strokeColor='#FA6400' />
                </Slider>
            </div>
        </>
    )
}

export default EmptyBottlesStock