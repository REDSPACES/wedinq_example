import {
	pgTable,
	uuid,
	text,
	timestamp,
	integer,
	boolean,
	unique,
	check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// 管理者テーブル
export const admins = pgTable("admins", {
	id: uuid("id").primaryKey(), // auth.users.id を参照
	email: text("email").notNull(),
	displayName: text("display_name").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

// クイズセットテーブル
export const quizSets = pgTable("quiz_sets", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	description: text("description"),
	accessCode: text("access_code").notNull().unique(), // 参加者用6文字
	mcAccessCode: text("mc_access_code").notNull().unique(), // MC用8文字
	createdBy: uuid("created_by")
		.notNull()
		.references(() => admins.id),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

// クイズ問題テーブル
export const quizzes = pgTable(
	"quizzes",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		quizSetId: uuid("quiz_set_id")
			.notNull()
			.references(() => quizSets.id, { onDelete: "cascade" }),
		questionNumber: integer("question_number").notNull(),
		questionText: text("question_text").notNull(),
		optionA: text("option_a").notNull(),
		optionB: text("option_b").notNull(),
		optionC: text("option_c").notNull(),
		correctOption: text("correct_option").notNull(), // A, B, C
		timeLimitSeconds: integer("time_limit_seconds").default(30).notNull(),
		points: integer("points").default(100).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		check(
			"correct_option_check",
			sql`${table.correctOption} IN ('A', 'B', 'C')`,
		),
		check(
			"time_limit_check",
			sql`${table.timeLimitSeconds} >= 10 AND ${table.timeLimitSeconds} <= 60`,
		),
	],
);

// セッションテーブル
export const sessions = pgTable(
	"sessions",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		quizSetId: uuid("quiz_set_id")
			.notNull()
			.references(() => quizSets.id),
		status: text("status").default("waiting").notNull(), // waiting, active, finished
		currentQuizId: uuid("current_quiz_id").references(() => quizzes.id),
		currentQuizStartedAt: timestamp("current_quiz_started_at", {
			withTimezone: true,
		}),
		startedAt: timestamp("started_at", { withTimezone: true }),
		finishedAt: timestamp("finished_at", { withTimezone: true }),
	},
	(table) => [
		check(
			"status_check",
			sql`${table.status} IN ('waiting', 'active', 'finished')`,
		),
	],
);

// 参加者テーブル
export const participants = pgTable(
	"participants",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		sessionId: uuid("session_id")
			.notNull()
			.references(() => sessions.id, { onDelete: "cascade" }),
		nickname: text("nickname").notNull(),
		identifierCode: text("identifier_code").notNull(), // テーブル番号など
		totalScore: integer("total_score").default(0).notNull(),
		joinedAt: timestamp("joined_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [unique("participant_unique").on(table.sessionId, table.identifierCode)],
);

// 回答テーブル
export const answers = pgTable(
	"answers",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		participantId: uuid("participant_id")
			.notNull()
			.references(() => participants.id, { onDelete: "cascade" }),
		quizId: uuid("quiz_id")
			.notNull()
			.references(() => quizzes.id, { onDelete: "cascade" }),
		selectedOption: text("selected_option").notNull(), // A, B, C
		isCorrect: boolean("is_correct").notNull(),
		responseTimeMs: integer("response_time_ms").notNull(),
		pointsEarned: integer("points_earned").notNull(),
		answeredAt: timestamp("answered_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		unique("answer_unique").on(table.participantId, table.quizId),
		check(
			"selected_option_check",
			sql`${table.selectedOption} IN ('A', 'B', 'C')`,
		),
	],
);

// 型エクスポート
export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;

export type QuizSet = typeof quizSets.$inferSelect;
export type NewQuizSet = typeof quizSets.$inferInsert;

export type Quiz = typeof quizzes.$inferSelect;
export type NewQuiz = typeof quizzes.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Participant = typeof participants.$inferSelect;
export type NewParticipant = typeof participants.$inferInsert;

export type Answer = typeof answers.$inferSelect;
export type NewAnswer = typeof answers.$inferInsert;
