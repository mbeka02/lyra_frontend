import { View } from "react-native";
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

import { AuthModal } from "@/components/AuthModal";
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
        opacity={0.2}
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
        className={`flex-1   justify-center pt-[${top + 30}px] items-center gap-5  bg-secondary/30`}
      >
        <Text
          className="font-semibold text-white text-lg py-8"
          style={{
            fontFamily: "Jakarta-Sans",
          }}
        >
          Hi there,....
        </Text>
        <View className="w-full px-10 gap-5">
          <Button
            className="py-2.5 rounded-lg bg-greenPrimary text-white font-semibold items-center"
            onPress={() => showModal(ModalType.Login)}
          >
            <Text
              className={` text-black dark:text-white font-semibold text-lg`}
              style={{
                fontFamily: "Jakarta-Sans",
              }}
            >
              Log in
            </Text>
          </Button>
          <Button
            className="py-2.5 rounded-lg items-center bg-greenPrimary text-white"
            onPress={() => showModal(ModalType.SignUp)}
          >
            <Text
              className="dark:text-white  text-black font-semibold text-lg"
              style={{
                fontFamily: "Jakarta-Sans",
              }}
            >
              Sign Up
            </Text>
          </Button>

          <Text
            className="text-white text-xs text-center mx-16"
            style={{
              fontFamily: "Jakarta-Sans",
            }}
          >
            By signing up, you agree to the{" "}
            <Text
              className="text-white text-xs underline"
              onPress={openLink}
              style={{
                fontFamily: "Jakarta-Sans",
              }}
            >
              User Notice
            </Text>{" "}
            and{" "}
            <Text
              className="text-white text-xs underline"
              onPress={openLink}
              style={{
                fontFamily: "Jakarta-Sans",
              }}
            >
              Privacy Policy
            </Text>
            .
          </Text>

          <Text
            className="text-white text-xs underline text-center"
            onPress={openActionSheet}
            style={{
              fontFamily: "Jakarta-Sans",
            }}
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
}
