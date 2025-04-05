/*import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as WebBrowser from "expo-web-browser";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { useCallback, useRef, useState } from "react";
import { ModalType } from "@/types";

import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
export default function HomeScreen() {
  const { top } = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();
  // const snapPoints = useMemo(() => ["33%"], []);
  const [authType, setAuthType] = useState<ModalType | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const openLink = async () => {
    WebBrowser.openBrowserAsync("https://mbeka-dev.vercel.app/#contact");
  };

  const openActionSheet = async () => {
    const options = ["View support docs", "Contact us", "Cancel"];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: `Can't log in or sign up?`,
      },
      (selectedIndex: any) => {
        switch (selectedIndex) {
          case 1:
            // Support
            break;

          case cancelButtonIndex:
          // Canceled
        }
      },
    );
  };

  const showModal = async (type: ModalType) => {
    setAuthType(type);
    bottomSheetModalRef.current?.present();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.6}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
        onPress={() => bottomSheetModalRef.current?.close()}
      />
    ),
    [],
  );
  return (
    <BottomSheetModalProvider>
      <View
        className={`flex-1 dark:bg-black   justify-center pt-[${top + 30}px] items-center gap-5  `}
      >
        <Text
          className=" font-jakarta-bold  text-5xl "
        // style={{
        //   fontFamily: "Jakarta-Sans",
        // }}
        >
          Welcome to Lyra
        </Text>
        <Text className="font-jakarta-regular max-w-sm   dark:text-gray-300 text-gray-500">
          Schedule your first appointment with a healthcare professional today!
        </Text>
        <View className="w-full my-2 px-10 gap-5">
          <Button
            size="lg"
            className=" bg-greenPrimary "
            onPress={() => showModal(ModalType.SignUp)}
          >
            <Text className="text-white font-jakarta-semibold text-xl">
              Let's get started
            </Text>
          </Button>
          <Button
            size="lg"
            className="   border-2 border-solid border-greenPrimary bg-transparent   items-center"
            onPress={() => showModal(ModalType.Login)}
          >
            <Text className={`text-greenPrimary font-jakarta-semibold text-lg`}>
              I already have an account
            </Text>
          </Button>

          <Text className=" text-xs font-jakarta-bold text-center mx-2">
            By signing up, you agree to the{" "}
            <Text className=" text-xs underline" onPress={openLink}>
              User Notice
            </Text>{" "}
            and{" "}
            <Text className=" text-xs underline" onPress={openLink}>
              Privacy Policy
            </Text>
            .
          </Text>

          <Text
            className=" text-xs underline text-center"
            onPress={openActionSheet}
          >
            Can't log in or sign up?
          </Text>
        </View>
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        handleComponent={null}
        backdropComponent={renderBackdrop}
        enableOverDrag={false}
        enablePanDownToClose
      >
        <AuthModal authType={authType} />
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}*/

import { View, StyleSheet, Image, Pressable, ScrollView } from "react-native";
import { Link } from "expo-router";
import { Text } from "~/components/ui/text";
import {
  ArrowRight,
  Stethoscope,
  Calendar,
  MessageSquare,
} from "lucide-react-native";

export default function LandingPage() {
  return (
    <View style={styles.container}>
      <ScrollView className="h-full">
        <View className="relative h-[500px]">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?q=80&w=2070",
            }}
            className="w-full h-full absolute"
          />
          <View style={styles.overlay} />
          <View className="flex-1 px-5 justify-center items-center border-2 border-solid border-red-400">
            <Text className="font-jakarta-bold text-5xl">Welcome to Lyra</Text>
            <Text style={styles.subtitle}>
              Schedule your first appointment with a healthcare professional
              today!
            </Text>
            <Link href="/" asChild>
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Get Started</Text>
                <ArrowRight size={20} color="#fff" style={styles.buttonIcon} />
              </Pressable>
            </Link>
          </View>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Stethoscope size={32} color="#0891b2" />
            <Text style={styles.featureTitle}>Expert Doctors</Text>
            <Text style={styles.featureText}>
              Connect with board-certified physicians across multiple
              specialties
            </Text>
          </View>
          <View style={styles.feature}>
            <Calendar size={32} color="#0891b2" />
            <Text style={styles.featureTitle}>Easy Scheduling</Text>
            <Text style={styles.featureText}>
              Book appointments at your convenience, 24/7
            </Text>
          </View>
          <View style={styles.feature}>
            <MessageSquare size={32} color="#0891b2" />
            <Text style={styles.featureTitle}>Secure Messaging</Text>
            <Text style={styles.featureText}>
              Private and encrypted communication with your healthcare providers
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  hero: {
    height: 500,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  content: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 48,
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 32,
    maxWidth: 400,
  },
  button: {
    backgroundColor: "#0891b2",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
    fontSize: 18,
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  features: {
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: 24,
  },
  feature: {
    flex: 1,
    minWidth: 280,
    backgroundColor: "#f8fafc",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  featureTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
    color: "#0f172a",
    marginTop: 16,
    marginBottom: 8,
  },
  featureText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
});
