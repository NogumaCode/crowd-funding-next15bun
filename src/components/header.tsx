"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getCurrentUserDataFromDB } from '@/actions/users';
import { useAuth, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation';
import  { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast';
import Link from "next/link";


interface User {
  id: number;
  clerkUserId: string;
  userName: string;
  email: string;
  profilePic: string | null;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MenuItem {
  name: string;
  url?: string;
  action?: () => void;
}

function Header() {

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [menuToShow, setMenuToShow] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const { signOut } = useAuth();

  const userMenu: MenuItem[] = [
    {
      name: "ダッシュボード",
      url: "/dashboard",
    },
    {
      name: "寄付金",
      url: "/donations",
    },
    { name: "ログアウト", action: () => signOut() },
  ];

  const adminMenu: MenuItem[] = [
    {
      name: "ダッシュボード",
      url: "/admin/dashboard",
    },
    {
      name: "寄付金",
      url: "/admin/donations",
    },
    {
      name: "ユーザー",
      url: "/admin/users",
    },
    {
      name: "キャンペーン",
      url: "/admin/campaigns",
    },
    { name: "ログアウト", action: () => signOut() },
  ];


  const getCurrentUser = async () => {
    try {
      const response = await getCurrentUserDataFromDB();

      if ("error" in response) {
        throw new Error(response.error);
      }

      // プロパティ 'profilePic' の null を空文字列に変換
      const processedResponse: User = {
        ...response,
        profilePic: response.profilePic || "",
        createdAt: response.createdAt.toString(),
        updatedAt: response.updatedAt.toString(),
      };

      // ユーザー情報を取得
      setCurrentUser(processedResponse);

      if (processedResponse.isAdmin) {
        setMenuToShow(adminMenu);
      } else {
        setMenuToShow(userMenu);
      }
    }catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "不明なエラーが発生しました。";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false); // ローディング完了
    }
  };
  useEffect(() => {
    getCurrentUser(); // startTransitionは省略
  }, []);
  return (
    <div>
      <div className="p-3 bg-primary flex justify-between items-center">
        <h1 className="font-semibold text-xl text-white">
          <Link href="/">Crowd Funding</Link>
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer font-semibold text-white">
        <div className="bg-white rounded py-2 px-3 flex justify-center items-center text-xs h-10">

          {loading ? (
            <span className="animate-pulse text-gray-500">Loading...</span>
          ) : (
            <div className="flex items-center space-x-2">  <UserButton/> {currentUser?.userName || "Guest"}</div>
          )}
          </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>メニュー</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {menuToShow.map((item) =>
              item.action ? (
                <DropdownMenuItem key={item.name} onClick={item.action}>
                  {item.name}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  key={item.url}
                  onClick={() => router.push(item.url || "#")}
                >
                  {item.name}
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>

      </div>

    </div>
  )
}

export default Header
