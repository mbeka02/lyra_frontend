import { useState } from "react";
import { View, FlatList } from "react-native";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllDoctors } from "~/services/doctor";
import { Button } from "~/components/ui/button";
import { Loader } from "~/components/Loader";
import { Text } from "~/components/ui/text";
import { DoctorCard } from "./DoctorCard";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { Filter } from "~/lib/icons/Filter";
import { ComboBox } from "~/components/ComboBox";
import { FiltersModal } from "./FiltersModal";

type SortOption = "experience" | "price" | null;
type OrderOption = "asc" | "desc";

interface FilterState {
  sortBy: SortOption;
  order: OrderOption;
  county: string | null;
  minPrice: string;
  maxPrice: string;
  minExperience: string;
  maxExperience: string;
}

const initialFilters: FilterState = {
  sortBy: "experience",
  order: "asc",
  county: null,
  minPrice: "",
  maxPrice: "",
  minExperience: "",
  maxExperience: "",
};

export function DoctorList() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isFocus, setIsFocus] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const { isPending, isError, data, isPlaceholderData } = useQuery({
    queryKey: [
      "doctors",
      page,
      filters.sortBy,
      filters.order,
      filters.county,
      filters.minExperience,
      filters.maxExperience,
      filters.minPrice,
      filters.maxPrice,
    ],
    queryFn: () =>
      getAllDoctors(
        page,
        filters.sortBy,
        filters.order,
        filters.county,
        filters.minExperience,
        filters.maxExperience,
        filters.minPrice,
        filters.maxPrice,
      ),
    placeholderData: keepPreviousData,
  });

  const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNextPage = () => {
    if (!isPlaceholderData && data?.has_more) {
      setPage((prev) => prev + 1);
    }
  };

  const handleFilterChange = <T extends keyof FilterState>(
    key: T,
    value: FilterState[T],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleModal = () => setModalVisible(!modalVisible);

  return (
    <View className="py-2 px-4 mb-8">
      {isPending ? (
        <Loader />
      ) : isError ? (
        <Text className="font-jakarta-regular font-semibold text-red-600">
          Error loading doctors
        </Text>
      ) : (
        <FlatList
          data={data.doctors}
          className="my-2"
          keyExtractor={(item) => item.doctor_id.toString()}
          renderItem={({ item }) => <DoctorCard {...item} />}
          ListHeaderComponent={
            <View className="flex-row p-4 my-2 mt-4 dark:bg-backgroundPrimary bg-slate-50 rounded-xl shadow-sm items-center justify-between w-full">
              <ComboBox
                county={filters.county}
                setIsFocus={setIsFocus}
                setCounty={(value) => handleFilterChange("county", value)}
                isFocus={isFocus}
              />
              <Button size="icon" variant="ghost" onPress={toggleModal}>
                <Filter
                  className="w-5 h-5 text-black dark:text-gray-300"
                  strokeWidth={1.75}
                />
              </Button>
            </View>
          }
          ListFooterComponent={
            <View className="flex flex-row justify-center gap-4 mt-4">
              <Button
                onPress={handlePreviousPage}
                disabled={page === 0}
                variant="outline"
                size="icon"
                className="border-black dark:border-white"
              >
                <ChevronLeft className="w-8 h-8 text-black dark:text-white" />
              </Button>
              <Button
                onPress={handleNextPage}
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

      <FiltersModal
        {...filters}
        setSortBy={(value) => handleFilterChange("sortBy", value)}
        setOrder={(value) => handleFilterChange("order", value)}
        setMinPrice={(value) => handleFilterChange("minPrice", value)}
        setMaxPrice={(value) => handleFilterChange("maxPrice", value)}
        setMinExperience={(value) => handleFilterChange("minExperience", value)}
        setMaxExperience={(value) => handleFilterChange("maxExperience", value)}
        isVisible={modalVisible}
        onClose={toggleModal}
      />
    </View>
  );
}
