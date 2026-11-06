/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Department } from '../../types';
import { getDepartments, submitAdmissionApplication } from '../../services/dataService';
import {
  CheckCircle2,
  FileText,
  Clock,
  Send,
  AlertCircle,
  HelpCircle,
  GraduationCap,
  Sparkles
} from 'lucide-react';

interface AdmissionsPageProps {
  initialDepartment?: string;
  onNavigate: (page: string) => void;
}

export const AdmissionsPage: React.FC<AdmissionsPageProps> = ({ initialDepartment, onNavigate }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    departmentId: '',
    departmentName: '',
    preferredProgram: 'TVET Certificate Level I',
    previousEducation: 'Grade 10 / 12 National Exam Pass'
  });
  const [submitting, setSubmitting] = useState(false);
  const [successCode, setSuccessCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadDepts() {
      try {
        const list = await getDepartments();
        setDepartments(list);
        if (list.length > 0) {
          const match = initialDepartment ? list.find(d => d.name === initialDepartment) : list[0];
          const activeDept = match || list[0];
          setFormData(prev => ({
            ...prev,
            departmentId: activeDept.id,
            departmentName: activeDept.name
          }));
        }
      } catch (err) {
        console.error('Failed to load departments in admissions:', err);
      }
    }
    loadDepts();
  }, [initialDepartment]);

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dId = e.target.value;
    const matched = departments.find(d => d.id === dId);
    setFormData(prev => ({
      ...prev,
      departmentId: dId,
      departmentName: matched ? matched.name : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.departmentId) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await submitAdmissionApplication({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        departmentId: formData.departmentId,
        departmentName: formData.departmentName,
        preferredProgram: formData.preferredProgram,
        previousEducation: formData.previousEducation
      });

      const refCode = `KTVET-APP-${Math.floor(100000 + Math.random() * 900000)}`;
      setSuccessCode(refCode);
      setFormData(prev => ({
        ...prev,
        fullName: '',
        email: '',
        phone: ''
      }));
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Submission failed. Please check network connectivity and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Banner */}
      <section className="bg-gradient-to-r from-[#0a192f] to-[#0f2744] text-white py-16 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Enrollment 2026/2027
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Admissions & Trainee Enrollment
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Begin your journey towards national occupational competence and certified craftsmanship.
            Karawo TVET College welcomes applicants for regular daytime, evening extension, and weekend shifts.
          </p>
        </div>
      </section>

      {/* Admissions Steps & Requirements */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Requirements & Process */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                Eligibility Guidelines
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#0f2744]">
                Admission Requirements
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Applicants must meet the national TVET entry benchmarks set by the Ministry of Labor and Skills:
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <div className="font-bold text-xs text-[#0f2744] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Level I & Level II Certificate Entry</span>
                  </div>
                  <p className="text-xs text-slate-500 pl-6">
                    Completion of Grade 10 or Grade 12 national secondary schooling or equivalent vocational foundation.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <div className="font-bold text-xs text-[#0f2744] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Level III & Level IV Diploma Entry</span>
                  </div>
                  <p className="text-xs text-slate-500 pl-6">
                    Completion of preparatory high school (ESLCE pass) or certified COC pass from preceding TVET levels.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <div className="font-bold text-xs text-[#0f2744] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Required Supporting Documents</span>
                  </div>
                  <p className="text-xs text-slate-500 pl-6">
                    Original transcript, Ethiopian Kebele/National ID, 4 passport photos, and medical fitness clearance.
                  </p>
                </div>
              </div>
            </div>

            {/* Admission Timeline Steps */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#0f2744]">
                Admissions Journey
              </h3>
              <ol className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 font-bold flex items-center justify-center shrink-0">1</span>
                  <div>
                    <strong>Online Application:</strong> Submit preferred department and contact information using the form.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 font-bold flex items-center justify-center shrink-0">2</span>
                  <div>
                    <strong>Registrar Review:</strong> College Registrar verifies educational credentials against ministry criteria.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 font-bold flex items-center justify-center shrink-0">3</span>
                  <div>
                    <strong>Orientation & Registration:</strong> Receive your trainee ID card and workshop safety gear allocation.
                  </div>
                </li>
              </ol>
            </div>
          </div>

          {/* Right Column: Online Application Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-lg">
              <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#0f2744]">
                    Online Admission Application
                  </h3>
                  <p className="text-xs text-slate-400">
                    Submit your application directly to the College Registrar Office.
                  </p>
                </div>
              </div>

              {successCode ? (
                <div className="my-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-emerald-900">Application Submitted Successfully!</h4>
                    <p className="text-xs text-emerald-700 mt-1">
                      Your admission application has been registered with the Karawo TVET College Admissions Office.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 inline-block font-mono text-sm font-bold text-slate-800">
                    Application Ref: {successCode}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Please retain this reference code. The Registrar Office will contact you via email/phone regarding your placement.
                  </p>
                  <button
                    onClick={() => setSuccessCode(null)}
                    className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 pt-6">
                  {errorMsg && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Trainee Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alazar Bekele Tadesse"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. alazar@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone Number (Ethiopia) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +251 91 123 4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Preferred TVET Department *
                      </label>
                      <select
                        value={formData.departmentId}
                        onChange={handleDeptChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      >
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Target TVET Qualification Level
                      </label>
                      <select
                        value={formData.preferredProgram}
                        onChange={(e) => setFormData({ ...formData, preferredProgram: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="TVET Certificate Level I">Level I - Basic Craftsman Certificate</option>
                        <option value="TVET Certificate Level II">Level II - Intermediate Technician</option>
                        <option value="TVET Certificate Level III">Level III - Advanced Technician</option>
                        <option value="TVET Diploma Level IV">Level IV - Professional Diploma & Supervisor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Highest Prior Educational Attainment
                      </label>
                      <select
                        value={formData.previousEducation}
                        onChange={(e) => setFormData({ ...formData, previousEducation: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="Grade 10 / 12 National Exam Pass">Grade 10 / 12 Secondary School Certificate</option>
                        <option value="Preparatory High School (Grade 12)">Preparatory High School (Grade 12)</option>
                        <option value="TVET Level I/II Graduate">Existing TVET Level I/II Certificate Holder</option>
                        <option value="Other Vocational Training">Other Vocational Foundation</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                    <p>
                      <strong>Declaration:</strong> I certify that all personal records and previous academic credentials submitted are genuine.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-slate-950" />
                    <span>{submitting ? 'Submitting Application...' : 'Submit Application to Registrar'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
