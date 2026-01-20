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
import { router } from "expo-router";

export default function ProfileEditScreen() {
  const { user, token, setSession } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!token) return;
    if (!name.trim() && !username.trim()) {
      setError("Provide at least a name or username");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const payload: { name?: string; username?: string } = {};
      if (name.trim()) payload.name = name.trim();
      if (username.trim()) payload.username = username.trim();

      const data = await updateUserProfile(token, payload);
      await setSession(token, data.user);
      router.back();
    } catch (e: any) {
      setError(e.message ?? "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F3F4FA] px-6 pt-14 pb-6">
      <Text className="text-3xl font-extrabold text-gray-900 mb-1">
        Edit profile
      </Text>
      <Text className="text-gray-500 mb-6">
        Update your display name and username.
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
          <Text className="text-sm text-gray-500 mb-1">Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Pick a username"
            autoCapitalize="none"
            className="border border-gray-200 rounded-2xl px-4 py-3 text-gray-900"
          />
          <Text className="text-xs text-gray-400 mt-1">
            Only letters, numbers and underscores are allowed.
          </Text>
        </View>

        {error ? (
          <Text className="text-rose-500 text-sm mt-1">{error}</Text>
        ) : null}

        <View className="flex-row gap-3 mt-2">
          <TouchableOpacity
            className="flex-1 bg-gray-200 rounded-full py-3 px-4 items-center"
            onPress={() => router.back()}
            disabled={saving}
          >
            <Text className="text-gray-700 text-lg font-semibold">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-cyan-500 rounded-full py-3 px-4 items-center flex-row justify-center"
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
      </View>
    </View>
  );
}

