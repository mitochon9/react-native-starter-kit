import { useMemo } from "react";
import { Dimensions, Text, View } from "react-native";
import { useTheme } from "@/src/shared/lib";

interface DataEntry {
  date: string; // ISO date string (YYYY-MM-DD)
  value: number; // Value between 0-1 for intensity
}

interface CalendarHeatmapProps {
  entries: DataEntry[];
  color?: [number, number, number]; // RGB color for the heatmap
  weeksToShow?: number;
  dayLabels?: string[];
  monthFormat?: (month: number) => string;
  legendLabels?: { low: string; high: string };
}

const screenWidth = Dimensions.get("window").width;
const DAY_LABEL_WIDTH = 20;
const PADDING = 40;
const GAP = 2;
const CELL_SIZE = 12;

export const CalendarHeatmap = ({
  entries,
  color = [96, 165, 250], // Default blue
  weeksToShow,
  dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  monthFormat = (month) => `${month + 1}`,
  legendLabels = { low: "Low", high: "High" },
}: CalendarHeatmapProps) => {
  const { isDark } = useTheme();

  const AVAILABLE_WIDTH = screenWidth - PADDING - DAY_LABEL_WIDTH;
  const WEEKS_TO_SHOW = weeksToShow ?? Math.floor(AVAILABLE_WIDTH / (CELL_SIZE + GAP));

  interface CellData {
    dateKey: string;
    value: number | null;
    isFuture: boolean;
  }

  interface WeekData {
    weekKey: string;
    cells: CellData[];
  }

  const { grid, months } = useMemo(() => {
    const entryMap = new Map(entries.map((e) => [e.date, e.value]));
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const weeks: WeekData[] = [];
    const monthLabels: { label: string; weekIndex: number }[] = [];

    const startDate = new Date(today);
    const dayOfWeek = today.getDay();
    startDate.setDate(today.getDate() - (WEEKS_TO_SHOW - 1) * 7 - dayOfWeek);

    let currentMonth = -1;

    for (let w = 0; w < WEEKS_TO_SHOW; w++) {
      const cells: CellData[] = [];
      let weekKey = "";

      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + w * 7 + d);
        const dateStr = date.toISOString().split("T")[0];

        if (d === 0) {
          weekKey = dateStr;
        }

        const isFuture = dateStr > todayStr;
        const value = isFuture ? null : (entryMap.get(dateStr) ?? null);
        cells.push({ dateKey: dateStr, value, isFuture });

        if (!isFuture && date.getMonth() !== currentMonth) {
          currentMonth = date.getMonth();
          monthLabels.push({
            label: monthFormat(currentMonth),
            weekIndex: w,
          });
        }
      }

      weeks.push({ weekKey, cells });
    }

    return { grid: weeks, months: monthLabels };
  }, [entries, WEEKS_TO_SHOW, monthFormat]);

  const getColor = (cell: CellData) => {
    if (cell.isFuture) {
      return "transparent";
    }
    if (cell.value === null) {
      return isDark ? "#1f2937" : "#f3f4f6";
    }
    const opacity = 0.2 + cell.value * 0.8;
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
  };

  const filteredMonths = months.filter((m, i) => {
    if (i === 0) return true;
    const prev = months[i - 1];
    return m.weekIndex - prev.weekIndex >= 3;
  });

  return (
    <View>
      <View className="flex-row ml-5 mb-1" style={{ height: 14 }}>
        {filteredMonths.map((m) => (
          <Text
            key={`${m.label}-${m.weekIndex}`}
            className={`text-[9px] ${isDark ? "text-gray-500" : "text-gray-400"}`}
            style={{
              position: "absolute",
              left: m.weekIndex * (CELL_SIZE + GAP),
            }}
          >
            {m.label}
          </Text>
        ))}
      </View>

      <View className="flex-row">
        <View className="mr-1">
          {dayLabels.map((day) => (
            <View key={day} style={{ height: CELL_SIZE + GAP }} className="justify-center">
              <Text className={`text-[9px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                {day}
              </Text>
            </View>
          ))}
        </View>

        <View className="flex-row">
          {grid.map((week) => (
            <View key={week.weekKey} style={{ marginRight: GAP }}>
              {week.cells.map((cell) => (
                <View
                  key={cell.dateKey}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    marginBottom: GAP,
                    borderRadius: 2,
                    backgroundColor: getColor(cell),
                  }}
                />
              ))}
            </View>
          ))}
        </View>
      </View>

      <View className="flex-row justify-end items-center mt-2 gap-1">
        <Text className={`text-[9px] mr-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          {legendLabels.low}
        </Text>
        {[0, 0.25, 0.5, 0.75, 1].map((intensity) => (
          <View
            key={intensity}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              borderRadius: 2,
              backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${0.2 + intensity * 0.8})`,
            }}
          />
        ))}
        <Text className={`text-[9px] ml-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          {legendLabels.high}
        </Text>
      </View>
    </View>
  );
};
