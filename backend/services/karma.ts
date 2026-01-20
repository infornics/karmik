import connectDB from "../database/connection";
import {
  karmaEntries,
  KarmaEntry,
  NewKarmaEntry,
} from "../database/schemas/karma";
import { and, desc, eq, gt } from "drizzle-orm";

export const addKarmaEntry = async (
  data: NewKarmaEntry
): Promise<KarmaEntry> => {
  const db = await connectDB();
  const [entry] = await db.insert(karmaEntries).values(data).returning();
  return entry;
};

export const getKarmaHistoryForUser = async (
  userId: string
): Promise<KarmaEntry[]> => {
  const db = await connectDB();
  return db
    .select()
    .from(karmaEntries)
    .where(eq(karmaEntries.userId, userId))
    .orderBy(desc(karmaEntries.createdAt));
};

export const getTodaySummaryForUser = async (
  userId: string
): Promise<{ good: number; bad: number; points: number }> => {
  const db = await connectDB();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const rows = await db
    .select()
    .from(karmaEntries)
    .where(
      and(
        eq(karmaEntries.userId, userId),
        gt(karmaEntries.createdAt, startOfDay)
      )
    )
    .orderBy(desc(karmaEntries.createdAt));

  let good = 0;
  let bad = 0;
  let points = 0;

  for (const row of rows) {
    if (row.type === "good") {
      good += 1;
    } else if (row.type === "bad") {
      bad += 1;
    }
    points += row.points;
  }

  return { good, bad, points };
};

export const resetTodayForUser = async (userId: string): Promise<void> => {
  const db = await connectDB();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  await db
    .delete(karmaEntries)
    .where(
      and(eq(karmaEntries.userId, userId), gt(karmaEntries.createdAt, startOfDay))
    );
};
