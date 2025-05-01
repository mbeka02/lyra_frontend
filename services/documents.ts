import { Api } from "./api";
import type { Bundle, DocumentReference } from "~/types/fhir";

// Define the structure of the Bundle returned by your API
interface DocumentReferenceBundle extends Bundle {
  entry?: { resource: DocumentReference }[]; // Specify the resource type in entry
}
export function UploadPatientDocument(data: FormData) {
  return Api.post("/documents/upload", data);
}

export function GetPatientDocuments(): Promise<DocumentReferenceBundle> {
  //TODO: Append patient parameters
  return Api.get("/documents");
}
