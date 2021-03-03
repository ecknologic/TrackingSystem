import React from "react";
import { Column } from "@ant-design/charts";

const ColumnChart = ({ data, columnWidthRatio = .35 }) => {

  var config = {
    data,
    width: '100%',
    isGroup: true,
    xField: "label",
    yField: "value",
    seriesField: "name",
    color: ["#8C54FF", "#2EB3FF", "#F7B500", "#33CBCC", "#62BE9D"],
    legend: false,
    yAxis: false,
    columnWidthRatio,
    marginRatio: .7,
    xAxis: {
      line: null,
      label: {
        style: {
          fill: "#B0BAC9",
          fontSize: 15,
          fontFamily: 'PoppinsRegular400',
        }
      }
    }
  };
  return <Column {...config} />;
};

const weekData = [
  {
    name: "20 Ltrs",
    label: "Mon",
    value: 12.4
  },
  {
    name: "2 Ltrs",
    label: "Mon",
    value: 23.4
  },
  {
    name: "1 Ltrs",
    label: "Mon",
    value: 28.8
  },
  {
    name: "500 ml",
    label: "Mon",
    value: 39.3
  },
  {
    name: "300 ml",
    label: "Mon",
    value: 59.3
  },
  {
    name: "20 Ltrs",
    label: "Tue",
    value: 32.4
  },
  {
    name: "2 Ltrs",
    label: "Tue",
    value: 23.4
  },
  {
    name: "1 Ltrs",
    label: "Tue",
    value: 40.8
  },
  {
    name: "500 ml",
    label: "Tue",
    value: 34.3
  },
  {
    name: "300 ml",
    label: "Tue",
    value: 29.3
  },
  {
    name: "20 Ltrs",
    label: "Wed",
    value: 32.4
  },
  {
    name: "2 Ltrs",
    label: "Wed",
    value: 52.4
  },
  {
    name: "1 Ltrs",
    label: "Wed",
    value: 28.8
  },
  {
    name: "500 ml",
    label: "Wed",
    value: 59.3
  },
  {
    name: "300 ml",
    label: "Wed",
    value: 29.3
  },
  {
    name: "20 Ltrs",
    label: "Thu",
    value: 52.4
  },
  {
    name: "2 Ltrs",
    label: "Thu",
    value: 42.4
  },
  {
    name: "1 Ltrs",
    label: "Thu",
    value: 58.8
  },
  {
    name: "500 ml",
    label: "Thu",
    value: 39.3
  },
  {
    name: "300 ml",
    label: "Thu",
    value: 19.3
  },
  {
    name: "20 Ltrs",
    label: "Fri",
    value: 12.4
  },
  {
    name: "2 Ltrs",
    label: "Fri",
    value: 52.4
  },
  {
    name: "1 Ltrs",
    label: "Fri",
    value: 18.8
  },
  {
    name: "500 ml",
    label: "Fri",
    value: 49.3
  },
  {
    name: "300 ml",
    label: "Fri",
    value: 59.3
  },
  {
    name: "20 Ltrs",
    label: "Sat",
    value: 42.4
  },
  {
    name: "2 Ltrs",
    label: "Sat",
    value: 12.4
  },
  {
    name: "1 Ltrs",
    label: "Sat",
    value: 48.8
  },
  {
    name: "500 ml",
    label: "Sat",
    value: 29.3
  },
  {
    name: "300 ml",
    label: "Sat",
    value: 59.3
  },
  {
    name: "20 Ltrs",
    label: "Sun",
    value: 22.4
  },
  {
    name: "2 Ltrs",
    label: "Sun",
    value: 12.4
  },
  {
    name: "1 Ltrs",
    label: "Sun",
    value: 58.8
  },
  {
    name: "500 ml",
    label: "Sun",
    value: 39.3
  },
  {
    name: "300 ml",
    label: "Sun",
    value: 49.3
  },
];

export default ColumnChart;
