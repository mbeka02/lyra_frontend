import { getAllDoctors } from "~/services/doctor";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../ui/button";
import { Loader } from "../Loader";
import { View, FlatList, TouchableOpacity } from "react-native";
import { Text } from "../ui/text";
import { DoctorCard } from "./DoctorCard";
import { Check } from "~/lib/icons/Check";
import { ChevronUp } from "~/lib/icons/ChevronUp";
import { ChevronDown } from "~/lib/icons/ChevronDown";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import { ChevronRight } from "~/lib/icons/ChevronRight";
export function DoctorList() {
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<"experience" | "price" | null>(null);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const {
    isPending,
    isPlaceholderData,
    isLoading,
    isError,
    error,
    data,
    isFetching,
  } = useQuery({
    queryKey: ["projects", page],
    queryFn: () => getAllDoctors(page, sortBy, order),
    placeholderData: keepPreviousData,
  });

  return (
    <View className="py-2 px-4">
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
          keyExtractor={(item) => item.doctor_id}
          renderItem={({ item }) => (
            <DoctorCard
              full_name={item.full_name}
              description={item.description}
              profile_image_url={item.profile_image_url}
              specialization={item.specialization}
              years_of_experience={item.years_of_experience}
              price_per_hour={item.price_per_hour}
            />
          )}
          ListHeaderComponent={
            <View className="rounded-xl shadow-sm bg-slate-50 dark:bg-backgroundPrimary overflow-hidden h-24 py-2 px-4 flex justify-between flex-row items-center">
              <Text className="font-jakarta-semibold mr-3">Sort By</Text>
              <View className="space-x-2">
                <Button
                  onPress={() => setSortBy("price")}
                  variant="outline"
                  className={`rounded-xl dark:border-white border-black ${sortBy === "price"
                      ? "border-greenPrimary bg-greenPrimary/50"
                      : ""
                    }`}
                >
                  {sortBy === "price" && (
                    <Check className="w-5 h-5 text-greenPrimary" />
                  )}
                  <Text className={`text-sm font-jakarta-semibold `}>
                    pricing
                  </Text>
                </Button>
                <Button
                  onPress={() => setSortBy("experience")}
                  variant="outline"
                  className={`rounded-xl dark:border-white border-black ${sortBy === "experience"
                      ? "border-greenPrimary bg-greenPrimary/50"
                      : ""
                    }`}
                >
                  {sortBy === "experience" && (
                    <Check className="w-5 h-5 text-greenPrimary" />
                  )}
                  <Text className={`text-sm font-jakarta-semibold `}>
                    experience
                  </Text>
                </Button>
              </View>
              <View className="flex rounded-md shadow-sm justify-center space-x-2">
                <TouchableOpacity onPress={() => setOrder("asc")}>
                  <ChevronUp
                    className={`w-5 h-5 text-black dark:text-white ${order === "asc" ? "text-greenPrimary" : ""}`}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setOrder("desc")}>
                  <ChevronDown
                    className={`w-5 h-5 text-black dark:text-white ${order === "desc" ? "text-greenPrimary" : ""}`}
                  />
                </TouchableOpacity>
              </View>
            </View>
          }
        />
      )}
      <Button
        onPress={() => setPage((old) => Math.max(old - 1, 0))}
        disabled={page === 0}
        variant="outline"
        size="icon"
      >
        <ChevronLeft className="w-8 h-8 text-input" />
      </Button>
      <Button
        onPress={() => {
          if (!isPlaceholderData && data?.has_more) {
            setPage((old) => old + 1);
          }
        }}
        // Disable the Next Page Button until we know a next page is available
        disabled={isPlaceholderData || !data?.has_more}
        variant="outline"
        size="icon"
      >
        <ChevronRight className="w-8 h-8 text-input" />
      </Button>
      {/*isFetching ? <Loader /> : null*/}
    </View>
  );
}
