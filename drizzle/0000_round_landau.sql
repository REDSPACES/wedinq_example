CREATE TABLE "admins" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"display_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"participant_id" uuid NOT NULL,
	"quiz_id" uuid NOT NULL,
	"selected_option" text NOT NULL,
	"is_correct" boolean NOT NULL,
	"response_time_ms" integer NOT NULL,
	"points_earned" integer NOT NULL,
	"answered_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "answer_unique" UNIQUE("participant_id","quiz_id"),
	CONSTRAINT "selected_option_check" CHECK ("answers"."selected_option" IN ('A', 'B', 'C'))
);
--> statement-breakpoint
CREATE TABLE "participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"nickname" text NOT NULL,
	"identifier_code" text NOT NULL,
	"total_score" integer DEFAULT 0 NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "participant_unique" UNIQUE("session_id","identifier_code")
);
--> statement-breakpoint
CREATE TABLE "quiz_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"access_code" text NOT NULL,
	"mc_access_code" text NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "quiz_sets_access_code_unique" UNIQUE("access_code"),
	CONSTRAINT "quiz_sets_mc_access_code_unique" UNIQUE("mc_access_code")
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_set_id" uuid NOT NULL,
	"question_number" integer NOT NULL,
	"question_text" text NOT NULL,
	"option_a" text NOT NULL,
	"option_b" text NOT NULL,
	"option_c" text NOT NULL,
	"correct_option" text NOT NULL,
	"time_limit_seconds" integer DEFAULT 30 NOT NULL,
	"points" integer DEFAULT 100 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "correct_option_check" CHECK ("quizzes"."correct_option" IN ('A', 'B', 'C')),
	CONSTRAINT "time_limit_check" CHECK ("quizzes"."time_limit_seconds" >= 10 AND "quizzes"."time_limit_seconds" <= 60)
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_set_id" uuid NOT NULL,
	"status" text DEFAULT 'waiting' NOT NULL,
	"current_quiz_id" uuid,
	"current_quiz_started_at" timestamp with time zone,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	CONSTRAINT "status_check" CHECK ("sessions"."status" IN ('waiting', 'active', 'finished'))
);
--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_sets" ADD CONSTRAINT "quiz_sets_created_by_admins_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_quiz_set_id_quiz_sets_id_fk" FOREIGN KEY ("quiz_set_id") REFERENCES "public"."quiz_sets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_quiz_set_id_quiz_sets_id_fk" FOREIGN KEY ("quiz_set_id") REFERENCES "public"."quiz_sets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_current_quiz_id_quizzes_id_fk" FOREIGN KEY ("current_quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE no action ON UPDATE no action;