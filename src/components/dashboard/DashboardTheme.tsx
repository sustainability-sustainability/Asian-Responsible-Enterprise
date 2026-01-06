import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Palette, Sparkles, Briefcase, Check, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../utils/api";

export default function DashboardTheme() {
  const [currentTheme, setCurrentTheme] = useState<"playful" | "corporate">("playful");
  const [defaultThemeMode, setDefaultThemeMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    loadTheme();
  }, []);

const loadTheme = async () => {
  try {
    const data = await api.getTheme();
    if (data && data.designTheme) {
      setCurrentTheme(data.designTheme);
    }
    if (data && data.defaultThemeMode) {
      setDefaultThemeMode(data.defaultThemeMode);
    }
  } catch (error) {
    console.error('Error loading theme:', error);
    toast.error('Failed to load theme settings. Using defaults.');
  }
};


  const switchTheme = async (theme: "playful" | "corporate") => {
  try {
    await api.updateTheme({ designTheme: theme, defaultThemeMode });
    setCurrentTheme(theme);
    toast.success(`Switched to ${theme === "corporate" ? "Corporate" : "Colorful & Playful"} Design!`);
  } catch (error: any) {
    console.error('Error saving theme:', error);
    toast.error(error.message || 'Failed to save theme');
  }
};

const setDefaultMode = async (mode: "light" | "dark") => {
  try {
    await api.updateTheme({ designTheme: currentTheme, defaultThemeMode: mode });
    setDefaultThemeMode(mode);
    toast.success(`Default theme mode set to ${mode === "dark" ? "Dark Mode" : "Light Mode"}!`, {
      description: "All new visitors will see this mode first"
    });
  } catch (error: any) {
    console.error('Error saving theme mode:', error);
    toast.error(error.message || 'Failed to save theme mode');
  }
};


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent">
          Design Theme Settings
        </h1>
        <p className="text-gray-500 mt-1">
          Choose between Colorful & Playful or Professional Corporate design, and set the default theme mode for visitors
        </p>
      </div>

      {/* Default Theme Mode Section */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {defaultThemeMode === "dark" ? (
              <Moon className="h-6 w-6 text-purple-600" />
            ) : (
              <Sun className="h-6 w-6 text-yellow-600" />
            )}
            Default Theme Mode for Visitors
          </CardTitle>
          <CardDescription>
            Set whether visitors see Dark Mode or Light Mode when they first open the website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Light Mode Option */}
            <Card
              className={`cursor-pointer transition-all duration-300 ${
                defaultThemeMode === "light"
                  ? "border-4 border-yellow-500 shadow-lg"
                  : "border-2 hover:border-yellow-300"
              }`}
              onClick={() => setDefaultMode("light")}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Sun className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Light Mode</h3>
                      <p className="text-sm text-gray-500">Bright & Clear</p>
                    </div>
                  </div>
                  {defaultThemeMode === "light" && (
                    <div className="bg-yellow-500 text-white rounded-full p-1">
                      <Check className="h-5 w-5" />
                    </div>
                  )}
                </div>
                
                {/* Preview */}
                <div className="bg-white p-3 rounded-lg border-2 border-gray-200">
                  <div className="space-y-2">
                    <div className="h-6 bg-gradient-to-r from-yellow-400 to-blue-500 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDefaultMode("light");
                  }}
                  disabled={defaultThemeMode === "light"}
                >
                  {defaultThemeMode === "light" ? "Currently Default" : "Set as Default"}
                </Button>
              </CardContent>
            </Card>

            {/* Dark Mode Option */}
            <Card
              className={`cursor-pointer transition-all duration-300 ${
                defaultThemeMode === "dark"
                  ? "border-4 border-purple-500 shadow-lg"
                  : "border-2 hover:border-purple-300"
              }`}
              onClick={() => setDefaultMode("dark")}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Moon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Dark Mode</h3>
                      <p className="text-sm text-gray-500">Elegant & Modern</p>
                    </div>
                  </div>
                  {defaultThemeMode === "dark" && (
                    <div className="bg-purple-500 text-white rounded-full p-1">
                      <Check className="h-5 w-5" />
                    </div>
                  )}
                </div>
                
                {/* Preview */}
                <div className="bg-slate-900 p-3 rounded-lg border-2 border-slate-700">
                  <div className="space-y-2">
                    <div className="h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
                    <div className="h-4 bg-slate-700 rounded"></div>
                    <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDefaultMode("dark");
                  }}
                  disabled={defaultThemeMode === "dark"}
                >
                  {defaultThemeMode === "dark" ? "Currently Default" : "Set as Default"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Note:</strong> The default theme mode is what visitors see when they first open your website.
              Users can still toggle between light and dark mode using the theme button in the navigation bar.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Design Style Section */}
      <div>
        <h2 className="text-2xl mb-4 bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent">
          Design Style
        </h2>
        <p className="text-gray-500 mb-6">
          Choose between two distinct design styles for your website
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Playful Theme Card */}
        <Card 
          className={`cursor-pointer transition-all duration-300 ${
            currentTheme === "playful" 
              ? "border-4 border-yellow-500 shadow-xl" 
              : "border-2 hover:border-blue-300"
          }`}
          onClick={() => switchTheme("playful")}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                Colorful & Playful
              </CardTitle>
              {currentTheme === "playful" && (
                <div className="bg-yellow-500 text-white rounded-full p-1">
                  <Check className="h-5 w-5" />
                </div>
              )}
            </div>
            <CardDescription>
              Vibrant, engaging design with animations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Preview */}
            <div className="bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50 p-4 rounded-lg border-2 border-dashed border-yellow-300">
              <div className="space-y-3">
                <div className="h-8 bg-gradient-to-r from-yellow-400 to-blue-600 rounded"></div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-12 bg-blue-400 rounded"></div>
                  <div className="h-12 bg-yellow-400 rounded"></div>
                  <div className="h-12 bg-green-400 rounded"></div>
                </div>
                <div className="h-4 bg-gradient-to-r from-yellow-200 to-blue-200 rounded"></div>
                <div className="h-4 bg-gradient-to-r from-blue-200 to-green-200 rounded"></div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <h4 className="font-semibold">Features:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>✨ Colorful gradients (Gold, Blue, Green)</li>
                <li>🎨 3D golden SDG illustrations</li>
                <li>✨ Particle animations & cursor glow</li>
                <li>🌈 Nature-inspired backgrounds</li>
                <li>💫 Playful, engaging design elements</li>
                <li>🎯 Perfect for community engagement</li>
              </ul>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700"
              onClick={(e) => {
                e.stopPropagation();
                switchTheme("playful");
              }}
              disabled={currentTheme === "playful"}
            >
              {currentTheme === "playful" ? "Currently Active" : "Switch to Playful"}
            </Button>
          </CardContent>
        </Card>

        {/* Corporate Theme Card */}
        <Card 
          className={`cursor-pointer transition-all duration-300 ${
            currentTheme === "corporate" 
              ? "border-4 border-blue-900 shadow-xl" 
              : "border-2 hover:border-gray-300"
          }`}
          onClick={() => switchTheme("corporate")}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-blue-900" />
                Professional Corporate
              </CardTitle>
              {currentTheme === "corporate" && (
                <div className="bg-blue-900 text-white rounded-full p-1">
                  <Check className="h-5 w-5" />
                </div>
              )}
            </div>
            <CardDescription>
              Clean, professional design for business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Preview */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300">
              <div className="space-y-3">
                <div className="h-8 bg-gradient-to-r from-blue-900 to-blue-700 rounded"></div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-12 bg-gray-300 rounded"></div>
                  <div className="h-12 bg-gray-400 rounded"></div>
                  <div className="h-12 bg-gray-300 rounded"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <h4 className="font-semibold">Features:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>💼 Professional navy, gray & white palette</li>
                <li>📊 Clean, minimal SDG card display</li>
                <li>🎯 Subtle animations (no particles)</li>
                <li>📑 Clean white/light backgrounds</li>
                <li>✨ Sleek, corporate design elements</li>
                <li>🏢 Perfect for business presentations</li>
              </ul>
            </div>

            <Button 
              className="w-full bg-blue-900 hover:bg-blue-800"
              onClick={(e) => {
                e.stopPropagation();
                switchTheme("corporate");
              }}
              disabled={currentTheme === "corporate"}
            >
              {currentTheme === "corporate" ? "Currently Active" : "Switch to Corporate"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Current Status */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Palette className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="font-semibold">Current Active Theme</h3>
              <p className="text-sm text-gray-600">
                {currentTheme === "playful" 
                  ? "✨ Colorful & Playful Design - Vibrant, engaging, community-focused" 
                  : "💼 Professional Corporate Design - Clean, minimal, business-focused"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-purple-600 mb-2">🌓 Default Theme Mode (Dark/Light):</h4>
              <ul className="space-y-2 ml-4">
                <li>✅ <strong>First Impression:</strong> The default theme mode is what all visitors see when they first open your website.</li>
                <li>🔄 <strong>User Control:</strong> Visitors can still toggle between dark and light mode using the theme button in the navigation bar.</li>
                <li>💾 <strong>Visitor Preference:</strong> Once a visitor toggles the theme, their choice is saved in their browser.</li>
                <li>🎯 <strong>Best Practice:</strong> Set the default to match your target audience's preference (e.g., dark mode for tech-focused sites, light mode for general audiences).</li>
              </ul>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-semibold text-blue-600 mb-2">🎨 Design Style (Playful/Corporate):</h4>
              <ul className="space-y-2 ml-4">
                <li>
                  <strong>🎨 Instant Theme Switching:</strong> Click on either theme card above to instantly switch between design styles.
                </li>
                <li>
                  <strong>💾 Persistent Settings:</strong> Your choice is saved automatically and will persist across sessions.
                </li>
                <li>
                  <strong>🔄 No Content Changes:</strong> Switching themes only changes the visual design. All your content, data, and settings remain exactly the same.
                </li>
                <li>
                  <strong>⚡ Real-time Preview:</strong> After switching, navigate to the main website to see the changes immediately.
                </li>
                <li>
                  <strong>🔙 Easy Reverting:</strong> You can switch back to the original design anytime with just one click.
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips Card */}
      <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-green-600" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <strong>Testing Your Settings:</strong> Open your website in a new incognito/private window to see exactly what new visitors will experience.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-2xl">🎯</div>
            <div>
              <strong>Recommended Combo:</strong> Corporate design with light mode default works best for business presentations. Playful design with either mode works great for community engagement.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚡</div>
            <div>
              <strong>Performance:</strong> Both dark and light modes perform equally well. Choose based on your brand and audience preferences.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}