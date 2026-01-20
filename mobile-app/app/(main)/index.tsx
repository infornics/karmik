import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { addKarmaEntry, fetchKarmaHistory } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type KarmaHistoryItem = {
  id: string;
  type: "good" | "bad";
  points: number;
  createdAt: string;
};

export default function HomeScreen() {
  const { token } = useAuth();
  const [todayGood, setTodayGood] = useState(0);
  const [todayBad, setTodayBad] = useState(0);
  const [todayPoints, setTodayPoints] = useState(0);
  const [history, setHistory] = useState<KarmaHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<"good" | "bad" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scoreScale = useRef(new Animated.Value(1)).current;

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    []
  );

  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchKarmaHistory(token);
      setHistory(data.history);
      setTodayGood(data.today.good);
      setTodayBad(data.today.bad);
      setTodayPoints(data.today.points);
    } catch (e: any) {
      setError(e.message ?? "Failed to load karma data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleAdd = async (type: "good" | "bad") => {
    if (!token) return;
    try {
      setUpdating(type);
      setError(null);
      await addKarmaEntry(type, token);
      await loadData();
    } catch (e: any) {
      setError(e.message ?? "Failed to update karma");
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scoreScale, {
        toValue: 1.08,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.spring(scoreScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, [todayPoints, scoreScale]);

  return (
    <View className="flex-1 bg-[#F3F4FA]">
      <View className="px-6 pt-14 pb-4">
        <Text className="text-xs text-gray-500 uppercase tracking-wide">
          Today
        </Text>
        <Text className="text-3xl font-extrabold text-gray-900 mt-1">
          {todayLabel}
        </Text>
        <Text className="text-gray-500 mt-1">
          Track the little choices that shape your day.
        </Text>
      </View>

      <View className="flex-1 px-6 pt-2 pb-6">
        <View className="bg-white rounded-3xl p-6 mb-4 shadow-md">
          <Text className="text-gray-500 text-sm mb-1">Karma score</Text>
          <Animated.Text
            style={{
              transform: [{ scale: scoreScale }],
            }}
            className={`text-5xl font-extrabold ${
              todayPoints >= 0 ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            {todayPoints}
          </Animated.Text>

          <View className="flex-row justify-between mt-6">
            <View>
              <Text className="text-xs text-gray-400 uppercase tracking-wide">
                Good
              </Text>
              <Text className="text-2xl font-bold text-emerald-500 mt-1">
                +{todayGood}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-xs text-gray-400 uppercase tracking-wide">
                Bad
              </Text>
              <Text className="text-2xl font-bold text-rose-500 mt-1">
                -{todayBad}
              </Text>
            </View>
          </View>
        </View>

        {error ? (
          <Text className="text-rose-500 text-center mb-2">{error}</Text>
        ) : null}

        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity
            className="flex-1 bg-emerald-500 rounded-full py-4 px-4 flex-row justify-center items-center shadow-sm"
            onPress={() => handleAdd("good")}
            disabled={updating !== null}
          >
            {updating === "good" ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-lg font-semibold">
                I did something good (+1)
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-rose-500 rounded-full py-4 px-4 flex-row justify-center items-center shadow-sm"
            onPress={() => handleAdd("bad")}
            disabled={updating !== null}
          >
            {updating === "bad" ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-lg font-semibold">
                I did something bad (-2)
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <Text className="text-gray-700 font-semibold mb-2">
          Recent karma
        </Text>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#6b7280" />
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {history.length === 0 ? (
              <Text className="text-gray-500 text-center mt-4">
                No karma tracked yet. Start logging your day!
              </Text>
            ) : (
              history.map((item) => {
                const date = new Date(item.createdAt);
                const timeLabel = date.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const isGood = item.type === "good";
                return (
                  <View
                    key={item.id}
                    className="flex-row items-center justify-between bg-white rounded-2xl px-4 py-3 mb-2 shadow-sm"
                  >
                    <View>
                      <Text
                        className={`font-semibold ${
                          isGood ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {isGood ? "Good deed" : "Slip up"}
                      </Text>
                      <Text className="text-xs text-gray-400 mt-0.5">
                        {timeLabel}
                      </Text>
                    </View>
                    <Text
                      className={`text-xl font-bold ${
                        isGood ? "text-emerald-500" : "text-rose-500"
                      }`}
                    >
                      {item.points > 0 ? `+${item.points}` : item.points}
                    </Text>
                  </View>
                );
              })
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
