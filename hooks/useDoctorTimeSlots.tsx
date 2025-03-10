import { useQuery } from "@tanstack/react-query";
import { requestDoctorTimeSlots } from "~/services/doctor";

// Custom hook that uses useQuery with your function
export const useDoctorTimeSlots = (
  day_of_week: number,
  doctor_id: number,
  slot_date: Date,
) => {
  console.log(" fn running");
  return useQuery({
    queryKey: ["doctorTimeSlots", doctor_id, day_of_week, slot_date],
    queryFn: () => requestDoctorTimeSlots(day_of_week, doctor_id, slot_date),
    enabled: !!doctor_id && day_of_week !== undefined && !!slot_date,
    // Other options you might want
    // staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
};
