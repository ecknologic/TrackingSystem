import React, { useRef } from 'react';
import Slider from "react-slick";
import PanelHeader from '../../../../components/PanelHeader';
import StackCard from '../../../../components/StackCard';
import { LeftChevronIconGrey, RightChevronIconGrey } from '../../../../components/SVG_Icons';

const TotalStackStatus = () => {
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
            <PanelHeader title='Total Stack Status' />
            <div className='panel-body'>
                <Slider className='dashboard-slider' {...props} ref={sliderRef}>
                    <StackCard title='20 Ltrs' total='2345' />
                    <StackCard title='2 Ltrs' total='2345' />
                    <StackCard title='1 Ltrs' total='2345' />
                    <StackCard title='500 ml' total='2345' />
                    <StackCard title='300 ml' total='2345' />
                </Slider>
            </div>
        </>
    )
}

export default TotalStackStatus