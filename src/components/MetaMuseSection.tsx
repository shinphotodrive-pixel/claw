import React, { useState } from 'react';
import { MUSE_SPECS, PRICING_TIERS } from '../data/reportData';
import { ShieldCheck, ShieldAlert, Cpu, ArrowRight, CheckCircle2, Lock, Sliders, Globe, Smartphone, RefreshCw, AlertCircle } from 'lucide-react';

interface MetaMuseSectionProps {
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const MetaMuseSection: React.FC<MetaMuseSectionProps> = ({ onShowToast }) => {
  // Calculator state
  const [weeklyTokens, setWeeklyTokens] = useState<number>(100); // in Millions
  const [billingPlatform, setBillingPlatform] = useState<'web' | 'ios'>('web');

  // Interactive Sentinel Simulation state
  const [simulatedAction, setSimulatedAction] = useState<'safe_summary' | 'payment_tainted' | 'email_blast'>('safe_summary');
  const [sentinelApproved, setSentinelApproved] = useState<boolean | null>(null);

  // Derive recommended tier
  const recommendedTier = weeklyTokens <= 100 
    ? PRICING_TIERS[0] 
    : weeklyTokens <= 500 
    ? PRICING_TIERS[1] 
    : PRICING_TIERS[2];

  // Raw API cost estimation comparison (assuming 70% input, 30% output tokens)
  // Input: $1.25/1M, Output: $4.25/1M -> Avg blended = (0.7 * 1.25 + 0.3 * 4.25) = $2.15 / 1M tokens
  const monthlyTokensM = weeklyTokens * 4.3;
  const rawApiCostEstimated = Math.round(monthlyTokensM * 2.15);
  const subscriptionCost = billingPlatform === 'web' ? recommendedTier.priceWeb : recommendedTier.priceIos;
  const savings = Math.max(0, rawApiCostEstimated - subscriptionCost);

  const handleTestSentinel = (actionKey: 'safe_summary' | 'payment_tainted' | 'email_blast') => {
    setSimulatedAction(actionKey);
    setSentinelApproved(null);
  };

  const handleApproveAction = () => {
    setSentinelApproved(true);
    onShowToast('eBPF 센티넬: 사용자의 명시적 디지털 서명으로 실행이 승인되었습니다.', 'success');
  };

  const handleRejectAction = () => {
    setSentinelApproved(false);
    onShowToast('eBPF 센티넬: 위험 작업이 차단되고 격리 VM 세션이 보호되었습니다.', 'warning');
  };

  return (
    <section id="muse" className="space-y-8 pt-6">
      {/* Section Header */}
      <div className="border-l-4 border-sky-600 pl-4 space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 uppercase tracking-wider">
            Cloud Turnkey Agent
          </span>
          <span className="text-xs text-slate-400 font-mono">2026.09 Flagship</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          메타 뮤즈(Meta Muse): 클라우드 자율 에이전트 심층 분석
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
          2026년 9월 8일 메타가 발표한 플래그십 AI 에이전트로, Muse Spark 1.3 멀티모달 모델, 무중단 백그라운드 구동 커넥터(Connectors), 그리고 eBPF 기반 센티넬 이중 보안 아키텍처를 결합한 통합 생태계입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Spark 1.3 Core Specs */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Muse Spark 1.3 스펙</h4>
            </div>
            <span className="text-[11px] bg-sky-50 text-sky-700 font-semibold px-2 py-0.5 rounded-full border border-sky-200">
              최상위 1M
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">컨텍스트 윈도우</span>
              <span className="font-bold text-slate-900 font-mono">1,048,576 토큰 (1M)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">지원 모달리티</span>
              <span className="font-bold text-slate-900 text-right">텍스트, 고화질 이미지, 영상, PDF</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">API 입력 단가</span>
              <span className="font-bold text-sky-700 font-mono">$1.25 / 1M 토큰</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">API 출력 단가</span>
              <span className="font-bold text-sky-700 font-mono">$4.25 / 1M 토큰</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Design Arena 순위</span>
              <span className="font-bold text-slate-900">지능 8위 / 에이전트 5위</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 font-medium">도구 호출 정밀도</span>
              <span className="font-bold text-emerald-600 font-mono">94.8% (불필요 호출 -20%)</span>
            </div>
          </div>

          <div className="p-3.5 bg-sky-50/70 rounded-2xl border border-sky-100 text-xs text-sky-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-sky-900">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>양방향 역질문 프로토콜 (Clarification)</span>
            </div>
            <p className="text-[11px] text-sky-800 leading-relaxed">
              사용자 지시가 모호하거나 잠재적 사이드 이펙트(결제, 문서 수정 등)가 감지되면 독단적으로 추론하지 않고 즉시 역질문 모달을 띄워 의도를 확인합니다.
            </p>
          </div>
        </div>

        {/* Card 2: Connectors & eBPF Sentinel Defense Visualizer */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">커넥터 & eBPF 센티넬 이중 보안</h4>
            </div>
            <span className="text-[11px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
              Kernel Level
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            모든 에이전트는 <b>Muse Secure VM</b>이라는 전용 마이크로 격리 환경에서 구동되며, 리눅스 eBPF 커널 프로브를 통해 데이터 오염(Taint Tracking)을 실시간 추적합니다.
          </p>

          {/* Interactive Sentinel Action Simulator */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                센티넬 오염 추적 시뮬레이터
              </span>
              <span className="text-[10px] font-mono text-slate-400">eBPF Probe: Active</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-medium">
              <button
                onClick={() => handleTestSentinel('safe_summary')}
                className={`p-2 rounded-lg border transition text-center ${
                  simulatedAction === 'safe_summary'
                    ? 'bg-sky-600 text-white border-sky-400 font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                1. 문서 읽기 요약
              </button>
              <button
                onClick={() => handleTestSentinel('payment_tainted')}
                className={`p-2 rounded-lg border transition text-center ${
                  simulatedAction === 'payment_tainted'
                    ? 'bg-rose-600 text-white border-rose-400 font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                2. 외부 결제 예약
              </button>
              <button
                onClick={() => handleTestSentinel('email_blast')}
                className={`p-2 rounded-lg border transition text-center ${
                  simulatedAction === 'email_blast'
                    ? 'bg-amber-600 text-white border-amber-400 font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                3. 일괄 이메일 발송
              </button>
            </div>

            {/* Simulation Result */}
            <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 text-xs space-y-2">
              {simulatedAction === 'safe_summary' && (
                <div className="text-emerald-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    안전: 순수 읽기(Read-only) 트랜잭션
                  </span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                    자동 승인 통과
                  </span>
                </div>
              )}

              {simulatedAction === 'payment_tainted' && (
                <div className="space-y-2">
                  <div className="text-rose-400 flex items-center gap-1.5 font-bold">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>eBPF Taint 경보: 비가역 금융 트랜잭션 감지</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    외부 사이트에서 스크래핑한 쿠폰 코드로 $240 결제를 진행하려 합니다. 사용자의 2차 생체 인증/서명이 강제됩니다.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleApproveAction}
                      disabled={sentinelApproved !== null}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition disabled:opacity-50"
                    >
                      사용자 서명 승인
                    </button>
                    <button
                      onClick={handleRejectAction}
                      disabled={sentinelApproved !== null}
                      className="px-3 py-1 bg-rose-700 hover:bg-rose-600 text-white text-[11px] font-bold rounded-lg transition disabled:opacity-50"
                    >
                      위험 차단 및 격리
                    </button>
                  </div>
                </div>
              )}

              {simulatedAction === 'email_blast' && (
                <div className="space-y-2">
                  <div className="text-amber-300 flex items-center gap-1.5 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>eBPF 경보: 대량 외부 아웃바운드 이메일 발송 시도</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Gmail 커넥터를 통해 35명에게 초대장을 자동 전송하려 합니다. Taint 추적기가 수신자 목록 승인을 요구합니다.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleApproveAction}
                      disabled={sentinelApproved !== null}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition disabled:opacity-50"
                    >
                      목록 확인 후 전송
                    </button>
                    <button
                      onClick={handleRejectAction}
                      disabled={sentinelApproved !== null}
                      className="px-3 py-1 bg-rose-700 hover:bg-rose-600 text-white text-[11px] font-bold rounded-lg transition disabled:opacity-50"
                    >
                      전송 취소
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Interactive Tier & Token Calculator */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <Sliders className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">요금제 & 비용 시뮬레이터</h4>
            </div>
            {/* Platform switcher */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
              <button
                onClick={() => setBillingPlatform('web')}
                className={`px-2 py-1 rounded-md transition flex items-center gap-1 ${
                  billingPlatform === 'web' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
              >
                <Globe className="w-3 h-3" />
                웹 (스트라이프)
              </button>
              <button
                onClick={() => setBillingPlatform('ios')}
                className={`px-2 py-1 rounded-md transition flex items-center gap-1 ${
                  billingPlatform === 'ios' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                iOS (인앱결제)
              </button>
            </div>
          </div>

          {/* Slider input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">주간 예상 토큰 사용량:</span>
              <span className="font-bold text-sky-700 font-mono text-sm">
                {weeklyTokens < 1000 ? `${weeklyTokens}M` : `${(weeklyTokens / 1000).toFixed(2)}B`} 토큰
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="3500"
              step="50"
              value={weeklyTokens}
              onChange={(e) => setWeeklyTokens(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>50M (가벼운 작업)</span>
              <span>500M (전문 개발)</span>
              <span>3.5B (대규모 연속)</span>
            </div>
          </div>

          {/* Recommendation Box */}
          <div className="p-4 rounded-2xl border bg-gradient-to-br from-slate-50 to-sky-50/50 border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">최적 추천 요금제</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${recommendedTier.badgeClass}`}>
                {recommendedTier.name}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-slate-900">
                ${billingPlatform === 'web' ? recommendedTier.priceWeb : recommendedTier.priceIos}
                <span className="text-xs font-normal text-slate-500"> / 월</span>
              </div>
              <div className="text-right text-[11px] text-slate-500">
                한도: <span className="font-bold text-slate-800 font-mono">{recommendedTier.tokenLabel}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{recommendedTier.description}</p>

            {/* Savings estimation vs raw API */}
            <div className="pt-2 border-t border-slate-200/80 text-[11px] flex justify-between items-center">
              <span className="text-slate-500">동일 사용량 API 직호출 대비:</span>
              <span className="font-bold text-emerald-700 font-mono">
                {savings > 0 ? `약 $${savings.toLocaleString()} /월 절약` : 'Free 플랜 최적'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
