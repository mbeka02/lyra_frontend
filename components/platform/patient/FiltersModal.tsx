import { View, Modal } from "react-native";
import { Dispatch, SetStateAction } from "react";
import { Text } from "~/components/ui/text";
import { Check } from "~/lib/icons/Check";
import { ChevronUp } from "~/lib/icons/ChevronUp";
import { ChevronDown } from "~/lib/icons/ChevronDown";
import { Button } from "~/components/ui/button";
import { TouchableOpacity } from "react-native";
import { X } from "~/lib/icons/X";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
interface FilterModalProps {
  sortBy: "experience" | "price" | null;
  setSortBy: Dispatch<SetStateAction<"experience" | "price" | null>>;
  order: "asc" | "desc";
  setOrder: Dispatch<SetStateAction<"asc" | "desc">>;
  setMinPrice: Dispatch<SetStateAction<string>>;
  setMaxPrice: Dispatch<SetStateAction<string>>;
  setMinExperience: Dispatch<SetStateAction<string>>;
  setMaxExperience: Dispatch<SetStateAction<string>>;

  minPrice: string;
  maxPrice: string;
  minExperience: string;
  maxExperience: string;
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
  minPrice,
  maxPrice,
  minExperience,
  maxExperience,
  setMinPrice,
  setMaxPrice,
  setMinExperience,
  setMaxExperience,
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
          <View className="flex-row w-full justify-between mb-4 ">
            <Text className="font-jakarta-semibold text-2xl ">
              Search Filters
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2 ">
              <X size={20} className="text-red-500" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          {/*Sort section*/}
          <View className="mb-5">
            <Text className="text-lg font-jakarta-semibold mb-3 ">Sort By</Text>

            <View className="flex-row gap-4">
              <TouchableOpacity
                className={`flex-row items-center py-2 px-3 rounded-lg border ${sortBy === "price"
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-input dark:bg-black bg-white"
                  }`}
                onPress={() => setSortBy("price")}
              >
                {sortBy === "price" && (
                  <Check size={18} color="#24AE7C" className="mr-1 mt-1" />
                )}
                <Text
                  className={`text-base font-jakarta-regular  ${sortBy === "price" ? "text-emerald-500 " : ""}`}
                >
                  price
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-row items-center py-2 px-3 rounded-lg border ${sortBy === "experience"
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-input dark:bg-black bg-white"
                  }`}
                onPress={() => setSortBy("experience")}
              >
                {sortBy === "experience" && (
                  <Check size={18} color="#24AE7C" className="mr-1 mt-1" />
                )}
                <Text
                  className={`text-base font-jakarta-regular  ${sortBy === "experience" ? "text-emerald-500 " : ""}`}
                >
                  experience
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Order By Section */}
          <View className="mb-5">
            <Text className="text-lg font-jakarta-semibold mb-2.5 ">
              Order By
            </Text>
            <View className="flex-row w-full gap-4">
              <TouchableOpacity
                className={`flex-row items-center py-2 px-3 rounded-lg border ${order === "asc"
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-input dark:bg-black bg-white"
                  }`}
                onPress={() => setOrder("asc")}
              >
                <ChevronUp
                  size={20}
                  className={`w-5  h-5 ${order === "asc" ? " text-greenPrimary" : "text-black dark:text-white"}`}
                />
                <Text
                  className={`text-base font-jakarta-regular  ml-1 ${order === "asc" ? "text-emerald-500 " : ""}`}
                >
                  Ascending
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-row items-center py-2 px-3 rounded-lg border ${order === "desc"
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-input dark:bg-black bg-white"
                  }`}
                onPress={() => setOrder("desc")}
              >
                <ChevronDown
                  size={20}
                  className={`w-5  h-5 ${order === "desc" ? " text-greenPrimary" : "text-black dark:text-white"}`}
                />
                <Text
                  className={`text-base font-jakarta-regular ml-1 ${order === "desc" ? "text-emerald-500 " : ""}`}
                >
                  Descending
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Price Range Section */}
          <View className="mb-5">
            <Text className="text-lg font-jakarta-semibold mb-2.5 ">
              Price Range
            </Text>
            <View className="flex-row justify-between gap-2.5">
              <View className="flex-1">
                <Label
                  className="text-xs font-normal  mb-1"
                  nativeID="min_price_label"
                >
                  Min
                </Label>
                <Input
                  value={minPrice}
                  onChangeText={(text) => setMinPrice(text)}
                  placeholder="e.g Ksh 500"
                  keyboardType="numeric"
                  className="placeholder:text-sm placeholder:text-white"
                />
              </View>
              <View className="flex-1">
                <Label
                  className="text-xs font-normal  mb-1"
                  nativeID="max_price_label"
                >
                  Max
                </Label>

                <Input
                  value={maxPrice}
                  onChangeText={(text) => setMaxPrice(text)}
                  className="placeholder:text-sm placeholder:text-white"
                  placeholder="e.g Ksh 4000"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Experience Range Section */}
          <View className="mb-5">
            <Text className="text-lg font-jakarta-semibold mb-2.5 ">
              Experience (Years)
            </Text>
            <View className="flex-row justify-between gap-2.5">
              <View className="flex-1">
                <Label
                  className="text-xs font-normal  mb-1"
                  nativeID="min_experience_label"
                >
                  Min
                </Label>

                <Input
                  value={minExperience}
                  onChangeText={(text) => setMinExperience(text)}
                  placeholder="1"
                  keyboardType="numeric"
                  className="placeholder:text-sm placeholder:text-white"
                />
              </View>
              <View className="flex-1">
                <Label
                  className="text-xs font-normal  mb-1"
                  nativeID="max_experience_label"
                >
                  Max
                </Label>

                <Input
                  value={maxExperience}
                  onChangeText={(text) => setMaxExperience(text)}
                  placeholder="30"
                  keyboardType="numeric"
                  className="placeholder:text-sm placeholder:text-white"
                />
              </View>
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
