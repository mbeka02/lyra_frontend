import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import UserAvatar from "../shared/UserAvatar";
import { Star, Phone } from "lucide-react-native";
import { Calendar } from "~/lib/icons/Calendar";
import { Users } from "~/lib/icons/Users";
import { Clock } from "~/lib/icons/Clock";
import { View } from "react-native";
import { Button } from "../ui/button";
interface DoctorCardProps {
  full_name: string;
  description: string;
  specialization: string;
  profile_image_url: string;
}

export function DoctorCard({
  full_name,
  description,
  specialization,
  profile_image_url,
}: DoctorCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <View className="flex items-center flex-row">
          <UserAvatar name={full_name} uri={profile_image_url} size={60} />
          <View className="space-y-1 ml-4">
            <Text className="font-jakarta-semibold text-lg">{full_name}</Text>
            <Text className="text-muted-foreground text-sm">
              {specialization}
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
                {/*TODO: Add years of experience*/}
                <Text className="text-sm font-jakarta-medium">8+ years</Text>
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
              <Clock strokeWidth={1} className=" dark:text-white text-black" />
              <View>
                {/*TODO: Add response time*/}
                <Text className="text-sm font-jakarta-medium">15 min</Text>
                <Text className="text-xs text-muted-foreground font-jakarta-light">
                  Response
                </Text>
              </View>
            </View>
          </View>
          <Button className="bg-greenPrimary mt-6 mb-2 flex flex-row items-center w-full gap-2">
            <Phone className="text-white h-4 w-4" size={18} color="white" />
            <Text className="font-jakarta-semibold text-lg text-white">
              Book Appointment
            </Text>
          </Button>
        </View>
      </CardContent>
    </Card>
  );
}
