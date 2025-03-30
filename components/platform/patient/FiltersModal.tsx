import { useState, useEffect } from "react";
import { View, Modal, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { X } from "~/lib/icons/X";
import { Check } from "~/lib/icons/Check";
import { ChevronUp } from "~/lib/icons/ChevronUp";
import { ChevronDown } from "~/lib/icons/ChevronDown";
type SortOption = "experience" | "price" | null;
type OrderOption = "asc" | "desc";

interface FilterModalProps {
  sortBy: SortOption;
  order: OrderOption;
  minPrice: string;
  maxPrice: string;
  minExperience: string;
  maxExperience: string;
  setSortBy: (value: SortOption) => void;
  setOrder: (value: OrderOption) => void;
  setMinPrice: (value: string) => void;
  setMaxPrice: (value: string) => void;
  setMinExperience: (value: string) => void;
  setMaxExperience: (value: string) => void;
  isVisible: boolean;
  onClose: () => void;
}

const OptionButton = ({
  isSelected,
  onPress,
  icon,
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
        <Label className="text-xs font-normal mb-1">Min</Label>
        <Input
          value={minValue}
          onChangeText={setMinValue}
          placeholder={minPlaceholder}
          keyboardType="numeric"
          className="placeholder:text-sm"
        />
      </View>
      <View className="flex-1">
        <Label className="text-xs font-normal mb-1">Max</Label>
        <Input
          value={maxValue}
          onChangeText={setMaxValue}
          placeholder={maxPlaceholder}
          keyboardType="numeric"
          className="placeholder:text-sm"
        />
      </View>
    </View>
  </View>
);

export function FiltersModal({
  sortBy,
  order,
  minPrice,
  maxPrice,
  minExperience,
  maxExperience,
  setSortBy,
  setOrder,
  setMinPrice,
  setMaxPrice,
  setMinExperience,
  setMaxExperience,
  isVisible,
  onClose,
}: FilterModalProps) {
  const [localState, setLocalState] = useState({
    sortBy,
    order,
    minPrice,
    maxPrice,
    minExperience,
    maxExperience,
  });

  useEffect(() => {
    if (isVisible) {
      setLocalState({
        sortBy,
        order,
        minPrice,
        maxPrice,
        minExperience,
        maxExperience,
      });
    }
  }, [
    isVisible,
    sortBy,
    order,
    minPrice,
    maxPrice,
    minExperience,
    maxExperience,
  ]);

  const handleApply = () => {
    setSortBy(localState.sortBy);
    setOrder(localState.order);
    setMinPrice(localState.minPrice);
    setMaxPrice(localState.maxPrice);
    setMinExperience(localState.minExperience);
    setMaxExperience(localState.maxExperience);
    onClose();
  };

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
          <View className="flex-row w-full justify-between mb-4">
            <Text className="font-jakarta-semibold text-2xl">
              Search Filters
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={20} className="text-red-500" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <View className="mb-5">
            <Text className="text-lg font-jakarta-semibold mb-3">Sort By</Text>
            <View className="flex-row gap-4">
              <OptionButton
                isSelected={localState.sortBy === "price"}
                onPress={() =>
                  setLocalState({ ...localState, sortBy: "price" })
                }
                label="Price"
              />
              <OptionButton
                isSelected={localState.sortBy === "experience"}
                onPress={() =>
                  setLocalState({ ...localState, sortBy: "experience" })
                }
                label="Experience"
              />
            </View>
          </View>

          <View className="mb-5">
            <Text className="text-lg font-jakarta-semibold mb-2.5">
              Order By
            </Text>
            <View className="flex-row w-full gap-4">
              <OptionButton
                isSelected={localState.order === "asc"}
                onPress={() => setLocalState({ ...localState, order: "asc" })}
                icon={
                  <ChevronUp
                    size={20}
                    className={`w-5 h-5 ${localState.order === "asc"
                        ? "text-greenPrimary"
                        : "text-black dark:text-white"
                      }`}
                  />
                }
                label="Ascending"
              />
              <OptionButton
                isSelected={localState.order === "desc"}
                onPress={() => setLocalState({ ...localState, order: "desc" })}
                icon={
                  <ChevronDown
                    size={20}
                    className={`w-5 h-5 ${localState.order === "desc"
                        ? "text-greenPrimary"
                        : "text-black dark:text-white"
                      }`}
                  />
                }
                label="Descending"
              />
            </View>
          </View>

          <InputRange
            label="Price Range"
            minValue={localState.minPrice}
            maxValue={localState.maxPrice}
            setMinValue={(value) =>
              setLocalState({ ...localState, minPrice: value })
            }
            setMaxValue={(value) =>
              setLocalState({ ...localState, maxPrice: value })
            }
            minPlaceholder="e.g Ksh 500"
            maxPlaceholder="e.g Ksh 4000"
          />

          <InputRange
            label="Experience (Years)"
            minValue={localState.minExperience}
            maxValue={localState.maxExperience}
            setMinValue={(value) =>
              setLocalState({ ...localState, minExperience: value })
            }
            setMaxValue={(value) =>
              setLocalState({ ...localState, maxExperience: value })
            }
            minPlaceholder="1"
            maxPlaceholder="30"
          />

          <Button
            onPress={handleApply}
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
