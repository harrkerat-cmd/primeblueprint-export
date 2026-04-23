export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { refreshBlogPosts } from "@/lib/blog";

export async function POST(request: Request) {
  const adminToken = process.env.BLOG_ADMIN_TOKEN;
  const providedToken = request.headers.get("x-admin-token");

  if (adminToken && providedToken !== adminToken) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const posts = await refreshBlogPosts();
  return NextResponse.json({ posts, refreshedAt: new Date().toISOString() });
}
