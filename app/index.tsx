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
        className={`flex-1   justify-center pt-[${top + 30}px] items-center gap-5  `}
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
}
