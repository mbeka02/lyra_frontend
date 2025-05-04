import { useQuery, UseQueryResult } from "@tanstack/react-query";
// Make sure fetchPatientDocuments is correctly imported (adjust path if needed)
import { GetPatientDocuments as fetchPatientDocuments } from "@/services/documents"; // Renaming on import for clarity
import { Bundle, DocumentReference } from "@/types/fhir"; // Your FHIR types
import { Role } from "~/providers/AuthProvider";
import { useMemo } from "react";
// Define the structure of the Bundle again or import if defined elsewhere
interface DocumentReferenceBundle extends Bundle {
  entry?: { resource: DocumentReference }[];
}
type PatientDocumentsQueryKey =
  | ["myPatientDocuments", number | string | undefined] // Key for patient viewing their own
  | ["patientDocumentsForSpecialist", number | string | undefined]; // Key for specialist viewing specific patient
interface usePatientHookParams {
  role: Role;
  selfUserId?: number; // Logged-in user's ID for unique patient key

  targetPatientId?: number; // The patient ID needed when role is SPECIALIST
}
export const usePatientDocuments = (
  params: usePatientHookParams,
): UseQueryResult<DocumentReference[], Error> => {
  const { role, selfUserId, targetPatientId } = params;
  // Determine the correct query key based on role
  const queryKey = useMemo((): PatientDocumentsQueryKey => {
    if (role === Role.PATIENT) {
      // Key specific to the logged-in user viewing their *own* documents
      return ["myPatientDocuments", selfUserId];
    } else if (role === Role.SPECIALIST) {
      // Key specific to the specialist viewing a *target* patient
      return ["patientDocumentsForSpecialist", targetPatientId];
    } else {
      // Undefined/fallback key - query will likely be disabled
      return ["patientDocumentsForSpecialist", undefined];
    }
  }, [role, selfUserId, targetPatientId]);

  // Determine if the query should be enabled
  const enabled = useMemo(() => {
    if (!role || !selfUserId) return false; // Must have role and logged-in user ID
    if (role === Role.PATIENT) return true; // Always enabled for logged-in patient
    if (role === Role.SPECIALIST) return !!targetPatientId; // Enabled only if target ID is provided for specialist
    return false; // Disabled for other roles or missing info
  }, [role, selfUserId, targetPatientId]);
  // <-- Explicit return type added
  return useQuery<
    DocumentReferenceBundle, // TQueryFnData: Type returned by queryFn (fetchPatientDocuments)
    Error, // TError: Type of error thrown
    DocumentReference[], // TData: Final data type after select function
    PatientDocumentsQueryKey // TQueryKey: Type of the query key array
  >({
    // Pass generics to useQuery
    queryKey: queryKey, // Use the defined query key type
    queryFn: () => {
      if (role === Role.PATIENT) {
        // Patient fetching their own: Call API *without* explicit patientId param
        console.log("Fetching documents for logged-in patient...");
        return fetchPatientDocuments({});
      } else if (role === Role.SPECIALIST) {
        // Specialist fetching for a target patient
        if (!targetPatientId) {
          // This case should ideally be prevented by the 'enabled' flag, but check again
          console.error("Specialist role requires targetPatientId");
          throw new Error("Patient ID is required for specialists");
        }
        console.log(
          `Fetching documents for patient ${targetPatientId} by specialist...`,
        );
        // Call API *with* the target patientId param
        return fetchPatientDocuments({ patientId: targetPatientId });
      } else {
        // Should not happen if 'enabled' logic is correct
        throw new Error("Invalid role for fetching documents");
      }
    },
    select: (bundle: DocumentReferenceBundle): DocumentReference[] => {
      // Type input to select
      // Safely extract DocumentReference resources
      return (
        bundle.entry
          ?.map((entry) => entry.resource)
          .filter(
            (resource): resource is DocumentReference =>
              resource?.resourceType === "DocumentReference",
          ) ?? [] // defaults to empty array if entry is null/undefined
      );
    },
    refetchInterval: 60000,
    enabled: enabled,
  });
};
