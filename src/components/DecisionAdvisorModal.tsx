import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight, RotateCcw, Cpu, Terminal, Sparkles, Layers } from 'lucide-react';

interface DecisionAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DecisionAdvisorModal: React.FC<DecisionAdvisorModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    purpose: '',
    techLevel: '',
    compliance: ''
  });

  if (!isOpen) return null;

  const handleSelect = (key: 'purpose' | 'techLevel' | 'compliance', value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (step < 3) {
      setStep(step + 1);
    } else {
      setStep(4); // result
    }
  };

  const handleReset = () => {
    setStep(1);
    setAnswers({ purpose: '', techLevel: '', compliance: '' });
  };

  // Determine recommendation
  let winner: 'muse' | 'openclaw' | 'hybrid' = 'muse';
  let title = '메타 뮤즈 (Meta Muse)';
  let reason = '';

  if (answers.techLevel === 'expert' && (answers.purpose === 'dev' || answers.compliance === 'local')) {
    winner = 'openclaw';
    title = '오픈클로 (OpenClaw) 권장';
    reason = '로컬 터미널 쉘에 대한 직접 제어와 민감한 사내 코드 및 환경변수를 외부 클라우드로 전송하지 않는 데이터 주권이 최우선이므로, 오픈클로가 최적의 선택입니다.';
  } else if (answers.techLevel === 'beginner' || answers.purpose === 'business') {
    winner = 'muse';
    title = '메타 뮤즈 (Meta Muse) 권장';
    reason = '별도 Docker 인프라나 API 키 관리 없이 브라우저와 모바일에서 즉시 비동기 워크플로우를 위임할 수 있으며, eBPF 센티넬이 금융 결제와 이메일 발송을 턴키로 보호합니다.';
  } else {
    winner = 'hybrid';
    title = '하이브리드 오케스트레이션 권장';
    reason = '고수준 리서치, 다단계 일정 관리 및 웹 조사는 메타 뮤즈에 위임하고, 로컬 파일 빌드 및 내부 DB 쿼리는 오픈클로를 통해 실행하는 듀얼 에이전트 구조를 추천합니다.';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">에이전트 선택 진단 컨설턴트</h3>
              <p className="text-xs text-slate-300">3가지 질문으로 최적의 에이전트 아키텍처 도출</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">질문 1 / 3</div>
              <h4 className="font-bold text-slate-900 text-base">에이전트를 도입하려는 핵심 목적은 무엇인가요?</h4>
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleSelect('purpose', 'business')}
                  className="w-full text-left p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-xs font-semibold text-slate-800 transition flex items-center justify-between"
                >
                  <span>일정 조율, 시장 조사, 이메일 요약 및 일상 업무 자동화</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => handleSelect('purpose', 'dev')}
                  className="w-full text-left p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-xs font-semibold text-slate-800 transition flex items-center justify-between"
                >
                  <span>코드 리팩토링, GitHub PR 자동화, 터미널 쉘 스크립트 실행</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => handleSelect('purpose', 'enterprise')}
                  className="w-full text-left p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-xs font-semibold text-slate-800 transition flex items-center justify-between"
                >
                  <span>사내 데이터베이스(SQL) 연동 및 대규모 비즈니스 분석</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">질문 2 / 3</div>
              <h4 className="font-bold text-slate-900 text-base">기술 인프라 및 환경 설정 친숙도는 어느 정도인가요?</h4>
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleSelect('techLevel', 'beginner')}
                  className="w-full text-left p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-xs font-semibold text-slate-800 transition flex items-center justify-between"
                >
                  <span>복잡한 설정 없이 웹/모바일 앱으로 즉시 로그인하여 사용 희망</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => handleSelect('techLevel', 'expert')}
                  className="w-full text-left p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-xs font-semibold text-slate-800 transition flex items-center justify-between"
                >
                  <span>Node.js, Docker, 터미널 CLI 구동 및 직접 API 키 연동 가능</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">질문 3 / 3</div>
              <h4 className="font-bold text-slate-900 text-base">데이터 프라이버시 및 보안 규제 요구사항은 어떠한가요?</h4>
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleSelect('compliance', 'cloud')}
                  className="w-full text-left p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-xs font-semibold text-slate-800 transition flex items-center justify-between"
                >
                  <span>메타의 클라우드 Micro-VM 샌드박스 보안을 신뢰하며 외부 연동 선호</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => handleSelect('compliance', 'local')}
                  className="w-full text-left p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-xs font-semibold text-slate-800 transition flex items-center justify-between"
                >
                  <span>사내 기밀 데이터가 외부 클라우드로 나가면 안 되며 로컬 구동 필수</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 text-center py-2">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
                {winner === 'muse' ? <Cpu className="w-7 h-7" /> : winner === 'openclaw' ? <Terminal className="w-7 h-7" /> : <Layers className="w-7 h-7" />}
              </div>

              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">추천 분석 결과</span>
                <h4 className="text-xl font-black text-slate-900 mt-1">{title}</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed px-4">{reason}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>다시 진단하기</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
                >
                  리포트로 돌아가기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
