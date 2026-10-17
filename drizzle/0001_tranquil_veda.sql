ALTER TABLE "orders" ADD COLUMN "phone2" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "carrier" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "gift" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "gift_note" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "notes" text;