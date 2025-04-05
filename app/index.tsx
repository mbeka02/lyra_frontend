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

export default function LandingPage() {
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
      <View className="flex-1">
        <ScrollView className="h-full">
          <View className="relative h-[450px]">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?q=80&w=2070",
              }}
              className="w-full h-full absolute"
            />
            <View style={styles.overlay} />
            <View className="flex-1 px-5 justify-center items-center">
              <Text className="font-jakarta-bold text-5xl">
                Welcome to Lyra
              </Text>
              <Text className="font-jakarta-regular text-lg text-center max-w-sm mb-8">
                Schedule your first appointment with a healthcare professional
                today!
              </Text>
              <View className="w-full flex items-center">
                <Button
                  size="lg"
                  className=" bg-greenPrimary mb-2 rounded-xl flex-row gap-1  items-center w-56 h-24"
                  onPress={() => showModal(ModalType.SignUp)}
                >
                  <Text className="text-white font-jakarta-semibold text-xl">
                    Get Started
                  </Text>
                  <ArrowRight
                    style={styles.buttonIcon}
                    size={22}
                    color="#ffffff"
                  />
                </Button>
                <Button
                  size="lg"
                  className=" bg-greenPrimary mb-2 rounded-xl w-56 h-24"
                  onPress={() => showModal(ModalType.Login)}
                >
                  <Text className={`text-white font-jakarta-semibold text-xl`}>
                    Login
                  </Text>
                </Button>

                <Text
                  className=" text-sm underline font-jakarta-medium text-center"
                  onPress={openActionSheet}
                >
                  Can't log in or sign up?
                </Text>
              </View>
            </View>
          </View>

          <View className="p-7 gap-7 flex-row justify-around flex-wrap">
            <View className="flex-1 min-w-[280px] p-6 rounded-xl items-center bg-slate-50 dark:bg-backgroundPrimary">
              <Stethoscope size={32} color="#24AE7C" />
              <Text className="font-jakarta-semibold text-xl mt-4 mb-2">
                Expert Doctors
              </Text>
              <Text className="font-jakarta-regular text-center text-base">
                Connect with board-certified physicians across multiple
                specialties
              </Text>
            </View>
            <View className=" flex-1 min-w-[280px] p-6 rounded-xl items-center bg-slate-50 dark:bg-backgroundPrimary">
              <Calendar size={32} color="#24AE7C" />
              <Text className="font-jakarta-semibold text-xl mt-4 mb-2">
                Easy Scheduling
              </Text>
              <Text className="font-jakarta-regular text-center text-base">
                Book appointments at your convenience, 24/7
              </Text>
            </View>
            <View className="flex-1 min-w-[280px] p-6 rounded-xl items-center bg-slate-50 dark:bg-backgroundPrimary">
              <MessageSquare size={32} color="#24AE7C" />
              <Text className="font-jakarta-semibold text-xl mt-4 mb-2">
                Secure Messaging
              </Text>
              <Text className="font-jakarta-regular text-center text-base">
                Private and encrypted communication with your healthcare
                providers
              </Text>
            </View>
          </View>
        </ScrollView>
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
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  buttonIcon: {
    marginLeft: 4,
    marginTop: 4,
  },
});
