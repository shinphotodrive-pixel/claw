import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs py-10 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
        <div className="flex items-center justify-center gap-2 text-white font-bold text-sm">
          <span>⚡</span>
          <span>2026 차세대 자율형 AI 에이전트 심층 인텔리전스 리포트</span>
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed text-[11px]">
          메타 뮤즈(Meta Muse Spark 1.3) 및 오픈클로(OpenClaw v2.4.1) 아키텍처, eBPF 센티넬 및 시스코 탈로스(Cisco Talos) 보안 분석 기반 리포트 대시보드입니다.
        </p>
        <div className="text-[10px] text-slate-500 font-mono pt-2">
          Complies with OWASP Top 10 for Agentic Applications & NIST AI Risk Management Framework Standards
        </div>
      </div>
    </footer>
  );
};
