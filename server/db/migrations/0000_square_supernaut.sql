CREATE TYPE "public"."contact_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"status" "contact_status" NOT NULL
);
