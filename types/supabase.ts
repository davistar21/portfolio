export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      bio: {
        Row: {
          id: string;
          name: string;
          tagline: string | null;
          description: string | null;
          profile_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          tagline?: string | null;
          description?: string | null;
          profile_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          tagline?: string | null;
          description?: string | null;
          profile_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          project_url: string | null;
          github_url: string | null;
          image_url: string | null;
          tags: string[] | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          project_url?: string | null;
          github_url?: string | null;
          image_url?: string | null;
          tags?: string[] | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          project_url?: string | null;
          github_url?: string | null;
          image_url?: string | null;
          tags?: string[] | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          name: string;
          type: string;
          proficiency: number;
          icon: string | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          proficiency: number;
          icon?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          proficiency?: number;
          icon?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      education: {
        Row: {
          id: string;
          degree: string;
          institution: string;
          start_date: string;
          end_date: string | null;
          description: string | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          degree: string;
          institution: string;
          start_date: string;
          end_date?: string | null;
          description?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          degree?: string;
          institution?: string;
          start_date?: string;
          end_date?: string | null;
          description?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      experience: {
        Row: {
          id: string;
          title: string;
          type: "job" | "achievement" | "volunteering";
          organization: string;
          organization_url: string | null;
          location: string | null;
          start_date: string;
          end_date: string | null;
          description: string | null;
          highlights: string[] | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          type: "job" | "achievement" | "volunteering";
          organization: string;
          organization_url?: string | null;
          location?: string | null;
          start_date: string;
          end_date?: string | null;
          description?: string | null;
          highlights?: string[] | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          type?: "job" | "achievement" | "volunteering";
          organization?: string;
          organization_url?: string | null;
          location?: string | null;
          start_date?: string;
          end_date?: string | null;
          description?: string | null;
          highlights?: string[] | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          role: string | null;
          company: string | null;
          message: string;
          image_url: string | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role?: string | null;
          company?: string | null;
          message: string;
          image_url?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string | null;
          company?: string | null;
          message?: string;
          image_url?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          created_at: string;
          handled: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          created_at?: string;
          handled?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          message?: string;
          created_at?: string;
          handled?: boolean;
        };
      };
      social_links: {
        Row: {
          id: string;
          platform: string;
          url: string;
          icon: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          platform: string;
          url: string;
          icon: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          platform?: string;
          url?: string;
          icon?: string;
          order_index?: number;
          created_at?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          tagline: string | null;
          content: string | null;
          image_url: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
          is_active: boolean | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          tagline?: string | null;
          content?: string | null;
          image_url?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          tagline?: string | null;
          content?: string | null;
          image_url?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean | null;
        };
      };
      blog_comments: {
        Row: {
          id: string;
          blog_post_id: string;
          parent_id: string | null;
          name: string | null;
          email: string | null;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          blog_post_id: string;
          parent_id?: string | null;
          name?: string | null;
          email?: string | null;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          blog_post_id?: string;
          parent_id?: string | null;
          name?: string | null;
          email?: string | null;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      blog_likes: {
        Row: {
          id: string;
          blog_post_id: string;
          visitor_id: string;
          liked: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          blog_post_id: string;
          visitor_id: string;
          liked?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          blog_post_id?: string;
          visitor_id?: string;
          liked?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      project_images: {
        Row: {
          id: string;
          project_id: string;
          image_url: string;
          alt_text: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          image_url: string;
          alt_text?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          image_url?: string;
          alt_text?: string | null;
          order_index?: number;
          created_at?: string;
        };
      };
      blog_post_images: {
        Row: {
          id: string;
          blog_post_id: string;
          image_url: string;
          alt_text: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          blog_post_id: string;
          image_url: string;
          alt_text?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          blog_post_id?: string;
          image_url?: string;
          alt_text?: string | null;
          order_index?: number;
          created_at?: string;
        };
      };
    };
  };
}
