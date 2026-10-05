import React, { useState } from 'react';
import { Terminal, Cloud, Settings, Copy, Check, Download, ShieldCheck, Key, ExternalLink, Cpu } from 'lucide-react';

interface SetupGuideSectionProps {
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const SetupGuideSection: React.FC<SetupGuideSectionProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'muse' | 'openclaw' | 'generator'>('muse');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Config generator form state
  const [agentName, setAgentName] = useState('Nexus-Autonomous-Core');
  const [modelChoice, setModelChoice] = useState('claude-3-7-sonnet-20250219');
  const [enableExecApproval, setEnableExecApproval] = useState(true);
  const [enableEgressFilter, setEnableEgressFilter] = useState(true);
  const [enableVectorDb, setEnableVectorDb] = useState(true);

  const copyToClipboard = (text: string, keyLabel: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyLabel);
    onShowToast(`클립보드에 복사되었습니다: ${keyLabel}`, 'success');
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const generatedSoulMd = `# SOUL.md - Autonomous Operational Directive
name: "${agentName}"
version: "2026.4"
architecture: "hybrid-reactive-deliberative"

## 1. Prime Directives & Safety Boundary
- Never execute shell scripts or system modifications without explicit user approval (${enableExecApproval ? 'exec.approval: true [ENFORCED]' : 'exec.approval: false [HIGH RISK]'}).
- Do NOT exfiltrate credentials, .env files, or private keys to external endpoints.
- If user instructions contain ambiguous risk, initiate the Reciprocal Clarification Protocol.

## 2. Memory & Episodic Reflection
- Storage Engine: ${enableVectorDb ? 'ChromaDB Local Vector Embeddings (Persistent)' : 'Stateless Window'}
- Persist: Successful refactor solutions, user tone preference, tool call latencies.

## 3. Tool Calling Verification
- Always sanitize arguments before invocation.
- Sandboxing: NVIDIA OpenShell Container Isolation.
`;

  const generatedConfigJson = JSON.stringify(
    {
      agent_id: agentName.toLowerCase().replace(/\s+/g, '-'),
      model: modelChoice,
      runtime: {
        host: '127.0.0.1',
        port: 18789,
        security: {
          require_token_handshake: true,
          cswsh_protection: true,
          exec_approval: enableExecApproval,
          egress_filtering: enableEgressFilter
        }
      },
      memory: {
        engine: enableVectorDb ? 'chroma_local' : 'in_memory',
        path: '~/.openclaw/storage/memory_vectors'
      },
      mcp_servers: ['filesystem', 'postgres', 'telegram_gateway']
    },
    null,
    2
  );

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast(`${filename} 파일이 다운로드되었습니다.`, 'success');
  };

  return (
    <section id="guide" className="space-y-8 pt-6">
      {/* Section Header */}
      <div className="border-l-4 border-slate-900 pl-4 space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800 uppercase tracking-wider">
            Deployment Handbook
          </span>
          <span className="text-xs text-slate-400 font-mono">Step-by-Step</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          플랫폼별 실전 셋업 & 보안 배포 매뉴얼
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
          메타 뮤즈의 국내 우회 활성화 절차와 오픈클로의 안전한 로컬 CLI 구축 가이드, 그리고 실전 검증된 설정 파일 생성기입니다.
        </p>
      </div>

      {/* Main Tab Wrapper */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('muse')}
            className={`flex-1 py-4 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'muse'
                ? 'text-sky-700 bg-sky-50/60 border-b-2 border-sky-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Cloud className="w-4 h-4 text-sky-600" />
            <span>메타 뮤즈 (한국 우회 & 턴키 셋업)</span>
          </button>
          <button
            onClick={() => setActiveTab('openclaw')}
            className={`flex-1 py-4 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'openclaw'
                ? 'text-amber-700 bg-amber-50/60 border-b-2 border-amber-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4 text-amber-600" />
            <span>오픈클로 (로컬 CLI & Docker 셋업)</span>
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex-1 py-4 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'generator'
                ? 'text-indigo-700 bg-indigo-50/60 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4 text-indigo-600" />
            <span>SOUL.md & Config 생성기</span>
          </button>
        </div>

        {/* Tab 1: Meta Muse Setup */}
        {activeTab === 'muse' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100 text-xs text-sky-950 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <b className="text-sky-900">2026.09 기준 국내 접속 안내:</b> 현재 메타 뮤즈는 미국 리전 대상 우선 롤아웃 중입니다. 국내 환경에서는 미국 IP VPN 및 해외 결제 프로필 우회가 필요합니다.
              </div>
            </div>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
                <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-sky-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                  1
                </span>
                <div className="space-y-1.5 flex-1">
                  <h5 className="font-bold text-slate-900 text-sm">네트워크 & 계정 리전 우회</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    미국 서부/동부 서버를 지원하는 VPN(Proton VPN, NordVPN 등)을 활성화합니다. 모바일 앱 사용 시 미국 Apple ID를 신규 생성하여 US App Store에서 다운로드합니다.
                  </p>
                  <div className="pt-1 text-[11px] text-slate-500">
                    💡 주의: 웹 접속 시 브라우저 시크릿 창(Incognito)에서 캐시 없이 접속해야 리전 판정 오류를 방지할 수 있습니다.
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
                <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-sky-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                  2
                </span>
                <div className="space-y-1.5 flex-1">
                  <h5 className="font-bold text-slate-900 text-sm">muse.ai 접속 및 온보딩 토큰 수령</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    공식 포털(<code className="bg-slate-200 px-1 py-0.5 rounded text-sky-800 font-mono">muse.ai</code>)에 접속하여 기존 Meta 계정으로 소셜 로그인합니다. 신규 가입 시 48시간 이내 초대 코드를 입력하면 10억 보너스 프로모션 토큰이 지급됩니다.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
                <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-sky-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                  3
                </span>
                <div className="space-y-1.5 flex-1">
                  <h5 className="font-bold text-slate-900 text-sm">커넥터 최소 권한 설정 (핵심 보안 수칙)</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono">Settings → Connectors</code> 메뉴에서 Google Workspace 및 외부 앱을 연동할 때 <b>쓰기/삭제(Write/Delete)</b> 권한을 배제하고 <b>읽기(Read-only)</b> 권한만 우선 부여합니다.
                  </p>
                  <div className="mt-2 p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-700">
                    🛡️ eBPF 센티넬이 백그라운드에서 상시 감시하므로, 결제나 메일 발송 등 가역성이 없는 행위는 사용자 확인 팝업을 거치게 됩니다.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: OpenClaw CLI Setup */}
        {activeTab === 'openclaw' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
                <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-amber-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                  1
                </span>
                <div className="space-y-2 flex-1">
                  <h5 className="font-bold text-slate-900 text-sm">전역 CLI 패키지 설치</h5>
                  <p className="text-xs text-slate-600">
                    Node.js v18 이상 및 Git이 구비된 환경에서 다음 명령어를 실행합니다:
                  </p>
                  <div className="p-3 bg-slate-950 text-amber-300 rounded-xl font-mono text-xs flex justify-between items-center">
                    <code>npm install -g openclaw</code>
                    <button
                      onClick={() => copyToClipboard('npm install -g openclaw', 'npm install -g openclaw')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 text-[11px]"
                    >
                      {copiedKey === 'npm install -g openclaw' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>복사</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
                <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-amber-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                  2
                </span>
                <div className="space-y-2 flex-1">
                  <h5 className="font-bold text-slate-900 text-sm">대화형 초기 설정 마법사 실행 (BYOK)</h5>
                  <p className="text-xs text-slate-600">
                    Anthropic API Key(Claude 3.7) 또는 OpenAI API Key 및 텔레그램 봇 토큰을 설정합니다:
                  </p>
                  <div className="p-3 bg-slate-950 text-amber-300 rounded-xl font-mono text-xs flex justify-between items-center">
                    <code>openclaw configure</code>
                    <button
                      onClick={() => copyToClipboard('openclaw configure', 'openclaw configure')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 text-[11px]"
                    >
                      {copiedKey === 'openclaw configure' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>복사</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
                <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-amber-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                  3
                </span>
                <div className="space-y-2 flex-1">
                  <h5 className="font-bold text-slate-900 text-sm">
                    NVIDIA OpenShell 격리 샌드박스에서 구동 (보안 권장)
                  </h5>
                  <p className="text-xs text-slate-600">
                    직접 호스트 쉘 대신 Docker 및 NVIDIA OpenShell 컨테이너 격리 모드로 데몬을 실행합니다:
                  </p>
                  <div className="p-3 bg-slate-950 text-amber-300 rounded-xl font-mono text-xs flex justify-between items-center">
                    <code>docker run -d --name openclaw-core -p 18789:18789 --security-opt seccomp=unconfined openclaw/runtime:latest</code>
                    <button
                      onClick={() => copyToClipboard('docker run -d --name openclaw-core -p 18789:18789 openclaw/runtime:latest', 'Docker Run')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 text-[11px]"
                    >
                      {copiedKey === 'Docker Run' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>복사</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Config Generator */}
        {activeTab === 'generator' && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Form controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">에이전트 인스턴스 명칭</label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">백엔드 추론 모델 (BYOK)</label>
                <select
                  value={modelChoice}
                  onChange={(e) => setModelChoice(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="claude-3-7-sonnet-20250219">Claude 3.7 Sonnet (Anthropic)</option>
                  <option value="gpt-5-turbo-2026">GPT-5 Turbo (OpenAI)</option>
                  <option value="llama-3.3-70b-instruct">Llama 3.3 70B (Local Ollama)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-700">보안 하드닝 옵션</label>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={enableExecApproval}
                      onChange={(e) => setEnableExecApproval(e.target.checked)}
                      className="accent-indigo-600 rounded"
                    />
                    <span>exec.approval: true (수동 승인)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={enableEgressFilter}
                      onChange={(e) => setEnableEgressFilter(e.target.checked)}
                      className="accent-indigo-600 rounded"
                    />
                    <span>외부 C2 네트워크 차단 필터</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Generated Code Previews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SOUL.md Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-800">SOUL.md (프롬프트 루트)</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => copyToClipboard(generatedSoulMd, 'SOUL.md')}
                      className="p-1 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium flex items-center gap-1 transition"
                    >
                      <Copy className="w-3 h-3" />
                      <span>복사</span>
                    </button>
                    <button
                      onClick={() => downloadFile(generatedSoulMd, 'SOUL.md')}
                      className="p-1 px-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-medium flex items-center gap-1 transition"
                    >
                      <Download className="w-3 h-3" />
                      <span>저장</span>
                    </button>
                  </div>
                </div>
                <pre className="p-4 bg-slate-950 text-indigo-200 rounded-2xl text-[11px] font-mono h-60 overflow-y-auto custom-scrollbar border border-slate-800">
                  {generatedSoulMd}
                </pre>
              </div>

              {/* openclaw.config.json Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-800">openclaw.config.json</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => copyToClipboard(generatedConfigJson, 'openclaw.config.json')}
                      className="p-1 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium flex items-center gap-1 transition"
                    >
                      <Copy className="w-3 h-3" />
                      <span>복사</span>
                    </button>
                    <button
                      onClick={() => downloadFile(generatedConfigJson, 'openclaw.config.json')}
                      className="p-1 px-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-medium flex items-center gap-1 transition"
                    >
                      <Download className="w-3 h-3" />
                      <span>저장</span>
                    </button>
                  </div>
                </div>
                <pre className="p-4 bg-slate-950 text-amber-200 rounded-2xl text-[11px] font-mono h-60 overflow-y-auto custom-scrollbar border border-slate-800">
                  {generatedConfigJson}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
