import { Api } from "./api";
import type { Bundle, DocumentReference } from "~/types/fhir";

// Define the structure of the Bundle returned by your API
interface DocumentReferenceBundle extends Bundle {
  entry?: { resource: DocumentReference }[]; // Specify the resource type in entry
}
export function UploadPatientDocument(data: FormData) {
  return Api.post("/documents/upload", data);
}
interface GetPatientDocumentParams {
  patientId?: number;
}
export function GetPatientDocuments(
  params: GetPatientDocumentParams,
): Promise<DocumentReferenceBundle> {
  //TODO: Append patient parameters
  const urlParams = new URLSearchParams();
  if (params.patientId)
    urlParams.append("patient_id", params.patientId.toString());
  const queryString = urlParams.toString();
  return Api.get(`/documents${queryString ? "?" + queryString : ""}`);
}
