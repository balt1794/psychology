import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();
  return [
    { url: 'https://propertylistingsai.com', lastModified: currentDate, priority: 1.0 },
    { url: 'https://propertylistingsai.com/tools', lastModified: currentDate, priority: 0.8 },
    { url: 'https://propertylistingsai.com/airbnb-listing', lastModified: currentDate, priority: 0.9 },
    { url: 'https://propertylistingsai.com/property-description-generator', lastModified: currentDate, priority: 0.8 },
    { url: 'https://propertylistingsai.com/driving-directions-generator', lastModified: currentDate, priority: 0.8 },
    { url: 'https://propertylistingsai.com/airbnb-house-rules-generator', lastModified: currentDate, priority: 0.7 },
    { url: 'https://propertylistingsai.com/pricing', lastModified: currentDate, priority: 0.7 },
    { url: 'https://propertylistingsai.com/faq', lastModified: currentDate, priority: 0.65 },
    { url: 'https://propertylistingsai.com/terms-of-use', lastModified: currentDate, priority: 0.8 },
  ];
}