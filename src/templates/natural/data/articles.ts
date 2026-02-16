export interface NaturalArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
}

export const defaultArticles: NaturalArticle[] = [
  {
    id: "001",
    title: "Whispers of Wisdom",
    category: "Financing",
    date: "Oct 16, 2024",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
  },
  {
    id: "002",
    title: "The Art of Slow Living",
    category: "Lifestyle",
    date: "Oct 14, 2024",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
  },
  {
    id: "003",
    title: "Building Bridges, Not Walls",
    category: "Community",
    date: "Oct 12, 2024",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
  },
  {
    id: "004",
    title: "Finding Balance in a Digital World",
    category: "Wellness",
    date: "Oct 10, 2024",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80",
  },
  {
    id: "005",
    title: "Wanderlust Chronicles",
    category: "Travel",
    date: "Oct 8, 2024",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  },
  {
    id: "006",
    title: "The Creative Spark",
    category: "Creativity",
    date: "Oct 6, 2024",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
  },
];
