import ProjectCard from "./ProjectCard";

const projects = [
  {
    link: "https://studently-main.vercel.app",
    title: "Studently",
    img: {
      src: "/studently-dashboard.jpeg",
      alt: "Studently - AI Study Assistant",
    },
    description: "All-in-One AI-Powered Study Assistant",
    tags: [
      "React Router v7",
      "TailwindCSS",
      "AWS Amplify",
      "AWS Cognito",
      "AWS Lambda",
      "AWS Textract",
      "AWS S3",
      "AWS DynamoDB",
      "AWS API Gateway",
      "AWS CloudWatch",
    ],
  },
  {
    link: "https://ai-resurne-analyz3r.vercel.app/",
    title: "AI Resume Analyzer",
    img: {
      src: "/ai-resume-analyzer-landing.png",
      alt: "Studently - AI Study Assistant",
    },
    description:
      "AI-powered resume analysis tool built to give you instant and insightful feedback on your resume",
    tags: ["React Router v7", "TailwindCSS", "Puter.js", "Claude API"],
  },
  {
    link: "https://url-shortener-app-wheat-eight.vercel.app/",
    title: "Shortly",
    img: {
      src: "/url-shortener-ss.png",
      alt: "Shortly - URL Shortener",
    },
    description:
      "A web app that generates short, shareable links from long URLs. Built with a focus on speed and usability, featuring copy-to-clipboard and link analytics.",
    tags: ["React + TS", "TailwindCSS", "CleanURI API"],
  },
  {
    link: "https://weather-app-ruddy-seven-32.vercel.app/",
    title: "Weather Inc.",
    img: {
      src: "/weather-app-page-ss.png",
      alt: "Studently - AI Study Assistant",
    },
    description:
      "A modern weather forecast app using real-time weather data. Get current conditions, hourly and daily forecasts using OpenMeteo API.",
    tags: ["React + TS", "TailwindCSS", "OpenMeteo API"],
  },
  {
    link: "https://crypto-app-1-seven.vercel.app/",
    title: "Koinery",
    img: {
      src: "/koinery-ss.png",
      alt: "Studently - AI Study Assistant",
    },
    description:
      "A cryptocurrency market tracker that displays real-time price data, trends, and market stats using the CoinGecko API.",
    tags: ["React + TS", "TailwindCSS", "CoinGecko API"],
  },
  {
    link: "https://ec90cd9e.vercel.app/",
    title: "E-Commerce Application",
    img: {
      src: "/e-coommerce-ss.png",
      alt: "Studently - AI Study Assistant",
    },
    description:
      "A modern e-commerce web app with product listings, cart functionality, and secure checkout. Deployed on AWS EC2 for scalability.",
    tags: ["React + TS", "TailwindCSS", "AWS EC2"],
  },
];

const Projects = () => {
  return (
    <div className="">
      <h2 className="font-semibold text-lg mb-4 ">Featured Projects</h2>
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center"> */}
      <div className="flex overflow-x-auto scrollbar-hide gap-8 snap-x snap-mandatory">
        {projects.map((e, idx) => {
          return <ProjectCard {...e} key={idx} />;
        })}
      </div>
    </div>
  );
};

export default Projects;
