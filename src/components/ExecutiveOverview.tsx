import React, { useState } from 'react';
import { KPI_METRICS } from '../data/reportData';
import { Cpu, Terminal, TrendingDown, ShieldAlert, ArrowRight, Zap, CheckCircle2, Info } from 'lucide-react';

const iconMap = {
  Cpu: Cpu,
  Terminal: Terminal,
  TrendingDown: TrendingDown,
  ShieldAlert: ShieldAlert,
};

export const ExecutiveOverview: React.FC = () => {
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);

  const timelineSteps = [
    {
      year: '2023',
      title: 'Prompt Engineering',
      desc: '사용자의 단일 텍스트 질의에 응답하는 단순 질의응답 (ChatGPT 3.5 시대)',
      badge: '수동적'
    },
    {
      year: '2024',
      title: 'RAG & Copilots',
      desc: '사내 문서 벡터 검색과 코드 자동 완성 보조 (GitHub Copilot, RAG 붐)',
      badge: '보조적'
    },
    {
      year: '2025',
      title: 'Tool Calling & Workflows',
      desc: 'API 호출 및 웹 검색 함수를 명시적으로 실행하는 LangChain/CrewAI 생태계',
      badge: '도구 활용'
    },
    {
      year: '2026',
      title: '자율 에이전트 & 커널 센티넬',
      desc: '백그라운드 지속 실행, 로컬 시스템 권한 위임, eBPF 커널 보안 및 다단계 자율 위임',
      badge: '완전 자율'
    }
  ];

  return (
    <section id="overview" className="space-y-8 pt-4">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-700/50">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-indigo-200">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>2026 AI 에이전트 패러다임 시프트 인텔리전스</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            수동적 대화형 LLM에서<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-amber-300">
              자율적 행동 대리인(Autonomous Agent)
            </span>의 시대로
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm sm:leading-relaxed">
            2026년 인공지능 산업은 단순 질의응답을 넘어 사용자의 상시 개입 없이 다단계 워크플로우를 기획하고 백그라운드에서 실행하는 <b>자율 에이전트</b> 시대로 완전히 전환되었습니다. 클라우드 기반 턴키 플랫폼 <b>메타 뮤즈(Meta Muse)</b>와 극단적 로컬 자율성을 자랑하는 <b>오픈클로(OpenClaw)</b>의 기술 아키텍처, 영구 기억 구조 및 보안 위협을 비교 분석합니다.
          </p>

          <div className="flex flex-wrap gap-2 pt-2 text-[11px] text-slate-300 font-medium">
            <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10">#MetaMuse</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10">#OpenClaw</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10">#Spark1.3_1M</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10">#MCP_Protocol</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10">#eBPF_Sentinel</span>
          </div>
        </div>

        {/* 4 Interactive KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-700/60 relative z-10">
          {KPI_METRICS.map((kpi) => {
            const Icon = iconMap[kpi.icon as keyof typeof iconMap] || Cpu;
            const isSelected = selectedKpi === kpi.id;

            return (
              <div
                key={kpi.id}
                onClick={() => setSelectedKpi(isSelected ? null : kpi.id)}
                className={`cursor-pointer transition-all duration-200 p-4 rounded-2xl border backdrop-blur-md ${
                  isSelected
                    ? 'bg-white/20 border-white/40 ring-2 ring-sky-400 shadow-lg scale-[1.02]'
                    : 'bg-white/10 hover:bg-white/15 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-300 font-medium">{kpi.title}</span>
                  <div className="p-1.5 rounded-lg bg-white/10 text-white">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className={`text-xl sm:text-2xl font-black ${
                    kpi.color === 'sky' ? 'text-sky-300' :
                    kpi.color === 'amber' ? 'text-amber-300' :
                    kpi.color === 'emerald' ? 'text-emerald-300' : 'text-rose-300'
                  }`}>
                    {kpi.value}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">{kpi.unit}</span>
                </div>

                <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{kpi.subtitle}</span>
                  <span className="text-[10px] text-slate-400 underline font-mono">자세히</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* KPI Detail Dropdown/Drawer if selected */}
        {selectedKpi && (
          <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-200 space-y-2 animate-in fade-in duration-200">
            {selectedKpi === 'context' && (
              <div>
                <b className="text-sky-300">1,048,576 토큰 (1M Context):</b> 메타 뮤즈의 Spark 1.3 모델은 단일 프롬프트에서 책 수백 권, 45분짜리 1080p 고화질 영상, 또는 20만 줄 이상의 대형 소스코드 레포지토리를 한 번에 주입하여 처리할 수 있는 초거대 컨텍스트 윈도우를 기본 지원합니다.
              </div>
            )}
            {selectedKpi === 'openclaw-growth' && (
              <div>
                <b className="text-amber-300">340,000+ GitHub Stars:</b> 오픈소스 프로젝트 중 역사상 최단기간 기록을 갱신 중인 오픈클로는 피터 스타인버거가 공개한 후 전 세계 개발자들이 5,700여 개의 ClawHub 자동화 스킬을 업로드하며 급성장했습니다.
              </div>
            )}
            {selectedKpi === 'efficiency' && (
              <div>
                <b className="text-emerald-300">-25% 토큰 최적화 & 도구 호출 20% 감소:</b> 뮤즈 Spark 1.3은 에이전틱 궤적 추론 최적화를 통해 불필요한 반복 도구 호출(Tool Loop)을 줄여 전체 연산 비용과 지연 시간을 대폭 개선했습니다.
              </div>
            )}
            {selectedKpi === 'vulnerability' && (
              <div>
                <b className="text-rose-300">26% 악성/취약 스킬 (Cisco Talos 리포트):</b> Cisco 보안 연구팀 조사 결과, 마켓플레이스 등록 스킬 5,700개 중 1,184개에서 환경변수 탈취, 원격 쉘 실행, 백도어 악성 스크립트가 발견되어 검증 없는 설치 시 심각한 보안 침해가 발생할 수 있습니다.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Evolution Timeline: 2023 -> 2026 */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              AI 에이전트 아키텍처 진화 타임라인 (2023 - 2026)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              프롬프트 질의응답에서 샌드박스 커널 레벨 자율 실행까지의 진화 단계
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 self-start sm:self-auto">
            4단계 진화론
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {timelineSteps.map((step, idx) => (
            <div
              key={step.year}
              className={`p-4 rounded-2xl border transition-all ${
                idx === 3
                  ? 'bg-gradient-to-b from-indigo-50/70 to-sky-50/70 border-indigo-200 ring-1 ring-indigo-400 shadow-xs'
                  : 'bg-slate-50/80 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-black font-mono px-2 py-0.5 rounded ${
                  idx === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {step.year}
                </span>
                <span className={`text-[10px] font-bold ${
                  idx === 3 ? 'text-indigo-600' : 'text-slate-400'
                }`}>
                  {step.badge}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
