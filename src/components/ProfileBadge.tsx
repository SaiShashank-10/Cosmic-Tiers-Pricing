"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function ProfileBadge() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;
  if (!session || !session.user) return null;

  const user = session.user as { name?: string | null; image?: string | null };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {user.image ? (
          // next/image is fine for remote images when domains are configured; fallback to img if needed
          // Use a simple img tag to avoid next/image config issues in local dev
          <img src={user.image} alt={user.name ?? "avatar"} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="h-8 w-8 rounded-full bg-white/10 grid place-items-center text-sm">{(user.name || "?").charAt(0)}</div>
        )}
        <div className="text-sm text-white/90">
          <div className="font-medium">{user.name ?? "User"}</div>
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="ml-2 rounded-md px-3 py-1 text-sm bg-white/5 hover:bg-white/10"
      >
        Sign out
      </button>
    </div>
  );
}
