// MockData.ts

// Define the interface for a single comment
export interface Comment {
  id: number;
  user: string;
  time: string;
  text: string;
}

// Define the interface for a single blog post
export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  track: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  imageAlt: string;
  tags: string[];
  comments: number;
  reads: number;
}

// --- Mock Data Arrays ---

export const blogPosts: BlogPost[] = [
  {
    id: "post-001",
    title: "Winning the AWS Hackathon: Building a Scalable AI Assistant",
    author: "Eyitayo Obembe",
    date: "Oct 25, 2025",
    track: "AI & Cloud",
    excerpt:
      "A deep dive into how our team leveraged AWS Bedrock, Lambda, and DynamoDB to create a winning, production-ready student AI assistant.",
    content:
      "The challenge was simple: build an impactful, scalable tool in 48 hours. Our solution focused on minimizing cold starts and maximizing cost efficiency by using AWS services like API Gateway and S3. [Content goes here...]",
    imageUrl: "https://images.unsplash.com/photo-1593508512255-46ce55963975",
    imageAlt: "Diagram of an AWS cloud architecture",
    tags: ["AWS", "AI", "Bedrock", "Serverless", "DynamoDB"],
    comments: 18,
    reads: 4500,
  },
  {
    id: "post-002",
    title: "Full-Stack Tips: Optimizing Next.js Performance with TypeScript",
    author: "Eyitayo Obembe",
    date: "Nov 15, 2025",
    track: "Full Stack",
    excerpt:
      "From server-side rendering to static generation, learn the Next.js best practices that ensure blazing-fast load times and maintainable codebases using TypeScript.",
    content:
      "Performance is not optional. We discuss code splitting, effective data fetching strategies, and how a strict TypeScript setup prevents common runtime errors in large React applications. [Content goes here...]",
    imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713",
    imageAlt: "Code snippet on a screen",
    tags: ["Next.js", "TypeScript", "Performance", "React", "Frontend"],
    comments: 9,
    reads: 2100,
  },
  {
    id: "post-003",
    title: "Blockchain for Impact: Web3's Role in Achieving SDGs in Lagos",
    author: "Eyitayo Obembe",
    date: "Sep 01, 2025",
    track: "Web3 & Impact",
    excerpt:
      "Exploring how decentralized applications (dApps) utilizing Ethers.js and basic Solidity can create transparent governance and financial inclusion aligned with UN SDGs.",
    content:
      "The Lagos Impact Hackathon inspired this post. Blockchain isn't just about finance; it's a powerful tool for verifiable identity, land registry, and supply chain transparency. We look at a conceptual dApp using Web3.js. [Content goes here...]",
    imageUrl: "https://images.unsplash.com/photo-1620283556093-bdc0840b33b0",
    imageAlt: "Abstract representation of blockchain nodes",
    tags: ["Web3", "Blockchain", "SDGs", "Ethers.js", "Solidity"],
    comments: 32,
    reads: 7800,
  },
];

export const mockComments: Comment[] = [
  {
    id: 1,
    user: "TechGuru42",
    time: "2m ago",
    text: "Great breakdown of the Lambda integration! Did you consider Step Functions?",
  },
  {
    id: 2,
    user: "Web3Dev",
    time: "5m ago",
    text: "Fascinating use case for Ethers.js—could this work on a Layer 2 network?",
  },
  {
    id: 3,
    user: "AIStudent",
    time: "10m ago",
    text: "The performance gains from Next.js static generation are insane!",
  },
];
