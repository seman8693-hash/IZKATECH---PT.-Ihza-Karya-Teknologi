import React, { useState } from 'react';
import { PROJECTS } from '../data/companyData.ts';
import { ProjectItem } from '../types.ts';
import { 
  Building2, 
  MapPin, 
  Search, 
  CheckCircle2, 
  Clock, 
  Briefcase, 
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';

interface ProjectsSectionProps {
  lang: 'id' | 'en';
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ lang }) => {
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const sectors = [
    { id: 'all', labelId: 'Semua Proyek (15)', labelEn: 'All Projects (15)' },
    { id: 'commercial', labelId: 'Perkantoran & Finansial', labelEn: 'Commercial & Corporate' },
    { id: 'education', labelId: 'Pendidikan & Kampus', labelEn: 'Education & Universities' },
    { id: 'infrastructure', labelId: 'Infrastruktur & Transportasi', labelEn: 'Infrastructure & Airports' },
    { id: 'hospitality', labelId: 'Perhotelan & Pariwisata', labelEn: 'Hospitality & Leisure' },
    { id: 'government', labelId: 'Pemerintahan', labelEn: 'Government' },
    { id: 'healthcare', labelId: 'R&D Farmasi & Medis', labelEn: 'R&D & Healthcare' },
  ];

  const filteredProjects = PROJECTS.filter((proj) => {
    const matchesSector = selectedSector === 'all' || proj.sector === selectedSector;
    const matchesSearch = 
      proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.scope.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  return (
    <section id="portofolio" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            {lang === 'id' ? 'Rekam Jejak & Portofolio' : 'Track Record & Portfolio'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            {lang === 'id' 
              ? 'Proyek-Proyek Pilihan Terintegrasi di Seluruh Indonesia' 
              : 'Featured Integrated Deployments Nationwide'}
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            {lang === 'id'
              ? 'Pengalaman nyata dalam menangani proyek infrastruktur kritis, gedung bertingkat, institusi pendidikan tinggi terkemuka, fasilitas logistik bandara, hingga jalan tol.'
              : 'Proven track record executing critical infrastructure, commercial towers, top universities, airport logistics, and highway systems across Indonesia.'}
          </p>
        </div>

        {/* Search and Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-lg">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="project-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'id' ? 'Cari nama proyek atau kota...' : 'Search by project or city...'}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Result Count */}
          <div className="text-xs text-slate-400 font-mono">
            {lang === 'id' 
              ? `Menampilkan ${filteredProjects.length} dari ${PROJECTS.length} Proyek`
              : `Showing ${filteredProjects.length} of ${PROJECTS.length} Projects`}
          </div>
        </div>

        {/* Sector Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {sectors.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSector(sec.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                selectedSector === sec.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {lang === 'id' ? sec.labelId : sec.labelEn}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              id={`project-card-${project.id}`}
              className="bg-slate-900/90 border border-slate-800/90 hover:border-cyan-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/30 group text-left relative"
            >
              <div>
                {/* Sector tag & status indicator */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-1 rounded-lg">
                    {project.sectorLabel}
                  </span>

                  {project.status === 'On Going' ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span>ON GOING</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>COMPLETED</span>
                    </span>
                  )}
                </div>

                {/* Project Title */}
                <h3 className="text-lg font-bold text-white mb-2 font-display group-hover:text-cyan-300 transition-colors leading-snug">
                  {project.name}
                </h3>

                {/* Location Badge */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>{project.location}</span>
                </div>

                {/* Scope Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-3 border-t border-slate-800/80">
                  {project.scope}
                </p>
              </div>

              {/* Bottom footer badge */}
              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono text-cyan-500/80">IZKATECH Verified</span>
                <span className="text-slate-400 font-medium">{project.city}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="py-16 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
            <Building2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <div className="text-base font-bold text-white mb-1">
              {lang === 'id' ? 'Proyek tidak ditemukan' : 'No projects matched'}
            </div>
            <p className="text-xs text-slate-400 mb-4">
              {lang === 'id' 
                ? 'Coba ganti kata kunci pencarian atau pilih kategori sektor yang lain.'
                : 'Try modifying your search keywords or select another sector filter.'}
            </p>
            <button
              onClick={() => {
                setSelectedSector('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
            >
              {lang === 'id' ? 'Reset Filter' : 'Reset Filters'}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
