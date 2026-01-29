export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  featuredImage?: string;
  publishedAt: string;
}

export interface Statistic {
  value: string;
  label: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface WorkingHoursItem {
  day: string;
  hours: string;
}

export interface GeneratedContent {
  pages: {
    home: {
      hero: {
        title: string;
        subtitle: string;
        description: string;
      };
      welcome: {
        title: string;
        content: string;
      };
      highlights: Array<{
        title: string;
        description: string;
        icon: string;
      }>;
      statistics?: Statistic[];
      process?: ProcessStep[];
    };
    about: {
      hero: {
        title: string;
        subtitle: string;
      };
      story: {
        title: string;
        content: string;
      };
      values: Array<{
        title: string;
        description: string;
      }>;
      team: {
        title: string;
        description: string;
      };
      timeline?: TimelineItem[];
    };
    services: {
      hero: {
        title: string;
        subtitle: string;
      };
      intro: {
        title: string;
        content: string;
      };
      servicesList: Array<{
        title: string;
        description: string;
        icon: string;
      }>;
      process?: ProcessStep[];
      faq?: Array<{
        question: string;
        answer: string;
      }>;
    };
    contact: {
      hero: {
        title: string;
        subtitle: string;
      };
      info: {
        address: string;
        phone: string;
        email: string;
        hours: string;
      };
      form: {
        title: string;
        subtitle: string;
      };
      workingHours?: WorkingHoursItem[];
    };
    blog?: {
      hero: {
        title: string;
        subtitle: string;
      };
      posts: BlogPost[];
    };
  };
  images?: {
    heroHome?: string;
    heroAbout?: string;
    heroServices?: string;
    heroContact?: string;
    heroBlog?: string;
    // New expanded image fields
    heroSplit?: string;
    aboutImage?: string;
    servicesImages?: string[];
    galleryImages?: string[];
    teamImage?: string;
    ctaImage?: string;
  };
  sectionVariants?: {
    hero?: 'split' | 'overlay' | 'centered' | 'gradient';
    services?: 'grid' | 'list' | 'cards';
    about?: 'inline' | 'fullwidth' | 'timeline';
    testimonials?: 'carousel' | 'grid' | 'single';
    contact?: 'inline' | 'fullwidth' | 'map';
  };
  metadata: {
    siteName: string;
    tagline: string;
    seoDescription?: string;
  };
}

export type WebsitePage = 'home' | 'about' | 'services' | 'contact' | 'blog' | 'blog-post';
