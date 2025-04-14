import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPatientAppointments } from "~/services/appointments";
import { AppointmentsList } from "~/components/platform/shared/AppointmentsList";
import { PatientAppointment } from "~/services/types";

export default function PatientAppointmentsScreen() {
  const [interval, setInterval] = useState(21);
  const [status, setStatus] = useState("");

  const {
    data: appointments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["patient-appointments", status, interval],
    queryFn: () => getPatientAppointments(status, interval),
    refetchInterval: 12000,
  });

  return (
    <AppointmentsList<PatientAppointment>
      appointments={appointments}
      title="Your Appointments"
      isLoading={isLoading}
      isError={isError}
      viewType="patient"
      newAppointmentRoute="/search"
      emptyStateMessage="You don't have any appointments scheduled at the moment."
    />
  );
}
