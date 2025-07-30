"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Dot,
  LabelList,
} from "recharts";

interface ChartData {
  name: string;
  [key: string]: string | number;
}

interface InteractiveChartProps {
  data: ChartData[];
  xAxisDataKey: string;
  lineDataKeys?: string[];
  barDataKeys?: string[];
  title: string;
  chartType: "line" | "bar";
}

const InteractiveChart = ({
  data,
  xAxisDataKey,
  lineDataKeys = [],
  barDataKeys = [],
  title,
  chartType,
}: InteractiveChartProps) => {
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#387908",
    "#d0ed57",
    "#a4de6c",
  ];

  const ChartComponent = chartType === "line" ? LineChart : BarChart;

  const values = data.flatMap((d) =>
    (chartType === "line" ? lineDataKeys : barDataKeys).map(
      (key) => d[key] as number
    )
  );
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  const renderCustomizedDot = (props: {
    cx?: number;
    cy?: number;
    value?: number;
    payload?: ChartData;
    index?: number;
  }) => {
    const { cx, cy, value, payload, index } = props;
    const key = `dot-${index || 0}-${payload?.name || cx}-${value}`;
    const isLastDataPoint = index === data.length - 1;

    if (value === maxValue) {
      return (
        <Dot
          key={key}
          cx={cx}
          cy={cy}
          r={8}
          fill="#ff0000"
          stroke="#fff"
          strokeWidth={2}
        />
      );
    }
    if (value === minValue) {
      return (
        <Dot
          key={key}
          cx={cx}
          cy={cy}
          r={8}
          fill="#0000ff"
          stroke="#fff"
          strokeWidth={2}
        />
      );
    }
    if (isLastDataPoint) {
      return (
        <Dot
          key={key}
          cx={cx}
          cy={cy}
          r={8}
          fill="#016630"
          stroke="#fff"
          strokeWidth={2}
        />
      );
    }
    return <Dot key={key} cx={cx} cy={cy} r={3} fill="#8884d8" />;
  };

  const CustomizedLabel = (props: {
    x?: number;
    y?: number;
    value?: number;
    index?: number;
  }) => {
    const { x, y, value, index } = props;
    let labelText = "";
    let textColor = "#333";
    const isLastDataPoint = index === data.length - 1;

    if (value === maxValue) {
      labelText = `최고: ${value}%`;
      textColor = "#ff0000";
    } else if (value === minValue) {
      labelText = `최저: ${value}%`;
      textColor = "#0000ff";
    } else if (isLastDataPoint) {
      labelText = `최신: ${value}%`;
      textColor = "#016630";
    }

    if (labelText) {
      return (
        <text
          x={x}
          y={y}
          dy={-10}
          fill={textColor}
          fontSize={12}
          textAnchor="middle"
        >
          {labelText}
        </text>
      );
    }

    return null;
  };

  return (
    <div style={{ width: "100%", height: 400, marginBottom: "2rem" }}>
      <h3 style={{ textAlign: "center" }}>{title}</h3>
      <ResponsiveContainer>
        <ChartComponent
          data={data}
          margin={{
            top: 20, // top margin to make space for labels
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisDataKey} />
          <YAxis unit="%" domain={[0, 100]} />
          <Tooltip formatter={(value: number) => `${value}%`} />
          <Legend />
          {chartType === "line" &&
            lineDataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                activeDot={{ r: 8 }}
                dot={renderCustomizedDot}
              >
                <LabelList dataKey={key} content={<CustomizedLabel />} />
              </Line>
            ))}
          {chartType === "bar" &&
            barDataKeys.map((key) => (
              <Bar key={key} dataKey={key}>
                {data.map((entry, index) => {
                  const value = entry[key] as number;
                  let color = colors[index % colors.length];
                  if (value === maxValue) color = "#ff0000";
                  if (value === minValue) color = "#0000ff";
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
                <LabelList dataKey={key} content={<CustomizedLabel />} />
              </Bar>
            ))}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default InteractiveChart;
