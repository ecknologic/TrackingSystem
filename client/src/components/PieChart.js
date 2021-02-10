import React from 'react';
import { Pie } from '@ant-design/charts'

const PieChart = () => {

    var data = [
        {
            type: 'Cleared Invoices',
            value: 65,
        },
        {
            type: 'Pending to Clear',
            value: 35,
        }
    ];
    var config = {
        appendPadding: 10,
        // startAngle: 90,
        // endAngle: 360,
        width: 180,
        height: 180,
        autoFit: false,
        data: data,
        angleField: 'value',
        colorField: 'type',
        color: ['#34B53A', '#FFB200'],
        radius: 1,
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
                fontSize: 24,
                textAlign: 'center',
                fontWeight: 600,
            },
        },
        interactions: [{ type: 'element-active' }],
    };
    return <Pie {...config} />;
}

export default PieChart