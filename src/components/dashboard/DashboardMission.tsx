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
import { Save, Edit, Target, Lightbulb, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { api } from "../../utils/api";

interface MissionPillar {
  title: string;
  description: string;
  color: string;
}

interface Objective {
  title: string;
  description: string;
  color: string;
}

interface MissionContent {
  heroTitle: string;
  heroSubtitle: string;
  pillars: MissionPillar[];
  objectives: Objective[];
}

// Default mission content
const defaultMissionContent: MissionContent = {
  heroTitle: "Our Mission",
  heroSubtitle: "Empowering sustainable development and responsible enterprise across Asia and the Pacific",
  pillars: [
    {
      title: "Corporate Social Responsibility",
      description:
        "Advancing corporate social responsibility and environmental sustainability across Asia and the Pacific by recognizing exemplary leadership in ethical governance.",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Climate Action Leadership",
      description:
        "Celebrating and promoting climate action and green innovation through our awards programs that inspire science-based sustainability strategies.",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Low-Carbon Economy",
      description:
        "Catalyzing a low-carbon economy by encouraging businesses and organizations to reduce carbon footprints and align with global sustainability goals.",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Ethical Governance",
      description:
        "Promoting responsible enterprise practices and ethical governance that harmonize economic growth with planetary stewardship.",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Green Innovation",
      description:
        "Fostering green innovation and science-based strategies that drive meaningful environmental impact and sustainable development.",
      color: "from-teal-500 to-teal-600",
    },
    {
      title: "Climate Resilience",
      description:
        "Building climate resilience across the Asia-Pacific region by inspiring individuals and organizations to adopt sustainable practices.",
      color: "from-blue-400 to-green-500",
    },
  ],
  objectives: [
    {
      title: "Honor Leadership Excellence",
      description:
        "To honor businesses, organizations, and individuals demonstrating leadership in corporate social responsibility (CSR), ethical governance, and environmental sustainability through the Climate Neutral Awards.",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Drive Climate Action & Advocacy",
      description:
        "To drive Awareness and Advocacy for Climate Action and encourage enterprises to adopt science-based sustainability strategies, reduce carbon footprints, and contribute to national and global climate resilience efforts.",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Provide Global Exposure",
      description:
        "To provide awardees with nationwide and international exposure through high-impact publications, digital media, and an exclusive gala event.",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Foster Networking Opportunities",
      description:
        "To create networking opportunities among sustainable enterprises, industry leaders, government officials, and experts to exchange best practices and innovative solutions.",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Ensure Lasting Recognition",
      description:
        "To ensure lasting recognition through the publication of awardees' achievements in a luxury coffee table magazine, reinforcing their commitment to sustainability and inspiring future leaders.",
      color: "from-teal-500 to-teal-600",
    },
  ],
};

export default function DashboardMission() {
  const [missionContent, setMissionContent] = useState<MissionContent>(defaultMissionContent);
  const [editingSection, setEditingSection] = useState<'hero' | 'pillars' | 'objectives' | null>(null);
  const [tempContent, setTempContent] = useState<MissionContent>(defaultMissionContent);

  // Load data on component mount
  useEffect(() => {
    loadMissionContent();
  }, []);

  const loadMissionContent = async () => {
    try {
      const data = await api.getMission();
      if (data && data.content) {
        setMissionContent(data.content);
        setTempContent(data.content);
      } else {
        setMissionContent(defaultMissionContent);
        setTempContent(defaultMissionContent);
      }
    } catch (error) {
      console.error('Error loading mission content:', error);
      toast.error('Failed to load mission content. Please try again.');
      setMissionContent(defaultMissionContent);
      setTempContent(defaultMissionContent);
    }
  };

  const saveMissionContent = async (content: MissionContent) => {
    try {
      await api.updateMission({ content });
      setMissionContent(content);
      setTempContent(content);
      toast.success('Mission content saved successfully!');
    } catch (error: any) {
      console.error('Error saving mission content:', error);
      toast.error(error.message || 'Failed to save mission content');
    }
  };

  const handleSave = () => {
    saveMissionContent(tempContent);
    setEditingSection(null);
  };

  const handleCancel = () => {
    setTempContent(missionContent);
    setEditingSection(null);
  };

  const updatePillar = (index: number, field: keyof MissionPillar, value: string) => {
    const updatedPillars = [...tempContent.pillars];
    updatedPillars[index] = { ...updatedPillars[index], [field]: value };
    setTempContent({ ...tempContent, pillars: updatedPillars });
  };

  const updateObjective = (index: number, field: keyof Objective, value: string) => {
    const updatedObjectives = [...tempContent.objectives];
    updatedObjectives[index] = { ...updatedObjectives[index], [field]: value };
    setTempContent({ ...tempContent, objectives: updatedObjectives });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent">
            Mission Management
          </h1>
          <p className="text-gray-500 mt-1">
            Edit mission content, pillars, and objectives
          </p>
        </div>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="hero">
            <Target className="h-4 w-4 mr-2" />
            Hero Section
          </TabsTrigger>
          <TabsTrigger value="pillars">
            <Lightbulb className="h-4 w-4 mr-2" />
            Mission Pillars ({missionContent.pillars.length})
          </TabsTrigger>
          <TabsTrigger value="objectives">
            <TrendingUp className="h-4 w-4 mr-2" />
            Objectives ({missionContent.objectives.length})
          </TabsTrigger>
        </TabsList>

        {/* Hero Section Tab */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Hero Section</CardTitle>
                  <CardDescription>Main title and subtitle for the Mission page</CardDescription>
                </div>
                {editingSection !== 'hero' && (
                  <Button
                    onClick={() => setEditingSection('hero')}
                    className="bg-gradient-to-r from-yellow-500 to-blue-600"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingSection === 'hero' ? (
                <>
                  <div className="space-y-2">
                    <Label>Hero Title *</Label>
                    <Input
                      value={tempContent.heroTitle}
                      onChange={(e) =>
                        setTempContent({ ...tempContent, heroTitle: e.target.value })
                      }
                      placeholder="Our Mission"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Hero Subtitle *</Label>
                    <Textarea
                      value={tempContent.heroSubtitle}
                      onChange={(e) =>
                        setTempContent({ ...tempContent, heroSubtitle: e.target.value })
                      }
                      placeholder="Empowering sustainable development..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-yellow-500 to-blue-600"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Hero Section
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-semibold mb-2">Title</h3>
                    <p className="text-gray-600">{missionContent.heroTitle}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Subtitle</h3>
                    <p className="text-gray-600">{missionContent.heroSubtitle}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mission Pillars Tab */}
        <TabsContent value="pillars" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Core mission pillars displayed on the Mission page
            </p>
            {editingSection !== 'pillars' && (
              <Button
                onClick={() => setEditingSection('pillars')}
                className="bg-gradient-to-r from-yellow-500 to-blue-600"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit All Pillars
              </Button>
            )}
          </div>

          {editingSection === 'pillars' ? (
            <Card className="border-2 border-blue-500">
              <CardHeader>
                <CardTitle>Edit Mission Pillars</CardTitle>
                <CardDescription>Update all mission pillars</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {tempContent.pillars.map((pillar, index) => (
                  <Card key={index} className="border">
                    <CardContent className="p-4 space-y-4">
                      <h4 className="font-semibold">Pillar {index + 1}</h4>
                      <div className="space-y-2">
                        <Label>Title *</Label>
                        <Input
                          value={pillar.title}
                          onChange={(e) => updatePillar(index, 'title', e.target.value)}
                          placeholder="Corporate Social Responsibility"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea
                          value={pillar.description}
                          onChange={(e) => updatePillar(index, 'description', e.target.value)}
                          placeholder="Advancing corporate social responsibility..."
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Color Gradient *</Label>
                        <Input
                          value={pillar.color}
                          onChange={(e) => updatePillar(index, 'color', e.target.value)}
                          placeholder="from-yellow-500 to-yellow-600"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-yellow-500 to-blue-600"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save All Pillars
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {missionContent.pillars.map((pillar, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{pillar.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{pillar.description}</p>
                    <p className="text-xs text-gray-400">Color: {pillar.color}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Objectives Tab */}
        <TabsContent value="objectives" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Key objectives displayed on the Mission page
            </p>
            {editingSection !== 'objectives' && (
              <Button
                onClick={() => setEditingSection('objectives')}
                className="bg-gradient-to-r from-yellow-500 to-blue-600"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit All Objectives
              </Button>
            )}
          </div>

          {editingSection === 'objectives' ? (
            <Card className="border-2 border-blue-500">
              <CardHeader>
                <CardTitle>Edit Objectives</CardTitle>
                <CardDescription>Update all mission objectives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {tempContent.objectives.map((objective, index) => (
                  <Card key={index} className="border">
                    <CardContent className="p-4 space-y-4">
                      <h4 className="font-semibold">Objective {index + 1}</h4>
                      <div className="space-y-2">
                        <Label>Title *</Label>
                        <Input
                          value={objective.title}
                          onChange={(e) => updateObjective(index, 'title', e.target.value)}
                          placeholder="Honor Leadership Excellence"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea
                          value={objective.description}
                          onChange={(e) => updateObjective(index, 'description', e.target.value)}
                          placeholder="To honor businesses..."
                          rows={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Color Gradient *</Label>
                        <Input
                          value={objective.color}
                          onChange={(e) => updateObjective(index, 'color', e.target.value)}
                          placeholder="from-yellow-500 to-yellow-600"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-yellow-500 to-blue-600"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save All Objectives
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {missionContent.objectives.map((objective, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{objective.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{objective.description}</p>
                    <p className="text-xs text-gray-400">Color: {objective.color}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}