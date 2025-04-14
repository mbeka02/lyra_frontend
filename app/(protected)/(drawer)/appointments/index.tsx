import { WithRole } from "~/components/WithRole";
import { Role } from "~/providers/AuthProvider";
import PatientAppointmentsScreen from "~/components/platform/patient/PatientAppointmentsScreen";
import DoctorAppointmentsScreen from "~/components/platform/doctor/DoctorAppointmentScreen";
export default function AppointmentsScreen() {
  return (
    <>
      <WithRole role={Role.PATIENT}>
        <PatientAppointmentsScreen />
      </WithRole>
      <WithRole role={Role.SPECIALIST}>
        <DoctorAppointmentsScreen />
      </WithRole>
    </>
  );
}
