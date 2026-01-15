import { useMemo } from "react";
import { Text, View } from "react-native";
import Svg, { Circle, G, Line, Path, Text as SvgText } from "react-native-svg";
import { useTheme } from "@/src/shared/lib";

interface DataPoint {
  date: string; // ISO date string (YYYY-MM-DD)
  values: Record<string, number>; // key -> value (0-10 scale)
}

interface DataSeries {
  key: string;
  label: string;
  color: string;
}

interface LineChartProps {
  data: DataPoint[];
  series: DataSeries[];
  days?: number;
  width?: number;
  height?: number;
  minValue?: number;
  maxValue?: number;
  emptyMessage?: string;
}

export const LineChart = ({
  data,
  series,
  days = 14,
  width = 300,
  height = 140,
  minValue = 0,
  maxValue = 10,
  emptyMessage = "No data available",
}: LineChartProps) => {
  const { isDark } = useTheme();

  const { startDate } = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));
    return { startDate: start, endDate: end };
  }, [days]);

  interface DayData {
    date: string;
    dayIndex: number;
    values: Record<string, number>;
  }

  const dailyData = useMemo(() => {
    const result: DayData[] = [];
    const dataMap = new Map(data.map((d) => [d.date, d.values]));

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      const values = dataMap.get(dateStr);

      if (values) {
        result.push({ date: dateStr, dayIndex: i, values });
      }
    }

    return result;
  }, [data, days, startDate]);

  const padding = { left: 25, right: 10, top: 10, bottom: 30 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const getY = (value: number) => {
    return padding.top + graphHeight - ((value - minValue) / (maxValue - minValue)) * graphHeight;
  };

  const getX = (dayIndex: number) => {
    return padding.left + (dayIndex / (days - 1)) * graphWidth;
  };

  const createPath = (key: string) => {
    const points = dailyData.filter((d) => d.values[key] !== undefined);
    if (points.length < 2) return "";
    return points
      .map((day, i) => `${i === 0 ? "M" : "L"} ${getX(day.dayIndex)} ${getY(day.values[key])}`)
      .join(" ");
  };

  const xLabels = useMemo(() => {
    const formatDate = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`;
    const endDate = new Date();
    const midDate = new Date(startDate);
    midDate.setDate(midDate.getDate() + Math.floor(days / 2));

    return [
      { dayIndex: 0, label: formatDate(startDate) },
      { dayIndex: Math.floor(days / 2), label: formatDate(midDate) },
      { dayIndex: days - 1, label: formatDate(endDate) },
    ];
  }, [startDate, days]);

  const yTicks = [minValue, (minValue + maxValue) / 2, maxValue];

  if (dailyData.length === 0) {
    return (
      <View className="items-center py-8">
        <Text className={`text-[13px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return (
    <View>
      <View className="flex-row justify-end gap-4 mb-3">
        {series.map((s) => (
          <View key={s.key} className="flex-row items-center gap-1">
            <View className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
            <Text className={`text-[11px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ width, height }}>
        <Svg width={width} height={height}>
          {yTicks.map((value) => (
            <G key={value}>
              <Line
                x1={padding.left}
                y1={getY(value)}
                x2={width - padding.right}
                y2={getY(value)}
                stroke={isDark ? "#374151" : "#e5e7eb"}
                strokeWidth={1}
                strokeDasharray={value === minValue ? undefined : [4, 4]}
              />
              <SvgText
                x={padding.left - 8}
                y={getY(value) + 4}
                fill={isDark ? "#6b7280" : "#9ca3af"}
                fontSize={10}
                textAnchor="end"
              >
                {value}
              </SvgText>
            </G>
          ))}

          {series.map((s) => {
            const path = createPath(s.key);
            return path ? (
              <Path
                key={s.key}
                d={path}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null;
          })}

          {dailyData.map((day) =>
            series.map((s) =>
              day.values[s.key] !== undefined ? (
                <Circle
                  key={`${day.date}-${s.key}`}
                  cx={getX(day.dayIndex)}
                  cy={getY(day.values[s.key])}
                  r={3}
                  fill={s.color}
                />
              ) : null
            )
          )}

          {xLabels.map(({ dayIndex, label }) => (
            <SvgText
              key={dayIndex}
              x={getX(dayIndex)}
              y={height - 8}
              fill={isDark ? "#6b7280" : "#9ca3af"}
              fontSize={10}
              textAnchor="middle"
            >
              {label}
            </SvgText>
          ))}
        </Svg>
      </View>
    </View>
  );
};
