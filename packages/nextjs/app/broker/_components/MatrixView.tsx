"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// async function fetchBundleInfo(bundleId: string) {
//   //  return a color based on bundleId randomly
//   const colors = ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"];
//   const color = colors[Math.floor(Math.random() * colors.length)];
//   return color;
// }
export function MatrixView({ bundles }: { bundles: Array<any> }) {
  const series: { name: string; data: any[] }[] = [];
  const [bundleId, setBundleId] = useState<number>();
  const numberOfColumns = 16; // Previously numberOfRows
  const numberOfRows = 6; // Previously numberOfColumns

  for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
    const rowData: {
      name: string;
      data: any[];
    } = { name: `Vault`, data: [] };

    for (let colIndex = 0; colIndex < numberOfColumns; colIndex++) {
      // Invert the row index to start from the bottom
      const cellValue = rowIndex * numberOfColumns + colIndex;
      const cellColor = "#D3D3D3"; // Assign a random color
      rowData.data.push({
        x: `Col ${colIndex + 1}`,
        y: cellValue,
        fillColor: cellColor, // Add the random color here
      });
    }
    series.push(rowData);
  }

  const handleCellClick = (event: any, chartContext: any, { seriesIndex, dataPointIndex }: any) => {
    const bundleId = seriesIndex * numberOfColumns + dataPointIndex;
    setBundleId(bundleId);
  };

  const state = {
    options: {
      states: {
        normal: {
          filter: {
            type: "none",
            value: 0,
          },
        },
        hover: {
          filter: {
            type: "lighten",
            value: 0.15,
          },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: "darken",
            value: 1,
          },
        },
      },
      legend: {
        show: false,
        onItemClick: {
          toggleDataSeries: true,
        },
        onItemHover: {
          highlightDataSeries: false,
        },
      },
      chart: {
        events: {
          dataPointSelection: handleCellClick,
        },
        toolbar: {
          show: false,
        },
        width: "100%",
      },
      tooltip: {
        x: {
          show: false,
        },
      },

      stroke: {
        width: 2,
        colors: ["black"],
      },
      plotOptions: {
        heatmap: {
          radius: 2,
          enableShades: true,
          useFillColorAsStroke: false,

          shadeIntensity: 0.5,
          distributed: true, // Ensure colors are applied per-cell
          colorScale: {
            inverse: true,
            ranges: series.flatMap(row =>
              row.data.map(cell => ({
                from: cell.y,
                to: cell.y,
                color: cell.fillColor,
              })),
            ),
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: "category",
        categories: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"],
        labels: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
    },
    series,
  };

  console.log("series", JSON.stringify(series));

  const legendItems = [
    { color: "gray", label: "Empty" },
    { color: "lightblue", label: "Open" },
    { color: "orange", label: "Messages to Process" },
    { color: "green", label: "Locked" },
    { color: "red", label: "Burned" },
  ];

  return (
    <div>
      {typeof window !== "undefined" && state && state.options && state.series && (
        <Chart height={300} options={state.options as any} series={state.series as any} type="heatmap" width={500} />
      )}
      <div
        className="legend"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {legendItems.map((item, index) => (
          <div
            key={index}
            className="legend-item"
            style={{
              display: "flex",
              flexDirection: "row",
              marginRight: "0.5rem",
              justifyContent: "space-between",
            }}
          >
            <div className="legend-label">
              <span
                style={{
                  color: item.color,
                  fontSize: "1.5rem",
                  marginRight: "0.3rem",
                }}
              >
                ■
              </span>
              {item.label}
            </div>
          </div>
        ))}
      </div>
      <br></br>
    </div>
  );
}