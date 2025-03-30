import { getAllDoctors } from "~/services/doctor";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Loader } from "~/components/Loader";
import { View, FlatList, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { DoctorCard } from "./DoctorCard";
import { Check } from "~/lib/icons/Check";
import { ChevronUp } from "~/lib/icons/ChevronUp";
import { ChevronDown } from "~/lib/icons/ChevronDown";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { Filter } from "~/lib/icons/Filter";
import { ComboBox } from "~/components/ComboBox";
import { FiltersModal } from "./FiltersModal";
export function DoctorList() {
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<"experience" | "price" | null>(
    "experience",
  );
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [county, setCounty] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [maxExperience, setMaxExperience] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const { isPending, isError, data, isPlaceholderData } = useQuery({
    queryKey: ["projects", page, sortBy, order, county],
    queryFn: () => getAllDoctors(page, sortBy, order, county),
    placeholderData: keepPreviousData,
  });

  return (
    <View className="py-2 px-4 mb-8">
      {isPending ? (
        <Loader />
      ) : isError ? (
        <Text className="font-jakarta-regular font-semibold text-red-600">
          Error
        </Text>
      ) : (
        <FlatList
          data={data.doctors}
          className="my-2"
          keyExtractor={(item) => item.doctor_id.toString()}
          renderItem={({ item }) => <DoctorCard {...item} />}
          ListHeaderComponent={
            <View className="flex-row p-4 my-2 mt-4 dark:bg-backgroundPrimary bg-slate-50 rounded-xl shadow-sm  items-center justify-between w-full">
              <ComboBox
                county={county}
                setIsFocus={setIsFocus}
                setCounty={setCounty}
                isFocus={isFocus}
              />
              <Button size="icon" variant="ghost" onPress={openModal}>
                <Filter
                  className="w-5 h-5 text-black dark:text-gray-300"
                  strokeWidth={1.75}
                />
              </Button>
              <FiltersModal
                sortBy={sortBy}
                setSortBy={setSortBy}
                order={order}
                setOrder={setOrder}
                isVisible={modalVisible}
                onClose={closeModal}
                minPrice={minPrice}
                maxPrice={maxPrice}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
                minExperience={minExperience}
                maxExperience={maxExperience}
                setMinExperience={setMinExperience}
                setMaxExperience={setMaxExperience}
              />
              <View className="rounded-xl my-2 shadow-sm bg-slate-50 dark:bg-backgroundPrimary overflow-hidden h-20 py-2 px-4 hidden justify-between flex-row items-center">
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
                        <Check
                          className=" mt-1 mr-1 text-greenPrimary"
                          size={20}
                        />
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
            </View>
          }
          ListFooterComponent={
            <View className="flex flex-row justify-center gap-4 mt-4">
              <Button
                onPress={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
                variant="outline"
                size="icon"
                className="border-black  dark:border-white"
              >
                <ChevronLeft className="w-8 h-8 text-black dark:text-white" />
              </Button>
              <Button
                onPress={() =>
                  !isPlaceholderData &&
                  data?.has_more &&
                  setPage((prev) => prev + 1)
                }
                disabled={isPlaceholderData || !data?.has_more}
                variant="outline"
                size="icon"
                className="border-black dark:border-white"
              >
                <ChevronRight className="w-8 h-8 text-black dark:text-white" />
              </Button>
            </View>
          }
        />
      )}
    </View>
  );
}
