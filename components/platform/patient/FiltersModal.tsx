import { View, Modal, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { Check } from "~/lib/icons/Check";
import { ChevronUp } from "~/lib/icons/ChevronUp";
import { ChevronDown } from "~/lib/icons/ChevronDown";
import { Button } from "~/components/ui/button";
import { X } from "~/lib/icons/X";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

type SortOption = "experience" | "price" | null;
type OrderOption = "asc" | "desc";

interface FilterModalProps {
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  order: OrderOption;
  setOrder: (value: OrderOption) => void;
  minPrice: string;
  maxPrice: string;
  minExperience: string;
  maxExperience: string;
  setMinPrice: (value: string) => void;
  setMaxPrice: (value: string) => void;
  setMinExperience: (value: string) => void;
  setMaxExperience: (value: string) => void;
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

  // Option button component for reusability
  const OptionButton = ({
    isSelected,
    onPress,
    icon = null,
    label,
  }: {
    isSelected: boolean;
    onPress: () => void;
    icon?: React.ReactNode;
    label: string;
  }) => (
    <TouchableOpacity
      className={`flex-row items-center py-2 px-3 rounded-lg border ${isSelected
          ? "border-emerald-500 bg-emerald-500/10"
          : "border-input dark:bg-black bg-white"
        }`}
      onPress={onPress}
    >
      {isSelected && !icon && (
        <Check size={18} color="#24AE7C" className="mr-1 mt-1" />
      )}
      {icon}
      <Text
        className={`text-base font-jakarta-regular ${icon ? "ml-1" : ""} ${isSelected ? "text-emerald-500" : ""
          }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Input range component for reusability
  const InputRange = ({
    label,
    minValue,
    maxValue,
    setMinValue,
    setMaxValue,
    minPlaceholder,
    maxPlaceholder,
  }: {
    label: string;
    minValue: string;
    maxValue: string;
    setMinValue: (value: string) => void;
    setMaxValue: (value: string) => void;
    minPlaceholder: string;
    maxPlaceholder: string;
  }) => (
    <View className="mb-5">
      <Text className="text-lg font-jakarta-semibold mb-2.5">{label}</Text>
      <View className="flex-row justify-between gap-2.5">
        <View className="flex-1">
          <Label
            className="text-xs font-normal mb-1"
            nativeID={`min_${label.toLowerCase().replace(/\s+/g, "_")}_label`}
          >
            Min
          </Label>
          <Input
            value={minValue}
            onChangeText={setMinValue}
            placeholder={minPlaceholder}
            keyboardType="numeric"
            className="placeholder:text-sm placeholder:text-white"
          />
        </View>
        <View className="flex-1">
          <Label
            className="text-xs font-normal mb-1"
            nativeID={`max_${label.toLowerCase().replace(/\s+/g, "_")}_label`}
          >
            Max
          </Label>
          <Input
            value={maxValue}
            onChangeText={setMaxValue}
            className="placeholder:text-sm placeholder:text-white"
            placeholder={maxPlaceholder}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center bg-black/50">
        <View className="w-11/12 mt-24 bg-slate-50 dark:bg-backgroundPrimary rounded-xl p-6 max-h-5/6">
          <View className="flex-row w-full justify-between mb-4">
            <Text className="font-jakarta-semibold text-2xl">
              Search Filters
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={20} className="text-red-500" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {/* Sort section */}
          <View className="mb-5">
            <Text className="text-lg font-jakarta-semibold mb-3">Sort By</Text>
            <View className="flex-row gap-4">
              <OptionButton
                isSelected={sortBy === "price"}
                onPress={() => setSortBy("price")}
                label="price"
              />
              <OptionButton
                isSelected={sortBy === "experience"}
                onPress={() => setSortBy("experience")}
                label="experience"
              />
            </View>
          </View>

          {/* Order By Section */}
          <View className="mb-5">
            <Text className="text-lg font-jakarta-semibold mb-2.5">
              Order By
            </Text>
            <View className="flex-row w-full gap-4">
              <OptionButton
                isSelected={order === "asc"}
                onPress={() => setOrder("asc")}
                icon={
                  <ChevronUp
                    size={20}
                    className={`w-5 h-5 ${order === "asc"
                        ? "text-greenPrimary"
                        : "text-black dark:text-white"
                      }`}
                  />
                }
                label="Ascending"
              />
              <OptionButton
                isSelected={order === "desc"}
                onPress={() => setOrder("desc")}
                icon={
                  <ChevronDown
                    size={20}
                    className={`w-5 h-5 ${order === "desc"
                        ? "text-greenPrimary"
                        : "text-black dark:text-white"
                      }`}
                  />
                }
                label="Descending"
              />
            </View>
          </View>

          {/* Price Range Section */}
          <InputRange
            label="Price Range"
            minValue={minPrice}
            maxValue={maxPrice}
            setMinValue={setMinPrice}
            setMaxValue={setMaxPrice}
            minPlaceholder="e.g Ksh 500"
            maxPlaceholder="e.g Ksh 4000"
          />

          {/* Experience Range Section */}
          <InputRange
            label="Experience (Years)"
            minValue={minExperience}
            maxValue={maxExperience}
            setMinValue={setMinExperience}
            setMaxValue={setMaxExperience}
            minPlaceholder="1"
            maxPlaceholder="30"
          />

          <Button
            onPress={onClose}
            size="lg"
            className="bg-greenPrimary w-full"
          >
            <Text className="text-white font-jakarta-semibold">Apply</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}
