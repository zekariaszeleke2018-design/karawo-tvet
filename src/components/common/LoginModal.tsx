/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_PRECONFIGURED_USERS } from '../../data/seedData';
import { X, Shield, Lock, GraduationCap, Building2, UserCheck, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginWithGoogle, switchDemoRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await loginWithGoogle();
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Google Authentication failed. You can also select a test persona below.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = (userId: string) => {
    switchDemoRole(userId);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-[#0f2744] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-white">Karawo TVET College</h2>
              <p className="text-xs text-amber-300 font-medium tracking-wide">
                Academic Management Portal Login
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2">
            Secure multi-role access for Administrators, Registrars, Department Heads, Teachers, and Trainees.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* Google Auth Button */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Official Authentication
            </h3>
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-sm transition shadow hover:shadow-md disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              {loading ? 'Authenticating...' : 'Sign in with Google Account'}
            </button>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase">
              Or Test Instant Role Personas
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Quick Demo Switchers */}
          <div className="space-y-2">
            <p className="text-xs text-slate-500">
              Select any preconfigured role below to test full system capabilities:
            </p>

            <div className="grid grid-cols-1 gap-2">
              {DEMO_PRECONFIGURED_USERS.map((user) => {
                const getRoleColor = (role: string) => {
                  switch (role) {
                    case 'admin':
                      return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
                    case 'registrar':
                      return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
                    case 'department_head':
                      return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
                    case 'teacher':
                      return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
                    case 'student':
                      return 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100';
                    default:
                      return 'bg-slate-50 text-slate-700 border-slate-200';
                  }
                };

                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelectDemo(user.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition ${getRoleColor(
                      user.role
                    )}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center font-bold text-xs">
                        {user.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                          {user.fullName}
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded uppercase font-bold bg-white/70">
                            {user.role.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {user.departmentName || user.email}
                        </div>
                      </div>
                    </div>
                    <UserCheck className="w-4 h-4 opacity-70" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          Karawo TVET College • Federal Technical and Vocational Training Institute accredited
        </div>
      </div>
    </div>
  );
};
