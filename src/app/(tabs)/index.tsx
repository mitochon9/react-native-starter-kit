import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage, useTheme } from "@/src/shared/lib";
import { Button, CalendarHeatmap, LineChart, SliderSelector, ThemedView } from "@/src/shared/ui";

const screenWidth = Dimensions.get("window").width;

// Generate sample data for heatmap
function generateHeatmapData() {
  const data = [];
  const today = new Date();
  for (let i = 60; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    if (Math.random() > 0.3) {
      data.push({
        date: date.toISOString().split("T")[0],
        value: Math.random(),
      });
    }
  }
  return data;
}

// Generate sample data for line chart
function generateChartData() {
  const data = [];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    if (Math.random() > 0.2) {
      data.push({
        date: date.toISOString().split("T")[0],
        values: {
          series1: Math.floor(Math.random() * 8) + 2,
          series2: Math.floor(Math.random() * 8) + 2,
        },
      });
    }
  }
  return data;
}

function SectionTitle({ children }: { children: string }) {
  const { isDark } = useTheme();
  return (
    <Text className={`text-sm font-semibold mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
      {children}
    </Text>
  );
}

function SegmentedControl({
  options,
  selectedIndex,
  onChange,
}: {
  options: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}) {
  const { isDark } = useTheme();
  return (
    <View className={`flex-row rounded-lg p-1 ${isDark ? "bg-gray-800" : "bg-gray-200"}`}>
      {options.map((option, index) => (
        <Pressable
          key={option}
          onPress={() => onChange(index)}
          className={`flex-1 py-2 px-3 rounded-md items-center ${
            selectedIndex === index ? (isDark ? "bg-gray-700" : "bg-white") : ""
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              selectedIndex === index
                ? isDark
                  ? "text-white"
                  : "text-gray-900"
                : isDark
                  ? "text-gray-400"
                  : "text-gray-500"
            }`}
          >
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const { isDark, themeMode, setThemeMode } = useTheme();
  const { languageMode, setLanguageMode } = useLanguage();
  const insets = useSafeAreaInsets();

  const [sliderValue, setSliderValue] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const heatmapData = useMemo(() => generateHeatmapData(), []);
  const chartData = useMemo(() => generateChartData(), []);

  const themeOptions = [
    t("settings.themeSystem"),
    t("settings.themeLight"),
    t("settings.themeDark"),
  ];
  const themeIndex = themeMode === "system" ? 0 : themeMode === "light" ? 1 : 2;

  const languageOptions = [t("language.ja"), t("language.en")];
  const languageIndex = languageMode === "ja" ? 0 : 1;

  const handleThemeChange = (index: number) => {
    const modes: ("system" | "light" | "dark")[] = ["system", "light", "dark"];
    setThemeMode(modes[index]);
  };

  const handleLanguageChange = (index: number) => {
    setLanguageMode(index === 0 ? "ja" : "en");
  };

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-8">
          <Text className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            {t("demo.title")}
          </Text>
          <Text className={`text-base ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {t("demo.subtitle")}
          </Text>
        </View>

        {/* Theme Section */}
        <View className="mb-6">
          <SectionTitle>{t("demo.section.theme")}</SectionTitle>
          <SegmentedControl
            options={themeOptions}
            selectedIndex={themeIndex}
            onChange={handleThemeChange}
          />
        </View>

        {/* Language Section */}
        <View className="mb-6">
          <SectionTitle>{t("demo.section.language")}</SectionTitle>
          <SegmentedControl
            options={languageOptions}
            selectedIndex={languageIndex}
            onChange={handleLanguageChange}
          />
        </View>

        {/* Buttons Section */}
        <View className="mb-6">
          <SectionTitle>{t("demo.section.buttons")}</SectionTitle>
          <View className="gap-3">
            <Button onPress={() => {}}>{t("demo.button.primary")}</Button>
            <Button variant="secondary" onPress={() => {}}>
              {t("demo.button.secondary")}
            </Button>
            <Button variant="outline" onPress={() => {}}>
              {t("demo.button.outline")}
            </Button>
            <Button isLoading={isLoading} onPress={handleLoadingDemo}>
              {t("demo.button.loading")}
            </Button>
          </View>
        </View>

        {/* Slider Section */}
        <View className="mb-6">
          <SectionTitle>{t("demo.section.slider")}</SectionTitle>
          <View className={`p-4 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
            <Text
              className={`text-center text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {t("demo.slider.value", { value: sliderValue })}
            </Text>
            <SliderSelector
              value={sliderValue}
              onChange={(v) => setSliderValue(Math.round(v))}
              minimumValue={1}
              maximumValue={10}
            />
          </View>
        </View>

        {/* Heatmap Section */}
        <View className="mb-6">
          <SectionTitle>{t("demo.section.heatmap")}</SectionTitle>
          <View
            className={`p-4 rounded-xl overflow-hidden ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
          >
            <CalendarHeatmap
              entries={heatmapData}
              color={[96, 165, 250]}
              weeksToShow={Math.floor((screenWidth - 100) / 14)}
              legendLabels={{
                low: t("demo.heatmap.low"),
                high: t("demo.heatmap.high"),
              }}
            />
          </View>
        </View>

        {/* Chart Section */}
        <View className="mb-6">
          <SectionTitle>{t("demo.section.chart")}</SectionTitle>
          <View className={`p-4 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
            <LineChart
              data={chartData}
              series={[
                { key: "series1", label: t("demo.chart.series1"), color: "#60a5fa" },
                { key: "series2", label: t("demo.chart.series2"), color: "#f472b6" },
              ]}
              width={screenWidth - 72}
              height={160}
              emptyMessage={t("demo.chart.empty")}
            />
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
