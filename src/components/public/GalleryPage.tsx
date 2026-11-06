/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { GalleryItem } from '../../types';
import { getGallery } from '../../services/dataService';
import { X, ZoomIn, Camera } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const list = await getGallery();
        setGallery(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = ['All', 'Automotive', 'Electrical', 'ICT', 'Manufacturing', 'Garment', 'Construction'];

  const filtered = selectedCategory === 'All'
    ? gallery
    : gallery.filter(g => g.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-16 pb-16">
      {/* Banner */}
      <section className="bg-gradient-to-r from-[#0a192f] to-[#0f2744] text-white py-16 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Visual Tour
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Campus & Practical Workshop Gallery
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Witness our trainees mastering industrial tools, computerized diagnostics,
            electronics benches, and manufacturing production lines.
          </p>

          {/* Category Tabs */}
          <div className="pt-4 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="group relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm hover:shadow-xl transition duration-300 cursor-pointer h-72"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition"></div>

              <div className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/60 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition">
                <ZoomIn className="w-4 h-4 text-amber-400" />
              </div>

              <div className="absolute bottom-0 inset-x-0 p-5 text-white space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                  {item.category}
                </span>
                <h3 className="font-bold text-sm text-white leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/80 text-white hover:bg-slate-950 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-h-[70vh] overflow-hidden flex items-center justify-center bg-black">
              <img
                src={activeImage.imageUrl}
                alt={activeImage.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>

            <div className="p-6 text-white space-y-1 bg-slate-900">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                {activeImage.category} • {activeImage.date}
              </span>
              <h3 className="font-serif text-lg font-bold text-white">
                {activeImage.title}
              </h3>
              <p className="text-xs text-slate-400">
                {activeImage.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
