import { useQuery, UseQueryResult } from "@tanstack/react-query";
// Make sure fetchPatientDocuments is correctly imported (adjust path if needed)
import { GetPatientDocuments as fetchPatientDocuments } from "@/services/documents"; // Renaming on import for clarity
import { Bundle, DocumentReference } from "@/types/fhir"; // Your FHIR types
import { Role } from "~/providers/AuthProvider";

// Define the structure of the Bundle again or import if defined elsewhere
interface DocumentReferenceBundle extends Bundle {
  entry?: { resource: DocumentReference }[];
}

// Type for the query key for better type safety
type PatientDocumentsQueryKey = ["patientDocuments", number | undefined];

export const usePatientDocuments = (
  role: Role,
  patientId?: number,
): UseQueryResult<DocumentReference[], Error> => {
  // <-- Explicit return type added
  return useQuery<
    DocumentReferenceBundle, // TQueryFnData: Type returned by queryFn (fetchPatientDocuments)
    Error, // TError: Type of error thrown
    DocumentReference[], // TData: Final data type after select function
    PatientDocumentsQueryKey // TQueryKey: Type of the query key array
  >({
    // Pass generics to useQuery
    queryKey: ["patientDocuments", patientId], // Use the defined query key type
    queryFn: () => {
      if (!patientId && role === Role.SPECIALIST) {
        // Throwing an error here is okay, or return Promise.reject()
        // React Query handles queryFn errors
        throw new Error("Patient ID is required");
        // return Promise.reject(new Error("Patient ID is required")); // Alternative
      }
      return fetchPatientDocuments({ patientId: patientId });
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
    // enabled: !!patientId,
  });
};
