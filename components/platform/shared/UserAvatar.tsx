import { ImageSourcePropType } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";

// import defaultAvatar from "@/assets/images/default-avatar.png";
interface UserAvatarProps {
  uri: string | undefined | null; //  profile image URL
  name?: string; // User's full name
  size?: number; // Avatar size (optional, default: 40)
}

function UserAvatar({ uri, name, size = 40 }: UserAvatarProps) {
  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Determine the image source
  const imageSource: ImageSourcePropType = uri
    ? { uri }
    : require("@/assets/images/default-avatar.png");

  return (
    <Avatar style={{ width: size, height: size }} alt={`${name}'s Avatar`}>
      <AvatarImage source={imageSource} />
      <AvatarFallback className="rounded-full bg-greenPrimary">
        {name ? (
          <Text
            className="font-jakarta-light text-white"
            style={{ fontSize: size / 2 }}
          >
            {getInitials(name)}
          </Text>
        ) : (
          <Text
            className="font-jakarta-light text-white"
            style={{ fontSize: size / 2 }}
          >
            US
          </Text>
        )}
      </AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;
