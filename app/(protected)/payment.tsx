// PaymentResultScreen.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, View } from "react-native";
import { useEffect } from "react";
import { Text } from "~/components/ui/text";
export default function PaymentResultScreen() {
  const { status, reference } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (status === "success") {
      Alert.alert(
        "Payment Successful",
        `Your appointment (ref: ${reference}) has been scheduled!`,
      );
    } else if (status === "pending") {
      Alert.alert("Payment Pending", "Your payment is still processing.");
    } else if (status === "failed") {
      Alert.alert("Payment Failed", "Please try again.");
    }

    setTimeout(() => {
      router.push("/home");
    }, 3000);
  }, [status, reference, router]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Processing payment status...</Text>
    </View>
  );
}
