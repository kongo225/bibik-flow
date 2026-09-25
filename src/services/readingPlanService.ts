import { getDatabase } from '../data/database';

export interface ReadingPlan {
  id: string;
  title: string;
  duration_days: number;
  description: string;
  type: 'general' | 'topical';
}

export interface ReadingPlanDay {
  plan_id: string;
  day: number;
  readings: { book_id: number; chapter: number }[];
  completed?: boolean;
}

export const readingPlanService = {
  async getPlans(): Promise<ReadingPlan[]> {
    const db = await getDatabase();
    return db.getAllAsync('SELECT * FROM reading_plans;') as Promise<ReadingPlan[]>;
  },

  async getPlanDays(planId: string): Promise<ReadingPlanDay[]> {
    const db = await getDatabase();
    const rows = (await db.getAllAsync(
      `SELECT * FROM reading_plan_days WHERE plan_id = ? ORDER BY day ASC;`,
      [planId]
    )) as { plan_id: string; day: number; readings: string }[];

    const userProgress = (await db.getAllAsync(
      `SELECT day, completed FROM user_plan_progress WHERE plan_id = ?;`,
      [planId]
    )) as { day: number; completed: number }[];

    return rows.map((r) => {
      const prog = userProgress.find((p) => p.day === r.day);
      return {
        plan_id: r.plan_id,
        day: r.day,
        readings: JSON.parse(r.readings),
        completed: prog ? prog.completed === 1 : false,
      };
    });
  },

  async markDayCompleted(planId: string, day: number, completed: boolean): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT OR REPLACE INTO user_plan_progress (plan_id, start_date, day, completed, completed_at)
       VALUES (?, ?, ?, ?, ?);`,
      [planId, new Date().toISOString(), day, completed ? 1 : 0, new Date().toISOString()]
    );
  },

  async getActivePlanProgress(planId: string): Promise<{ completedCount: number; totalDays: number; percent: number }> {
    const db = await getDatabase();
    const plan = (await db.getFirstAsync(
      `SELECT duration_days FROM reading_plans WHERE id = ?;`,
      [planId]
    )) as { duration_days: number } | null;

    const totalDays = plan?.duration_days || 1;

    const completedRow = (await db.getFirstAsync(
      `SELECT COUNT(*) as count FROM user_plan_progress WHERE plan_id = ? AND completed = 1;`,
      [planId]
    )) as { count: number } | null;

    const completedCount = completedRow?.count || 0;

    return {
      completedCount,
      totalDays,
      percent: Math.round((completedCount / totalDays) * 100),
    };
  },
};
