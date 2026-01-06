import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Mail, Lock, Chrome, LogIn, UserPlus, AlertCircle, Shield } from 'lucide-react';
import { api } from '../utils/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: { email: string; name: string }) => void;
}

export default function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bypassMode, setBypassMode] = useState(false);

  // HIDDEN BYPASS: Press Ctrl+Shift+D to enable bypass mode
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setBypassMode(true);
        setTimeout(() => setBypassMode(false), 3000);
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isOpen]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    // Check for bypass mode
    if (bypassMode) {
      const user = {
        email: 'dev@test.com',
        name: 'Developer Mode (Bypass Active)'
      };
      localStorage.setItem('authToken', 'bypass-token');
      localStorage.setItem('adminUser', JSON.stringify(user));
      onLogin(user);
      onClose();
      setLoading(false);
      setBypassMode(false);
      return;
    }
    
    try {
      // Import Google Identity Services
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      
      if (!googleClientId) {
        throw new Error('Google Client ID not configured');
      }

      // Initialize Google Sign-In
      if (!window.google) {
        throw new Error('Google Sign-In not loaded');
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response: any) => {
          try {
            const data = await api.googleLogin(response.credential);
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('adminUser', JSON.stringify(data.user));
            onLogin({ email: data.user.email, name: data.user.name });
            onClose();
          } catch (err: any) {
            setError(err.message || 'Failed to sign in with Google');
            setLoading(false);
          }
        }
      });

      window.google.accounts.id.prompt();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check for bypass mode
    if (bypassMode) {
      const user = {
        email: 'dev@test.com',
        name: 'Developer Mode (Bypass Active)'
      };
      localStorage.setItem('authToken', 'bypass-token');
      localStorage.setItem('adminUser', JSON.stringify(user));
      onLogin(user);
      onClose();
      setLoading(false);
      setBypassMode(false);
      return;
    }

    try {
      if (isSignUp) {
        const data = await api.signup(email, password, name);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        onLogin({ email: data.user.email, name: data.user.name });
        onClose();
      } else {
        const data = await api.signin(email, password);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        onLogin({ email: data.user.email, name: data.user.name });
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 border-2 border-yellow-500/20">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent">
            {isSignUp ? 'Create Admin Account' : 'Admin Login'}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500 dark:text-gray-400">
            {isSignUp ? 'Enter your details to create a new account.' : 'Enter your credentials to access the dashboard.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Bypass Mode Indicator */}
          <AnimatePresence>
            {bypassMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-500 dark:border-green-600 rounded-lg flex items-center gap-2"
              >
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400 animate-pulse" />
                <div>
                  <p className="text-green-700 dark:text-green-300">
                    🔓 Developer Bypass Mode Active
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Click any login button to enter dashboard
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Google Sign In Button */}
          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm transition-all duration-200"
          >
            <Chrome className="mr-2 h-5 w-5 text-blue-600" />
            {loading ? 'Connecting...' : 'Continue with Gmail'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-800 px-2 text-gray-500">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} noValidate={bypassMode} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!bypassMode}
                  disabled={loading}
                  className="h-11 border-2 focus:border-yellow-500"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@areopc.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={!bypassMode}
                  disabled={loading}
                  className="h-11 pl-10 border-2 focus:border-yellow-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!bypassMode}
                  disabled={loading}
                  className="h-11 pl-10 border-2 focus:border-yellow-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700 text-white disabled:opacity-50"
            >
              {loading ? (
                'Loading...'
              ) : isSignUp ? (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Create Account
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                // Always clear form when switching between Sign In/Sign Up
                setEmail("");
                setPassword("");
                setName("");
              }}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}