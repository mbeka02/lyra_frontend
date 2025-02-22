import { getAllDoctors } from "~/services/doctor";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../ui/button";
import { Loader } from "../Loader";
import { View, FlatList } from "react-native";
import { Text } from "../ui/text";
import { DoctorCard } from "./DoctorCard";

export function DoctorList() {
  const [page, setPage] = useState(0);
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
    queryFn: () => getAllDoctors(page),
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
            />
          )}
        />
      )}
      <Button
        onPress={() => setPage((old) => Math.max(old - 1, 0))}
        disabled={page === 0}
        variant="outline"
      >
        <Text> Previous Page</Text>
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
      >
        <Text> Next Page</Text>
      </Button>
      {isFetching ? <Loader /> : null}
    </View>
  );
}
