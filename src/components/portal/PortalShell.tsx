/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminView } from './AdminView';
import { RegistrarView } from './RegistrarView';
import { DeptHeadView } from './DeptHeadView';
import { TeacherView } from './TeacherView';
import { StudentView } from './StudentView';
import {
  GraduationCap,
  Shield,
  LogOut,
  Building2,
  Users,
  BookOpen,
  FileText,
  Home,
  AlertTriangle,
  ChevronRight,
  UserCheck,
  Award
} from 'lucide-react';

interface PortalShellProps {
  onBackToWebsite: () => void;
  onOpenLoginModal: () => void;
}

export const PortalShell: React.FC<PortalShellProps> = ({ onBackToWebsite, onOpenLoginModal }) => {
  const { userProfile, loading, logout, switchDemoRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">
            Loading Karawo TVET Academic Portal...
          </p>
        </div>
      </div>
    );
  }

  // If visitor / not logged in
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a192f] to-[#0f2744] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-slate-900 shadow-2xl text-center space-y-6 border border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0f2744] to-[#1e3a8a] text-amber-400 flex items-center justify-center mx-auto shadow-lg">
            <Shield className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif font-bold text-2xl text-[#0f2744]">
              Authentication Required
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              The Karawo TVET Academic Management Portal is restricted to authorized college administrators,
              registrars, instructors, and enrolled trainees.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={onOpenLoginModal}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow transition"
            >
              Sign In or Select Demo Role
            </button>
            <button
              onClick={onBackToWebsite}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
            >
              Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CRITICAL SECURITY ENFORCEMENT: Account Deactivation Check
  if (userProfile.status === 'inactive') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-slate-900 border-2 border-rose-500/80 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500 text-rose-500 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest bg-rose-950 px-3 py-1 rounded-full border border-rose-800">
              Security Notice • Immediate Access Revocation
            </span>
            <h2 className="font-serif font-bold text-2xl text-white">
              Account Deactivated
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your account (<strong className="text-white">{userProfile.email}</strong>) has been flagged as{' '}
              <span className="text-rose-400 font-bold uppercase">INACTIVE</span> by the Karawo TVET College Administration.
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 text-left space-y-1">
              <div>• All departmental access has been frozen.</div>
              <div>• Submissions and grading tools are disabled.</div>
              <div>• If you are a departing instructor or completed student, this is standard protocol.</div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => {
                // Allow switching to active demo user for testing
                switchDemoRole('demo-admin-1');
              }}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition"
            >
              Switch to Active Admin (Demo Recovery)
            </button>
            <button
              onClick={logout}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
            >
              Sign Out & Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'registrar':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'department_head':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'teacher':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'student':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-[#0a192f] text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          {/* Institution Header */}
          <div className="p-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow">
                <GraduationCap className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-white text-sm tracking-wide">
                  KARAWO TVET
                </h2>
                <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  Academic Portal
                </div>
              </div>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="p-4 mx-3 my-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${getRoleBadge(userProfile.role)}`}>
                {userProfile.role.replace('_', ' ')}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>

            <div>
              <div className="font-bold text-white text-xs truncate">{userProfile.fullName}</div>
              <div className="text-[10px] text-slate-400 truncate">{userProfile.email}</div>
            </div>

            {userProfile.departmentName && (
              <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-amber-300 font-medium truncate">
                Dept: {userProfile.departmentName}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="px-3 space-y-1 text-xs">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Portal Scope: {userProfile.role.replace('_', ' ').toUpperCase()}
            </div>
            <div className="px-3 py-2 bg-slate-800/60 rounded-xl text-white font-semibold flex items-center justify-between">
              <span className="capitalize">{userProfile.role.replace('_', ' ')} Workspace</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2 text-xs">
          <button
            onClick={onBackToWebsite}
            className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition flex items-center gap-2 font-medium"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>Public Website</span>
          </button>

          <button
            onClick={logout}
            className="w-full py-2 px-3 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-xl transition flex items-center gap-2 font-medium border border-rose-900/50"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {userProfile.role === 'admin' && <AdminView />}
        {userProfile.role === 'registrar' && <RegistrarView />}
        {userProfile.role === 'department_head' && <DeptHeadView />}
        {userProfile.role === 'teacher' && <TeacherView />}
        {userProfile.role === 'student' && <StudentView />}
      </main>
    </div>
  );
};
