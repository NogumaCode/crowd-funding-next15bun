import { db } from "@/db/drizzle";
import { Users } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const handleNewUserRegistration = async () => {
  try {
    const loggedInUserData = await currentUser();

    if (!loggedInUserData) {
      throw new Error("User not logged in.");
    }

    // 既存ユーザーを確認
    const existingUser = await db
      .select()
      .from(Users)
      .where(eq(Users.clerkUserId, loggedInUserData.id))
      .limit(1);

    if (existingUser.length > 0) {
      return existingUser[0]; // ユーザーが既に存在する場合、その情報を返す
    }

    // 新しいユーザーを作成
    let userName = loggedInUserData.username;
    if (!userName) {
      userName =
        (loggedInUserData.firstName || "") +
        " " +
        (loggedInUserData.lastName || "");
      userName = userName.trim();
    }

    const newUser = {
      clerkUserId: loggedInUserData.id,
      userName: userName || "Unknown",
      email: loggedInUserData.emailAddresses[0]?.emailAddress || "",
      profilePic: loggedInUserData.imageUrl || "",
      isAdmin: false, // 必要に応じて変更
      isActive: true, // 初期状態はアクティブ
    };

    // Drizzle ORMで新しいユーザーを挿入
    await db.insert(Users).values(newUser);

    return newUser;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    } else {
      return {
        error: "An unknown error occurred.",
      };
    }
  }
};

export const getCurrentUserDataFromDB = async () => {
  try {
    const loggedInUserData = await currentUser();

    if (!loggedInUserData) {
      throw new Error("User not logged in.");
    }

    // ログイン中のユーザー情報を取得
    const user = await db
      .select()
      .from(Users)
      .where(eq(Users.clerkUserId, loggedInUserData.id))
      .limit(1);

    if (user.length === 0) {
      throw new Error("User not found.");
    }

    return user[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    } else {
      return {
        error: "An unknown error occurred.",
      };
    }
  }
};
