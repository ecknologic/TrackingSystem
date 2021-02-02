import React from 'react';
import { Pie } from '@ant-design/charts'

const PieChart = () => {

    var data = [
        {
            type: 'a',
            value: 35,
        },
        {
            type: 'b',
            value: 65,
        }
    ];
    var config = {
        appendPadding: 10,
        // startAngle: 90,
        // endAngle: 360,
        data: data,
        angleField: 'value',
        colorField: 'type',
        color: ['#34B53A', '#FFB200'],
        radius: 0.8,
        legend: false,
        pieStyle: {
            lineWidth: 0,
            lineDash: [0, 0],
            strokeOpacity: 0.5
        },
        label: {
            type: 'inner',
            offset: '-50%',
            autoRotate: false,
            content: function content(_ref) {
                var percent = _ref.percent;
                return ''.concat(percent * 100, '%');
            },
            style: {
                fontSize: 30,
                textAlign: 'center',
                fontWeight: 600,
            },
        },
        interactions: [{ type: 'element-active' }],
    };
    return <Pie {...config} />;
}

export default PieChart