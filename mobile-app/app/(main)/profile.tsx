import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "@/lib/auth";
import { updateUserProfile } from "@/lib/api";

export default function ProfileScreen() {
  const { user, token, logout, setSession } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async () => {
    if (!token) return;
    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const data = await updateUserProfile(token, { name: name.trim() });
      await setSession(token, data.user);
      setSuccess("Profile updated");
    } catch (e: any) {
      setError(e.message ?? "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F3F4FA] px-6 pt-14 pb-6">
      <Text className="text-3xl font-extrabold text-gray-900 mb-1">
        Profile
      </Text>
      <Text className="text-gray-500 mb-6">
        Manage your account and keep your karma journey going.
      </Text>

      <View className="bg-white rounded-3xl p-6 shadow-md mb-4 gap-4">
        <View>
          <Text className="text-sm text-gray-500 mb-1">Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            className="border border-gray-200 rounded-2xl px-4 py-3 text-gray-900"
          />
        </View>

        <View>
          <Text className="text-sm text-gray-500 mb-1">Email</Text>
          <Text className="text-gray-900 font-medium">
            {user?.email ?? "Email unknown"}
          </Text>
        </View>

        <View>
          <Text className="text-sm text-gray-500 mb-1">Username</Text>
          <Text className="text-gray-900 font-medium">
            {user?.username ?? "Will be generated from your name"}
          </Text>
        </View>

        {error ? (
          <Text className="text-rose-500 text-sm mt-1">{error}</Text>
        ) : null}
        {success ? (
          <Text className="text-emerald-500 text-sm mt-1">{success}</Text>
        ) : null}

        <TouchableOpacity
          className="mt-2 bg-cyan-500 rounded-full py-3 px-4 items-center flex-row justify-center"
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-lg font-semibold">Save</Text>
          )}
        </TouchableOpacity>
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

