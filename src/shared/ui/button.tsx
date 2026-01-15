import { ActivityIndicator, Pressable, Text } from "react-native";
import { useTheme } from "@/src/shared/lib";

interface ButtonProps {
  onPress: () => void;
  children: string;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

export const Button = ({
  onPress,
  children,
  isLoading = false,
  disabled = false,
  variant = "primary",
}: ButtonProps) => {
  const { isDark } = useTheme();
  const isDisabled = disabled || isLoading;

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return isDark ? "bg-gray-100" : "bg-gray-800";
      case "secondary":
        return isDark ? "bg-gray-700" : "bg-gray-200";
      case "outline":
        return isDark ? "border border-gray-100" : "border border-gray-800";
      default:
        return isDark ? "bg-gray-100" : "bg-gray-800";
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "primary":
        return isDark ? "text-gray-800" : "text-white";
      case "secondary":
        return isDark ? "text-gray-100" : "text-gray-800";
      case "outline":
        return isDark ? "text-gray-100" : "text-gray-800";
      default:
        return isDark ? "text-gray-800" : "text-white";
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`py-4 px-6 rounded-xl items-center justify-center ${getVariantStyles()} ${isDisabled ? "opacity-40" : "active:opacity-70"}`}
    >
      {isLoading ? (
        <ActivityIndicator color={isDark ? "#1f2937" : "#fff"} />
      ) : (
        <Text className={`text-base font-bold ${getTextColor()}`}>{children}</Text>
      )}
    </Pressable>
  );
};
