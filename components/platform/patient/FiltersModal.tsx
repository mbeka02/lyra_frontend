import { View, Modal } from "react-native";
import { Dispatch, SetStateAction } from "react";
import { Text } from "~/components/ui/text";
import { Check } from "~/lib/icons/Check";
import { ChevronUp } from "~/lib/icons/ChevronUp";
import { ChevronDown } from "~/lib/icons/ChevronDown";
import { Button } from "~/components/ui/button";
import { TouchableOpacity } from "react-native";
import { X } from "~/lib/icons/X";
interface FilterModalProps {
  sortBy: "experience" | "price" | null;
  setSortBy: Dispatch<SetStateAction<"experience" | "price" | null>>;
  order: "asc" | "desc";
  setOrder: Dispatch<SetStateAction<"asc" | "desc">>;

  isVisible: boolean;
  onClose: () => void;
}
export function FiltersModal({
  sortBy,
  setSortBy,
  order,
  setOrder,
  isVisible,
  onClose,
}: FilterModalProps) {
  if (!isVisible) return null;
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center bg-black/50">
        <View className="w-11/12 mt-24 bg-slate-50 dark:bg-backgroundPrimary rounded-xl p-6 max-h-5/6">
          <View className="flex-row w-full ">
            <TouchableOpacity onPress={onClose} className="p-2 ml-auto">
              <X size={20} className="text-red-500" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          <View className=" my-2 px-2  overflow-hidden h-20  flex justify-between flex-row items-center">
            <Text className="font-jakarta-semibold mr-3">Sort By</Text>
            <View className="flex gap-2 flex-row items-center">
              {(["price", "experience"] as const).map((criteria) => (
                <Button
                  key={criteria}
                  onPress={() => setSortBy(criteria)}
                  variant="outline"
                  size="sm"
                  className={`rounded-md px-1 pb-1  bg-transparent  flex flex-row items-center ${sortBy === criteria ? "border-greenPrimary bg-greenPrimary/20" : ""}`}
                >
                  {sortBy === criteria && (
                    <Check className=" mt-1 mr-1 text-greenPrimary" size={20} />
                  )}
                  <Text
                    className={`text-xs font-jakarta-medium ${sortBy === criteria ? "text-greenPrimary" : ""}`}
                  >
                    {criteria}
                  </Text>
                </Button>
              ))}
            </View>
            <View className="flex rounded-md shadow-sm justify-center space-x-2">
              {(["asc", "desc"] as const).map((direction) => (
                <TouchableOpacity
                  key={direction}
                  onPress={() => setOrder(direction)}
                  className="bg-slate-50 dark:bg-backgroundPrimary"
                >
                  {direction === "asc" ? (
                    <ChevronUp
                      className={`w-5  h-5 ${order === "asc" ? " text-greenPrimary" : "text-black dark:text-white"}`}
                    />
                  ) : (
                    <ChevronDown
                      className={`w-5 h-5 ${order === "desc" ? "text-greenPrimary" : "text-black dark:text-white"}`}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Button
            onPress={onClose}
            size="lg"
            className="bg-greenPrimary w-full"
          >
            <Text className=" text-white font-jakarta-semibold ">Apply</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}
