CREATE TABLE IF NOT EXISTS "authenticator" (
	"id" serial PRIMARY KEY NOT NULL,
	"credentialID" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"transports" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "storage" (
	"sessionID" text PRIMARY KEY NOT NULL,
	"data" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" text NOT NULL,
	"authenticator_id" integer,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"challenge" text,
	"jwt_id" text,
	"active" boolean NOT NULL,
	"isAdmin" boolean,
	"metadata" json,
	"appdata" json,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_authenticator_id_authenticator_id_fk" FOREIGN KEY ("authenticator_id") REFERENCES "authenticator"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
