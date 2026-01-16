import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { authIcons } from "@/assets/icons";
import { Link } from "expo-router";
import { useState } from "react";

export default function Register() {
  const {
    EmailIcon,
    LockIcon,
    EyeOpenIcon,
    EyeCloseIcon,
    GoogleIcon,
    FacebookIcon,
    GithubIcon,
    UserIcon,
  } = authIcons;
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className="items-center justify-center flex-1">
      <View className="items-center justify-center gap-1">
        <Text className="text-4xl font-extrabold">Create Account</Text>

        <Text className="text-center text-gray-500">
          Create a new account to get started and enjoy seamless access to our
          features.
        </Text>
      </View>

      <View className="my-10 gap-5 w-full">
        <View className="flex-row items-center gap-2 shadow-md bg-white py-3 px-5 rounded-full">
          <UserIcon width={28} height={28} />
          <TextInput
            placeholder="Full Name"
            className="text-gray-500 flex-1 text-xl"
          />
        </View>
        <View className="flex-row items-center gap-2 shadow-md bg-white py-3 px-5 rounded-full">
          <EmailIcon width={28} height={28} />
          <TextInput
            keyboardType="email-address"
            placeholder="Email"
            className="text-gray-500 flex-1 text-xl"
          />
        </View>

        <View className="flex-row items-center gap-2 shadow-md bg-white py-3 px-5 rounded-full">
          <LockIcon width={28} height={28} />
          <TextInput
            placeholder="Password"
            secureTextEntry={!showPassword}
            className="text-gray-500 flex-1 text-xl"
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOpenIcon width={28} height={28} />
            ) : (
              <EyeCloseIcon width={28} height={28} />
            )}
          </Pressable>
        </View>

        <TouchableOpacity className="bg-cyan-500 p-5 rounded-full">
          <Text className="text-white text-center text-2xl">Register</Text>
        </TouchableOpacity>

        <View className="flex-row items-center gap-2 justify-center">
          <Text className="text-gray-500">Already have an account?</Text>
          <Link href="/login" className="text-lg underline text-cyan-500">
            Login
          </Link>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="text-gray-500 text-lg">or</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      <View className="my-5 gap-3 items-center">
        <Text className="text-gray-500">Continue with</Text>

        <View className="flex-row items-center gap-5">
          <TouchableOpacity className="bg-white p-5 rounded-full">
            <GoogleIcon width={28} height={28} />
          </TouchableOpacity>
          <TouchableOpacity className="bg-white p-5 rounded-full">
            <FacebookIcon width={28} height={28} />
          </TouchableOpacity>
          <TouchableOpacity className="bg-white p-5 rounded-full">
            <GithubIcon width={28} height={28} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
