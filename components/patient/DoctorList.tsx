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

  const { isPending, isError, data, isFetching, isPlaceholderData } = useQuery({
    queryKey: ["projects", page, sortBy, order],
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
          renderItem={({ item }) => <DoctorCard {...item} />}
          ListHeaderComponent={
            <View className="rounded-xl my-2 shadow-sm bg-slate-50 dark:bg-backgroundPrimary overflow-hidden h-24 py-2 px-4 flex justify-between flex-row items-center">
              <Text className="font-jakarta-semibold mr-3">Sort By</Text>
              <View className="flex gap-2 flex-row items-center">
                {(["price", "experience"] as const).map((criteria) => (
                  <Button
                    key={criteria}
                    onPress={() => setSortBy(criteria)}
                    variant="outline"
                    size="sm"
                    className={`rounded-xl bg-transparent  flex flex-row items-center ${sortBy === criteria ? "border-greenPrimary bg-greenPrimary/20" : ""}`}
                  >
                    {sortBy === criteria && (
                      <Check className=" mt-1 text-greenPrimary" size={22} />
                    )}
                    <Text
                      className={`text-xs font-jakarta-semibold ${sortBy === criteria ? "text-greenPrimary" : ""}`}
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
                    className="bg-white dark:bg-black"
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
          }
        />
      )}
      <View className="flex flex-row justify-between mt-4">
        <Button
          onPress={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          variant="outline"
          size="icon"
        >
          <ChevronLeft className="w-8 h-8 text-input" />
        </Button>
        <Button
          onPress={() =>
            !isPlaceholderData && data?.has_more && setPage((prev) => prev + 1)
          }
          disabled={isPlaceholderData || !data?.has_more}
          variant="outline"
          size="icon"
        >
          <ChevronRight className="w-8 h-8 text-input" />
        </Button>
      </View>
      {isFetching && <Loader />}
    </View>
  );
}
