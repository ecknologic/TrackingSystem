import React from 'react';
import { Pie } from '@ant-design/charts'

const PieChart = ({ data }) => {
    var config = {
        appendPadding: 10,
        width: 170,
        height: 170,
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
        tooltip: {
            formatter: (datum) => ({ name: datum.type, value: datum.value + '%' })
        },
        label: {
            type: 'inner',
            offset: '-45%',
            autoRotate: false,
            content: function content(_ref) {
                var percent = _ref.percent;
                return ''.concat(Math.round(percent * 100), '%');
            },
            style: {
                fontSize: 22,
                textAlign: 'center',
                fontWeight: 600,
            },
        },
        interactions: [{ type: 'element-active' }],
    };
    return <Pie {...config} />;
}

export default PieChart