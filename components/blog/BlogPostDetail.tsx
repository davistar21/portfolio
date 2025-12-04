// BlogPostDetail.tsx
import React from "react";
import { MessageCircle, Send, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { BlogPost, Comment, mockComments } from "@/mockData";

// Assume these are shadcn/ui components
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";

interface BlogPostDetailProps {
  post: BlogPost;
}

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => (
  <div className="border rounded-md p-4 mb-3 bg-gray-50 dark:bg-gray-800">
    <div className="flex justify-between items-center text-sm mb-1">
      <strong className="text-gray-900 dark:text-gray-100">
        {comment.user}
      </strong>
      <span className="text-xs text-gray-500">{comment.time}</span>
    </div>
    <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
  </div>
);

// Framer Motion variant for detail view entry
const detailVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ post }) => {
  return (
    <motion.div
      className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8"
      variants={detailVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-50 mb-4">
        {post.title}
      </h1>
      <p className="text-lg text-muted-foreground border-b pb-4 mb-6">
        By **{post.author}** | Published: {post.date} | Track: {post.track}
      </p>

      <img
        src={post.imageUrl}
        alt={post.imageAlt}
        className="w-full max-h-[400px] object-cover rounded-lg shadow-md mb-8"
      />

      <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed">
        <p>{post.content}</p>
        <p className="mt-4 border-l-4 border-blue-500 pl-4 italic text-blue-600 dark:text-blue-400">
          *This breakdown highlights my expertise across the stack: **Frontend,
          Backend, AI integration, and Web3/Blockchain**, providing
          comprehensive value.*
        </p>
      </div>

      {/* Real-Time Commentary Simulation */}
      <div className="mt-12 pt-6 border-t-4 border-primary">
        <h2 className="text-2xl font-bold text-primary flex items-center mb-4">
          <Users className="w-6 h-6 mr-2" />
          Real-Time Commentary ({mockComments.length})
        </h2>
        <p className="text-sm text-red-600 dark:text-red-400 font-semibold mb-4">
          *Note: A real-time feature requires **WebSockets** [Image of
          WebSockets data flow] or a real-time service (like Firebase/Supabase)
          to stream updates.*
        </p>

        <div className="space-y-3">
          {mockComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </div>

      <div className="comment-form mt-8 flex flex-col sm:flex-row gap-3">
        {/* Textarea should be replaced with shadcn's Textarea */}
        <textarea
          placeholder="Join the conversation..."
          className="flex-grow min-h-[80px] p-3 rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {/* Button should be replaced with shadcn's Button (variant="success") */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-600 text-white hover:bg-green-700 py-3 px-6 rounded-md font-semibold transition duration-200 shadow-md h-fit flex items-center justify-center sm:w-auto w-full"
        >
          <Send className="w-5 h-5 mr-2" />
          Post Comment
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BlogPostDetail;
