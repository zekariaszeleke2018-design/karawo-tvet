/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { NewsItem, Announcement } from '../../types';
import { getNews, getAnnouncements } from '../../services/dataService';
import { Calendar, User, Tag, ArrowRight, X, AlertCircle, Bell } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [news, anns] = await Promise.all([
          getNews(),
          getAnnouncements()
        ]);
        setNewsList(news);
        setAnnouncements(anns.filter(a => a.scope === 'college'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = ['All', 'Achievement', 'Facility Upgrade', 'Partnership', 'Academic'];

  const filteredNews = selectedCategory === 'All'
    ? newsList
    : newsList.filter(n => n.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-16 pb-16">
      {/* Banner */}
      <section className="bg-gradient-to-r from-[#0a192f] to-[#0f2744] text-white py-16 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            College Media Center
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            News & Official Announcements
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Stay updated with academic breakthroughs, regional skills demonstrations,
            industry partnership signings, and institutional advisories.
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

      {/* College-Wide Urgent Announcements Banner */}
      {announcements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 sm:p-5 rounded-r-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
              <Bell className="w-4 h-4 text-amber-600" />
              <span>Official Institutional Notices ({announcements.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-[#0f2744]">{ann.title}</h4>
                    {ann.priority === 'urgent' && (
                      <span className="text-[9px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded uppercase">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                  <div className="text-[10px] text-slate-400 pt-1">
                    Posted by: {ann.authorName} • {ann.createdAt.split('T')[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((news) => (
            <article
              key={news.id}
              onClick={() => setActiveArticle(news)}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition duration-200 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="relative overflow-hidden h-52">
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {news.category}
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <div className="flex items-center gap-3 text-slate-400 text-xs">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {news.publishedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {news.author}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#0f2744] group-hover:text-amber-600 transition leading-snug">
                    {news.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {news.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-amber-600 font-bold">
                <span>Read Full Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Read Article Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="relative h-64 shrink-0">
              <img
                src={activeArticle.imageUrl}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/70 text-white hover:bg-slate-950 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-4 bg-amber-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-full">
                {activeArticle.category}
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>Published: {activeArticle.publishedAt}</span>
                <span>•</span>
                <span>By: {activeArticle.author}</span>
              </div>

              <h2 className="font-serif text-2xl font-bold text-[#0f2744] leading-tight">
                {activeArticle.title}
              </h2>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium leading-relaxed">
                {activeArticle.summary}
              </div>

              <div className="text-sm text-slate-700 leading-relaxed space-y-3 whitespace-pre-line">
                {activeArticle.content}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 bg-[#0f2744] text-white text-xs font-bold rounded-xl"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
