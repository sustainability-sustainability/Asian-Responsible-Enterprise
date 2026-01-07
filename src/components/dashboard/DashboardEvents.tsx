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
import { Save, Plus, Trash2, Edit, Calendar, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { FileUpload } from "./FileUpload";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { api } from "../../utils/api";
import { normalizeFromApi, migrateDocuments } from "../../utils/objectId";

interface EventPhoto {
  _id?: string;
  url: string;
  caption: string;
}

interface Event {
  _id?: string;
  month: string;
  year: number;
  title: string;
  description: string;
  photos: EventPhoto[];
}

export default function DashboardEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: "default" | "destructive";
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
    variant: "default",
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await api.getEvents();
      if (data && Array.isArray(data)) {
        const normalizedEvents = data.map(normalizeFromApi);
        setEvents(normalizedEvents);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Error loading events:", error);
      const saved = localStorage.getItem("eventsData");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const migratedEvents = migrateDocuments(parsed);
          setEvents(migratedEvents);
        } catch {
          setEvents([]);
        }
      } else {
        setEvents([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveEvents = async (updatedEvents: Event[]) => {
    try {
      for (const event of updatedEvents) {
        if (event._id) {
          await api.updateEvent(event._id.toString(), event);
        } else {
          const { _id, ...data } = event; // strip accidental _id
          const created = await api.createEvent(data);
          event._id = created.data?._id || created._id;
        }
      }
      localStorage.setItem("eventsData", JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
    } catch (error: any) {
      toast.error(error.message || "Failed to save events");
      localStorage.setItem("eventsData", JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
    }
  };

  const handleSave = () => {
    if (editingEvent) {
      if (!editingEvent.title.trim()) {
        toast.error("Please enter an event title");
        return;
      }
      if (!editingEvent.description.trim()) {
        toast.error("Please enter an event description");
        return;
      }
      if (editingEvent.photos.length === 0) {
        toast.error("Please add at least one photo to the event");
        return;
      }

      const isNew = !editingEvent._id;
      setConfirmDialog({
        open: true,
        title: isNew ? "Create Event" : "Update Event",
        description: isNew
          ? "Are you sure you want to create this event? It will be immediately visible on the website."
          : "Are you sure you want to save these changes? The event will be updated on the website.",
        onConfirm: () => {
          let updatedEvents;
          if (isNew) {
            const newEvent = { ...editingEvent };
            delete (newEvent as any)._id;
            updatedEvents = [...events, newEvent];
            toast.success("Event created successfully!");
          } else {
            updatedEvents = events.map((e) =>
              e._id === editingEvent._id ? editingEvent : e
            );
            toast.success("Event updated successfully!");
          }
          saveEvents(updatedEvents);
          setEditingEvent(null);
          setPhotoUrl("");
          setPhotoCaption("");
          window.dispatchEvent(new Event("storage"));
        },
        variant: "default",
      });
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      open: true,
      title: "Delete Event",
      description: "Are you sure you want to delete this event?",
      onConfirm: async () => {
        try {
          await api.deleteEvent(id);
          const updatedEvents = events.filter((e) => e._id !== id);
          saveEvents(updatedEvents);
          toast.success("Event deleted successfully!");
        } catch (error: any) {
          console.error("Error deleting event from backend:", error);
          const updatedEvents = events.filter((e) => e._id !== id);
          saveEvents(updatedEvents);
          toast.success("Event deleted from local storage");
        }
      },
      variant: "destructive",
    });
  };

  const addPhoto = () => {
    if (editingEvent && photoUrl.trim() && photoCaption.trim()) {
      const newPhoto: EventPhoto = {
        url: photoUrl.trim(),
        caption: photoCaption.trim(),
      };
      setEditingEvent({
        ...editingEvent,
        photos: [...editingEvent.photos, newPhoto],
      });
      setPhotoUrl("");
      setPhotoCaption("");
      toast.success("Photo added successfully!");
    } else if (!photoUrl.trim()) {
      toast.error("Please select or enter a photo URL");
    } else if (!photoCaption.trim()) {
      toast.error("Please enter a caption for the photo");
    }
  };

  const removePhoto = (photoId: string) => {
    if (editingEvent) {
      const updatedPhotos = editingEvent.photos.filter((p) => (p._id || p.url) !== photoId);
      setEditingEvent({
        ...editingEvent,
        photos: updatedPhotos,
      });
    }
  };

  const editPhoto = (photoId: string) => {
    const photo = editingEvent?.photos.find((p) => (p._id || p.url) === photoId);
    if (photo) {
      setEditingPhotoId(photo._id || photo.url);
      setPhotoUrl(photo.url);
      setPhotoCaption(photo.caption);
    }
  };

  const updatePhoto = () => {
    if (editingEvent && editingPhotoId !== null) {
      const updatedPhotos = editingEvent.photos.map((p) =>
        (p._id || p.url) === editingPhotoId
          ? { ...p, url: photoUrl, caption: photoCaption }
          : p
      );
      setEditingEvent({
        ...editingEvent,
        photos: updatedPhotos,
      });
      setEditingPhotoId(null);
      setPhotoUrl("");
      setPhotoCaption("");
      toast.success("Photo updated successfully!");
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent">
            Events Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage events and photo galleries
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingEvent({
              month: "January",
              year: new Date().getFullYear(),
              title: "",
              description: "",
              photos: []
            });
            setPhotoUrl("");
            setPhotoCaption("");
          }}
          className="bg-gradient-to-r from-yellow-500 to-blue-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <div className="text-sm text-gray-500 mb-4">
        Total Events: {events.length}
        <span className="ml-2 text-xs text-gray-400">
          (The Events page shows events filtered by selected month/year)
        </span>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-500">Loading events...</span>
          </div>
        ) : events.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No events found. Click "Add Event" to create your first event.
            </CardContent>
          </Card>
        ) : (
          events.map((event) => (
          <Card key={event._id || event.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-gray-500">
                      {event.month} {event.year}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {event.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    {event.photos.length} photos
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingEvent(event);
                      setPhotoUrl("");
                      setPhotoCaption("");
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(event._id || event.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Photo preview */}
              {event.photos.length > 0 && (
                <div className="grid grid-cols-6 gap-2">
                  {event.photos.map((photo) => (
                    <img
                      key={photo._id || photo.url}
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-16 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))
        )}
      </div>

      {editingEvent && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle>
              {!editingEvent._id ? "New Event" : "Edit Event"}
            </CardTitle>
            <CardDescription>Add or update event information and photos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Month *</Label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={editingEvent.month}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      month: e.target.value,
                    })
                  }
                >
                  {['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Year *</Label>
                <Input
                  type="number"
                  value={editingEvent.year}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      year: parseInt(e.target.value) || new Date().getFullYear(),
                    })
                  }
                  placeholder="2024"
                />
              </div>
              <div className="space-y-2 flex items-end">
                <div className="text-sm text-gray-500">
                  {editingEvent.photos.length} photos
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Event Title *</Label>
              <Input
                value={editingEvent.title}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    title: e.target.value,
                  })
                }
                placeholder="Annual Sustainability Summit 2024"
              />
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={editingEvent.description}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    description: e.target.value,
                  })
                }
                placeholder="Event description..."
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <Label>Event Photos</Label>
              <Card className="p-4 border-dashed">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Photo</Label>
                    <div className="flex gap-2 items-center mb-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={photoUrl && !photoUrl.startsWith('data:') ? "default" : "outline"}
                        onClick={() => {
                          const useUrl = photoUrl && photoUrl.startsWith('data:');
                          if (useUrl) {
                            setPhotoUrl('');
                          }
                        }}
                      >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        {photoUrl && !photoUrl.startsWith('data:') ? 'Using URL' : 'Use URL Instead'}
                      </Button>
                    </div>
                    
                    {photoUrl && !photoUrl.startsWith('data:') ? (
                      <Input
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                      />
                    ) : (
                      <div className="max-w-md">
                        <FileUpload
                          accept="image/*"
                          maxSize={5}
                          currentFile={photoUrl}
                          onUpload={(base64) => setPhotoUrl(base64)}
                          type="image"
                          label="Upload Event Photo"
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Caption</Label>
                    <Input
                      value={photoCaption}
                      onChange={(e) => setPhotoCaption(e.target.value)}
                      placeholder="Opening keynote address"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addPhoto();
                        }
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={addPhoto}
                    variant="outline"
                    className="w-full"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Add Photo
                  </Button>
                </div>
              </Card>

              {editingEvent.photos.length > 0 && (
                <div className="space-y-2">
                  {editingEvent.photos.map((photo) => (
                    <Card key={photo._id || photo.url} className={`p-3 ${editingPhotoId === (photo._id || photo.url) ? 'border-2 border-blue-500' : ''}`}>
                      {editingPhotoId === (photo._id || photo.url) ? (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label className="text-sm">Photo</Label>
                            <div className="flex gap-2 items-center mb-2">
                              <Button
                                type="button"
                                size="sm"
                                variant={photoUrl && !photoUrl.startsWith('data:') ? "default" : "outline"}
                                onClick={() => {
                                  const useUrl = photoUrl && photoUrl.startsWith('data:');
                                  if (useUrl) {
                                    setPhotoUrl('');
                                  }
                                }}
                              >
                                <LinkIcon className="h-4 w-4 mr-2" />
                                {photoUrl && !photoUrl.startsWith('data:') ? 'Using URL' : 'Use URL Instead'}
                              </Button>
                            </div>
                            
                            {photoUrl && !photoUrl.startsWith('data:') ? (
                              <Input
                                value={photoUrl}
                                onChange={(e) => setPhotoUrl(e.target.value)}
                                placeholder="https://images.unsplash.com/..."
                              />
                            ) : (
                              <div className="max-w-md">
                                <FileUpload
                                  accept="image/*"
                                  maxSize={5}
                                  currentFile={photoUrl}
                                  onUpload={(base64) => setPhotoUrl(base64)}
                                  type="image"
                                  label="Upload Event Photo"
                                />
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">Caption</Label>
                            <Input
                              value={photoCaption}
                              onChange={(e) => setPhotoCaption(e.target.value)}
                              placeholder="Opening keynote address"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  updatePhoto();
                                }
                              }}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={updatePhoto}
                              className="flex-1 bg-green-500 hover:bg-green-600"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Update
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingPhotoId(null);
                                setPhotoUrl("");
                                setPhotoCaption("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <img
                            src={photo.url}
                            alt={photo.caption}
                            className="w-20 h-14 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{photo.caption}</p>
                            {photo.url.startsWith('data:') && (
                              <p className="text-xs text-green-600">✓ Image uploaded</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => editPhoto(photo._id || photo.url)}
                            >
                              <Edit className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removePhoto(photo._id || photo.url)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingEvent(null);
                  setPhotoUrl("");
                  setPhotoCaption("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-yellow-500 to-blue-600"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Event
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
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
        confirmText={confirmDialog.variant === 'destructive' ? 'Delete' : 'Save'}
        cancelText="Cancel"
      />
    </div>
  );
}