export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  featuredImage?: string;
  publishedAt: string;
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
  };
  metadata: {
    siteName: string;
    tagline: string;
    seoDescription?: string;
  };
}

export type WebsitePage = 'home' | 'about' | 'services' | 'contact' | 'blog' | 'blog-post';
