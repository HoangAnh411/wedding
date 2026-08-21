warn The configuration property `package.json#prisma` is deprecated and will be removed in Prisma 7. Please migrate to a Prisma config file (e.g., `prisma.config.ts`).
For more information, see: https://pris.ly/prisma-config

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weddings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT,
    "groom_name" TEXT NOT NULL,
    "bride_name" TEXT NOT NULL,
    "wedding_date" TIMESTAMP(3),
    "engagement_date" TIMESTAMP(3),
    "ceremony_date" TIMESTAMP(3),
    "reception_date" TIMESTAMP(3),
    "story" TEXT,
    "venue_name" TEXT,
    "venue_address" TEXT,
    "venue_lat" DOUBLE PRECISION,
    "venue_lng" DOUBLE PRECISION,
    "cover_image" TEXT,
    "is_template" BOOLEAN NOT NULL DEFAULT false,
    "gallery_enabled" BOOLEAN NOT NULL DEFAULT true,
    "music_enabled" BOOLEAN NOT NULL DEFAULT true,
    "rsvp_enabled" BOOLEAN NOT NULL DEFAULT true,
    "wishes_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weddings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_events" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "event_type" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "event_date" TIMESTAMP(3),
    "event_time" TEXT,
    "location" TEXT,
    "outfit_description" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "timeline_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_trays" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "tray_name" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gift_trays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_images" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "caption" TEXT,
    "is_video" BOOLEAN NOT NULL DEFAULT false,
    "video_url" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music_tracks" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT,
    "url" TEXT NOT NULL,
    "cover_url" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "music_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guests" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "family_side" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "group_name" TEXT,
    "invite_code" TEXT,
    "table_number" INTEGER,
    "is_attending" BOOLEAN,
    "plus_one" BOOLEAN NOT NULL DEFAULT false,
    "plus_one_name" TEXT,
    "meal_choice" TEXT,
    "dietary_restrictions" TEXT,
    "has_sent_invitation" BOOLEAN NOT NULL DEFAULT false,
    "invitation_sent_at" TIMESTAMP(3),
    "has_opened_invitation" BOOLEAN NOT NULL DEFAULT false,
    "opened_at" TIMESTAMP(3),
    "rsvp_at" TIMESTAMP(3),
    "thank_you_sent" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rsvp_responses" (
    "id" TEXT NOT NULL,
    "guest_id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "is_attending" BOOLEAN NOT NULL,
    "guest_count" INTEGER NOT NULL DEFAULT 1,
    "meal_choice" TEXT,
    "dietary_restrictions" TEXT,
    "message" TEXT,
    "responded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rsvp_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishes" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "guest_name" TEXT NOT NULL,
    "phone" TEXT,
    "content" TEXT NOT NULL,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "check_ins" (
    "id" TEXT NOT NULL,
    "guest_id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "checked_in_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "check_in_by" TEXT,
    "notes" TEXT,

    CONSTRAINT "check_ins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "contact_name" TEXT,
    "contact_phone" TEXT,
    "contact_email" TEXT,
    "address" TEXT,
    "website" TEXT,
    "service_description" TEXT,
    "contract_value" DOUBLE PRECISION,
    "paid_amount" DOUBLE PRECISION DEFAULT 0,
    "status" TEXT DEFAULT 'contacted',
    "rating" INTEGER DEFAULT 0,
    "notes" TEXT,
    "reminder_date" TIMESTAMP(3),
    "contract_file_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist_items" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "phase" TEXT,
    "due_date" TIMESTAMP(3),
    "due_relative_days" INTEGER,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "assigned_to" TEXT,
    "priority" TEXT DEFAULT 'medium',
    "notes" TEXT,
    "completed_at" TIMESTAMP(3),
    "reminder_set" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checklist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_items" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "estimated_cost" DOUBLE PRECISION,
    "actual_cost" DOUBLE PRECISION,
    "vendor_id" TEXT,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "paid_date" TIMESTAMP(3),
    "payment_method" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budget_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tables" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "table_number" INTEGER NOT NULL,
    "table_name" TEXT,
    "capacity" INTEGER NOT NULL DEFAULT 10,
    "location_description" TEXT,
    "is_head_table" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "money_gifts" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "guest_name" TEXT NOT NULL,
    "phone" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_method" TEXT,
    "bank_name" TEXT,
    "transaction_id" TEXT,
    "received_at" TIMESTAMP(3),
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "money_gifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_configs" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "gateway_type" TEXT NOT NULL,
    "account_number" TEXT,
    "account_name" TEXT,
    "bank_name" TEXT,
    "qr_code_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "weddings_slug_key" ON "weddings"("slug");

-- CreateIndex
CREATE INDEX "weddings_user_id_idx" ON "weddings"("user_id");

-- CreateIndex
CREATE INDEX "timeline_events_wedding_id_idx" ON "timeline_events"("wedding_id");

-- CreateIndex
CREATE INDEX "gallery_images_wedding_id_idx" ON "gallery_images"("wedding_id");

-- CreateIndex
CREATE INDEX "music_tracks_wedding_id_idx" ON "music_tracks"("wedding_id");

-- CreateIndex
CREATE UNIQUE INDEX "guests_invite_code_key" ON "guests"("invite_code");

-- CreateIndex
CREATE INDEX "guests_wedding_id_idx" ON "guests"("wedding_id");

-- CreateIndex
CREATE INDEX "guests_wedding_id_is_attending_idx" ON "guests"("wedding_id", "is_attending");

-- CreateIndex
CREATE INDEX "guests_wedding_id_invite_code_idx" ON "guests"("wedding_id", "invite_code");

-- CreateIndex
CREATE INDEX "rsvp_responses_wedding_id_idx" ON "rsvp_responses"("wedding_id");

-- CreateIndex
CREATE INDEX "rsvp_responses_guest_id_idx" ON "rsvp_responses"("guest_id");

-- CreateIndex
CREATE INDEX "wishes_wedding_id_idx" ON "wishes"("wedding_id");

-- CreateIndex
CREATE INDEX "wishes_wedding_id_is_approved_idx" ON "wishes"("wedding_id", "is_approved");

-- CreateIndex
CREATE INDEX "check_ins_wedding_id_idx" ON "check_ins"("wedding_id");

-- CreateIndex
CREATE INDEX "check_ins_guest_id_idx" ON "check_ins"("guest_id");

-- CreateIndex
CREATE INDEX "vendors_wedding_id_idx" ON "vendors"("wedding_id");

-- CreateIndex
CREATE INDEX "vendors_wedding_id_category_idx" ON "vendors"("wedding_id", "category");

-- CreateIndex
CREATE INDEX "checklist_items_wedding_id_idx" ON "checklist_items"("wedding_id");

-- CreateIndex
CREATE INDEX "checklist_items_wedding_id_phase_idx" ON "checklist_items"("wedding_id", "phase");

-- CreateIndex
CREATE INDEX "budget_items_wedding_id_idx" ON "budget_items"("wedding_id");

-- CreateIndex
CREATE INDEX "budget_items_wedding_id_category_idx" ON "budget_items"("wedding_id", "category");

-- CreateIndex
CREATE INDEX "tables_wedding_id_idx" ON "tables"("wedding_id");

-- CreateIndex
CREATE INDEX "money_gifts_wedding_id_idx" ON "money_gifts"("wedding_id");

-- AddForeignKey
ALTER TABLE "weddings" ADD CONSTRAINT "weddings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_events" ADD CONSTRAINT "timeline_events_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_trays" ADD CONSTRAINT "gift_trays_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music_tracks" ADD CONSTRAINT "music_tracks_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guests" ADD CONSTRAINT "guests_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvp_responses" ADD CONSTRAINT "rsvp_responses_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvp_responses" ADD CONSTRAINT "rsvp_responses_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishes" ADD CONSTRAINT "wishes_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_items" ADD CONSTRAINT "checklist_items_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_items" ADD CONSTRAINT "budget_items_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_items" ADD CONSTRAINT "budget_items_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tables" ADD CONSTRAINT "tables_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "money_gifts" ADD CONSTRAINT "money_gifts_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_configs" ADD CONSTRAINT "payment_configs_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

