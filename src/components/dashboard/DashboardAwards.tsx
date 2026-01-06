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
import { Save, Plus, Trash2, Edit, Award as AwardIcon, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { api } from "../../utils/api";
import { generateObjectId, normalizeFromApi, migrateDocuments } from "../../utils/objectId";
import { FileUpload } from "./FileUpload";

interface Award {
  id: string;
  _id?: string;
  title: string;
  organization: string;
  category: string;
  year: string;
  description: string;
  sdg: number;
  color: string;
  image?: string;
}

interface AchievementStat {
  label: string;
  value: string;
}

// Default awards data
const defaultAwards: Award[] = [
  {
    id: generateObjectId(),
    title: "SDG Action Award 2024",
    organization: "UN Global Compact",
    category: "Climate Action",
    year: "2024",
    description:
      "Outstanding contribution to climate action initiatives and carbon neutrality goals.",
    sdg: 13,
    color: "from-yellow-400 to-yellow-600",
  },
  {
    id: generateObjectId(),
    title: "Sustainable Innovation Prize",
    organization: "World Economic Forum",
    category: "Clean Energy",
    year: "2023",
    description:
      "Revolutionary approach to affordable and clean energy solutions in developing countries.",
    sdg: 7,
    color: "from-blue-400 to-blue-600",
  },
  {
    id: generateObjectId(),
    title: "Green Business Excellence",
    organization: "Asian Sustainability Council",
    category: "Responsible Production",
    year: "2024",
    description:
      "Leadership in sustainable business practices and circular economy implementation.",
    sdg: 12,
    color: "from-green-400 to-green-600",
  },
  {
    id: generateObjectId(),
    title: "Water Conservation Champion",
    organization: "Global Water Partnership",
    category: "Clean Water",
    year: "2023",
    description:
      "Exceptional efforts in water resource management and access to clean water initiatives.",
    sdg: 6,
    color: "from-cyan-400 to-cyan-600",
  },
];

// Default achievement stats
const defaultStats: AchievementStat[] = [
  { label: "Nominated Individuals", value: "25+" },
  { label: "SDGs Addressed", value: "17" },
  { label: "Partner Organizations", value: "5+" },
  { label: "Years of Impact", value: "1" },
];

export default function DashboardAwards() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [stats, setStats] = useState<AchievementStat[]>([]);
  const [editingAward, setEditingAward] = useState<Award | null>(null);
  const [editingStats, setEditingStats] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadAwards();
    loadStats();
    loadFeaturedAwards();
  }, []);

  const loadAwards = async () => {
    try {
      const data = await api.getAwards();
      if (data && data.awards && Array.isArray(data.awards) && data.awards.length > 0) {
        // Normalize awards from API (handle _id field from MongoDB)
        const normalizedAwards = data.awards.map(normalizeFromApi);
        setAwards(normalizedAwards);
      } else {
        setAwards([]);
      }
    } catch (error) {
      console.error('Error loading awards:', error);
      toast.error('Failed to load awards. Please try again.');
      setAwards([]);
    }
  };

  const loadStats = async () => {
    try {
      const data = await api.getAwards();
      if (data && data.stats && Array.isArray(data.stats) && data.stats.length > 0) {
        setStats(data.stats);
      } else {
        setStats(defaultStats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Failed to load statistics. Please try again.');
      setStats(defaultStats);
    }
  };

  const saveAwardsData = async (updatedAwards: Award[], updatedStats: AchievementStat[]) => {
    try {
      // For each award, either create or update based on whether it exists in current state
      for (const award of updatedAwards) {
        const existingAward = awards.find(a => a.id === award.id);
        if (existingAward) {
          // Update existing award
          await api.updateAward(award.id.toString(), award);
        } else {
          // Create new award
          await api.createAward(award);
        }
      }
      
      // Reload awards from backend to ensure sync
      await loadAwards();
      await loadStats();
      
      toast.success('Awards updated successfully!');
    } catch (error: any) {
      console.error('Error saving awards:', error);
      toast.error(error.message || 'Failed to save awards');
    }
  };

  const handleSaveAward = async () => {
    if (editingAward) {
      try {
        if (!editingAward.id || editingAward.id === "0" || editingAward.id === 0 as any) {
          // Create new award with ObjectId
          const newAward = { ...editingAward, id: generateObjectId() };
          await api.createAward(newAward);
          toast.success('Award created successfully!');
        } else {
          // Update existing award
          await api.updateAward(editingAward.id.toString(), editingAward);
          toast.success('Award updated successfully!');
        }
        
        // Reload awards from backend
        await loadAwards();
        setEditingAward(null);
      } catch (error: any) {
        console.error('Error saving award:', error);
        toast.error(error.message || 'Failed to save award');
      }
    }
  };

  const handleDeleteAward = async (id: string) => {
    if (confirm('Are you sure you want to delete this award?')) {
      try {
        await api.deleteAward(id);
        await loadAwards();
        toast.success('Award deleted successfully!');
      } catch (error: any) {
        console.error('Error deleting award:', error);
        toast.error(error.message || 'Failed to delete award');
      }
    }
  };

 const handleSaveStats = async () => {
  try {
    await api.updateStats(stats);
    setEditingStats(false);
    toast.success("Achievement stats updated successfully!");
  } catch (error: any) {
    console.error("Error saving stats:", error);
    toast.error(error.message || "Failed to save statistics");
  }
};


  const handleStatChange = (index: number, field: 'label' | 'value', value: string) => {
    const updatedStats = [...stats];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    setStats(updatedStats);
  };



  const [featuredAwards, setFeaturedAwards] = useState<Award[]>([]);
const [editingFeatured, setEditingFeatured] = useState<Award | null>(null);

const loadFeaturedAwards = async () => {
  try {
    const data = await api.getFeaturedAwards();
    if (Array.isArray(data)) {
      const normalized = data.map((doc) => ({
        id: doc._id?.toString(),
        ...doc,
      }));
      setFeaturedAwards(normalized);
    } else {
      setFeaturedAwards([]);
    }
  } catch (err) {
    console.error("Error loading featured awards:", err);
    setFeaturedAwards([]);
  }
};


const handleSaveFeatured = async () => {
  if (editingFeatured) {
    try {
      if (!editingFeatured.id || editingFeatured.id === "0") {
        const newAward = { ...editingFeatured, id: generateObjectId() };
        await api.createFeaturedAward(newAward);
      } else {
        await api.updateFeaturedAward(editingFeatured.id.toString(), editingFeatured);
      }

      // 🔑 Always await reload after save
      await loadFeaturedAwards();

      setEditingFeatured(null);
      toast.success("Featured award saved!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save featured award");
    }
  }
};

const handleDeleteFeatured = async (id: string) => {
  if (confirm("Delete this featured award?")) {
    try {
      await api.deleteFeaturedAward(id);
      await loadFeaturedAwards();
      toast.success("Featured award deleted!");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete featured award");
    }
  }
};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent">
            Awards Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage awards and achievement statistics
          </p>
        </div>
      </div>
      

      <Tabs defaultValue="awards" className="w-full">
       <TabsList className="grid w-full grid-cols-3 max-w-md">
  <TabsTrigger value="awards">
    <AwardIcon className="h-4 w-4 mr-2" />
    Awards ({awards.length})
  </TabsTrigger>
  <TabsTrigger value="stats">
    <TrendingUp className="h-4 w-4 mr-2" />
    Achievement Stats
  </TabsTrigger>
  <TabsTrigger value="featured">
    <AwardIcon className="h-4 w-4 mr-2 text-yellow-500" />
    Featured ({featuredAwards.length})
  </TabsTrigger>
</TabsList>
{/* Featured Awards Tab */}
<TabsContent value="featured" className="space-y-4">
  <div className="flex justify-between items-center">
    <p className="text-sm text-gray-500">Featured awards highlighted on the site</p>
    <Button
      onClick={() =>
        setEditingFeatured({
          id: 0,
          title: "",
          organization: "",
          category: "",
          year: new Date().getFullYear().toString(),
          description: "",
          sdg: 7,
          color: "from-yellow-400 to-yellow-600",
        })
      }
      className="bg-gradient-to-r from-yellow-500 to-blue-600"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Featured Award
    </Button>
  </div>

  <div className="grid gap-4">
    {featuredAwards.map((award) => (
      <Card key={award.id}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg mb-1">{award.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{award.description}</p>
              <div className="flex gap-4 text-xs text-gray-400">
                <span>{award.organization}</span>
                <span>{award.year}</span>
                <span>{award.category}</span>
                <span>SDG {award.sdg}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditingFeatured(award)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-500 hover:bg-red-50"
                onClick={() => handleDeleteFeatured(award.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>

  {editingFeatured && (
    <Card className="border-2 border-yellow-500">
      <CardHeader>
        <CardTitle>{editingFeatured.id === 0 ? "New Featured Award" : "Edit Featured Award"}</CardTitle>
        <CardDescription>Manage featured award information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Same fields as Awards, but no image upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              value={editingFeatured.title}
              onChange={(e) => setEditingFeatured({ ...editingFeatured, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Organization *</Label>
            <Input
              value={editingFeatured.organization}
              onChange={(e) => setEditingFeatured({ ...editingFeatured, organization: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Category *</Label>
            <Input
              value={editingFeatured.category}
              onChange={(e) => setEditingFeatured({ ...editingFeatured, category: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Year *</Label>
            <Input
              value={editingFeatured.year}
              onChange={(e) => setEditingFeatured({ ...editingFeatured, year: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>SDG *</Label>
            <Input
              type="number"
              min="1"
              max="17"
              value={editingFeatured.sdg}
              onChange={(e) => setEditingFeatured({ ...editingFeatured, sdg: parseInt(e.target.value) || 7 })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description *</Label>
          <Textarea
            value={editingFeatured.description}
            onChange={(e) => setEditingFeatured({ ...editingFeatured, description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Color Gradient *</Label>
          <Input
            value={editingFeatured.color}
            onChange={(e) => setEditingFeatured({ ...editingFeatured, color: e.target.value })}
          />
        </div>

        <div className="space-y-2">
        <Label>Image (optional)</Label>
        <FileUpload
          onUpload={(url) =>
            setEditingFeatured({ ...editingFeatured, image: url })
          }
          onDelete={() =>
            setEditingFeatured({ ...editingFeatured, image: undefined })
          }
          imageUrl={editingFeatured.image}
        />
      </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setEditingFeatured(null)}>
            Cancel
          </Button>
          <Button onClick={handleSaveFeatured} className="bg-gradient-to-r from-yellow-500 to-blue-600">
            <Save className="h-4 w-4 mr-2" />
            Save Featured Award
          </Button>
        </div>
      </CardContent>
    </Card>
  )}
</TabsContent>

        {/* Awards Tab */}
        <TabsContent value="awards" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 ">
              Recognition and awards received
            </p>
            <Button
              onClick={() =>
                setEditingAward({
                  id: 0,
                  title: "",
                  organization: "",
                  category: "",
                  year: new Date().getFullYear().toString(),
                  description: "",
                  sdg: 7,
                  color: "from-yellow-400 to-yellow-600",
                })
              }
              className="bg-gradient-to-r from-yellow-500 to-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Award
            </Button>
          </div>

          <div className="grid gap-4">
            {awards.map((award) => (
              <Card key={award.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg mb-1">{award.title}</h3>
                      <p className="text-sm text-gray-500 mb-2 whitespace-pre-line break-words break-all text-justify leading-relaxed">
                        {award.description}
                      </p>
                      <div className="flex gap-4 text-xs text-gray-400">
                        <span>{award.organization}</span>
                        <span>{award.year}</span>
                        <span>{award.category}</span>
                        <span>SDG {award.sdg}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingAward(award)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => handleDeleteAward(award.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {editingAward && (
            <Card className="border-2 border-blue-500">
              <CardHeader>
                <CardTitle>
                  {editingAward.id === 0 ? "New Award" : "Edit Award"}
                </CardTitle>
                <CardDescription>
                  Add or update award information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Award Title *</Label>
                    <Input
                      value={editingAward.title}
                      onChange={(e) =>
                        setEditingAward({
                          ...editingAward,
                          title: e.target.value,
                        })
                      }
                      placeholder="SDG Action Award 2024"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Organization *</Label>
                    <Input
                      value={editingAward.organization}
                      onChange={(e) =>
                        setEditingAward({
                          ...editingAward,
                          organization: e.target.value,
                        })
                      }
                      placeholder="UN Global Compact"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Input
                      value={editingAward.category}
                      onChange={(e) =>
                        setEditingAward({
                          ...editingAward,
                          category: e.target.value,
                        })
                      }
                      placeholder="Climate Action"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Year *</Label>
                    <Input
                      value={editingAward.year}
                      onChange={(e) =>
                        setEditingAward({
                          ...editingAward,
                          year: e.target.value,
                        })
                      }
                      placeholder="2024"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SDG Number (1-17) *</Label>
                    <Input
                      type="number"
                      min="1"
                      max="17"
                      value={editingAward.sdg}
                      onChange={(e) =>
                        setEditingAward({
                          ...editingAward,
                          sdg: parseInt(e.target.value) || 7,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2 whitespace-pre-line break-words break-all text-justify leading-relaxed">
                  <Label>Description *</Label>
                  <Textarea
                    value={editingAward.description}
                    onChange={(e) =>
                      setEditingAward({
                        ...editingAward,
                        description: e.target.value,
                      })
                    }
                    placeholder="Outstanding contribution to..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Color Gradient (Tailwind classes) *</Label>
                  <Input
                    value={editingAward.color}
                    onChange={(e) =>
                      setEditingAward({
                        ...editingAward,
                        color: e.target.value,
                      })
                    }
                    placeholder="from-yellow-400 to-yellow-600"
                  />
                  <p className="text-xs text-gray-500">
                    Examples: from-yellow-400 to-yellow-600, from-blue-400 to-blue-600, from-green-400 to-green-600
                  </p>
                </div>

             

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingAward(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveAward}
                    className="bg-gradient-to-r from-yellow-500 to-blue-600"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Award
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Achievement Stats Tab */}
        <TabsContent value="stats" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Key achievement statistics displayed on the Awards page
            </p>
            {!editingStats && (
              <Button
                onClick={() => setEditingStats(true)}
                className="bg-gradient-to-r from-yellow-500 to-blue-600"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Stats
              </Button>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Achievement Statistics</CardTitle>
              <CardDescription>
                Display key metrics and milestones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.map((stat, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                      placeholder="Nominated Individuals"
                      disabled={!editingStats}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                      placeholder="25+"
                      disabled={!editingStats}
                    />
                  </div>
                </div>
              ))}

              {editingStats && (
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingStats(false);
                      loadStats();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveStats}
                    className="bg-gradient-to-r from-yellow-500 to-blue-600"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Statistics
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}