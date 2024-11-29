import {
  pgTable,
  serial,
  varchar,
  boolean,
  integer,
  timestamp,
  text,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// usersテーブルの定義
export const Users = pgTable("users", {
  id: serial("id").primaryKey(), // 自動採番の主キー
  clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull().unique(), // ClerkのユーザーID
  userName: varchar("user_name", { length: 255 }).notNull(), // ユーザー名
  email: varchar("email", { length: 255 }).notNull().unique(), // メールアドレス（ユニーク）
  profilePic: varchar("profile_pic", { length: 255 }).default(""), // プロフィール画像
  isAdmin: boolean("is_admin").default(false).notNull(), // 管理者フラグ
  isActive: boolean("is_active").default(true).notNull(), // アクティブフラグ
  createdAt: timestamp("created_at").defaultNow().notNull(), // 作成日時
  updatedAt: timestamp("updated_at").defaultNow().notNull(), // 更新日時
});

// campaigns テーブルの定義
export const Campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(), // 自動採番の主キー
  name: varchar("name", { length: 255 }).notNull(), // キャンペーン名
  description: text("description").notNull(), // 詳細情報
  organizer: varchar("organizer", { length: 255 }).notNull(), // 主催者名
  targetAmount: integer("target_amount").notNull(), // 目標金額
  collectedAmount: integer("collected_amount").default(0).notNull(), // 集金額
  category: varchar("category", { length: 255 }).notNull(), // カテゴリ
  startDate: timestamp("start_date").notNull(), // 開始日
  endDate: timestamp("end_date").notNull(), // 終了日
  isActive: boolean("is_active").default(true).notNull(), // アクティブ状態
  showDonarsInCampaign: boolean("show_donars_in_campaign")
    .default(true)
    .notNull(), // 寄付者リスト表示
  images: jsonb("images").notNull(), // 画像リスト
  createdBy: integer("created_by")
    .references(() => Users.id)
    .notNull(), // ユーザーIDの外部キー
});

// リレーションの定義
export const CampaignsRelations = relations(Campaigns, ({ one }) => ({
  createdBy: one(Users, {
    fields: [Campaigns.createdBy],
    references: [Users.id],
  }),
}));
