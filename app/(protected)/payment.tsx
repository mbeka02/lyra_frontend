// PaymentResultScreen.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import { useEffect } from "react";
import { Text } from "~/components/ui/text";
import { CheckCircle, Hourglass, XCircle } from "lucide-react-native";

export default function PaymentResultScreen() {
  const { status, reference } = useLocalSearchParams();
  const router = useRouter();

  // Icon and message mapping
  const statusData: Record<string, { icon: JSX.Element; message: string }> = {
    success: {
      icon: <CheckCircle size={80} color="green" />,
      message: `Payment Successful!\nYour appointment (ref: ${reference}) has been scheduled.`,
    },
    pending: {
      icon: <Hourglass size={80} color="orange" />,
      message: "Payment Pending.\nYour payment is still processing.",
    },
    failed: {
      icon: <XCircle size={80} color="red" />,
      message: "Payment Failed.\nPlease try again.",
    },
  };

  const { icon, message } =
    statusData[status as keyof typeof statusData] || statusData.failed;

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/home");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      {icon}
      <Text className="font-jakarta-semibold text-lg mt-8 text-center">
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});
