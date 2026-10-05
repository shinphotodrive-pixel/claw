import React, { useState } from 'react';
import { OPENCLAW_ECOSYSTEM, SAMPLE_CLAWHUB_SKILLS } from '../data/reportData';
import { ClawSkill } from '../types';
import { Terminal, ShieldAlert, CheckCircle2, AlertTriangle, Play, Sparkles, FolderGit2, Search, ExternalLink, Code2 } from 'lucide-react';

interface OpenClawSectionProps {
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const OpenClawSection: React.FC<OpenClawSectionProps> = ({ onShowToast }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'safe' | 'warning' | 'malicious'>('all');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'OpenClaw Daemon v2.4.1 (x86_64-apple-darwin24)',
    'Loaded configuration: ~/.openclaw/config.json',
    'Model: claude-3-7-sonnet-20250219 (BYOK Anthropic API)',
    'MCP Servers active: [postgres, filesystem, telegram-gateway]',
    'Type or click one of the preset commands below to simulate execution.'
  ]);
  const [isSimulatingCli, setIsSimulatingCli] = useState(false);

  // Filter skills
  const filteredSkills = SAMPLE_CLAWHUB_SKILLS.filter((s) => {
    if (selectedFilter === 'all') return true;
    return s.status === selectedFilter;
  });

  const runTerminalCommand = (cmd: string) => {
    setIsSimulatingCli(true);
    setTerminalOutput((prev) => [...prev, `$ ${cmd}`]);

    setTimeout(() => {
      if (cmd === 'openclaw status') {
        setTerminalOutput((prev) => [
          ...prev,
          '[OK] Daemon PID: 88412 (running background)',
          '[OK] Memory: 1.2GB RAM | SOUL.md loaded',
          '[OK] Vector DB: ChromaDB (14,289 episodic embeddings)',
          '[OK] Telegram Gateway: @MyDevClawBot (connected)'
        ]);
        onShowToast('터미널 명령 openclaw status 실행 완료', 'info');
      } else if (cmd === 'openclaw audit --security') {
        setTerminalOutput((prev) => [
          ...prev,
          '[*] Scanning 4 installed ClawHub skills against Cisco Talos DB...',
          '[!] WARNING: "telegram-crypto-arb-bot" flagged: Malicious Base64 exfiltration to 194.26.29.x',
          '[!] ACTION RECOMMENDED: Remove skill or run with NVIDIA OpenShell isolation.',
          '[+] Audit complete: 1 critical threat, 1 warning detected.'
        ]);
        onShowToast('보안 감사 완료: 악성 스킬이 감지되었습니다.', 'warning');
      } else if (cmd === 'openclaw skills list') {
        setTerminalOutput((prev) => [
          ...prev,
          'Installed Skills:',
          '  - github-pr-automator (v1.2.0) [VERIFIED SAFE]',
          '  - postgres-data-pipeline (v2.0.4) [VERIFIED SAFE]',
          '  - auto-social-scheduler (v0.9.1) [UNVERIFIED]'
        ]);
        onShowToast('설치된 스킬 목록을 불러왔습니다.', 'success');
      }
      setIsSimulatingCli(false);
    }, 450);
  };

  return (
    <section id="openclaw" className="space-y-8 pt-6">
      {/* Section Header */}
      <div className="border-l-4 border-amber-500 pl-4 space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
            Open-Source Local Framework
          </span>
          <span className="text-xs text-slate-400 font-mono">340k+ Stars</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          오픈클로(OpenClaw): 로컬 구동 자율 프레임워크 생태계
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
          피터 스타인버거(Peter Steinberger)의 64,000회 이상 커밋 노하우가 집약된 오픈소스 프레임워크로, 로컬 PC/서버에서 무제한 권한으로 동작하는 프라이버시 중심의 에이전트 아키텍처입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Core Architecture & SOUL.md */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <FolderGit2 className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">아키텍처 & SOUL.md</h4>
            </div>
            <span className="text-[11px] bg-amber-50 text-amber-800 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
              Local Sovereignty
            </span>
          </div>

          <div className="space-y-3">
            {OPENCLAW_ECOSYSTEM.components.map((c) => (
              <div key={c.name} className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 text-xs space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>{c.name}</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{c.role}</p>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100 text-xs text-amber-900">
            <span className="font-bold">업계 영향력:</span> 메타 뮤즈 엔지니어링 팀도 오픈클로의 디렉토리 기반 영구 기억 구조(<code className="bg-white px-1 py-0.5 rounded font-mono text-amber-800">SOUL.md</code>)에 깊은 영감을 받았음을 기술 블로그에서 공식 인정했습니다.
          </div>
        </div>

        {/* Card 2: Cisco Talos Vulnerability Donut Chart & Analysis */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">ClawHub 보안 취약점 비율</h4>
            </div>
            <span className="text-[11px] bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded-full border border-rose-200">
              Cisco Talos 리포트
            </span>
          </div>

          {/* SVG Donut Chart */}
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-emerald-500 fill-none"
                  strokeWidth="14"
                />
                {/* Malicious/Vulnerable slice: 26% of perimeter (2 * PI * 38 = ~238.76 -> 26% is ~62.08) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-rose-500 fill-none transition-all duration-700"
                  strokeWidth="14"
                  strokeDasharray="62.1 238.8"
                  strokeDashoffset="0"
                />
              </svg>
              {/* Inner label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900 font-mono">26%</span>
                <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">악성 / 취약</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full mt-4 text-xs">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                <div>
                  <div className="font-bold text-rose-900">악성/취약 (26%)</div>
                  <div className="text-[10px] text-rose-700">1,184개 위험 패키지</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <div>
                  <div className="font-bold text-emerald-900">정상 스킬 (74%)</div>
                  <div className="text-[10px] text-emerald-700">3,370+ 검증 패키지</div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            마켓플레이스에 등록된 스킬이 사용자의 쉘 실행 권한을 상속받으므로, 사전 정적 분석 없이 무분별하게 설치할 경우 크레덴셜 탈취 및 랜섬웨어 노출 위험이 있습니다.
          </p>
        </div>

        {/* Card 3: Interactive Virtual Terminal CLI */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                </div>
                <span className="text-xs font-mono text-slate-400">OpenClaw Local Terminal</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">PORT 18789</span>
            </div>

            {/* Terminal Screen */}
            <div className="mt-3 p-3 bg-slate-900/90 rounded-2xl font-mono text-[11px] text-slate-300 h-52 overflow-y-auto space-y-1 custom-scrollbar">
              {terminalOutput.map((line, idx) => (
                <div
                  key={idx}
                  className={
                    line.startsWith('$')
                      ? 'text-amber-300 font-bold'
                      : line.includes('WARNING') || line.includes('Critical')
                      ? 'text-rose-400'
                      : line.includes('[OK]') || line.includes('[+]')
                      ? 'text-emerald-400'
                      : 'text-slate-300'
                  }
                >
                  {line}
                </div>
              ))}
              {isSimulatingCli && (
                <div className="text-slate-500 animate-pulse">명령어 실행 중...</div>
              )}
            </div>
          </div>

          {/* Quick Command Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono">빠른 실행 명령 테스트:</span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => runTerminalCommand('openclaw status')}
                disabled={isSimulatingCli}
                className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono transition text-center disabled:opacity-50"
              >
                status
              </button>
              <button
                onClick={() => runTerminalCommand('openclaw audit --security')}
                disabled={isSimulatingCli}
                className="px-2 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-[10px] font-mono transition text-center border border-rose-800/60 disabled:opacity-50"
              >
                audit --security
              </button>
              <button
                onClick={() => runTerminalCommand('openclaw skills list')}
                disabled={isSimulatingCli}
                className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono transition text-center disabled:opacity-50"
              >
                skills list
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive ClawHub Skill Inspector */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-600" />
              ClawHub 커뮤니티 스킬 감사 인스펙터
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              실제 등록된 대표 스킬 4종의 정적 분석 결과 및 권한 위임 현황을 확인하세요.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                selectedFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setSelectedFilter('safe')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                selectedFilter === 'safe'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              안전 (Safe)
            </button>
            <button
              onClick={() => setSelectedFilter('warning')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                selectedFilter === 'warning'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              주의 (Warning)
            </button>
            <button
              onClick={() => setSelectedFilter('malicious')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                selectedFilter === 'malicious'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              악성 (Malicious)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className={`p-4 rounded-2xl border transition-all ${
                skill.status === 'malicious'
                  ? 'bg-rose-50/40 border-rose-200 ring-1 ring-rose-300'
                  : skill.status === 'warning'
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-slate-50/60 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                    {skill.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{skill.author}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    skill.status === 'safe'
                      ? 'bg-emerald-100 text-emerald-800'
                      : skill.status === 'warning'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {skill.status.toUpperCase()}
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{skill.description}</p>

              <div className="mt-3 flex flex-wrap gap-1 items-center">
                <span className="text-[10px] text-slate-400 font-medium mr-1">요구 MCP 도구:</span>
                {skill.mcpTools.map((t) => (
                  <span key={t} className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                    {t}
                  </span>
                ))}
              </div>

              <div className={`mt-3 p-2.5 rounded-xl text-[11px] leading-relaxed ${
                skill.status === 'malicious' ? 'bg-rose-100 text-rose-900 font-medium' : 'bg-slate-100 text-slate-700'
              }`}>
                <b>Cisco 감사 소견:</b> {skill.auditNotes}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
