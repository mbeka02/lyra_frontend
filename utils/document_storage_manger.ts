import AsyncStorage from "@react-native-async-storage/async-storage";
import { DocumentReference } from "@/types/fhir";

// Prefix for document keys in AsyncStorage
const DOCUMENT_KEY_PREFIX = "document_";

/**
 * A utility class for managing document storage and retrieval
 * to ensure consistency and prevent duplicates
 */
class DocumentStorageManager {
  /**
   * Save a document to AsyncStorage
   * @param {DocumentReference} document - The document to save
   * @returns {Promise<void>}
   */
  static async saveDocument(document: DocumentReference): Promise<void> {
    if (!document || !document.id) {
      throw new Error("Cannot save document: Invalid document or missing ID");
    }

    try {
      const key = `${DOCUMENT_KEY_PREFIX}${document.id}`;
      await AsyncStorage.setItem(key, JSON.stringify(document));
    } catch (error) {
      console.error("Error saving document to storage:", error);
      throw error;
    }
  }

  /**
   * Get a document from AsyncStorage by ID
   * @param {string} documentId - The ID of the document to retrieve
   * @returns {Promise<DocumentReference | null>} The document or null if not found
   */
  static async getDocument(
    documentId: string,
  ): Promise<DocumentReference | null> {
    if (!documentId) {
      return null;
    }

    try {
      const key = `${DOCUMENT_KEY_PREFIX}${documentId}`;
      const documentJson = await AsyncStorage.getItem(key);

      if (!documentJson) {
        return null;
      }

      return JSON.parse(documentJson) as DocumentReference;
    } catch (error) {
      console.error("Error retrieving document from storage:", error);
      return null;
    }
  }

  /**
   * Delete a document from AsyncStorage by ID
   * @param {string} documentId - The ID of the document to delete
   * @returns {Promise<void>}
   */
  static async deleteDocument(documentId: string): Promise<void> {
    if (!documentId) {
      return;
    }

    try {
      const key = `${DOCUMENT_KEY_PREFIX}${documentId}`;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error deleting document from storage:", error);
      throw error;
    }
  }

  /**
   * Get all documents from AsyncStorage
   * @returns {Promise<DocumentReference[]>} Array of documents
   */
  static async getAllDocuments(): Promise<DocumentReference[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const documentKeys = keys.filter((key) =>
        key.startsWith(DOCUMENT_KEY_PREFIX),
      );

      if (documentKeys.length === 0) {
        return [];
      }

      const documentJsons = await AsyncStorage.multiGet(documentKeys);
      const documents: DocumentReference[] = [];

      for (const [_, value] of documentJsons) {
        if (value) {
          documents.push(JSON.parse(value) as DocumentReference);
        }
      }

      return documents;
    } catch (error) {
      console.error("Error retrieving all documents from storage:", error);
      return [];
    }
  }

  /**
   * Clear all documents from AsyncStorage
   * @returns {Promise<void>}
   */
  static async clearAllDocuments(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const documentKeys = keys.filter((key) =>
        key.startsWith(DOCUMENT_KEY_PREFIX),
      );

      if (documentKeys.length > 0) {
        await AsyncStorage.multiRemove(documentKeys);
      }
    } catch (error) {
      console.error("Error clearing documents from storage:", error);
      throw error;
    }
  }
}

export default DocumentStorageManager;
