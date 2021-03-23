import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Line } from "@reactchartjs/react-chart.js";
const BesttagsSection = ({ animatedItem, chartdata, chartlabel }) => {
  const state = useSelector((state) => state.surpinReducer);
  const { tags } = state;
  const [gradient, setGradient] = useState("");
  useEffect(() => {
    var ctx = document.getElementById("myChart").getContext("2d");
    var gradient = ctx.createLinearGradient(0, 25, 0, 300);
    gradient.addColorStop(0, "rgba(149, 76, 233, 0.5)");
    gradient.addColorStop(0.35, "rgba(149, 76, 233, 0.25)");
    gradient.addColorStop(1, "rgba(149, 76, 233, 0)");
    setGradient(gradient);
  }, []);
  return (
    <div className="besttagsSection">
      <div className="besttags__title">Best Tags</div>
      <div {...animatedItem} className="besttags__chart">
        <Line
          id="myChart"
          data={{
            labels: chartlabel,
            datasets: [
              {
                backgroundColor: gradient,
                pointBackgroundColor: "rgba(149, 76, 233, 1)",
                borderColor: "rgba(149, 76, 233, 1)",
                label: "# of Surpins",
                data: chartdata,
                fill: true,
                lineTension: 0.2,
                borderWidth: 2,
                pointRadius: 3,
              },
            ],
          }}
          options={{
            layout: {
              padding: 10,
            },
            responsive: true,
            legend: {
              display: false,
            },
          }}
          scales={{
            xAxes: [
              {
                gridLines: {
                  display: false,
                },
                ticks: {
                  padding: 10,
                  autoSkip: false,
                  maxRotation: 15,
                  minRotation: 15,
                },
              },
            ],
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "My Surpin BEST",
                  padding: 10,
                },
                gridLines: {
                  display: true,
                  color: "rgba(80, 102, 120, 0.25)",
                },
                ticks: {
                  beginAtZero: false,
                  max: 63,
                  min: 57,
                  padding: 10,
                },
              },
            ],
          }}
        />
      </div>
    </div>
  );
};
export default BesttagsSection;
