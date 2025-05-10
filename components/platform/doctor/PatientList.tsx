import { useQuery } from "@tanstack/react-query";
import { FlatList, View, RefreshControl } from "react-native";
import { GradientText } from "~/components/GradientText";
import PatientCard from "./PatientCard";
import { SkeletonLoader } from "../shared/SkeletonLoader";
import { getPatientsUnderCare } from "~/services/doctor";
import { Text } from "~/components/ui/text";
import { useCallback, useState } from "react";
import { toast } from "sonner-native";
export function PatientList() {
  const {
    data: patients,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["my-patients"],
    queryFn: getPatientsUnderCare,
  });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      toast.error("unable to refresh patients");
      console.error("Error refreshing patients:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  if (isLoading)
    return (
      <SkeletonLoader
        count={3}
        containerStyles="gap-4 py-2 px-6"
        skeletonStlyes="rounded-xl px-4 p-2 w-full h-32"
      />
    );

  if (isError) {
    return (
      <View className="h-full">
        <Text className="font-jakarta-semibold text-xl mx-auto my-auto text-red-600">
          Error: Unable to load page info
        </Text>
      </View>
    );
  }
  return (
    <View className="h-full">
      <View className="mb-6 mx-6 mt-4">
        <GradientText isUnderlined={true} text="My patients" />
      </View>
      <FlatList
        data={patients}
        keyExtractor={(item) => item.patient_id}
        renderItem={({ item }) => (
          <PatientCard
            patient_id={item.patient_id}
            user_id={item.user_id}
            date_of_birth={item.date_of_birth}
            full_name={item.full_name}
            profile_picture={item.profile_picture}
          />
        )}
        className="p-4"
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="p-8 rounded-lg items-center justify-center mt-8 bg-slate-50 dark:bg-backgroundPrimary">
            <Text className="font-jakarta-regular text-base text-center text-gray-500 dark:text-gray-400">
              No patients found
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#24AE7C"
            colors={["#24AE7C"]}
            progressBackgroundColor="#F0F9FF"
          />
        }
      />
    </View>
  );
}
