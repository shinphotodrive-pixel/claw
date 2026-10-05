import React, { useState } from 'react';
import { Sparkles, Terminal, ShieldAlert, Cpu, HelpCircle, Menu, X, BookOpen, Layers, Gauge, FileDown, Loader2 } from 'lucide-react';

interface NavbarProps {
  onOpenAdvisor: () => void;
  activeSection: string;
  onDownloadReport: () => void;
  isDownloading?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdvisor,
  activeSection,
  onDownloadReport,
  isDownloading = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { id: 'overview', label: '개요', icon: BookOpen },
    { id: 'muse', label: '메타 뮤즈', icon: Cpu, accent: 'text-sky-600 hover:text-sky-700' },
    { id: 'openclaw', label: '오픈클로', icon: Terminal, accent: 'text-amber-600 hover:text-amber-700' },
    { id: 'memory', label: '메모리 구조', icon: Layers },
    { id: 'performance', label: '성능 지표', icon: Gauge, accent: 'text-emerald-600 hover:text-emerald-700' },
    { id: 'security', label: '보안 위협 & 방어', icon: ShieldAlert, accent: 'text-rose-600 hover:text-rose-700' },
    { id: 'guide', label: '구동 매뉴얼', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('overview')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white flex items-center justify-center font-black text-lg shadow-sm border border-slate-700/30">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight tracking-tight">
                  2026 자율형 AI 에이전트 인텔리전스
                </h1>
                <span className="hidden lg:inline-block px-2 py-0.5 text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 rounded-md">
                  심층 리포트
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Meta Muse (클라우드 턴키) vs OpenClaw (로컬 오픈소스) 기술 아키텍처 비교
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-slate-100 text-slate-950 font-bold shadow-2xs'
                      : item.accent || 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-80" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="hidden sm:flex items-center space-x-2">
            <button
              onClick={onDownloadReport}
              disabled={isDownloading}
              className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs hover:shadow transition flex items-center gap-1.5 disabled:opacity-50"
              title="이해관계자용 PDF 리포트 다운로드"
            >
              {isDownloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              ) : (
                <FileDown className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>{isDownloading ? '생성 중...' : 'PDF 리포트'}</span>
            </button>

            <button
              onClick={onOpenAdvisor}
              className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold shadow-xs hover:shadow transition flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-200" />
              <span>에이전트 진단</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center sm:hidden gap-1">
            <button
              onClick={onDownloadReport}
              disabled={isDownloading}
              className="p-2 text-slate-800 hover:bg-slate-100 rounded-lg text-xs font-bold"
              title="PDF 리포트 다운로드"
            >
              {isDownloading ? (
                <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
              ) : (
                <FileDown className="w-5 h-5 text-emerald-600" />
              )}
            </button>
            <button
              onClick={onOpenAdvisor}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-bold"
              title="에이전트 진단"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/95 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
              >
                <Icon className="w-4 h-4 text-slate-500" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onDownloadReport();
              }}
              disabled={isDownloading}
              className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-xs font-bold text-center flex items-center justify-center gap-2"
            >
              <FileDown className="w-4 h-4 text-emerald-400" />
              <span>{isDownloading ? 'PDF 생성 중...' : '이해관계자 PDF 리포트 다운로드'}</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdvisor();
              }}
              className="w-full py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-bold text-center flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-indigo-200" />
              <span>나에게 맞는 에이전트 찾기 (진단기)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

