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

export default ColumnChart;
