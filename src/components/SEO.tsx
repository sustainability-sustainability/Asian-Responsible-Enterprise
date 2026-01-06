import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  url?: string;
}

export default function SEO({
  title = "Asian Responsible Enterprise Awards - Climate Neutral & Sustainability Leadership",
  description = "Join the Asian Responsible Enterprise Awards (ARE Awards) in promoting sustainable development and climate action. Recognizing excellence in corporate responsibility, environmental stewardship, and the 17 UN Sustainable Development Goals across Asia.",
  keywords = "Asian Responsible Enterprise, ARE Awards, Climate Neutral Awards, Sustainability, SDG, Sustainable Development Goals, Corporate Responsibility, Environmental Awards, Climate Action, Green Business, Asia Sustainability, ESG, Corporate Social Responsibility",
  ogImage = "https://your-domain.com/og-image.jpg",
  url = "https://your-domain.com"
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic Meta Tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', 'Asian Responsible Enterprise, OPC');
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Open Graph Meta Tags (Facebook, LinkedIn)
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:site_name', 'Asian Responsible Enterprise Awards', true);

    // Twitter Card Meta Tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // Additional SEO Meta Tags
    updateMetaTag('theme-color', '#FFD700');
    updateMetaTag('msapplication-TileColor', '#FFD700');

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = url;

    // JSON-LD Structured Data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Asian Responsible Enterprise",
      "alternateName": "ARE Awards",
      "url": url,
      "logo": `${url}/logo.png`,
      "description": description,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "6789 Ayala Avenue, Salcedo Village, Brgy. Bel Air",
        "addressLocality": "Makati City",
        "addressRegion": "Metro Manila",
        "addressCountry": "Philippines"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+63-968-858-1982",
        "contactType": "Customer Service",
        "email": "kennethrocete.cna@gmail.com",
        "availableLanguage": ["English", "Filipino"]
      },
      "sameAs": [
        "https://www.facebook.com/climateneutralawards"
      ],
      "award": "Climate Neutral Awards",
      "keywords": keywords
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

  }, [title, description, keywords, ogImage, url]);

  return null; // This component doesn't render anything
}

// Section-specific SEO configurations
export const seoConfig = {
  home: {
    title: "Asian Responsible Enterprise Awards - Leading Sustainability in Asia",
    description: "Discover the Asian Responsible Enterprise Awards (ARE Awards) - celebrating climate neutral businesses and sustainable development across Asia. Join us in advancing the UN's 17 Sustainable Development Goals.",
    keywords: "Asian Responsible Enterprise, ARE Awards, Climate Neutral Awards, Sustainability Leadership, SDG Champions, Green Business Asia"
  },
  awards: {
    title: "Climate Neutral Awards - Asian Responsible Enterprise",
    description: "Explore our prestigious Climate Neutral Awards recognizing organizations driving environmental excellence and sustainability across Asia. Apply now for ARE Awards recognition.",
    keywords: "Climate Neutral Awards, Environmental Awards Asia, Sustainability Recognition, Green Awards, Corporate Environmental Excellence"
  },
  mission: {
    title: "Our Mission - Advancing Sustainable Development Goals",
    description: "Learn about our mission to promote the UN's 17 Sustainable Development Goals through the Asian Responsible Enterprise Awards. Building a sustainable future together.",
    keywords: "SDG Mission, Sustainable Development, UN Goals, Corporate Responsibility Mission, Environmental Stewardship"
  },
  news: {
    title: "Sustainability News & Updates - ARE Awards",
    description: "Stay updated with the latest news on sustainable development, climate action, and corporate responsibility from the Asian Responsible Enterprise Awards.",
    keywords: "Sustainability News, Climate Action Updates, Green Business News, SDG Updates, Environmental News Asia"
  },
  events: {
    title: "Sustainability Events & Awards Ceremonies - ARE",
    description: "Join our sustainability events, awards ceremonies, and conferences. Connect with climate leaders and sustainability champions across Asia.",
    keywords: "Sustainability Events, Awards Ceremony, Climate Conferences, Green Events Asia, Networking"
  },
  publications: {
    title: "Publications & Resources - Asian Responsible Enterprise",
    description: "Access our sustainability publications, research reports, and resources on corporate responsibility, climate action, and the SDGs.",
    keywords: "Sustainability Publications, SDG Resources, Climate Reports, ESG Research, Sustainability Guides"
  },
  community: {
    title: "Join Our Sustainability Community - ARE Awards",
    description: "Connect with our community of sustainability leaders, climate champions, and responsible enterprises across Asia. Together for a better future.",
    keywords: "Sustainability Community, Climate Network, Green Business Community, SDG Champions, Environmental Leaders"
  },
  contact: {
    title: "Contact Us - Asian Responsible Enterprise Awards",
    description: "Get in touch with the Asian Responsible Enterprise Awards team. Let's collaborate on sustainability initiatives and climate action.",
    keywords: "Contact ARE Awards, Sustainability Partnerships, Climate Collaboration, Inquiry"
  }
};
