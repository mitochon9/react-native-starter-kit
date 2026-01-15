import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";
import { useRef } from "react";
import { Platform, View } from "react-native";
import { useTheme } from "@/src/shared/lib";

interface SliderSelectorProps {
  value: number;
  onChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  color?: string;
  enableHaptics?: boolean;
}

export const SliderSelector = ({
  value,
  onChange,
  minimumValue = 1,
  maximumValue = 10,
  step = 1,
  color,
  enableHaptics = true,
}: SliderSelectorProps) => {
  const { isDark } = useTheme();
  const lastValue = useRef(value);
  const trackColor = color ?? (isDark ? "#60a5fa" : "#3b82f6");

  const handleValueChange = (newValue: number) => {
    if (newValue !== lastValue.current) {
      lastValue.current = newValue;
      if (enableHaptics && Platform.OS === "ios") {
        Haptics.selectionAsync();
      }
    }
    onChange(newValue);
  };

  return (
    <View className="px-1">
      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        value={value}
        onValueChange={handleValueChange}
        minimumTrackTintColor={trackColor}
        maximumTrackTintColor={isDark ? "#374151" : "#e5e7eb"}
        thumbTintColor={trackColor}
      />
    </View>
  );
};
