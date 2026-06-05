CREATE TABLE "pillars" (
	"symbol" varchar(100) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "building_blocks" (
	"symbol" varchar(100) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"pillar_symbol" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "constructs" (
	"symbol" varchar(100) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"building_block_symbol" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subconstructs" (
	"symbol" varchar(100) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"construct_symbol" varchar(100) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "building_blocks" ADD CONSTRAINT "building_blocks_pillar_symbol_pillars_symbol_fk" FOREIGN KEY ("pillar_symbol") REFERENCES "public"."pillars"("symbol") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "constructs" ADD CONSTRAINT "constructs_building_block_symbol_building_blocks_symbol_fk" FOREIGN KEY ("building_block_symbol") REFERENCES "public"."building_blocks"("symbol") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "subconstructs" ADD CONSTRAINT "subconstructs_construct_symbol_constructs_symbol_fk" FOREIGN KEY ("construct_symbol") REFERENCES "public"."constructs"("symbol") ON DELETE cascade ON UPDATE cascade;
