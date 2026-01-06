import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Save, ExternalLink, CheckCircle, AlertCircle, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { api } from "../../utils/api";

interface SEOData {
  siteUrl: string;
  ogImage: string;
  googleVerification: string;
  googleAnalytics: string;
  facebookPixel: string;
  pages: {
    [key: string]: {
      title: string;
      description: string;
      keywords: string;
    };
  };
}

const defaultSEOData: SEOData = {
  siteUrl: "https://your-domain.com",
  ogImage: "https://your-domain.com/og-image.jpg",
  googleVerification: "",
  googleAnalytics: "",
  facebookPixel: "",
  pages: {
    home: {
      title: "Asian Responsible Enterprise Awards - Leading Sustainability in Asia",
      description: "Discover the Asian Responsible Enterprise Awards (ARE Awards) - celebrating climate neutral businesses and sustainable development across Asia.",
      keywords: "Asian Responsible Enterprise, ARE Awards, Climate Neutral Awards, Sustainability Leadership, SDG Champions",
    },
    awards: {
      title: "Climate Neutral Awards - Asian Responsible Enterprise",
      description: "Explore our prestigious Climate Neutral Awards recognizing organizations driving environmental excellence and sustainability across Asia.",
      keywords: "Climate Neutral Awards, Environmental Awards Asia, Sustainability Recognition, Green Awards",
    },
    mission: {
      title: "Our Mission - Advancing Sustainable Development Goals",
      description: "Learn about our mission to promote the UN's 17 Sustainable Development Goals through the Asian Responsible Enterprise Awards.",
      keywords: "SDG Mission, Sustainable Development, UN Goals, Corporate Responsibility Mission",
    },
    news: {
      title: "Sustainability News & Updates - ARE Awards",
      description: "Stay updated with the latest news on sustainable development, climate action, and corporate responsibility.",
      keywords: "Sustainability News, Climate Action Updates, Green Business News, SDG Updates",
    },
    events: {
      title: "Sustainability Events & Awards Ceremonies - ARE",
      description: "Join our sustainability events, awards ceremonies, and conferences. Connect with climate leaders across Asia.",
      keywords: "Sustainability Events, Awards Ceremony, Climate Conferences, Green Events Asia",
    },
    publications: {
      title: "Publications & Resources - Asian Responsible Enterprise",
      description: "Access our sustainability publications, research reports, and resources on corporate responsibility and climate action.",
      keywords: "Sustainability Publications, SDG Resources, Climate Reports, ESG Research",
    },
    community: {
      title: "Join Our Sustainability Community - ARE Awards",
      description: "Connect with our community of sustainability leaders, climate champions, and responsible enterprises across Asia.",
      keywords: "Sustainability Community, Climate Network, Green Business Community, SDG Champions",
    },
    contact: {
      title: "Contact Us - Asian Responsible Enterprise Awards",
      description: "Get in touch with the Asian Responsible Enterprise Awards team for sustainability partnerships and climate collaboration.",
      keywords: "Contact ARE Awards, Sustainability Partnerships, Climate Collaboration",
    },
  },
};

export default function DashboardSEO() {
  const [seoData, setSEOData] = useState<SEOData>(defaultSEOData);
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  useEffect(() => {
    loadSEOData();
  }, []);

  const loadSEOData = async () => {
    try {
      const data = await api.getSEO();
      if (data && data.siteUrl) {
        setSEOData(data);
      } else {
        setSEOData(defaultSEOData);
      }
    } catch (error) {
      console.error('Error loading SEO data:', error);
      toast.error('Failed to load SEO settings. Using defaults.');
      setSEOData(defaultSEOData);
    }
  };

  const saveSEOData = async (data: SEOData) => {
    try {
      await api.updateSEO(data);
      setSEOData(data);
      toast.success('SEO settings saved successfully!');
    } catch (error: any) {
      console.error('Error saving SEO data:', error);
      toast.error(error.message || 'Failed to save SEO settings');
    }
  };

  const handleSaveGeneral = () => {
    saveSEOData(seoData);
  };

  const handleSavePage = (pageId: string) => {
    saveSEOData(seoData);
    setEditingPage(null);
  };

  const updatePageSEO = (pageId: string, field: string, value: string) => {
    setSEOData({
      ...seoData,
      pages: {
        ...seoData.pages,
        [pageId]: {
          ...seoData.pages[pageId],
          [field]: value,
        },
      },
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const isSetupComplete = seoData.siteUrl !== "https://your-domain.com" && 
                          seoData.googleVerification !== "";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent">
            SEO Management
          </h1>
          <p className="text-gray-500 mt-1">
            Optimize your website for search engines
          </p>
        </div>
        <Badge variant={isSetupComplete ? "default" : "outline"} className="text-sm">
          {isSetupComplete ? (
            <>
              <CheckCircle className="w-4 h-4 mr-1" />
              Setup Complete
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 mr-1" />
              Setup Required
            </>
          )}
        </Badge>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="pages">Page SEO</TabsTrigger>
          <TabsTrigger value="tools">SEO Tools</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Website Configuration</CardTitle>
              <CardDescription>
                Basic SEO settings for your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Website URL *</Label>
                <Input
                  value={seoData.siteUrl}
                  onChange={(e) => setSEOData({ ...seoData, siteUrl: e.target.value })}
                  placeholder="https://your-domain.com"
                />
                <p className="text-xs text-gray-500">
                  Enter your full website URL including https://
                </p>
              </div>

              <div className="space-y-2">
                <Label>Open Graph Image URL</Label>
                <Input
                  value={seoData.ogImage}
                  onChange={(e) => setSEOData({ ...seoData, ogImage: e.target.value })}
                  placeholder="https://your-domain.com/og-image.jpg"
                />
                <p className="text-xs text-gray-500">
                  Image that appears when shared on social media (1200x630px recommended)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Google Site Verification Code</Label>
                <Input
                  value={seoData.googleVerification}
                  onChange={(e) => setSEOData({ ...seoData, googleVerification: e.target.value })}
                  placeholder="google1234567890abcdef"
                />
                <p className="text-xs text-gray-500">
                  Get this from Google Search Console during verification
                </p>
              </div>

              <div className="space-y-2">
                <Label>Google Analytics ID (Optional)</Label>
                <Input
                  value={seoData.googleAnalytics}
                  onChange={(e) => setSEOData({ ...seoData, googleAnalytics: e.target.value })}
                  placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
                />
                <p className="text-xs text-gray-500">
                  Track website traffic with Google Analytics
                </p>
              </div>

              <div className="space-y-2">
                <Label>Facebook Pixel ID (Optional)</Label>
                <Input
                  value={seoData.facebookPixel}
                  onChange={(e) => setSEOData({ ...seoData, facebookPixel: e.target.value })}
                  placeholder="1234567890123456"
                />
                <p className="text-xs text-gray-500">
                  Track conversions and create targeted ads
                </p>
              </div>

              <Button
                onClick={handleSaveGeneral}
                className="bg-gradient-to-r from-yellow-500 to-blue-600 w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Save General Settings
              </Button>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Access important SEO tools and resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href="https://search.google.com/search-console/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">Google Search Console</span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
              <a
                href="https://analytics.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">Google Analytics</span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
              <a
                href="https://developers.facebook.com/tools/debug/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">Facebook Sharing Debugger</span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
              <a
                href={`${seoData.siteUrl}/sitemap.xml`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">View Sitemap</span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
              <a
                href={`${seoData.siteUrl}/robots.txt`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">View Robots.txt</span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Page SEO Tab */}
        <TabsContent value="pages" className="space-y-4">
          {Object.keys(seoData.pages).map((pageId) => (
            <Card key={pageId}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="capitalize">{pageId} Page</CardTitle>
                    <CardDescription>
                      SEO settings for the {pageId} section
                    </CardDescription>
                  </div>
                  {editingPage !== pageId && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingPage(pageId)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingPage === pageId ? (
                  <>
                    <div className="space-y-2">
                      <Label>Page Title *</Label>
                      <Input
                        value={seoData.pages[pageId].title}
                        onChange={(e) => updatePageSEO(pageId, 'title', e.target.value)}
                        placeholder="Page Title (50-60 characters)"
                      />
                      <p className="text-xs text-gray-500">
                        Length: {seoData.pages[pageId].title.length} characters
                        {seoData.pages[pageId].title.length > 60 && (
                          <span className="text-red-500 ml-2">⚠️ Too long!</span>
                        )}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Meta Description *</Label>
                      <Textarea
                        value={seoData.pages[pageId].description}
                        onChange={(e) => updatePageSEO(pageId, 'description', e.target.value)}
                        placeholder="Page description (150-160 characters)"
                        rows={3}
                      />
                      <p className="text-xs text-gray-500">
                        Length: {seoData.pages[pageId].description.length} characters
                        {seoData.pages[pageId].description.length > 160 && (
                          <span className="text-red-500 ml-2">⚠️ Too long!</span>
                        )}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Keywords</Label>
                      <Textarea
                        value={seoData.pages[pageId].keywords}
                        onChange={(e) => updatePageSEO(pageId, 'keywords', e.target.value)}
                        placeholder="Comma-separated keywords"
                        rows={2}
                      />
                      <p className="text-xs text-gray-500">
                        Separate keywords with commas
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditingPage(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleSavePage(pageId)}
                        className="bg-gradient-to-r from-yellow-500 to-blue-600"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500">Title</Label>
                      <p className="text-sm">{seoData.pages[pageId].title}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Description</Label>
                      <p className="text-sm">{seoData.pages[pageId].description}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Keywords</Label>
                      <p className="text-sm text-gray-600">{seoData.pages[pageId].keywords}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* SEO Tools Tab */}
        <TabsContent value="tools" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sitemap URL</CardTitle>
              <CardDescription>Submit this to Google Search Console</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input
                  value={`${seoData.siteUrl}/sitemap.xml`}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(`${seoData.siteUrl}/sitemap.xml`, 'Sitemap URL')}
                >
                  {copiedItem === 'Sitemap URL' ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Robots.txt URL</CardTitle>
              <CardDescription>Verify search engines can crawl your site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input
                  value={`${seoData.siteUrl}/robots.txt`}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(`${seoData.siteUrl}/robots.txt`, 'Robots.txt URL')}
                >
                  {copiedItem === 'Robots.txt URL' ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Your SEO</CardTitle>
              <CardDescription>Use these tools to verify your SEO setup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href={`https://search.google.com/test/mobile-friendly?url=${encodeURIComponent(seoData.siteUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">Mobile-Friendly Test</span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
              <a
                href={`https://pagespeed.web.dev/report?url=${encodeURIComponent(seoData.siteUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">PageSpeed Insights</span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
              <a
                href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(seoData.siteUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">Facebook Debugger</span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Guides</CardTitle>
              <CardDescription>Learn how to improve your search rankings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">
                📘 Check the <code className="bg-gray-100 px-2 py-1 rounded">/SEO_QUICK_SETUP.md</code> file for a quick 5-minute setup guide
              </p>
              <p className="text-sm text-gray-600">
                📗 Read <code className="bg-gray-100 px-2 py-1 rounded">/SEO_REGISTRATION_GUIDE.md</code> for comprehensive SEO strategies
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
