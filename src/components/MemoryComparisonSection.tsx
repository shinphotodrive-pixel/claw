import React, { useState } from 'react';
import { COMPARISON_DIMENSIONS } from '../data/reportData';
import { Layers, Database, Cpu, Trophy, Clock, Check, ArrowRight, Sparkles } from 'lucide-react';

export const MemoryComparisonSection: React.FC = () => {
  const [simulationDay, setSimulationDay] = useState<number>(15);

  // Simulation metrics based on day
  const museContextUsage = Math.min(100, 20 + simulationDay * 2.5);
  const museCumulativeRecall = 25; // stays low because it is stateless per session
  const openclawContextUsage = Math.min(100, 15 + simulationDay * 1.5);
  const openclawCumulativeRecall = Math.min(98, 40 + simulationDay * 1.8);

  const barComparison = [
    { label: '단일 세션 맥락 수용량', muse: 98, claw: 60, unit: '1M tokens' },
    { label: '장기 기억 및 경험 보존', muse: 45, claw: 95, unit: 'Vector DB' },
    { label: '로컬 시스템 완전 제어권', muse: 30, claw: 98, unit: 'Shell OS' },
    { label: '보안 샌드박스 안정성', muse: 92, claw: 55, unit: 'eBPF VM' },
    { label: '도구 확장 마켓 생태계', muse: 68, claw: 94, unit: '5.7k MCP' },
    { label: '설치 및 유지보수 편의성', muse: 90, claw: 48, unit: 'Turnkey' }
  ];

  return (
    <section id="memory" className="space-y-8 pt-6">
      {/* Section Header */}
      <div className="border-l-4 border-indigo-600 pl-4 space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider">
            Architecture Matrix
          </span>
          <span className="text-xs text-slate-400 font-mono">Context vs Memory</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          아키텍처 비교: 초거대 컨텍스트 윈도우 vs 영구 기억(Persistent Memory)
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
          메타 뮤즈와 오픈클로는 정보를 수용하고 보존하는 패러다임이 근본적으로 다릅니다. 단일 세션에 집중하는 1M 토큰의 힘과, 세션을 초월하여 지식을 축적하는 로컬 영구 기억의 구조를 대조합니다.
        </p>
      </div>

      {/* Visual Bar Comparison Chart Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              6대 핵심 지표 역량 비교 차트
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              클라우드 초거대 컨텍스트(Meta Muse) vs 로컬 영구 자율성(OpenClaw)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-sky-700">
              <span className="w-3 h-3 rounded-md bg-sky-600"></span>
              Meta Muse
            </span>
            <span className="flex items-center gap-1.5 text-amber-700">
              <span className="w-3 h-3 rounded-md bg-amber-500"></span>
              OpenClaw
            </span>
          </div>
        </div>

        {/* Custom Bar Graphs */}
        <div className="space-y-4">
          {barComparison.map((item) => (
            <div key={item.label} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>{item.label}</span>
                <span className="text-slate-400 font-mono text-[11px]">지표: {item.unit}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Muse Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-sky-800 font-medium">Meta Muse</span>
                    <span className="font-bold text-sky-700 font-mono">{item.muse}점</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-sky-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.muse}%` }}
                    ></div>
                  </div>
                </div>

                {/* OpenClaw Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-amber-800 font-medium">OpenClaw</span>
                    <span className="font-bold text-amber-700 font-mono">{item.claw}점</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.claw}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive 30-Day Multi-Task Agent Simulation */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h4 className="text-base font-bold text-white">
                30일 연속 프로젝트 수행 시 기억 보존 시뮬레이터
              </h4>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              날짜가 지남에 따라 세션 휘발(Muse)과 벡터 데이터베이스 누적(OpenClaw)이 어떻게 작동하는지 관찰하세요.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-amber-300 font-bold bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
              현재 Day {simulationDay} 진행 중
            </span>
          </div>
        </div>

        {/* Day Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-300">
            <span>Day 1 (초기 셋업)</span>
            <span>Day 7 (프로젝트 진행)</span>
            <span>Day 15 (복잡도 심화)</span>
            <span>Day 30 (장기 운영)</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={simulationDay}
            onChange={(e) => setSimulationDay(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Simulation Output Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Muse State */}
          <div className="p-4 rounded-2xl bg-white/5 border border-sky-400/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-300">☁️ Meta Muse (Context Window 중심)</span>
              <span className="text-[10px] bg-sky-500/20 text-sky-200 px-2 py-0.5 rounded border border-sky-400/40">
                세션 휘발형 (Stateless)
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300 text-[11px]">
                <span>단일 세션 내 프롬프트 처리력:</span>
                <span className="font-bold text-sky-300">{museContextUsage}% (1M 여유)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-sky-400 h-full rounded-full" style={{ width: `${museContextUsage}%` }}></div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300 text-[11px]">
                <span>과거 {simulationDay}일간 실수/습관 회상률:</span>
                <span className="font-bold text-slate-400">{museCumulativeRecall}% (제한적)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-slate-500 h-full rounded-full" style={{ width: `${museCumulativeRecall}%` }}></div>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
              {simulationDay > 10
                ? '새 세션을 열 때마다 지난주의 파일 수정 규칙이나 사용자의 특정 코드 컨벤션을 다시 프롬프트에 주입해야 합니다.'
                : '당일 작업에서는 1M 토큰으로 방대한 코드를 통째로 읽고 신속하게 처리합니다.'}
            </p>
          </div>

          {/* OpenClaw State */}
          <div className="p-4 rounded-2xl bg-white/5 border border-amber-400/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300">💻 OpenClaw (Persistent Vector Memory)</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded border border-amber-400/40">
                영구 축적형 (Stateful)
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300 text-[11px]">
                <span>단일 턴 컨텍스트 잔여량:</span>
                <span className="font-bold text-amber-300">{openclawContextUsage}% (슬라이딩 요약)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: `${openclawContextUsage}%` }}></div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300 text-[11px]">
                <span>과거 {simulationDay}일간 실패 극복 & 선호도 회상률:</span>
                <span className="font-bold text-emerald-400">{openclawCumulativeRecall}% (완전 체화)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${openclawCumulativeRecall}%` }}></div>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
              {simulationDay > 10
                ? `ChromaDB와 SOUL.md에 Day ${simulationDay} 동안 겪었던 린트 에러, DB 스키마 특징, 사용자의 말투가 완벽히 저장되어 지시 없이도 맞춤형으로 실행합니다.`
                : '초기 셋업 과정에서 사용자의 시스템 환경과 취향을 로컬 데이터베이스에 인덱싱합니다.'}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Side-by-Side Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-slate-700" />
          상세 기술 사양 대조표
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">평가 항목</th>
                <th className="py-3 px-3 text-sky-700">Meta Muse</th>
                <th className="py-3 px-3 text-amber-700">OpenClaw</th>
                <th className="py-3 px-3 text-center">우위 판정</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {COMPARISON_DIMENSIONS.map((dim) => (
                <tr key={dim.dimension} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-3 font-bold text-slate-800">{dim.dimension}</td>
                  <td className="py-3.5 px-3 text-slate-600 leading-relaxed">{dim.museDetail}</td>
                  <td className="py-3.5 px-3 text-slate-600 leading-relaxed">{dim.clawDetail}</td>
                  <td className="py-3.5 px-3 text-center font-bold">
                    {dim.winner === 'muse' ? (
                      <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px]">
                        Muse 우위
                      </span>
                    ) : dim.winner === 'openclaw' ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px]">
                        OpenClaw 우위
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px]">
                        동률
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
