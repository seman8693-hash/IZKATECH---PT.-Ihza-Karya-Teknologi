import React, { useState, useEffect } from 'react';
import { PROJECTS } from '../data/companyData.ts';
import { ProjectItem } from '../types.ts';
import { getStoredProjects, sectorPlaceholderImage } from '../data/adminStore.ts';
import { AdminProject } from '../types/admin.ts';
import { 
  Building2, 
  MapPin, 
  Search, 
  CheckCircle2, 
  Clock, 
  Briefcase, 
  Sparkles,
  ChevronRight,
  Filter,
  X,
  Calendar
} from 'lucide-react';

interface ProjectsSectionProps {
  lang: 'id' | 'en';
}

/** Kartu portofolio = format katalog + gambar & detail dari admin */
interface PortfolioCard extends ProjectItem {
  image?: string;
  details?: string;
  highlights?: string[];
}

const mapAdminToCard = (p: AdminProject): PortfolioCard => ({
  id: p.id,
  name: p.title,
  location: p.location || 'Indonesia',
  city: p.city || 'Nasional',
  sector: (p.sector || 'commercial') as ProjectItem['sector'],
  sectorLabel: p.sectorLabel || p.category,
  status: p.status === 'completed' ? 'Completed' : 'On Going',
  scope: p.description,
  year: p.year,
  image: p.image || sectorPlaceholderImage(p.sector, p.sectorLabel),
  details: p.details || p.description,
  highlights: p.highlights || [],
});

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ lang }) => {
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [portfolio, setPortfolio] = useState<PortfolioCard[]>(() => PROJECTS as PortfolioCard[]);
  const [detailProject, setDetailProject] = useState<PortfolioCard | null>(null);

  // Muat portofolio dari penyimpanan admin (upload gambar & detail) — fallback ke data statis
  useEffect(() => {
    try {
      const stored = getStoredProjects();
      if (stored.length > 0) {
        setPortfolio(stored.map(mapAdminToCard));
      }
    } catch {
      // fallback: tetap gunakan PROJECTS statis
    }
  }, []);

  const sectors = [
    { id: 'all', labelId: 'Semua Proyek (15)', labelEn: 'All Projects (15)' },
    { id: 'commercial', labelId: 'Perkantoran & Finansial', labelEn: 'Commercial & Corporate' },
    { id: 'education', labelId: 'Pendidikan & Kampus', labelEn: 'Education & Universities' },
    { id: 'infrastructure', labelId: 'Infrastruktur & Transportasi', labelEn: 'Infrastructure & Airports' },
    { id: 'hospitality', labelId: 'Perhotelan & Pariwisata', labelEn: 'Hospitality & Leisure' },
    { id: 'government', labelId: 'Pemerintahan', labelEn: 'Government' },
    { id: 'healthcare', labelId: 'R&D Farmasi & Medis', labelEn: 'R&D & Healthcare' },
  ];

  const filteredProjects = portfolio.filter((proj) => {
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
              ? `Menampilkan ${filteredProjects.length} dari ${portfolio.length} Proyek`
              : `Showing ${filteredProjects.length} of ${portfolio.length} Projects`}
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
                {/* Foto Dokumentasi Proyek */}
                <div className="relative -m-6 mb-5 h-44 overflow-hidden rounded-t-2xl bg-slate-950">
                  <img
                    src={project.image || sectorPlaceholderImage(project.sector, project.sectorLabel)}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent" />
                </div>

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
                  {project.year && (
                    <>
                      <span className="text-slate-700">•</span>
                      <Calendar className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span>{project.year}</span>
                    </>
                  )}
                </div>

                {/* Scope Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-3 border-t border-slate-800/80">
                  {project.scope}
                </p>
              </div>

              {/* Bottom footer badge */}
              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono text-cyan-500/80">IZKATECH Verified</span>
                <button
                  onClick={() => setDetailProject(project)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors"
                >
                  Detail Katalog
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
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

      {/* -------------------------------------------------------------
          MODAL DETAIL KATALOG PROYEK
          ------------------------------------------------------------- */}
      {detailProject && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm"
          onClick={() => setDetailProject(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hero Image */}
            <div className="relative h-56 sm:h-72">
              <img
                src={detailProject.image || sectorPlaceholderImage(detailProject.sector, detailProject.sectorLabel)}
                alt={detailProject.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
              <button
                onClick={() => setDetailProject(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/70 hover:bg-slate-800 text-slate-200 border border-slate-700 cursor-pointer transition-colors"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-cyan-300 bg-cyan-950/70 border border-cyan-800/60 px-2.5 py-1 rounded-lg backdrop-blur">
                  {detailProject.sectorLabel}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur ${
                  detailProject.status === 'On Going'
                    ? 'bg-amber-500/85 text-slate-950'
                    : 'bg-emerald-500/85 text-slate-950'
                }`}>
                  {detailProject.status === 'On Going' ? 'ON GOING' : 'COMPLETED'}
                </span>
                {detailProject.year && (
                  <span className="text-[10px] font-mono text-slate-300 bg-slate-900/70 px-2.5 py-1 rounded-full border border-slate-700 backdrop-blur">
                    {detailProject.year}
                  </span>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display leading-snug">
                  {detailProject.name}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    {detailProject.location} • {detailProject.city}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                    {detailProject.sectorLabel}
                  </span>
                </div>
              </div>

              {/* Ringkasan */}
              <div>
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 mb-2">
                  Ringkasan
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">{detailProject.scope}</p>
              </div>

              {/* Keterangan Detail */}
              {detailProject.details && detailProject.details !== detailProject.scope && (
                <div>
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 mb-2">
                    Keterangan Detail
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed text-justify">
                    {detailProject.details}
                  </p>
                </div>
              )}

              {/* Poin Unggulan */}
              {detailProject.highlights && detailProject.highlights.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 mb-2">
                    Lingkup Pekerjaan &amp; Poin Unggulan
                  </h4>
                  <ul className="space-y-2">
                    {detailProject.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="font-mono text-xs text-cyan-500/80">IZKATECH Verified Project</span>
                <a
                  href="#kontak"
                  onClick={() => setDetailProject(null)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 text-xs font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                  Konsultasi Proyek Serupa
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>
    </section>
  );
};
