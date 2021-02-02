import React from "react";
import { Column } from "@ant-design/charts";

const ColumnChart = () => {
  var data = [
    {
      name: "London",
      label: "Jan",
      value: 18.9
    },
    {
      name: "London",
      label: "Feb",
      value: 28.8
    },
    {
      name: "London",
      label: "Mar",
      value: 39.3
    },
    {
      name: "London",
      label: "Apr",
      value: 81.4
    },
    {
      name: "London",
      label: "May",
      value: 47
    },
    {
      name: "London",
      label: "Jun",
      value: 20.3
    },
    {
      name: "London",
      label: "Jul",
      value: 24
    },
    {
      name: "London",
      label: "Aug",
      value: 35.6
    },
    {
      name: "Berlin",
      label: "Jan",
      value: 12.4
    },
    {
      name: "Berlin",
      label: "Feb",
      value: 23.2
    },
    {
      name: "Berlin",
      label: "Mar",
      value: 34.5
    },
    {
      name: "Berlin",
      label: "Apr",
      value: 99.7
    },
    {
      name: "Berlin",
      label: "May",
      value: 52.6
    },
    {
      name: "Berlin",
      label: "Jun",
      value: 35.5
    },
    {
      name: "Berlin",
      label: "Jul",
      value: 37.4
    },
    {
      name: "Berlin",
      label: "Aug",
      value: 42.4
    }
  ];
  var config = {
    data: data,
    // height: 200,
    // autoFit: false,
    isGroup: true,
    xField: "label",
    yField: "value",
    seriesField: "name",
    color: ["#d62728", "#2ca02c", "#000000"],
    legend: false,
    yAxis: false,
    columnStyle: {
      cursor: "pointer"
    },
    columnWidthRatio: .3,
    marginRatio: .5,
    xAxis: {
      line: null,
      label: {
        style: {
          fill: "red",
          fontSize: 24,
          fontFamily: 'PoppinsRegular400',
        }
      }
    }
  };
  return <Column {...config} />;
};

export default ColumnChart;
