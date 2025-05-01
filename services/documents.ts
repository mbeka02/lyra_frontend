import { Api } from "./api";

export function UploadPatientDocument(data: FormData) {
  return Api.post("/documents/upload", data);
}
