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
import { Save, Plus, Trash2, Edit, Mail, Link as LinkIcon, MapPin, MessageCircle, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { api } from "../../utils/api";

interface ContactInfo {
  title: string;
  content: string;
  description: string;
  color: string;
}

interface QuickLink {
  id: number;
  label: string;
  url: string;
  active: boolean;
}

interface Location {
  address: string;
  city: string;
  businessHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  mapEmbedUrl: string;
  googleMapsLink: string;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface ContactData {
  contactInfo: ContactInfo[];
  quickLinks: QuickLink[];
  location: Location;
  faqs: FAQ[];
}

export default function DashboardContact() {
  const [contactData, setContactData] = useState<ContactData>({
  contactInfo: [],
  quickLinks: [],
  location: {
    address: "",
    city: "",
    businessHours: {
      monday: "", tuesday: "", wednesday: "", thursday: "",
      friday: "", saturday: "", sunday: ""
    },
    mapEmbedUrl: "",
    googleMapsLink: ""
  },
  faqs: []
});

  const [editingInfo, setEditingInfo] = useState(false);
  const [tempContactInfo, setTempContactInfo] = useState<ContactInfo[]>([]);
  const [editingQuickLink, setEditingQuickLink] = useState<QuickLink | null>(null);
  const [editingLocation, setEditingLocation] = useState(false);
  const [tempLocation, setTempLocation] = useState<Location | null>(null);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);

  useEffect(() => {
    loadContactData();
  }, []);

 const loadContactData = async () => {
  try {
    const data = await api.getContact();
    if (data) {
      setContactData(data);
      setTempContactInfo(data.contactInfo || []);
      setTempLocation(data.location || null);
    } else {
      // no contact yet
      setContactData({
        contactInfo: [],
        quickLinks: [],
        location: {
          address: "",
          city: "",
          businessHours: {
            monday: "", tuesday: "", wednesday: "", thursday: "",
            friday: "", saturday: "", sunday: ""
          },
          mapEmbedUrl: "",
          googleMapsLink: ""
        },
        faqs: []
      });
    }
  } catch (error) {
    console.error("Error loading contact data:", error);
    toast.error("No contact data found. Please create one.");
    // initialize empty so UI still works
    setContactData({
      contactInfo: [],
      quickLinks: [],
      location: {
        address: "",
        city: "",
        businessHours: {
          monday: "", tuesday: "", wednesday: "", thursday: "",
          friday: "", saturday: "", sunday: ""
        },
        mapEmbedUrl: "",
        googleMapsLink: ""
      },
      faqs: []
    });
  }
};


  const saveContactData = async (data: ContactData) => {
    try {
      await api.updateContact(data);
      setContactData(data);
      setTempContactInfo(data.contactInfo);
      setTempLocation(data.location);
      toast.success("Contact data saved successfully!");
    } catch (error: any) {
      console.error("Error saving contact data:", error);
      toast.error(error.message || "Failed to save contact data");
    }
  };

  // Contact Info Management
  const handleSaveContactInfo = () => {
    if (!contactData) return;
    const updatedData = { ...contactData, contactInfo: tempContactInfo };
    saveContactData(updatedData);
    setEditingInfo(false);
    toast.success("Contact information updated successfully!");
  };

  const updateContactInfo = (index: number, field: keyof ContactInfo, value: string) => {
    const updated = [...tempContactInfo];
    updated[index] = { ...updated[index], [field]: value };
    setTempContactInfo(updated);
  };

  // Quick Links Management
  const handleSaveQuickLink = () => {
    if (!contactData || !editingQuickLink) return;
    let updatedQuickLinks;
    if (editingQuickLink.id === 0) {
      const newLink = { ...editingQuickLink, id: Date.now() };
      updatedQuickLinks = [...contactData.quickLinks, newLink];
      toast.success("Quick link created successfully!");
    } else {
      updatedQuickLinks = contactData.quickLinks.map((link) =>
        link.id === editingQuickLink.id ? editingQuickLink : link
      );
      toast.success("Quick link updated successfully!");
    }
    saveContactData({ ...contactData, quickLinks: updatedQuickLinks });
    setEditingQuickLink(null);
  };

  const handleDeleteQuickLink = (id: number) => {
    if (!contactData) return;
    if (confirm("Are you sure you want to delete this quick link?")) {
      const updatedQuickLinks = contactData.quickLinks.filter((link) => link.id !== id);
      saveContactData({ ...contactData, quickLinks: updatedQuickLinks });
      toast.success("Quick link deleted successfully!");
    }
  };

  const toggleQuickLinkActive = (id: number) => {
    if (!contactData) return;
    const updatedQuickLinks = contactData.quickLinks.map((link) =>
      link.id === id ? { ...link, active: !link.active } : link
    );
    saveContactData({ ...contactData, quickLinks: updatedQuickLinks });
    toast.success("Quick link status updated!");
  };

  // Location Management
  const handleSaveLocation = () => {
    if (!contactData || !tempLocation) return;
    saveContactData({ ...contactData, location: tempLocation });
    setEditingLocation(false);
    toast.success("Location updated successfully!");
  };

  const updateLocationField = (field: keyof Location, value: any) => {
    if (!tempLocation) return;
    setTempLocation({ ...tempLocation, [field]: value });
  };

  const updateBusinessHours = (day: keyof Location["businessHours"], value: string) => {
    if (!tempLocation) return;
    setTempLocation({
      ...tempLocation,
      businessHours: { ...tempLocation.businessHours, [day]: value },
    });
  };

  // FAQ Management
  const handleSaveFAQ = () => {
    if (!contactData || !editingFAQ) return;
    let updatedFAQs;
    if (editingFAQ.id === 0) {
      const newFAQ = { ...editingFAQ, id: Date.now() };
      updatedFAQs = [...contactData.faqs, newFAQ];
      toast.success("FAQ created successfully!");
    } else {
      updatedFAQs = contactData.faqs.map((f) =>
        f.id === editingFAQ.id ? editingFAQ : f
      );
      toast.success("FAQ updated successfully!");
    }
    saveContactData({ ...contactData, faqs: updatedFAQs });
    setEditingFAQ(null);
  };

  const handleDeleteFAQ = (id: number) => {
    if (!contactData) return;
    if (confirm("Are you sure you want to delete this FAQ?")) {
      const updatedFAQs = contactData.faqs.filter((f) => f.id !== id);
      saveContactData({ ...contactData, faqs: updatedFAQs });
      toast.success("FAQ deleted successfully!");
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent">
            Contact Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage contact information, quick links, location, and FAQs
          </p>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        {contactData && (
  <TabsList className="grid w-full grid-cols-4 max-w-3xl">
    <TabsTrigger value="info">
      <Mail className="h-4 w-4 mr-2" />
      Contact Info ({contactData.contactInfo.length})
    </TabsTrigger>
    <TabsTrigger value="quicklinks">
      <LinkIcon className="h-4 w-4 mr-2" />
      Quick Links ({contactData.quickLinks.length})
    </TabsTrigger>
    <TabsTrigger value="location">
      <MapPin className="h-4 w-4 mr-2" />
      Location
    </TabsTrigger>
    <TabsTrigger value="faqs">
      <MessageCircle className="h-4 w-4 mr-2" />
      FAQs ({contactData.faqs.length})
    </TabsTrigger>
  </TabsList>
)}


        {/* Contact Info Tab */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Main contact details displayed on Contact page</CardDescription>
                </div>
                {!editingInfo && (
                  <Button
                    onClick={() => setEditingInfo(true)}
                    className="bg-gradient-to-r from-yellow-500 to-blue-600"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Contact Info
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingInfo ? (
                <>
                  {tempContactInfo.map((info, index) => (
                    <Card key={index} className="p-4 border">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Contact Method {index + 1}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Title *</Label>
                            <Input
                              value={info.title}
                              onChange={(e) => updateContactInfo(index, 'title', e.target.value)}
                              placeholder="Email Us"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Color Gradient *</Label>
                            <Input
                              value={info.color}
                              onChange={(e) => updateContactInfo(index, 'color', e.target.value)}
                              placeholder="from-blue-500 to-blue-600"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Content *</Label>
                          <Input
                            value={info.content}
                            onChange={(e) => updateContactInfo(index, 'content', e.target.value)}
                            placeholder="kennethrocete.cna@gmail.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description *</Label>
                          <Textarea
                            value={info.description}
                            onChange={(e) => updateContactInfo(index, 'description', e.target.value)}
                            placeholder="Send us an email..."
                            rows={2}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                <div className="flex justify-between gap-2">
      <Button
        onClick={() =>
          setTempContactInfo([
            ...tempContactInfo,
            { title: "", content: "", description: "", color: "" }
          ])
        }
        className="bg-gradient-to-r from-green-500 to-green-600"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Contact Method
      </Button>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setEditingInfo(false);
            setTempContactInfo(contactData.contactInfo);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveContactInfo}
          className="bg-gradient-to-r from-yellow-500 to-blue-600"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Contact Info
        </Button>
      </div>
    </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contactData?.contactInfo?.map((info, index) => (
  <Card key={index} className="p-4">
    <h3 className="font-semibold mb-2">{info.title}</h3>
    <p className="text-sm text-gray-700 mb-1">{info.content}</p>
    <p className="text-xs text-gray-500 mb-2">{info.description}</p>
    <p className="text-xs text-gray-400">Color: {info.color}</p>
  </Card>
))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

{/* Quick Links Tab */}
<TabsContent value="quicklinks" className="space-y-4">
  <div className="flex justify-end">
    <Button
      onClick={() =>
        setEditingQuickLink({
          id: 0,
          label: "",
          url: "",
          active: true,
        })
      }
      className="bg-gradient-to-r from-yellow-500 to-blue-600"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Quick Link
    </Button>
  </div>

  <div className="grid gap-4">
    {contactData?.quickLinks?.length ? (
      contactData.quickLinks.map((link) => (
        <Card key={link.id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{link.label}</h3>
                  <Badge variant={link.active ? "default" : "outline"}>
                    {link.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline break-all"
                >
                  {link.url}
                </a>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleQuickLinkActive(link.id)}
                  title={link.active ? "Deactivate" : "Activate"}
                >
                  {link.active ? (
                    <ToggleRight className="h-4 w-4" />
                  ) : (
                    <ToggleLeft className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingQuickLink(link)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-500 hover:bg-red-50"
                  onClick={() => handleDeleteQuickLink(link.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))
    ) : (
      <p className="text-gray-500">No quick links yet.</p>
    )}
  </div>

  {editingQuickLink && (
    <Card className="border-2 border-blue-500">
      <CardHeader>
        <CardTitle>
          {editingQuickLink.id === 0 ? "New Quick Link" : "Edit Quick Link"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Label *</Label>
            <Input
              value={editingQuickLink.label}
              onChange={(e) =>
                setEditingQuickLink({
                  ...editingQuickLink,
                  label: e.target.value,
                })
              }
              placeholder="Facebook"
            />
          </div>
          <div className="space-y-2">
            <Label>URL *</Label>
            <Input
              value={editingQuickLink.url}
              onChange={(e) =>
                setEditingQuickLink({
                  ...editingQuickLink,
                  url: e.target.value,
                })
              }
              placeholder="https://www.facebook.com/..."
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={editingQuickLink.active}
            onChange={(e) =>
              setEditingQuickLink({
                ...editingQuickLink,
                active: e.target.checked,
              })
            }
            className="w-4 h-4"
          />
          <Label>Active</Label>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setEditingQuickLink(null)}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveQuickLink}
            className="bg-gradient-to-r from-yellow-500 to-blue-600"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Quick Link
          </Button>
        </div>
      </CardContent>
    </Card>
  )}
</TabsContent>
{/* Location Tab */}
<TabsContent value="location" className="space-y-4">
  <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
          <CardTitle>Our Location</CardTitle>
          <CardDescription>Manage location details and business hours</CardDescription>
        </div>
        {!editingLocation && (
          <Button
            onClick={() => setEditingLocation(true)}
            className="bg-gradient-to-r from-yellow-500 to-blue-600"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Location
          </Button>
        )}
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {editingLocation ? (
        <>
          {tempLocation && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Address *</Label>
                <Textarea
                  value={tempLocation.address}
                  onChange={(e) => updateLocationField("address", e.target.value)}
                  placeholder="Full address"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>City *</Label>
                <Input
                  value={tempLocation.city}
                  onChange={(e) => updateLocationField("city", e.target.value)}
                  placeholder="Makati City, Metro Manila"
                />
              </div>

              <div className="space-y-2">
                <Label>Business Hours</Label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(tempLocation.businessHours || {}).map(([day, hours]) => (
                    <div key={day} className="flex items-center gap-2">
                      <Label className="w-24 capitalize">{day}:</Label>
                      <Input
                        value={hours}
                        onChange={(e) =>
                          updateBusinessHours(day as keyof Location["businessHours"], e.target.value)
                        }
                        placeholder="9:00 AM - 6:00 PM"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Google Maps Embed URL *</Label>
                <Textarea
                  value={tempLocation.mapEmbedUrl}
                  onChange={(e) => updateLocationField("mapEmbedUrl", e.target.value)}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Google Maps Link *</Label>
                <Input
                  value={tempLocation.googleMapsLink}
                  onChange={(e) => updateLocationField("googleMapsLink", e.target.value)}
                  placeholder="https://www.google.com/maps/search/..."
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditingLocation(false);
                setTempLocation(contactData?.location || null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveLocation}
              className="bg-gradient-to-r from-yellow-500 to-blue-600"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Location
            </Button>
          </div>
        </>
      ) : (
        contactData?.location && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Address</h4>
              <p className="text-sm text-gray-700">{contactData.location.address}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">City</h4>
              <p className="text-sm text-gray-700">{contactData.location.city}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Business Hours</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(contactData.location.businessHours || {}).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="capitalize font-medium">{day}:</span>
                    <span className="text-gray-700">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Google Maps Embed URL</h4>
              <p className="text-xs text-gray-500 break-all">
                {contactData.location.mapEmbedUrl}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Google Maps Link</h4>
              <a
                href={contactData.location.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline break-all"
              >
                {contactData.location.googleMapsLink}
              </a>
            </div>
          </div>
        )
      )}
    </CardContent>
  </Card>
</TabsContent>

     {/* FAQs Tab */}
<TabsContent value="faqs" className="space-y-4">
  <div className="flex justify-end">
    <Button
      onClick={() =>
        setEditingFAQ({
          id: 0,
          question: "",
          answer: "",
          category: "General",
        })
      }
      className="bg-gradient-to-r from-yellow-500 to-blue-600"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add FAQ
    </Button>
  </div>

  <div className="grid gap-4">
    {contactData?.faqs?.length ? (
      contactData.faqs.map((faq) => (
        <Card key={faq.id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{faq.category}</Badge>
                </div>
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button size="sm" variant="outline" onClick={() => setEditingFAQ(faq)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-500 hover:bg-red-50"
                  onClick={() => handleDeleteFAQ(faq.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))
    ) : (
      <p className="text-gray-500">No FAQs yet.</p>
    )}
  </div>

  {editingFAQ && (
    <Card className="border-2 border-blue-500">
      <CardHeader>
        <CardTitle>{editingFAQ.id === 0 ? "New FAQ" : "Edit FAQ"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Category *</Label>
          <select
            className="w-full border rounded px-3 py-2"
            value={editingFAQ.category}
            onChange={(e) =>
              setEditingFAQ({ ...editingFAQ, category: e.target.value })
            }
          >
            <option value="General">General</option>
            <option value="Services">Services</option>
            <option value="Awards">Awards</option>
            <option value="Partnerships">Partnerships</option>
            <option value="Technical">Technical</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Question *</Label>
          <Input
            value={editingFAQ.question}
            onChange={(e) =>
              setEditingFAQ({ ...editingFAQ, question: e.target.value })
            }
            placeholder="How can I get involved?"
          />
        </div>

        <div className="space-y-2">
          <Label>Answer *</Label>
          <Textarea
            value={editingFAQ.answer}
            onChange={(e) =>
              setEditingFAQ({ ...editingFAQ, answer: e.target.value })
            }
            placeholder="Detailed answer..."
            rows={4}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setEditingFAQ(null)}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveFAQ}
            className="bg-gradient-to-r from-yellow-500 to-blue-600"
          >
            <Save className="h-4 w-4 mr-2" />
            Save FAQ
          </Button>
        </div>
      </CardContent>
    </Card>
  )}
</TabsContent>

      </Tabs>
    </div>
  );
}