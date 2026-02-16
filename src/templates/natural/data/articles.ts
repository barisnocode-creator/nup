export interface NaturalArticle {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  tags: string[];
}

export const defaultArticles: NaturalArticle[] = [
  {
    id: "001",
    title: "Whispers of Wisdom",
    subtitle: "Uncovering the quiet truths that shape our daily decisions",
    category: "Financing",
    date: "Oct 16, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
    author: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    },
    content:
      "In the quiet moments between decisions, wisdom often speaks the loudest. This article explores how mindful financial planning can transform not just our bank accounts, but our entire approach to life's choices.",
    tags: ["finance", "mindfulness", "planning"],
  },
  {
    id: "002",
    title: "The Art of Slow Living",
    subtitle: "Finding beauty in life's unhurried moments",
    category: "Lifestyle",
    date: "Oct 14, 2024",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
    author: {
      name: "James Miller",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    },
    content:
      "In a world that never stops moving, the art of slow living offers a revolutionary approach to finding peace. Discover how embracing a slower pace can lead to a richer, more fulfilling existence.",
    tags: ["lifestyle", "wellness", "mindfulness"],
  },
  {
    id: "003",
    title: "Building Bridges, Not Walls",
    subtitle: "How communities thrive through connection and understanding",
    category: "Community",
    date: "Oct 12, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    author: {
      name: "Maya Johnson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    },
    content:
      "Strong communities are built on the foundation of genuine connections. Learn how small acts of kindness and understanding can transform neighborhoods into thriving, supportive networks.",
    tags: ["community", "social", "connection"],
  },
  {
    id: "004",
    title: "Finding Balance in a Digital World",
    subtitle: "Navigating the intersection of technology and well-being",
    category: "Wellness",
    date: "Oct 10, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80",
    author: {
      name: "Alex Thompson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    },
    content:
      "As our lives become increasingly digital, finding balance between screen time and real-world experiences becomes essential. Explore practical strategies for maintaining wellness in the digital age.",
    tags: ["wellness", "technology", "balance"],
  },
  {
    id: "005",
    title: "Wanderlust Chronicles",
    subtitle: "Stories from the road less traveled",
    category: "Travel",
    date: "Oct 8, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
    author: {
      name: "Luna Park",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    },
    content:
      "Every journey begins with a single step, but it's the unexpected detours that create the most memorable stories. Join us as we explore hidden gems and share tales from adventures around the globe.",
    tags: ["travel", "adventure", "culture"],
  },
  {
    id: "006",
    title: "The Creative Spark",
    subtitle: "Igniting innovation through artistic expression",
    category: "Creativity",
    date: "Oct 6, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    author: {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    },
    content:
      "Creativity isn't just about art—it's a mindset that can transform every aspect of our lives. Discover how to nurture your creative spark and bring innovation to your daily routine.",
    tags: ["creativity", "innovation", "art"],
  },
];
