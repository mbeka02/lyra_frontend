import { useQuery, useQueryClient } from "@tanstack/react-query";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { getUser } from "~/services/user";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useAuthentication } from "~/context/AuthContext";
import { Loader } from "~/components/Loader";
import UserAvatar from "~/components/platform/shared/UserAvatar";
import { Link } from "expo-router";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { useColorScheme } from "~/lib/useColorScheme";
import { Switch } from "~/components/ui/switch";
export default function SettingsScreen() {
  const queryClient = useQueryClient();
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  function toggleColorScheme() {
    const newTheme = isDarkColorScheme ? "light" : "dark";
    setColorScheme(newTheme);
    setAndroidNavigationBar(newTheme);
  }

  const { onLogout } = useAuthentication();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  if (isLoading || !data) {
    return <Loader />;
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="font-jakarta-semibold text-red-600">
          Error: Unable to display page details
        </Text>
        <Button
          onPress={() => queryClient.invalidateQueries({ queryKey: ["user"] })}
          className="mt-4 font-jakarta-semibold text-white bg-red-600"
        >
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ScrollView className="py-4 px-6">
        <View className="py-3 pt-1">
          <Text className="text-xs font-jakarta-medium my-2 tracking-wider dark:text-gray-300 text-gray-500 uppercase">
            Account
          </Text>
        </View>
        <Link
          href="/settings/profile"
          className="rounded-xl shadow-sm px-2 dark:bg-backgroundPrimary bg-slate-50"
        >
          <View className="p-3 w-full flex-row items-center">
            <UserAvatar
              uri={data.profile_image_url}
              name={data.full_name}
              size={50}
            />
            <View className="mr-auto ml-4">
              <Text className="text-lg font-jakarta-semibold">
                {data?.full_name}
              </Text>

              <Text className="text-base font-jakarta-regular italic text-gray-600 dark:text-gray-400">
                {data?.email}
              </Text>
            </View>

            <FeatherIcon color="#bcbcbc" name="chevron-right" size={22} />
          </View>
        </Link>

        <View className="py-3">
          <Text className="text-xs font-jakarta-medium my-2 tracking-wider dark:text-gray-300 text-gray-500 uppercase">
            Preferences
          </Text>

          <View className="rounded-xl shadow-sm bg-slate-50 dark:bg-backgroundPrimary overflow-hidden">
            <TouchableOpacity className="h-11 px-4 flex-row items-center">
              <Text className="text-base font-jakarta-regular">Language</Text>
              <View className="flex-1" />
              <Text className="text-base font-jakarta-medium dark:text-gray-100 text-gray-400 mr-1">
                English/Swahili
              </Text>
              <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
            </TouchableOpacity>

            <TouchableOpacity className="h-11 px-4 flex-row items-center border-t border-gray-100 dark:border-gray-600">
              <Text className="text-base font-jakarta-regular">Location</Text>
              <View className="flex-1" />
              <Text className="text-base font-medium font-jakarta-regular dark:text-gray-100 text-gray-400 mr-1">
                Kenya
              </Text>
              <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
            </TouchableOpacity>
            <View className="h-11 px-4 flex-row items-center border-t border-gray-100 dark:border-gray-600 justify-between">
              <Text className="text-base font-jakarta-regular">Dark Mode</Text>
              <Switch
                checked={isDarkColorScheme}
                onCheckedChange={toggleColorScheme}
                nativeID={`dark-mode-toggle`}
                className={`${isDarkColorScheme ? "bg-greenPrimary" : ""}   `}
              />
            </View>
          </View>
        </View>

        <View className="py-3">
          <Text className="my-2 text-xs font-jakarta-medium tracking-wider text-gray-500 dark:text-gray-300 uppercase">
            Resources
          </Text>

          <View className="rounded-xl shadow-sm bg-slate-50 dark:bg-backgroundPrimary overflow-hidden">
            <TouchableOpacity className="h-11 px-4 flex-row items-center">
              <Text className="text-base font-jakarta-regular">Contact Me</Text>
              <View className="flex-1" />
              <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
            </TouchableOpacity>

            <TouchableOpacity className="h-11 px-4 flex-row items-center border-t border-gray-100 dark:border-gray-600">
              <Text className="text-base font-jakarta-regular">Report Bug</Text>
              <View className="flex-1" />
              <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
            </TouchableOpacity>

            <TouchableOpacity className="h-11 px-4 flex-row items-center border-t border-gray-100 dark:border-gray-600">
              <Text className="text-base font-jakarta-regular">
                Rate in App Store
              </Text>
              <View className="flex-1" />
              <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
            </TouchableOpacity>

            <TouchableOpacity className="h-11 px-4 flex-row items-center border-t border-gray-100 dark:border-gray-600">
              <Text className="text-base font-jakarta-regular">
                Terms and Privacy
              </Text>
              <View className="flex-1" />
              <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
            </TouchableOpacity>
          </View>
        </View>

        <View className=" mt-6 py-3">
          <View className="rounded-xl shadow-sm bg-greenPrimary overflow-hidden">
            <Button onPress={onLogout} className="bg-greenPrimary">
              <Text className="text-base font-jakarta-semibold text-white">
                Log Out
              </Text>
            </Button>
          </View>
        </View>

        <Text className="mt-6 mb-6 text-sm font-medium text-center text-gray-500">
          App Version 0.3
        </Text>
      </ScrollView>
    </View>
  );
}
