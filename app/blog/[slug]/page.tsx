import React from "react";
import { supabase } from "@/lib/supabase";
import BlogPostClient from "@/components/blog/BlogPostClient";
import { Metadata } from "next";

export const revalidate = 60; // Revalidate every 60 seconds

type Props = {
  params: Promise<{ slug: string }>;
};

// SEO Metadata Generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*, blog_post_images(*)")
    .eq("slug", slug)
    .single();

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const coverImage =
    post.blog_post_images && post.blog_post_images.length > 0
      ? post.blog_post_images[0].image_url
      : "https://eyitayobembe.vercel.app/og-image.png"; // Fallback image

  return {
    title: post.title,
    description: post.tagline || post.content?.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.tagline || post.content?.slice(0, 160) || "",
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: ["Eyitayo Obembe"],
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.tagline || post.content?.slice(0, 160) || "",
      images: [coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*, blog_post_images(*)")
    .eq("slug", slug)
    .single();

  return <BlogPostClient post={post} />;
}
