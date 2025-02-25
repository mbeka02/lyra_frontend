import React, { useState } from "react";
import { View, Switch, StyleSheet, Alert, Platform } from "react-native";
import { Text } from "../ui/text";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Calendar, DateData } from "react-native-calendars";
import { Button } from "../ui/button";
interface FormData {
  day_of_week: number;
  start_time: string; // Format: "HH:mm"
  end_time: string; // Format: "HH:mm"
  is_recurring: boolean;
  specific_date: string; // Format: "YYYY-MM-DD"
}

const AvailabilityForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    day_of_week: 0,
    start_time: "09:00",
    end_time: "17:00",
    is_recurring: true,
    specific_date: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showStartTimePicker, setShowStartTimePicker] =
    useState<boolean>(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState<boolean>(false);

  const daysOfWeek = [
    { label: "Sunday", value: 0 },
    { label: "Monday", value: 1 },
    { label: "Tuesday", value: 2 },
    { label: "Wednesday", value: 3 },
    { label: "Thursday", value: 4 },
    { label: "Friday", value: 5 },
    { label: "Saturday", value: 6 },
  ];

  // Helper: Convert "HH:mm" string to a Date object (arbitrary date)
  const getTimeDate = (timeStr: string): Date => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return new Date(1970, 0, 1, hours, minutes);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    // Convert times into total minutes for comparison
    const [startHour, startMinute] = formData.start_time.split(":").map(Number);
    const [endHour, endMinute] = formData.end_time.split(":").map(Number);
    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;

    if (startTotal >= endTotal) {
      newErrors.time = "End time must be after start time";
    }
    if (!formData.is_recurring && !formData.specific_date) {
      newErrors.date = "Specific date is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;

    const payload = {
      doctor_id: "",
      day_of_week: formData.is_recurring ? formData.day_of_week : null,
      start_time: formData.start_time,
      end_time: formData.end_time,
      is_recurring: formData.is_recurring,
      specific_date: formData.is_recurring ? null : formData.specific_date,
    };

    try {
      const response = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save availability");
    } catch (error: any) {
      console.error("Error saving availability:", error);
      Alert.alert("Error", "Failed to save availability");
    }
  };

  const onStartTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ): void => {
    // For Android, dismiss the picker after selection.
    if (Platform.OS === "android") {
      setShowStartTimePicker(false);
    }
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, "0");
      const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
      setFormData((prev) => ({ ...prev, start_time: `${hours}:${minutes}` }));
    }
  };

  const onEndTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ): void => {
    if (Platform.OS === "android") {
      setShowEndTimePicker(false);
    }
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, "0");
      const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
      setFormData((prev) => ({ ...prev, end_time: `${hours}:${minutes}` }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <Text>Recurring Availability:</Text>
        <Switch
          value={formData.is_recurring}
          onValueChange={(value: boolean) =>
            setFormData((prev) => ({ ...prev, is_recurring: value }))
          }
        />
      </View>

      {formData.is_recurring ? (
        <>
          <Text>Day of Week:</Text>
          <Picker
            selectedValue={formData.day_of_week}
            onValueChange={(value: number) =>
              setFormData((prev) => ({ ...prev, day_of_week: value }))
            }
            style={styles.picker}
          >
            {daysOfWeek.map((day) => (
              <Picker.Item
                key={day.value}
                label={day.label}
                value={day.value}
              />
            ))}
          </Picker>
        </>
      ) : (
        <>
          <Text>Specific Date:</Text>
          <Calendar
            current={formData.specific_date}
            markedDates={{
              [formData.specific_date]: {
                selected: true,
                selectedColor: "#00adf5",
              },
            }}
            onDayPress={(day: DateData) =>
              setFormData((prev) => ({
                ...prev,
                specific_date: day.dateString,
              }))
            }
          />
        </>
      )}

      <Text>Start Time:</Text>
      <Button
        style={styles.timeButton}
        onPress={() => setShowStartTimePicker(true)}
      >
        <Text>{formData.start_time}</Text>
      </Button>
      {showStartTimePicker && (
        <DateTimePicker
          value={getTimeDate(formData.start_time)}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onStartTimeChange}
        />
      )}

      <Text>End Time:</Text>
      <Button onPress={() => setShowEndTimePicker(true)}>
        <Text>{formData.end_time}</Text>
      </Button>
      {showEndTimePicker && (
        <DateTimePicker
          value={getTimeDate(formData.end_time)}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onEndTimeChange}
        />
      )}

      {errors.time && <Text>{errors.time}</Text>}
      {errors.date && <Text>{errors.date}</Text>}

      <Button onPress={handleSubmit}>
        <Text>Add availability</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    color: "black",
  },
  picker: {
    marginVertical: 10,
  },
  timeButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginVertical: 10,
    alignItems: "center",
  },
  timeButtonText: {
    fontSize: 16,
    color: "black",
  },
  error: {
    color: "red",
    marginVertical: 5,
  },
});

export default AvailabilityForm;
