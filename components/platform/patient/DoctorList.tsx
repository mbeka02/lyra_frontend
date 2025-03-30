import { getAllDoctors } from "~/services/doctor";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Loader } from "~/components/Loader";
import { View, FlatList } from "react-native";
import { Text } from "~/components/ui/text";
import { DoctorCard } from "./DoctorCard";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { Filter } from "~/lib/icons/Filter";
import { ComboBox } from "~/components/ComboBox";
import { FiltersModal } from "./FiltersModal";

// Define types for filter options
type SortOption = "experience" | "price" | null;
type OrderOption = "asc" | "desc";

// Define the filters type
type FilterState = {
  sortBy: SortOption;
  order: OrderOption;
  county: string | null;
  minPrice: string;
  maxPrice: string;
  minExperience: string;
  maxExperience: string;
};

export function DoctorList() {
  // Pagination state
  const [page, setPage] = useState(0);

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    sortBy: "experience",
    order: "asc",
    county: null,
    minPrice: "",
    maxPrice: "",
    minExperience: "",
    maxExperience: "",
  });

  // UI states
  const [isFocus, setIsFocus] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Modal handlers
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  // Query data
  const { isPending, isError, data, isPlaceholderData } = useQuery({
    queryKey: [
      "doctors",
      page,
      filters.county,
      filters.minExperience,
      filters.maxExperience,
      filters.minPrice,
      filters.maxPrice,
      filters.sortBy,
      filters.order,
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

  // Pagination handlers
  const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNextPage = () => {
    if (!isPlaceholderData && data?.has_more) {
      setPage((prev) => prev + 1);
    }
  };

  // Custom handlers for each filter to address type issues
  const handleCountyChange = (value: string | null) => {
    setFilters((prev) => ({ ...prev, county: value }));
  };

  const handleSortByChange = (value: SortOption) => {
    setFilters((prev) => ({ ...prev, sortBy: value }));
  };

  const handleOrderChange = (value: OrderOption) => {
    setFilters((prev) => ({ ...prev, order: value }));
  };

  const handleMinPriceChange = (value: string) => {
    setFilters((prev) => ({ ...prev, minPrice: value }));
  };

  const handleMaxPriceChange = (value: string) => {
    setFilters((prev) => ({ ...prev, maxPrice: value }));
  };

  const handleMinExperienceChange = (value: string) => {
    setFilters((prev) => ({ ...prev, minExperience: value }));
  };

  const handleMaxExperienceChange = (value: string) => {
    setFilters((prev) => ({ ...prev, maxExperience: value }));
  };

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
                setCounty={handleCountyChange}
                isFocus={isFocus}
              />
              <Button size="icon" variant="ghost" onPress={openModal}>
                <Filter
                  className="w-5 h-5 text-black dark:text-gray-300"
                  strokeWidth={1.75}
                />
              </Button>

              <FiltersModal
                sortBy={filters.sortBy}
                setSortBy={handleSortByChange}
                order={filters.order}
                setOrder={handleOrderChange}
                isVisible={modalVisible}
                onClose={closeModal}
                minPrice={filters.minPrice}
                maxPrice={filters.maxPrice}
                setMinPrice={handleMinPriceChange}
                setMaxPrice={handleMaxPriceChange}
                minExperience={filters.minExperience}
                maxExperience={filters.maxExperience}
                setMinExperience={handleMinExperienceChange}
                setMaxExperience={handleMaxExperienceChange}
              />
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
    </View>
  );
}
