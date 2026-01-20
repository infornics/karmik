import { Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "@/lib/auth";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View className="flex-1 bg-[#F3F4FA] px-6 pt-14 pb-6">
      <Text className="text-3xl font-extrabold text-gray-900 mb-1">
        Profile
      </Text>
      <Text className="text-gray-500 mb-6">
        Manage your account and keep your karma journey going.
      </Text>

      <View className="bg-white rounded-3xl p-6 shadow-md mb-4">
        <Text className="text-sm text-gray-500 mb-1">Signed in as</Text>
        <Text className="text-lg font-semibold text-gray-900 mb-1">
          {user?.name || "Karmik user"}
        </Text>
        <Text className="text-gray-600">{user?.email ?? "Email unknown"}</Text>
      </View>

      <TouchableOpacity
        className="mt-auto bg-gray-900 rounded-full py-4 px-4 items-center"
        onPress={logout}
      >
        <Text className="text-white text-lg font-semibold">Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

