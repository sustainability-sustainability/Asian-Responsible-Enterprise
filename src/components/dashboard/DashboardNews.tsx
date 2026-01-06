import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Save, Plus, Trash2, Upload, Edit, Video, Eye, Star, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { FileUpload } from './FileUpload';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { api } from '../../utils/api';

interface NewsArticle {
  _id?: string; // MongoDB ObjectId
  title: string;
  description: string; // ✅ match backend
  excerpt: string;
  image: string;
  date: string;
  category: string;
  author: string;
  readTime: string;
  featured: boolean;
  link?: string;
}

interface NewsVideo {
  _id?: string;        // MongoDB ObjectId
  title: string;
  description: string;
  thumbnail: string;   // image thumbnail
  duration: string;
  views: string;
  date: string;
  videoUrl: string;    // required by backend schema
  link?: string;       // optional external link
}


interface FeaturedStory {
 _id?: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  sdg: number;
  featured: boolean;
  image: string;
  useCustomImage: boolean;
  link?: string; // Optional external link
}

// ✅ Start with empty arrays instead of hardcoded defaults
const defaultArticles: NewsArticle[] = [];
const defaultVideos: NewsVideo[] = [];
const defaultStories: FeaturedStory[] = [];

export default function DashboardNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [videos, setVideos] = useState<NewsVideo[]>([]);
  const [featuredStories, setFeaturedStories] = useState<FeaturedStory[]>([]);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [editingVideo, setEditingVideo] = useState<NewsVideo | null>(null);
  const [editingStory, setEditingStory] = useState<FeaturedStory | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: "default" | "destructive";
  }>({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
    variant: 'default'
  });

  // Load data on component mount - sync with website
  useEffect(() => {
    loadArticles();
    loadVideos();
    loadFeaturedStories();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await api.getNews();
      if (data && data.articles && Array.isArray(data.articles) && data.articles.length > 0) {
        setArticles(data.articles);
      } else {
        setArticles(defaultArticles);
      }
    } catch (error) {
      console.error('Error loading articles:', error);
      toast.error('Failed to load news articles. Please try again.');
      setArticles(defaultArticles);
    }
  };

  const loadVideos = async () => {
    try {
      const data = await api.getNews();
      if (data && data.videos && Array.isArray(data.videos) && data.videos.length > 0) {
        setVideos(data.videos);
      } else {
        setVideos(defaultVideos);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
      toast.error('Failed to load videos. Please try again.');
      setVideos(defaultVideos);
    }
  };

  const loadFeaturedStories = async () => {
    try {
      const data = await api.getNews();
      if (data && data.stories && Array.isArray(data.stories) && data.stories.length > 0) {
        setFeaturedStories(data.stories);
      } else {
        setFeaturedStories(defaultStories);
      }
    } catch (error) {
      console.error('Error loading featured stories:', error);
      toast.error('Failed to load featured stories. Please try again.');
      setFeaturedStories(defaultStories);
    }
  };

 
 const saveArticles = async (updatedArticles: NewsArticle[]) => {
  try {
    const data = {
      articles: updatedArticles,
      videos: videos,
      stories: featuredStories
    };
    await api.updateAllNews(data);   // <-- fixed
;
    setArticles(updatedArticles);
  } catch (error: any) {
    toast.error(error.message || 'Failed to save articles');
  
    setArticles(updatedArticles);
  }
};

const saveVideos = async (updatedVideos: NewsVideo[]) => {
  try {
    const data = {
      articles: articles,
      videos: updatedVideos,
      stories: featuredStories
    };
    await api.updateAllNews(data);   // <-- fixed


    setVideos(updatedVideos);
  } catch (error: any) {
    toast.error(error.message || 'Failed to save videos');

    setVideos(updatedVideos);
  }
};

const saveFeaturedStories = async (updatedStories: FeaturedStory[]) => {
  try {
    const data = {
      articles: articles,
      videos: videos,
      stories: updatedStories
    };
    await api.updateAllNews(data);   // <-- fixed


    setFeaturedStories(updatedStories);
  } catch (error: any) {
    toast.error(error.message || 'Failed to save stories');

    setFeaturedStories(updatedStories);
  }
};

  // Article CRUD operations
 // ✅ Article CRUD operations
// ✅ Article CRUD operations
const handleSaveArticle = () => {
  if (editingArticle) {
    // Required fields aligned with NewsArticle interface
    const requiredFields = [
      { key: "title", label: "Title" },
    
      { key: "excerpt", label: "Excerpt" },
      { key: "author", label: "Author" },
      { key: "date", label: "Date" },
      { key: "image", label: "Image" },
      { key: "category", label: "Category" },
    ];

    const missing = requiredFields.filter(
      f => !editingArticle[f.key as keyof NewsArticle]
    );

    if (missing.length > 0) {
      toast.error(
        `Please fill in required fields: ${missing.map(f => f.label).join(", ")}`
      );
      return;
    }

    const isNew = !editingArticle._id; // ✅ use _id instead of id
    setConfirmDialog({
      open: true,
      title: isNew ? "Create Article" : "Update Article",
      description: isNew
        ? "Are you sure you want to create this article? It will be immediately visible on the website."
        : "Are you sure you want to save these changes? The article will be updated on the website.",
      onConfirm: () => {
        if (isNew) {
          const { _id, ...data } = editingArticle; // strip accidental _id
          const newArticle = { ...data };
          saveArticles([...articles, newArticle]);
          toast.success("Article created successfully!");
        } else {
          saveArticles(
            articles.map(a =>
              a._id === editingArticle._id ? editingArticle : a
            )
          );
          toast.success("Article updated successfully!");
        }
        setEditingArticle(null);
      },
      variant: "default",
    });
  }
};

const handleDeleteArticle = (id: string) => { // ✅ use string for MongoDB ObjectId
  setConfirmDialog({
    open: true,
    title: "Delete Article",
    description: "Are you sure you want to delete this article?",
    onConfirm: () => {
      saveArticles(articles.filter(a => a._id !== id));
      toast.success("Article deleted successfully!");
    },
    variant: "destructive",
  });
};

// ✅ Video CRUD operations (still use id: number)
const handleSaveVideo = () => {
  if (editingVideo) {
    const requiredFields = [
      { key: "title", label: "Title" },
      { key: "description", label: "Description" },
      { key: "date", label: "Date" },
      { key: "thumbnail", label: "Thumbnail" },
    ];

     const missing = requiredFields.filter(
      f => !editingVideo[f.key as keyof FeaturedVideo]
    );

    if (missing.length > 0) {
      toast.error(
        `Please fill in required fields: ${missing.map(f => f.label).join(", ")}`
      );
      return;
    }
    const isNew = !editingVideo._id; // ✅ use _id instead of id
    if (isNew) {
      const { _id, ...data } = editingVideo; // strip accidental _id
      const newVideo = { ...data };
      saveVideos([...videos, newVideo]);
      toast.success("Video created successfully!");
    } else {
      saveVideos(
        videos.map(v =>
          v._id === editingVideo._id ? editingVideo : v
        )
      );
      toast.success("Video updated successfully!");
    }
    setEditingVideo(null);
  }
};
const handleDeleteVideo = (id: string) => { // ✅ string for MongoDB ObjectId
  setConfirmDialog({
    open: true,
    title: "Delete Video",
    description: "Are you sure you want to delete this video?",
    onConfirm: () => {
      saveVideos(videos.filter(v => v._id !== id));
      toast.success("Video deleted successfully!");
    },
    variant: "destructive",
  });
};

// ✅ Featured Story CRUD operations (still use id: number)
const handleSaveStory = () => {
  if (editingStory) {
    const requiredFields = [
      { key: "title", label: "Title" },
      { key: "excerpt", label: "Excerpt" },
      { key: "date", label: "Date" },
      { key: "readTime", label: "Read Time" },
      { key: "category", label: "Category" },
      { key: "image", label: "Image" },
      { key: "sdg", label: "SDG Number" },
    ];

    const missing = requiredFields.filter(
      f => !editingStory[f.key as keyof FeaturedStory]
    );

    if (missing.length > 0) {
      toast.error(
        `Please fill in required fields: ${missing.map(f => f.label).join(", ")}`
      );
      return;
    }

    const isNew = !editingStory._id;
    if (isNew) {
      const { _id, ...data } = editingStory; // strip accidental _id
      const newStory = { ...data };
      saveFeaturedStories([...featuredStories, newStory]);
      toast.success("Featured story created successfully!");
    } else {
      saveFeaturedStories(
        featuredStories.map(s =>
          s._id === editingStory._id ? editingStory : s
        )
      );
      toast.success("Featured story updated successfully!");
    }
    

    setEditingStory(null);
  }
};

const handleDeleteStory = (id: string) => {
  setConfirmDialog({
    open: true,
    title: "Delete Featured Story",
    description: "Are you sure you want to delete this featured story?",
    onConfirm: () => {
      saveFeaturedStories(featuredStories.filter(s => s.id !== id));
      toast.success("Featured story deleted successfully!");
    },
    variant: "destructive",
  });
};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent">
            News Management
          </h1>
          <p className="text-gray-500 mt-1">Manage all news content - articles, videos, and featured stories</p>
        </div>
      </div>

      <Tabs defaultValue="articles" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="articles">
            <Eye className="h-4 w-4 mr-2" />
            In-Depth Articles ({articles.length})
          </TabsTrigger>
          <TabsTrigger value="videos">
            <Video className="h-4 w-4 mr-2" />
            Featured Videos ({videos.length})
          </TabsTrigger>
          <TabsTrigger value="stories">
            <Star className="h-4 w-4 mr-2" />
            Featured Stories ({featuredStories.length})
          </TabsTrigger>
        </TabsList>

        {/* In-Depth Articles Tab */}
        <TabsContent value="articles" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Magazine-style articles displayed in the News section
            </p>
            <Button
              onClick={() => setEditingArticle({
              
                title: '',
                description: '',
                excerpt: '',
                image: '',
                date: new Date().toISOString().split('T')[0],
                category: 'Clean Energy',
                author: '',
                readTime: '5 min read',
                featured: false
              })}
              className="bg-gradient-to-r from-yellow-500 to-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Article
            </Button>
          </div>

          <div className="grid gap-4">
            {articles.map((article) => (
              <Card key={article.id} className={article.featured ? "border-yellow-400 border-2" : ""}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {article.image && (
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-32 h-24 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg">{article.title}</h3>
                            {article.featured && (
                              <Badge className="bg-yellow-500">Featured</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{article.description}</p>
                          <div className="flex gap-4 text-xs text-gray-400">
                            <span>{article.date}</span>
                            <span>{article.category}</span>
                            <span>{article.author}</span>
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingArticle(article)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 hover:bg-red-50"
                            onClick={() => handleDeleteArticle(article.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {editingArticle && (
            <Card className="border-2 border-blue-500 mt-6">
              <CardHeader>
                <CardTitle>{editingArticle.id === 0 ? 'New Article' : 'Edit Article'}</CardTitle>
                <CardDescription>Create engaging in-depth articles for your readers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      value={editingArticle.title}
                      onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                      placeholder="Article title"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Author *</Label>
                    <Input
                      value={editingArticle.author}
                      onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                      placeholder="Dr. Sarah Chen"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Excerpt (Short Summary) *</Label>
                  <Textarea
                    value={editingArticle.excerpt}
                    onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                    placeholder="One-line summary for cards..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Full Description *</Label>
                  <Textarea
                    value={editingArticle.description}
                    onChange={(e) => setEditingArticle({ ...editingArticle, description: e.target.value })}
                    placeholder="Detailed article content..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Input
                      value={editingArticle.category}
                      onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                      placeholder="Clean Energy"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input
                      type="date"
                      value={editingArticle.date}
                      onChange={(e) => setEditingArticle({ ...editingArticle, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Read Time *</Label>
                    <Input
                      value={editingArticle.readTime}
                      onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                      placeholder="8 min read"
                    />
                  </div>
                  <div className="space-y-2 flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingArticle.featured}
                        onChange={(e) => setEditingArticle({ ...editingArticle, featured: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Featured</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Featured Image *</Label>
                  <div className="flex gap-2 items-center mb-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={editingArticle.image && !editingArticle.image.startsWith('data:') ? "default" : "outline"}
                      onClick={() => {
                        const useUrl = editingArticle.image && editingArticle.image.startsWith('data:');
                        if (useUrl) {
                          setEditingArticle({ ...editingArticle, image: '' });
                        }
                      }}
                    >
                      <LinkIcon className="h-4 w-4 mr-2" />
                      {editingArticle.image && !editingArticle.image.startsWith('data:') ? 'Using URL' : 'Use URL Instead'}
                    </Button>
                  </div>
                  
                  {editingArticle.image && !editingArticle.image.startsWith('data:') ? (
                    <div className="space-y-2">
                      <Input
                        value={editingArticle.image}
                        onChange={(e) => setEditingArticle({ ...editingArticle, image: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                      />
                      {editingArticle.image && (
                        <img src={editingArticle.image} alt="Preview" className="w-full h-48 object-cover rounded" />
                      )}
                    </div>
                  ) : (
                    <FileUpload
                      accept="image/*"
                      maxSize={5}
                      currentFile={editingArticle.image}
                      onUpload={(base64) => setEditingArticle({ ...editingArticle, image: base64 })}
                      type="image"
                      label="Upload Article Image"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label>External Link (optional)</Label>
                  <Input
                    value={editingArticle.link || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, link: e.target.value })}
                    placeholder="https://example.com/article"
                  />
                  <p className="text-xs text-gray-500">When users click "Explore More" in the article modal, they will be redirected to this URL</p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingArticle(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveArticle} className="bg-gradient-to-r from-yellow-500 to-blue-600">
                    <Save className="h-4 w-4 mr-2" />
                    Save Article
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Featured Videos Tab */}
        <TabsContent value="videos" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Video content featured in the News section
            </p>
            <Button
              onClick={() => setEditingVideo({
              
                title: '',
                description: '',
                thumbnail: '',
                duration: '',
                views: '0',
                date: new Date().toISOString().split('T')[0]
              })}
              className="bg-gradient-to-r from-yellow-500 to-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Video
            </Button>
          </div>

          <div className="grid gap-4">
            {videos.map((video) => (
              <Card key={video.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {video.thumbnail && (
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-48 h-28 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Video className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg">{video.title}</h3>
                          </div>
                          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{video.description}</p>
                          <div className="flex gap-4 text-xs text-gray-400">
                            <span>{video.date}</span>
                            <span>{video.duration}</span>
                            <span>{video.views} views</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingVideo(video)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 hover:bg-red-50"
                            onClick={() => handleDeleteVideo(video.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {editingVideo && (
            <Card className="border-2 border-blue-500 mt-6">
              <CardHeader>
                <CardTitle>{editingVideo.id === 0 ? 'New Video' : 'Edit Video'}</CardTitle>
                <CardDescription>Add featured videos to showcase your work</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      value={editingVideo.title}
                      onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                      placeholder="Video title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input
                      type="date"
                      value={editingVideo.date}
                      onChange={(e) => setEditingVideo({ ...editingVideo, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    value={editingVideo.description}
                    onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                    placeholder="Detailed video description..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Duration *</Label>
                    <Input
                      value={editingVideo.duration}
                      onChange={(e) => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                      placeholder="12:34"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Views</Label>
                    <Input
                      value={editingVideo.views}
                      onChange={(e) => setEditingVideo({ ...editingVideo, views: e.target.value })}
                      placeholder="45K"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Thumbnail Image *</Label>
                  <div className="flex gap-2 items-center mb-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={editingVideo.thumbnail && !editingVideo.thumbnail.startsWith('data:') ? "default" : "outline"}
                      onClick={() => {
                        const useUrl = editingVideo.thumbnail && editingVideo.thumbnail.startsWith('data:');
                        if (useUrl) {
                          setEditingVideo({ ...editingVideo, thumbnail: '' });
                        }
                      }}
                    >
                      <LinkIcon className="h-4 w-4 mr-2" />
                      {editingVideo.thumbnail && !editingVideo.thumbnail.startsWith('data:') ? 'Using URL' : 'Use URL Instead'}
                    </Button>
                  </div>
                  
                  {editingVideo.thumbnail && !editingVideo.thumbnail.startsWith('data:') ? (
                    <div className="space-y-2">
                      <Input
                        value={editingVideo.thumbnail}
                        onChange={(e) => setEditingVideo({ ...editingVideo, thumbnail: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                      />
                      {editingVideo.thumbnail && (
                        <img src={editingVideo.thumbnail} alt="Preview" className="w-full h-48 object-cover rounded" />
                      )}
                    </div>
                  ) : (
                    <FileUpload
                      accept="image/*"
                      maxSize={5}
                      currentFile={editingVideo.thumbnail}
                      onUpload={(base64) => setEditingVideo({ ...editingVideo, thumbnail: base64 })}
                      type="image"
                      label="Upload Video Thumbnail"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label>External Link (optional)</Label>
                  <Input
                    value={editingVideo.link || ''}
                    onChange={(e) => setEditingVideo({ ...editingVideo, link: e.target.value })}
                    placeholder="https://example.com/video"
                  />
                  <p className="text-xs text-gray-500">When users click "Explore More" in the video modal, they will be redirected to this URL</p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingVideo(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveVideo} className="bg-gradient-to-r from-yellow-500 to-blue-600">
                    <Save className="h-4 w-4 mr-2" />
                    Save Video
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Featured Stories Tab */}
        <TabsContent value="stories" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Hero stories with custom images displayed at the top of News section
            </p>
            <Button
              onClick={() => setEditingStory({
            
                title: '',
                excerpt: '',
                date: new Date().toISOString().split('T')[0],
                readTime: '5 min read',
                category: 'Clean Energy',
                sdg: 7,
                featured: false,
                image: '',
                useCustomImage: false
              })}
              className="bg-gradient-to-r from-yellow-500 to-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Story
            </Button>
          </div>

          <div className="grid gap-4">
            {featuredStories.map((story) => (
              <Card key={story.id} className={story.featured ? "border-yellow-400 border-2" : ""}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg">{story.title}</h3>
                        {story.featured && (
                          <Badge className="bg-yellow-500">Featured</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{story.excerpt}</p>
                      <div className="flex gap-4 text-xs text-gray-400">
                        <span>{story.date}</span>
                        <span>{story.category}</span>
                        <span>SDG {story.sdg}</span>
                        <span>{story.readTime}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingStory(story)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => handleDeleteStory(story.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {editingStory && (
            <Card className="border-2 border-blue-500 mt-6">
              <CardHeader>
                <CardTitle>{editingStory.id === 0 ? 'New Featured Story' : 'Edit Featured Story'}</CardTitle>
                <CardDescription>Hero stories with custom images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      value={editingStory.title}
                      onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })}
                      placeholder="Story title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input
                      type="date"
                      value={editingStory.date}
                      onChange={(e) => setEditingStory({ ...editingStory, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Excerpt *</Label>
                  <Textarea
                    value={editingStory.excerpt}
                    onChange={(e) => setEditingStory({ ...editingStory, excerpt: e.target.value })}
                    placeholder="Story description..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Input
                      value={editingStory.category}
                      onChange={(e) => setEditingStory({ ...editingStory, category: e.target.value })}
                      placeholder="Clean Energy"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SDG Number *</Label>
                    <Input
                      type="number"
                      min="1"
                      max="17"
                      value={editingStory.sdg}
                      onChange={(e) => setEditingStory({ ...editingStory, sdg: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Read Time *</Label>
                    <Input
                      value={editingStory.readTime}
                      onChange={(e) => setEditingStory({ ...editingStory, readTime: e.target.value })}
                      placeholder="5 min read"
                    />
                  </div>
                  <div className="space-y-2 flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingStory.featured}
                        onChange={(e) => setEditingStory({ ...editingStory, featured: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Featured</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Story Image</Label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingStory.useCustomImage}
                        onChange={(e) => setEditingStory({ ...editingStory, useCustomImage: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Upload custom image</span>
                    </label>
                  </div>
                  
                  {editingStory.useCustomImage ? (
                    <FileUpload
                      accept="image/*"
                      maxSize={5}
                      currentFile={editingStory.image}
                      onUpload={(base64) => setEditingStory({ ...editingStory, image: base64 })}
                      type="image"
                      label="Upload Story Image"
                    />
                  ) : (
                    <Input
                      value={editingStory.image}
                      onChange={(e) => setEditingStory({ ...editingStory, image: e.target.value })}
                      placeholder="solar schools bangladesh education"
                    />
                  )}
                  <p className="text-xs text-gray-500">
                    {editingStory.useCustomImage 
                      ? "Upload your own image file (max 5MB)" 
                      : "Enter Unsplash search query or direct image URL"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>External Link (optional)</Label>
                  <Input
                    value={editingStory.link || ''}
                    onChange={(e) => setEditingStory({ ...editingStory, link: e.target.value })}
                    placeholder="https://example.com/story"
                  />
                  <p className="text-xs text-gray-500">When users click "Explore More" in the story modal, they will be redirected to this URL</p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingStory(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveStory} className="bg-gradient-to-r from-yellow-500 to-blue-600">
                    <Save className="h-4 w-4 mr-2" />
                    Save Story
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={() => {
          confirmDialog.onConfirm();
          setConfirmDialog({ ...confirmDialog, open: false });
        }}
        variant={confirmDialog.variant}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}