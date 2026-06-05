CREATE TABLE "pillar" (
	"symbol" varchar(100) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "building_block" (
	"symbol" varchar(100) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"pillar_symbol" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "construct" (
	"symbol" varchar(100) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"building_block_symbol" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subconstruct" (
	"symbol" varchar(100) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"construct_symbol" varchar(100) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "building_block" ADD CONSTRAINT "building_block_pillar_symbol_pillar_symbol_fk" FOREIGN KEY ("pillar_symbol") REFERENCES "public"."pillar"("symbol") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "construct" ADD CONSTRAINT "construct_building_block_symbol_building_block_symbol_fk" FOREIGN KEY ("building_block_symbol") REFERENCES "public"."building_block"("symbol") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "subconstruct" ADD CONSTRAINT "subconstruct_construct_symbol_construct_symbol_fk" FOREIGN KEY ("construct_symbol") REFERENCES "public"."construct"("symbol") ON DELETE cascade ON UPDATE cascade;