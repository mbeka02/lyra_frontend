import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import UserAvatar from "../shared/UserAvatar";
import { Star, Phone } from "lucide-react-native";
import { Calendar } from "~/lib/icons/Calendar";
import { Users } from "~/lib/icons/Users";
import { Coins } from "~/lib/icons/Coins";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { AppointmentModal } from "./AppointmentModal";
interface DoctorCardProps {
  doctor_id: number;
  full_name: string;
  description: string;
  specialization: string;
  profile_image_url: string;
  years_of_experience: number;
  price_per_hour: string;
  county: string;
  onBookAppointment?: (doctorName: string) => void; // Optional callback for appointment booking
}

export function DoctorCard({
  full_name,
  description,
  specialization,
  profile_image_url,
  years_of_experience,
  price_per_hour,
  doctor_id,
  county,
}: DoctorCardProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const doctorData = {
    full_name,
    description,
    specialization,
    profile_image_url,
    years_of_experience,
    price_per_hour,
    county,
    doctor_id,
  };
  return (
    <>
      <Card className="w-full dark:bg-backgroundPrimary bg-slate-50 my-4">
        <CardContent className="p-4">
          <View className="flex items-center flex-row">
            <UserAvatar name={full_name} uri={profile_image_url} size={60} />
            <View className="space-y-1 ml-4">
              <Text className="font-jakarta-semibold text-lg">{full_name}</Text>
              <Text className="text-muted-foreground text-sm">
                {specialization} | {county} county
              </Text>
              <View className="flex flex-row items-center gap-1">
                <Star
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  size={20}
                  fill="#faac15"
                />
                {/*TODO: Add rating*/}
                <Text className="text-sm font-jakarta-medium">0.0</Text>
                {/*TODO: Add reviews*/}
                <Text className="text-sm text-muted-foreground font-jakarta-medium">
                  (0 reviews)
                </Text>
              </View>
            </View>
          </View>
          <View className="mt-4 space-y-4">
            <Text className="font-jakarta-regular text-sm text-muted-foreground">
              {description.slice(0, 80) + "..."}
            </Text>
            <View className="flex flex-row justify-between items-center my-2">
              <View className="flex flex-row items-center gap-2">
                <Calendar
                  className="h-4 w-4 text-black dark:text-white"
                  strokeWidth={1}
                />
                <View>
                  <Text className="text-sm font-jakarta-medium">
                    {years_of_experience} years
                  </Text>
                  <Text className="text-xs text-muted-foreground font-jakarta-light">
                    Experience
                  </Text>
                </View>
              </View>
              <View className="flex flex-row items-center gap-2">
                <Users
                  strokeWidth={1}
                  className="h-4 w-4 text-black dark:text-white"
                />
                <View>
                  {/*TODO: Add number of patients served*/}
                  <Text className="text-sm font-jakarta-medium">0</Text>
                  <Text className="text-xs text-muted-foreground font-jakarta-light">
                    Patients
                  </Text>
                </View>
              </View>
              <View className="flex flex-row items-center gap-2">
                <Coins
                  strokeWidth={1}
                  className=" dark:text-white text-black"
                />
                <View>
                  <Text className="text-sm font-jakarta-medium">
                    ksh {price_per_hour}
                  </Text>
                  <Text className="text-xs text-muted-foreground font-jakarta-light">
                    Per Hour
                  </Text>
                </View>
              </View>
            </View>
            <Button
              className="bg-greenPrimary mt-6 mb-2 flex flex-row items-center w-full gap-2"
              onPress={openModal}
            >
              <Phone className="text-white h-4 w-4" size={18} color="white" />
              <Text className="font-jakarta-semibold text-lg text-white">
                Book Appointment
              </Text>
            </Button>
          </View>
        </CardContent>
      </Card>
      <AppointmentModal
        isVisible={modalVisible}
        onClose={closeModal}
        doctor={doctorData}
      />
    </>
  );
}
