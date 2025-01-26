CREATE TABLE "records" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"record_name" varchar NOT NULL,
	"analysis_result" varchar NOT NULL,
	"kanban_records" varchar NOT NULL,
	"created_by" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar NOT NULL,
	"age" integer NOT NULL,
	"location" varchar NOT NULL,
	"folders" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"treatment_counts" integer NOT NULL,
	"folder" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"created_by" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;