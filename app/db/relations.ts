import { relations } from "drizzle-orm";
import {
	admins,
	answers,
	participants,
	quizSets,
	quizzes,
	sessions,
} from "./schema";

// 管理者のリレーション
export const adminsRelations = relations(admins, ({ many }) => ({
	quizSets: many(quizSets),
}));

// クイズセットのリレーション
export const quizSetsRelations = relations(quizSets, ({ one, many }) => ({
	createdBy: one(admins, {
		fields: [quizSets.createdBy],
		references: [admins.id],
	}),
	quizzes: many(quizzes),
	sessions: many(sessions),
}));

// クイズ問題のリレーション
export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
	quizSet: one(quizSets, {
		fields: [quizzes.quizSetId],
		references: [quizSets.id],
	}),
	answers: many(answers),
	currentInSessions: many(sessions),
}));

// セッションのリレーション
export const sessionsRelations = relations(sessions, ({ one, many }) => ({
	quizSet: one(quizSets, {
		fields: [sessions.quizSetId],
		references: [quizSets.id],
	}),
	currentQuiz: one(quizzes, {
		fields: [sessions.currentQuizId],
		references: [quizzes.id],
	}),
	participants: many(participants),
}));

// 参加者のリレーション
export const participantsRelations = relations(
	participants,
	({ one, many }) => ({
		session: one(sessions, {
			fields: [participants.sessionId],
			references: [sessions.id],
		}),
		answers: many(answers),
	}),
);

// 回答のリレーション
export const answersRelations = relations(answers, ({ one }) => ({
	participant: one(participants, {
		fields: [answers.participantId],
		references: [participants.id],
	}),
	quiz: one(quizzes, {
		fields: [answers.quizId],
		references: [quizzes.id],
	}),
}));
