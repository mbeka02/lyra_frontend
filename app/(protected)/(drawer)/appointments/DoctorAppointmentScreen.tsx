import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDoctorAppointments } from "~/services/appointments";
import { AppointmentsList } from "./AppointmentsList";
import { DoctorAppointment } from "~/services/types";

export default function DoctorAppointmentsScreen() {
  const [interval, setInterval] = useState(21);
  const [status, setStatus] = useState("");

  const {
    data: appointments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["doctor-appointments", status, interval],
    queryFn: () => getDoctorAppointments(status, interval),
    refetchInterval: 12000,
  });

  return (
    <AppointmentsList<DoctorAppointment>
      appointments={appointments}
      title="Your Schedule"
      isLoading={isLoading}
      isError={isError}
      viewType="specialist"
      newAppointmentRoute="/"
      emptyStateMessage="You don't have any appointments scheduled at the moment."
    />
  );
}
