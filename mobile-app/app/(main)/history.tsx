import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { fetchKarmaHistory } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type KarmaHistoryItem = {
  id: string;
  type: "good" | "bad";
  points: number;
  createdAt: string;
};

export default function HistoryScreen() {
  const { token } = useAuth();
  const [history, setHistory] = useState<KarmaHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchKarmaHistory(token);
      setHistory(data.history);
    } catch (e: any) {
      setError(e.message ?? "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [token]);

  const handleRefresh = async () => {
    if (!token) return;
    try {
      setRefreshing(true);
      await load();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F3F4FA] px-6 pt-14 pb-6">
      <Text className="text-3xl font-extrabold text-gray-900 mb-1">
        History
      </Text>
      <Text className="text-gray-500 mb-4">
        Reflect on your past actions and trends.
      </Text>

      {error ? (
        <Text className="text-rose-500 text-center mb-2">{error}</Text>
      ) : null}

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#6b7280" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#6b7280"
              colors={["#22c55e"]}
            />
          }
        >
          {history.length === 0 ? (
            <Text className="text-gray-500 text-center mt-4">
              No karma entries yet. Start logging your day on the Home tab.
            </Text>
          ) : (
            history.map((item) => {
              const date = new Date(item.createdAt);
              const dayLabel = date.toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              });
              const timeLabel = date.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              });
              const isGood = item.type === "good";

              return (
                <View
                  key={item.id}
                  className="bg-white rounded-2xl px-4 py-3 mb-2 flex-row justify-between items-center shadow-sm"
                >
                  <View>
                    <Text
                      className={`font-semibold ${
                        isGood ? "text-cyan-600" : "text-rose-600"
                      }`}
                    >
                      {isGood ? "Good deed" : "Slip up"}
                    </Text>
                    <Text className="text-xs text-gray-400">
                      {dayLabel} • {timeLabel}
                    </Text>
                  </View>
                  <Text
                    className={`text-xl font-bold ${
                      isGood ? "text-cyan-500" : "text-rose-500"
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
  );
}

