"use client";

import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, MessageCircle, Presentation, Home } from "lucide-react";
import "./globals.css";

const notoSans = Noto_Sans_TC({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSerif = Noto_Serif_TC({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const navItems = [
  { href: "/", label: "首頁", icon: Home },
  { href: "/lesson/1", label: "課程", icon: BookOpen },
  { href: "/tutor", label: "AI 教師", icon: MessageCircle },
  { href: "/classroom", label: "課堂模式", icon: Presentation },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="zh-TW">
      <head>
        <title>理財，可以不一樣 — 互動教學平台</title>
        <meta
          name="description"
          content="金融商品行銷實務 PBL 互動式多媒體教學平台"
        />
      </head>
      <body
        className={`${notoSans.variable} ${notoSerif.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        {/* 導覽列 */}
        <nav className="sticky top-0 z-50 bg-[var(--zhen-primary)] text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <span className="text-2xl">💰</span>
                <span className="font-bold text-lg tracking-wide group-hover:text-[var(--zhen-accent)] transition-colors">
                  富誠互動教室
                </span>
              </Link>

              {/* 導覽項目 */}
              <div className="flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "bg-white/20 text-[var(--zhen-accent)]"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>

        {/* 主要內容 */}
        <main className="flex-1">{children}</main>

        {/* 頁尾 */}
        <footer className="bg-gray-100 border-t py-6 text-center text-sm text-gray-500">
          <p>理財，可以不一樣 — 金融商品行銷實務 PBL 互動教學平台 © 2026</p>
        </footer>
      </body>
    </html>
  );
}
