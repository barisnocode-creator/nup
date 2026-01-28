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
  };
  metadata: {
    siteName: string;
    tagline: string;
  };
}

export type WebsitePage = 'home' | 'about' | 'services' | 'contact';
