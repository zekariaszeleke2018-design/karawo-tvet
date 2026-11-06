/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';
import { UserProfile, UserRole } from '../types';
import { DEMO_PRECONFIGURED_USERS } from '../data/seedData';
import { initializeDatabaseIfEmpty } from '../services/dataService';

interface AuthContextType {
  firebaseUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isDemoUser: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  switchDemoRole: (demoUserId: string) => void;
  updateCurrentUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_STORAGE_KEY = 'ktvet_demo_user_id';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(false);

  useEffect(() => {
    // Initialize seed data on startup
    initializeDatabaseIfEmpty();

    // Check for existing demo session in localStorage
    const savedDemoId = localStorage.getItem(DEMO_STORAGE_KEY);
    if (savedDemoId) {
      const match = DEMO_PRECONFIGURED_USERS.find(u => u.id === savedDemoId);
      if (match) {
        setUserProfile(match);
        setIsDemoUser(true);
        setLoading(false);
      }
    }

    // Subscribe to Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const profile = snap.data() as UserProfile;
            setUserProfile(profile);
            setIsDemoUser(false);
            localStorage.removeItem(DEMO_STORAGE_KEY);
          } else {
            // New user signed in with Google
            const isDefaultAdmin = user.email === 'zekariaszeleke2018@gmail.com' || (user.email && user.email.includes('admin'));
            const initialRole: UserRole = isDefaultAdmin ? 'admin' : 'student';
            const newProfile: UserProfile = {
              id: user.uid,
              uid: user.uid,
              email: user.email || '',
              fullName: user.displayName || 'Authorized User',
              role: initialRole,
              status: 'active',
              idNumber: isDefaultAdmin ? 'KTVET-ADM-G01' : `KTVET/2026/${Math.floor(1000 + Math.random() * 9000)}`,
              departmentId: isDefaultAdmin ? undefined : 'dept-auto',
              departmentName: isDefaultAdmin ? undefined : 'Automotive Technology & Mechanical',
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
            setIsDemoUser(false);
            localStorage.removeItem(DEMO_STORAGE_KEY);
          }
        } catch (err) {
          console.error('Error fetching/creating user profile:', err);
        }
      } else if (!savedDemoId) {
        // No firebase user and no demo user saved
        // default to visitor
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign In Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    setIsDemoUser(false);
    setUserProfile(null);
    if (firebaseUser) {
      await signOut(auth);
    }
  };

  const switchDemoRole = (demoUserId: string) => {
    const demo = DEMO_PRECONFIGURED_USERS.find(u => u.id === demoUserId);
    if (demo) {
      localStorage.setItem(DEMO_STORAGE_KEY, demoUserId);
      setUserProfile(demo);
      setIsDemoUser(true);
    }
  };

  const updateCurrentUserProfile = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return;
    const updated = { ...userProfile, ...updates };
    setUserProfile(updated);
    if (!isDemoUser && userProfile.uid) {
      try {
        await setDoc(doc(db, 'users', userProfile.uid), updated, { merge: true });
      } catch (e) {
        console.error('Failed to update user profile in Firestore:', e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userProfile,
        loading,
        isDemoUser,
        loginWithGoogle,
        logout,
        switchDemoRole,
        updateCurrentUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
