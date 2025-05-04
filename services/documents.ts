import { Api } from "./api";
import type { Bundle, DocumentReference } from "~/types/fhir";

// Define the structure of the Bundle returned by your API
export interface DocumentReferenceBundle extends Bundle {
  entry?: { resource: DocumentReference }[]; // Specify the resource type in entry
}
export function UploadPatientDocument(data: FormData) {
  return Api.postForm("/documents/upload", data);
}
interface GetPatientDocumentParams {
  patientId?: number;
}
export function GetSignedURL(url: string): Promise<string> {
  return Api.post("/documents/signed-url", {
    unsigned_url: url,
  });
}
export function GetPatientDocuments(
  params: GetPatientDocumentParams,
): Promise<DocumentReferenceBundle> {
  const urlParams = new URLSearchParams();
  if (params.patientId)
    urlParams.append("patient_id", params.patientId.toString());
  const queryString = urlParams.toString();
  return Api.get(`/documents${queryString ? "?" + queryString : ""}`);
}
