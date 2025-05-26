import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { toast } from "sonner-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";

type PatientDetail = {
  id: string;
  resourceType: "Patient";
  name: [
    {
      given: string[];
      family: string;
    },
  ];
  birthDate: string;
  gender: string;
  address: [
    {
      line: string[];
      city: string;
      state: string;
      postalCode: string;
    },
  ];
};

type Observation = {
  id: string;
  resourceType: "Observation";
  code: {
    text: string;
  };
  valueString?: string;
  effectiveDateTime: string;
};

type Document = {
  id: string;
  resourceType: "DocumentReference";
  content: [
    {
      attachment: {
        url: string;
        title: string;
        contentType: string;
      };
    },
  ];
  type: {
    text: string;
  };
  date: string;
};

export default function PatientDetails() {
  const { id: patientId } = useLocalSearchParams<{ id: string }>();
  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [note, setNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  useEffect(() => {
    // Simulate fetching patient data
    fetchPatientData();
    fetchObservations();
    fetchDocuments();
  }, [patientId]);

  const fetchPatientData = () => {
    // Mock patient data
    setPatient({
      id: patientId.toString(),
      resourceType: "Patient",
      name: [
        {
          given: ["John"],
          family: "Doe",
        },
      ],
      birthDate: "1990-05-15",
      gender: "male",
      address: [
        {
          line: ["123 Main St"],
          city: "Springfield",
          state: "IL",
          postalCode: "62701",
        },
      ],
    });
  };

  const fetchObservations = () => {
    // Mock observations
    setObservations([
      {
        id: "1",
        resourceType: "Observation",
        code: { text: "Consultation Note" },
        valueString: "Patient presents with mild fever and cough",
        effectiveDateTime: "2025-05-09T10:30:00Z",
      },
    ]);
  };

  const fetchDocuments = () => {
    // Mock documents
    setDocuments([
      {
        id: "1",
        resourceType: "DocumentReference",
        content: [
          {
            attachment: {
              url: "https://example.com/doc1.pdf",
              title: "Blood Test Results",
              contentType: "application/pdf",
            },
          },
        ],
        type: { text: "Lab Result" },
        date: "2025-05-08T15:30:00Z",
      },
    ]);
  };

  const handleAddNote = () => {
    if (!note.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    const newObservation = {
      id: Date.now().toString(),
      resourceType: "Observation",
      code: { text: "Consultation Note" },
      valueString: note,
      effectiveDateTime: new Date().toISOString(),
    };

    setObservations([newObservation as Observation, ...observations]);
    setNote("");
    setShowNoteInput(false);
    toast.success("Note added successfully");
  };

  const handleUploadDocument = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        const newDocument = {
          id: Date.now().toString(),
          resourceType: "DocumentReference",
          content: [
            {
              attachment: {
                url: result.assets[0].uri,
                title: "Uploaded Document",
                contentType: "image/jpeg",
              },
            },
          ],
          type: { text: "Lab Result" },
          date: new Date().toISOString(),
        };

        setDocuments([newDocument as Document, ...documents]);
        toast.success("Document uploaded successfully");
      }
    } catch (error) {
      toast.error("Error uploading document");
    }
  };

  if (!patient) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading patient data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Patient Record</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Information</Text>
        <View style={styles.patientInfo}>
          <Text
            style={styles.name}
          >{`${patient.name[0].given.join(" ")} ${patient.name[0].family}`}</Text>
          <Text style={styles.details}>
            DOB: {format(new Date(patient.birthDate), "MMM dd, yyyy")}
          </Text>
          <Text style={styles.details}>Gender: {patient.gender}</Text>
          <Text style={styles.details}>
            Address: {patient.address[0].line.join(", ")},{" "}
            {patient.address[0].city}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Consultation Notes</Text>
          <Pressable
            style={styles.addButton}
            onPress={() => setShowNoteInput(true)}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
          </Pressable>
        </View>

        {showNoteInput && (
          <View style={styles.noteInput}>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="Enter consultation note..."
              value={note}
              onChangeText={setNote}
            />
            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowNoteInput(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.saveButton]}
                onPress={handleAddNote}
              >
                <Text style={styles.buttonText}>Save Note</Text>
              </Pressable>
            </View>
          </View>
        )}

        {observations.map((obs) => (
          <View key={obs.id} style={styles.noteCard}>
            <Text style={styles.noteText}>{obs.valueString}</Text>
            <Text style={styles.noteDate}>
              {format(new Date(obs.effectiveDateTime), "MMM dd, yyyy HH:mm")}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Documents</Text>
          <Pressable style={styles.addButton} onPress={handleUploadDocument}>
            <MaterialIcons name="file-upload" size={24} color="#fff" />
          </Pressable>
        </View>

        {documents.map((doc) => (
          <View key={doc.id} style={styles.documentCard}>
            <MaterialIcons name="description" size={24} color="#4B5563" />
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>
                {doc.content[0].attachment.title}
              </Text>
              <Text style={styles.documentDate}>
                {format(new Date(doc.date), "MMM dd, yyyy HH:mm")}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#FFF",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  section: {
    backgroundColor: "#FFF",
    marginTop: 12,
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  patientInfo: {
    marginTop: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  details: {
    fontSize: 16,
    color: "#4B5563",
    marginBottom: 2,
  },
  addButton: {
    backgroundColor: "#3B82F6",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  noteInput: {
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: "#6B7280",
  },
  saveButton: {
    backgroundColor: "#3B82F6",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },
  noteCard: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  noteText: {
    fontSize: 16,
    color: "#374151",
  },
  noteDate: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  documentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  documentDate: {
    fontSize: 14,
    color: "#6B7280",
  },
});
