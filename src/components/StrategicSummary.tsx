import React from 'react';
import { Lightbulb, Shield, CheckCircle2, FileText, ExternalLink } from 'lucide-react';

export const StrategicSummary: React.FC = () => {
  return (
    <section className="space-y-6 pt-4">
      <div className="bg-gradient-to-br from-slate-100 via-amber-50/40 to-sky-50/40 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-800">
            <Lightbulb className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              종합 전략 제언 및 엔터프라이즈 거버넌스 가이드라인
            </h3>
            <p className="text-xs text-slate-500">
              사용자 페르소나별 도입 권고안 및 보안 규제(NIST / EU AI Act) 준수 원칙
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 leading-relaxed">
          {/* Card 1: Marketer & Individual */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-700 text-sm flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
                일반 개인 & 기획자 / 마케터
              </span>
              <span className="text-[10px] font-bold bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-200">
                Meta Muse 최적
              </span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              별도의 인프라 구축 및 API 키 관리 없이 즉각적인 업무 자동화 효과를 누릴 수 있는 <b>메타 뮤즈</b>를 추천합니다. 다만 Gmail 및 캘린더 커넥터 연동 시 초기 권한을 <b>읽기 전용</b>으로 설정하고, Sentinel 승인 알림 팝업의 내용(수신인, 금액)을 항상 교차 검증하십시오.
            </p>
          </div>

          {/* Card 2: Engineer & Enterprise */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-700 text-sm flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                소프트웨어 엔지니어 & 기밀 취급 기업
              </span>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                OpenClaw + Docker 권장
              </span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              사내 인하우스 코드, SSH 키, 내부 PostgreSQL 연동 등 데이터의 물리적 주권과 극단적 자율성이 필요할 경우 <b>오픈클로</b>가 필수적입니다. 단, 26%의 스킬 보안 취약점에 대비하여 반드시 <b>NVIDIA OpenShell 컨테이너 격리</b>와 <code>exec.approval: true</code>를 기본 활성화하십시오.
            </p>
          </div>
        </div>

        {/* Global Compliance Frameworks */}
        <div className="p-4 bg-white/80 rounded-2xl border border-slate-200/70 text-xs space-y-2">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>2026 글로벌 AI 에이전트 규제 표준 준수 체크포인트</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-600 pt-1">
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <b className="text-slate-900 block mb-0.5">OWASP Agentic Top 10</b>
              간접 프롬프트 인젝션 방어 및 미승인 쉘 실행 방지
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <b className="text-slate-900 block mb-0.5">NIST AI RMF</b>
              에이전트 의사결정 감사 로그 및 eBPF Taint 추적 보관
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <b className="text-slate-900 block mb-0.5">EU AI Act (High-Risk)</b>
              비가역적 금융/개인정보 처리 시 Human-in-the-loop 강제
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
