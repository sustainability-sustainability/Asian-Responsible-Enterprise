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
import {
  Save,
  Plus,
  Trash2,
  Edit,
  Users,
  Video,
  MessageSquare,
  TrendingUp,
  Star,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { FileUpload } from "./FileUpload";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { api } from "../../utils/api";

interface CommunityStats {
  label: string;
  value: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  members: number;
  location: string;
  sdg: number;
  progress: number;
  category: string;
}

interface CommunityEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  attendees: number;
  sdg: number;
}

interface CommunityVideo {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl?: string;
  duration: string;
  views: string;
  category: string;
  featured: boolean;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  message: string;
  avatar: string;
}

interface CommunityData {
  stats: CommunityStats[];
  projects: Project[];
  events: CommunityEvent[];
  videos: CommunityVideo[];
  testimonials: Testimonial[];
}

// ✅ Empty defaults — ready to be filled from MongoDB
const defaultCommunityData: CommunityData = {
  stats: [
    { label: "Active Members", value: "0" },
    { label: "Projects Launched", value: "0" },
    { label: "Countries Reached", value: "0" },
    { label: "Impact Stories", value: "0" }
   ],
  projects: [],
  events: [],
  videos: [],
  testimonials: [],
};


function base64ToFile(base64: string, filename: string) {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export default function DashboardCommunity() {
  const [communityData, setCommunityData] = useState<CommunityData>(defaultCommunityData);
  const [editingStats, setEditingStats] = useState(false);
  const [tempStats, setTempStats] = useState<CommunityStats[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingEvent, setEditingEvent] = useState<CommunityEvent | null>(null);
  const [editingVideo, setEditingVideo] = useState<CommunityVideo | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  
  // Confirmation dialog state
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

  useEffect(() => {
    loadCommunityData();
  }, []);

 const loadCommunityData = async () => {
  try {
    const data = await api.getCommunity();
    if (data) {
      const loadedData: CommunityData = {
        stats: data.stats || [],
        projects: data.projects || [],
        events: data.events || [],
        videos: data.videos || [],
        testimonials: data.testimonials || []
      };
      setCommunityData(loadedData);
      setTempStats(loadedData.stats);
    } else {
      setCommunityData(defaultCommunityData);
      setTempStats(defaultCommunityData.stats);
    }
  } catch (error) {
    console.error('Error loading community data:', error);
    toast.error('Failed to load community data. Please try again.');
    setCommunityData(defaultCommunityData);
    setTempStats(defaultCommunityData.stats);
  }
};

const saveCommunityData = async (data: CommunityData) => {
  try {
    console.log("Payload being sent to backend:", JSON.stringify(data, null, 2));

   await api.updateCommunity(data); // ✅ send raw objec // ✅ send raw object
    setCommunityData(data);
    setTempStats(data.stats);
    toast.success('Community data saved successfully!');
  } catch (error: any) {
    console.error('Error saving community data:', error);
    toast.error(error.message || 'Failed to save community data');
  }
};

  // Stats Management
  const handleSaveStats = () => {
    setConfirmDialog({
      open: true,
      title: 'Save Community Stats',
      description: 'Are you sure you want to save these changes? The statistics will be updated on the Community page.',
      onConfirm: () => {
        const updatedData = { ...communityData, stats: tempStats };
        saveCommunityData(updatedData);
        setEditingStats(false);
        toast.success('Community stats updated successfully!');
      },
      variant: 'default'
    });
  };

  const updateStat = (index: number, field: keyof CommunityStats, value: string) => {
    const updated = [...tempStats];
    updated[index] = { ...updated[index], [field]: value };
    setTempStats(updated);
  };

  // Projects Management
  const handleSaveProject = () => {
  if (editingProject) {
    const action = editingProject.id === 0 ? "create" : "update";
    setConfirmDialog({
      open: true,
      title: action === "create" ? "Create Project" : "Update Project",
      description:
        action === "create"
          ? "Are you sure you want to create this project?"
          : "Are you sure you want to save these changes?",
      onConfirm: () => {
        // ✅ Always fall back to an empty array if projects is undefined
        const currentProjects = communityData.projects || [];
        let updatedProjects;

        if (editingProject.id === 0) {
          const newProject = { ...editingProject, id: Date.now() };
          updatedProjects = [...currentProjects, newProject];
          toast.success("Project created successfully!");
        } else {
          updatedProjects = currentProjects.map((p) =>
            p.id === editingProject.id ? editingProject : p
          );
          toast.success("Project updated successfully!");
        }

        saveCommunityData({ ...communityData, projects: updatedProjects });
        setEditingProject(null);
      },
      variant: "default",
    });
  }
};

  const handleDeleteProject = (id: number) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Project',
      description: 'Are you sure you want to delete this project? This action cannot be undone.',
      onConfirm: () => {
        const updatedProjects = communityData.projects.filter((p) => p.id !== id);
        saveCommunityData({ ...communityData, projects: updatedProjects });
        toast.success('Project deleted successfully!');
      },
      variant: 'destructive'
    });
  };

  // Events Management
  const handleSaveEvent = () => {
    if (editingEvent) {
      const action = editingEvent.id === 0 ? 'create' : 'update';
      setConfirmDialog({
        open: true,
        title: action === 'create' ? 'Create Event' : 'Update Event',
        description: action === 'create'
          ? 'Are you sure you want to create this event?'
          : 'Are you sure you want to save these changes?',
        onConfirm: () => {
          let updatedEvents;
          if (editingEvent.id === 0) {
            const newEvent = { ...editingEvent, id: Date.now() };
            updatedEvents = [...communityData.events, newEvent];
            toast.success('Event created successfully!');
          } else {
            updatedEvents = communityData.events.map((e) =>
              e.id === editingEvent.id ? editingEvent : e
            );
            toast.success('Event updated successfully!');
          }
          saveCommunityData({ ...communityData, events: updatedEvents });
          setEditingEvent(null);
        },
        variant: 'default'
      });
    }
  };

  const handleDeleteEvent = (id: number) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Event',
      description: 'Are you sure you want to delete this event? This action cannot be undone.',
      onConfirm: () => {
        const updatedEvents = communityData.events.filter((e) => e.id !== id);
        saveCommunityData({ ...communityData, events: updatedEvents });
        toast.success('Event deleted successfully!');
      },
      variant: 'destructive'
    });
  };

  // Videos Management
// Helper: convert base64 thumbnail into a File
function base64ToFile(base64: string, filename: string) {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

const handleSaveVideo = async () => {
  if (!editingVideo) return;

  try {
    let uploadedUrl = editingVideo.videoUrl;
    let uploadedThumb = editingVideo.thumbnail;

    // Upload video file
    if (editingVideo.file) {
      const formData = new FormData();
      formData.append("video", editingVideo.file);

      const res = await fetch("http://localhost:5000/api/community/upload-video", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Video upload failed");
      const { videoUrl } = await res.json();
      uploadedUrl = videoUrl; // ✅ Cloudinary secure_url
    }

    // Upload thumbnail if base64
    if (uploadedThumb && uploadedThumb.startsWith("data:image")) {
      const thumbFile = base64ToFile(uploadedThumb, "thumbnail.png");
      const formData = new FormData();
      formData.append("image", thumbFile);

      const res = await fetch("http://localhost:5000/api/community/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Image upload failed");
      const { imageUrl } = await res.json();
      uploadedThumb = imageUrl;
    }

    // Clean video object
    const { file, thumbnailFile, preview, ...rest } = editingVideo;
    const cleanVideo = {
      ...rest,
      videoUrl: uploadedUrl,
      thumbnail: uploadedThumb,
    };

    // Update list
    const updatedVideos =
      editingVideo.id === 0
        ? [...communityData.videos, { ...cleanVideo, id: Date.now() }]
        : communityData.videos.map((v) =>
            v.id === editingVideo.id ? cleanVideo : v
          );

    await saveCommunityData({ ...communityData, videos: updatedVideos });
    setEditingVideo(null);
  } catch (err) {
    console.error("Error saving video:", err);
  }
};


  const handleDeleteVideo = (id: number) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Video',
      description: 'Are you sure you want to delete this video? This action cannot be undone.',
      onConfirm: () => {
        const updatedVideos = communityData.videos.filter((v) => v.id !== id);
        saveCommunityData({ ...communityData, videos: updatedVideos });
        toast.success('Video deleted successfully!');
      },
      variant: 'destructive'
    });
  };

  // Testimonials Management
  const handleSaveTestimonial = () => {
    if (editingTestimonial) {
      const action = editingTestimonial.id === 0 ? 'create' : 'update';
      setConfirmDialog({
        open: true,
        title: action === 'create' ? 'Create Testimonial' : 'Update Testimonial',
        description: action === 'create'
          ? 'Are you sure you want to add this testimonial to Community Voices?'
          : 'Are you sure you want to save these changes?',
        onConfirm: () => {
          let updatedTestimonials;
          if (editingTestimonial.id === 0) {
            const newTestimonial = { ...editingTestimonial, id: Date.now() };
            updatedTestimonials = [...communityData.testimonials, newTestimonial];
            toast.success('Testimonial created successfully!');
          } else {
            updatedTestimonials = communityData.testimonials.map((t) =>
              t.id === editingTestimonial.id ? editingTestimonial : t
            );
            toast.success('Testimonial updated successfully!');
          }
          saveCommunityData({ ...communityData, testimonials: updatedTestimonials });
          setEditingTestimonial(null);
        },
        variant: 'default'
      });
    }
  };

  const handleDeleteTestimonial = (id: number) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Testimonial',
      description: 'Are you sure you want to delete this testimonial? This action cannot be undone.',
      onConfirm: () => {
        const updatedTestimonials = communityData.testimonials.filter((t) => t.id !== id);
        saveCommunityData({ ...communityData, testimonials: updatedTestimonials });
        toast.success('Testimonial deleted successfully!');
      },
      variant: 'destructive'
    });
  };


  


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent">
            Community Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage community stats, projects, events, videos, and testimonials
          </p>
        </div>
      </div>

      <Tabs defaultValue="stats" className="w-full">
       <TabsList className="grid w-full grid-cols-5 max-w-4xl">
        <TabsTrigger value="stats">
          <Users className="h-4 w-4 mr-2" />
          Stats ({communityData.stats?.length ?? 0})
        </TabsTrigger>
        <TabsTrigger value="projects">
          <Star className="h-4 w-4 mr-2" />
          Projects ({communityData.projects?.length ?? 0})
        </TabsTrigger>
        <TabsTrigger value="events">
          <Calendar className="h-4 w-4 mr-2" />
          Events ({communityData.events?.length ?? 0})
        </TabsTrigger>
        <TabsTrigger value="videos">
          <Video className="h-4 w-4 mr-2" />
          Videos ({communityData.videos?.length ?? 0})
        </TabsTrigger>
        <TabsTrigger value="testimonials">
          <MessageCircle className="h-4 w-4 mr-2" />
          Voices ({communityData.testimonials?.length ?? 0})
        </TabsTrigger>
        </TabsList>


        {/* Stats Tab */}
     <TabsContent value="stats" className="space-y-4">
  <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
          <CardTitle>Community Statistics</CardTitle>
          <CardDescription>
            Key metrics displayed on the Community page
          </CardDescription>
        </div>
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
    </CardHeader>

    <CardContent className="space-y-4">
      {editingStats ? (
        <>
          {(tempStats ?? []).map((stat, index) => (
            <Card key={index} className="p-4 border">
              <div className="space-y-3">
                <h4 className="font-semibold">Stat {index + 1}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Label *</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) =>
                        updateStat(index, "label", e.target.value)
                      }
                      placeholder="Projects Launched"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Value *</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) =>
                        updateStat(index, "value", e.target.value)
                      }
                      placeholder="150K+"
                    />
                  </div>
                </div>
                {/* Delete button for each stat */}
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() =>
                      setTempStats(
                        (tempStats ?? []).filter((_, i) => i !== index)
                      )
                    }
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {/* ➕ Add Stat button */}
          <div className="flex justify-start">
            <Button
              variant="outline"
              onClick={() =>
                setTempStats([...(tempStats ?? []), { label: "", value: "" }])
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Stat
            </Button>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditingStats(false);
                setTempStats(communityData.stats ?? []);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveStats}
              className="bg-gradient-to-r from-yellow-500 to-blue-600"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Stats
            </Button>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(communityData.stats ?? []).map((stat, index) => (
            <Card key={index} className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>


        {/* Projects Tab - Continue from previous implementation... */}
        <TabsContent value="projects" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() =>
                setEditingProject({
                  id: 0,
                  title: "",
                  description: "",
                  members: 0,
                  location: "",
                  sdg: 1,
                  progress: 0,
                  category: "",
                })
              }
              className="bg-gradient-to-r from-yellow-500 to-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>

          <div className="grid gap-4">
            {(communityData.projects ?? []).map((project) => (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>👥 {project.members} members</span>
                        <span>📍 {project.location}</span>
                        <span>🎯 SDG {project.sdg}</span>
                        <span>📊 {project.progress}% progress</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingProject(project)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {editingProject && (
            <Card className="border-2 border-blue-500">
              <CardHeader>
                <CardTitle>{editingProject.id === 0 ? "New Project" : "Edit Project"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Project Title *</Label>
                  <Input
                    value={editingProject.title}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, title: e.target.value })
                    }
                    placeholder="Clean Water for Rural Communities"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    value={editingProject.description}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    placeholder="Project description..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Members *</Label>
                    <Input
                      type="number"
                      value={editingProject.members}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          members: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="245"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <Input
                      value={editingProject.location}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, location: e.target.value })
                      }
                      placeholder="Southeast Asia"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>SDG (1-17) *</Label>
                    <Input
                      type="number"
                      min="1"
                      max="17"
                      value={editingProject.sdg}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          sdg: parseInt(e.target.value) || 1,
                        })
                      }
                      placeholder="6"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Progress (%) *</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={editingProject.progress}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          progress: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="75"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Input
                    value={editingProject.category}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, category: e.target.value })
                    }
                    placeholder="Water & Sanitation"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingProject(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProject}
                    className="bg-gradient-to-r from-yellow-500 to-blue-600"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Events Tab - Same structure as before */}
        <TabsContent value="events" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() =>
                setEditingEvent({
                  id: 0,
                  title: "",
                  date: "",
                  time: "",
                  type: "Virtual",
                  attendees: 0,
                  sdg: 1,
                })
              }
              className="bg-gradient-to-r from-yellow-500 to-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>

          <div className="grid gap-4">
            {(communityData.events ?? []).map((event) => (
              <Card key={event.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>📅 {event.date}</span>
                        <span>🕐 {event.time}</span>
                        <span>📍 {event.type}</span>
                        <span>👥 {event.attendees} attendees</span>
                        <span>🎯 SDG {event.sdg}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingEvent(event)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {editingEvent && (
            <Card className="border-2 border-blue-500">
              <CardHeader>
                <CardTitle>{editingEvent.id === 0 ? "New Event" : "Edit Event"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Event Title *</Label>
                  <Input
                    value={editingEvent.title}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, title: e.target.value })
                    }
                    placeholder="Global Climate Action Webinar"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input
                      type="date"
                      value={editingEvent.date}
                      onChange={(e) =>
                        setEditingEvent({ ...editingEvent, date: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Time *</Label>
                    <Input
                      value={editingEvent.time}
                      onChange={(e) =>
                        setEditingEvent({ ...editingEvent, time: e.target.value })
                      }
                      placeholder="14:00 UTC"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Type *</Label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={editingEvent.type}
                      onChange={(e) =>
                        setEditingEvent({ ...editingEvent, type: e.target.value })
                      }
                    >
                      <option value="Virtual">Virtual</option>
                      <option value="In-Person">In-Person</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Attendees *</Label>
                    <Input
                      type="number"
                      value={editingEvent.attendees}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          attendees: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="2500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>SDG (1-17) *</Label>
                    <Input
                      type="number"
                      min="1"
                      max="17"
                      value={editingEvent.sdg}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          sdg: parseInt(e.target.value) || 1,
                        })
                      }
                      placeholder="13"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingEvent(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEvent}
                    className="bg-gradient-to-r from-yellow-500 to-blue-600"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Videos Tab - NEW! Community in Action */}
        <TabsContent value="videos" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Community in Action Videos</CardTitle>
                  <CardDescription>Manage video content for the Community in Action section</CardDescription>
                </div>
                <Button
                  onClick={() =>
                    setEditingVideo({
                      id: 0,
                      title: "",
                      description: "",
                      thumbnail: "",
                      videoUrl: "",
                      duration: "",
                      views: "0",
                      category: "",
                      featured: false,
                    })
                  }
                  className="bg-gradient-to-r from-yellow-500 to-blue-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Video
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
              {(communityData.videos ?? []).map((video) => (
                  <Card key={video.id} className={video.featured ? "border-2 border-purple-500" : ""}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        {/* Thumbnail Preview */}
                        {video.thumbnail && (
                          <div className="flex-shrink-0">
                            <img
                              src={video.thumbnail.startsWith('data:') || video.thumbnail.startsWith('http') 
                                ? video.thumbnail 
                                : `https://images.unsplash.com/200x120?${video.thumbnail}`}
                              alt={video.title}
                              className="w-32 h-20 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{video.title}</h3>
                            {video.featured && (
                              <Badge className="bg-purple-500">Featured</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                          <div className="flex gap-4 text-xs text-gray-500">
                            <span>⏱️ {video.duration}</span>
                            <span>👁️ {video.views} views</span>
                            <span>📁 {video.category}</span>
                          </div>
                          {video.videoUrl && (
                            <div className="text-xs text-green-600 mt-2">
                              ✓ Video file uploaded
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button size="sm" variant="outline" onClick={() => setEditingVideo(video)}>
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {editingVideo && (
            <Card className="border-2 border-blue-500">
              <CardHeader>
                <CardTitle>{editingVideo.id === 0 ? "New Video" : "Edit Video"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Video Title *</Label>
                  <Input
                    value={editingVideo.title}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, title: e.target.value })
                    }
                    placeholder="Community Impact Stories"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    value={editingVideo.description}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, description: e.target.value })
                    }
                    placeholder="Video description..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Video Thumbnail Image</Label>
                  <FileUpload
                    accept="image/*"
                    maxSize={5}
                    currentFile={editingVideo.thumbnail}
                    onUpload={(base64) =>
                      setEditingVideo({ ...editingVideo, thumbnail: base64 })
                    }
                    type="image"
                    label="Upload Thumbnail or enter keywords"
                  />
                  <p className="text-xs text-gray-500">
                    Upload an image or enter keywords (e.g., "climate workshop presentation")
                  </p>
                </div>

              <div className="space-y-2">
  <Label>Video File *</Label>
  <p className="text-xs text-gray-500 mb-2">
    Upload a video file (MP4, WebM, etc.)
  </p>

  {/* Styled label acts as the visible red button */}
  <label className="inline-block bg-red-600 text-white font-semibold px-6 py-3 rounded-lg cursor-pointer hover:bg-red-700">
    Choose Video
    <input
      type="file"
      accept="video/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setEditingVideo({
          ...editingVideo,
          file, // raw File object for Cloudinary
          preview: URL.createObjectURL(file), // local preview for UI
          videoUrl: null, // will be set after Cloudinary upload in handleSaveVideo
        });
      }}
      className="hidden" // hide the native input
    />
  </label>

  {/* Show local preview if a file was selected */}
  {editingVideo.preview && (
    <video
      src={editingVideo.preview}
      controls
      className="mt-2 w-full rounded-lg border border-gray-300"
    />
  )}

  {/* Show success message once Cloudinary URL is set */}
  {editingVideo.videoUrl && (
    <div className="text-xs text-green-600 mt-2">
      ✓ Video uploaded successfully
    </div>
  )}
</div>


                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Duration *</Label>
                    <Input
                      value={editingVideo.duration}
                      onChange={(e) =>
                        setEditingVideo({ ...editingVideo, duration: e.target.value })
                      }
                      placeholder="8:45"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Views *</Label>
                    <Input
                      value={editingVideo.views}
                      onChange={(e) =>
                        setEditingVideo({ ...editingVideo, views: e.target.value })
                      }
                      placeholder="125K"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Input
                      value={editingVideo.category}
                      onChange={(e) =>
                        setEditingVideo({ ...editingVideo, category: e.target.value })
                      }
                      placeholder="Impact Stories"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="videoFeatured"
                    checked={editingVideo.featured}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, featured: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <Label htmlFor="videoFeatured">Featured Video (shown at top)</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingVideo(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveVideo}
                    className="bg-gradient-to-r from-yellow-500 to-blue-600"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Video
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Testimonials Tab - NEW! Community Voices */}
        <TabsContent value="testimonials" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Community Voices Testimonials</CardTitle>
                  <CardDescription>Manage testimonials for the Community Voices section</CardDescription>
                </div>
                <Button
                  onClick={() =>
                    setEditingTestimonial({
                      id: 0,
                      name: "",
                      role: "",
                      location: "",
                      message: "",
                      avatar: "",
                    })
                  }
                  className="bg-gradient-to-r from-yellow-500 to-blue-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Testimonial
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {(communityData.testimonials ?? []).map((testimonial) => (
                  <Card key={testimonial.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        {/* Avatar Preview */}
                        {testimonial.avatar && (
                          <div className="flex-shrink-0">
                            <img
                              src={testimonial.avatar.startsWith('data:') || testimonial.avatar.startsWith('http') 
                                ? testimonial.avatar 
                                : `https://images.unsplash.com/80x80?${testimonial.avatar}`}
                              alt={testimonial.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">{testimonial.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {testimonial.role} • {testimonial.location}
                          </p>
                          <p className="text-sm text-gray-700 italic mb-2">
                            "{testimonial.message}"
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button size="sm" variant="outline" onClick={() => setEditingTestimonial(testimonial)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 hover:bg-red-50"
                            onClick={() => handleDeleteTestimonial(testimonial.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {editingTestimonial && (
            <Card className="border-2 border-blue-500">
              <CardHeader>
                <CardTitle>{editingTestimonial.id === 0 ? "New Testimonial" : "Edit Testimonial"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input
                      value={editingTestimonial.name}
                      onChange={(e) =>
                        setEditingTestimonial({ ...editingTestimonial, name: e.target.value })
                      }
                      placeholder="Maria Santos"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <Input
                      value={editingTestimonial.location}
                      onChange={(e) =>
                        setEditingTestimonial({ ...editingTestimonial, location: e.target.value })
                      }
                      placeholder="Brazil"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Role/Title *</Label>
                  <Input
                    value={editingTestimonial.role}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, role: e.target.value })
                    }
                    placeholder="Community Organizer"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Testimonial Message *</Label>
                  <Textarea
                    value={editingTestimonial.message}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, message: e.target.value })
                    }
                    placeholder="This platform has connected me with..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Avatar Image</Label>
                  <FileUpload
                    accept="image/*"
                    maxSize={5}
                    currentFile={editingTestimonial.avatar}
                    onUpload={(base64) =>
                      setEditingTestimonial({ ...editingTestimonial, avatar: base64 })
                    }
                    type="image"
                    label="Upload Avatar or enter keywords"
                  />
                  <p className="text-xs text-gray-500">
                    Upload an image or enter keywords (e.g., "woman professional brazil")
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingTestimonial(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveTestimonial}
                    className="bg-gradient-to-r from-yellow-500 to-blue-600"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Testimonial
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
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
        confirmText={confirmDialog.variant === 'destructive' ? 'Delete' : 'Save Changes'}
        cancelText="Cancel"
      />
    </div>
  );
}