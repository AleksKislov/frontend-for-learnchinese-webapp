import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Chart } from "react-google-charts";
import axios from "axios";

const Analytics = () => {
  const fetchData = async () => {
    const { data } = await axios.get("/api/users/reading_results");
    console.log(data);
    setstate(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [state, setstate] = useState(null);

  const options = {
    // title: "Чтение каждый день",
    hAxis: { title: "Дата", viewWindow: { min: 1 } },
    vAxis: { title: "Прочитано, 字", viewWindow: { min: 1, max: 2000 } },
    legend: "none",
    seriesType: "area",
    series: {
      0: { pointShape: "circle", pointSize: 8 },
      1: { type: "line" }
    }
  };

  const rows = [
    [1, 250, 500],
    [2, 290, 800],
    [3, 798, 1000],
    [4, 1200, 1000],
    [5, 1200, 1000],
    [6, 684, 1200],
    [7, 234, 1000],
    [8, 912, 1000],
    [9, 662, 1000]
  ];

  const dataDiv = state ? <div>yes</div> : <div>no</div>;

  return (
    <div className=''>
      {dataDiv}
      <Chart
        columns={[
          {
            type: "number",
            label: "Дата"
          },
          {
            type: "number",
            label: "Прочитано, 字"
          },
          {
            type: "number",
            label: "Цель, 字"
          }
        ]}
        chartType='ComboChart'
        rows={rows}
        options={options}
        width='100%'
        height='400px'
        legendToggle
      />
    </div>
  );
};

const mapStateTioProps = state => ({
  comments: state.comments.lastComments,
  loading: state.posts.loading
});

export default connect(mapStateTioProps, {})(Analytics);
