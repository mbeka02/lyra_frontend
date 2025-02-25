import { StyleSheet, View } from "react-native";
import { Text } from "./ui/text";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Dispatch, SetStateAction } from "react";
import { useColorScheme } from "~/lib/useColorScheme";
import { counties } from "~/constants/counties";
interface ComboBoxProps {
  county: string | null;
  setCounty: Dispatch<SetStateAction<string | null>>;
  isFocus: boolean;
  setIsFocus: Dispatch<SetStateAction<boolean>>;
}

/*FIXME:
VirtualizedList: You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices like PureComponent, shouldComponentUpdate, etc. {"contentLength": 2673.90478515625, "dt": 5542, "prevDt": 2166}
 */
export const ComboBox = ({
  county,
  setCounty,
  isFocus,
  setIsFocus,
}: ComboBoxProps) => {
  const { isDarkColorScheme } = useColorScheme();

  const RenderLabelComponent = () =>
    county || isFocus ? (
      <Text
        className={`absolute bg-slate-50 dark:bg-backgroundPrimary top-1 left-6 px-2 text-sm z-50 font-jakarta-semibold ${isFocus ? "text-greenPrimary" : ""
          }`}
      >
        County
      </Text>
    ) : null;

  return (
    <View className="bg-slate-50 h-24 p-4 dark:bg-backgroundPrimary rounded-xl my-2">
      <RenderLabelComponent />
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "#24AE7C" }]}
        placeholderStyle={[
          styles.textStyle,
          {
            color: isDarkColorScheme ? "white" : "black",
            fontFamily: "Jakarta-Sans-SemiBold",
            fontSize: 14,
          },
        ]}
        selectedTextStyle={[
          {
            color: isDarkColorScheme ? "white" : "black",
          },
        ]}
        inputSearchStyle={{
          height: 40,
          fontSize: 12,
          borderRadius: 8,
          fontFamily: "Jakarta-Sans-Regular",
          color: isDarkColorScheme ? "white" : "black",
        }}
        iconStyle={styles.iconStyle}
        data={counties}
        search
        containerStyle={{
          backgroundColor: isDarkColorScheme ? "#131619" : "#F8FAFC",
          borderRadius: 8,
          // marginTop: 12,
        }}
        itemTextStyle={{ color: isDarkColorScheme ? "white" : "black" }}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Select a county" : "..."}
        searchPlaceholder="Search..."
        searchPlaceholderTextColor={isDarkColorScheme ? "white" : "black"}
        activeColor="transparent"
        value={county}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setCounty(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? "#24AE7C" : isDarkColorScheme ? "white" : "black"}
            name="Safety"
            size={18}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
    marginTop: 5,
  },
  textStyle: {
    fontSize: 12,
    fontFamily: "Jakarta-Sans-Regular",
  },
  searchStyle: {
    height: 40,
    fontSize: 12,
    borderRadius: 8,
    fontFamily: "Jakarta-Sans-Regular",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
