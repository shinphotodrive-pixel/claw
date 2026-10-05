import React, { useState } from 'react';
import { generateCostForecastPdf } from '../utils/generatePdfReport';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  Gauge,
  Cpu,
  Zap,
  HardDrive,
  Network,
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileDown,
  Loader2,
  TrendingUp,
  AlertTriangle,
  Sliders,
  Sparkles,
  Radio,
  ShieldCheck,
  Check,
  DollarSign,
  Coins,
  PiggyBank,
  CreditCard,
} from 'lucide-react';

// Context-dependent latency data (milliseconds) - Live vs Historical
const LATENCY_LIVE = [
  { context: '4K (간단 질의)', museTTFT: 240, openclawTTFT: 380, museTotal: 1200, openclawTotal: 1850 },
  { context: '32K (문서 분석)', museTTFT: 320, openclawTTFT: 620, museTotal: 2900, openclawTotal: 3800 },
  { context: '128K (코드 레포)', museTTFT: 580, openclawTTFT: 1450, museTotal: 5800, openclawTotal: 8400 },
  { context: '512K (대용량 데이터)', museTTFT: 950, openclawTTFT: 3800, museTotal: 11200, openclawTotal: 19800 },
  { context: '1M (초대형 세션)', museTTFT: 1420, openclawTTFT: 8200, museTotal: 18600, openclawTotal: 34500 },
];

const LATENCY_HISTORICAL = [
  { context: '4K (간단 질의)', museTTFT: 260, openclawTTFT: 410, museTotal: 1350, openclawTotal: 1980 },
  { context: '32K (문서 분석)', museTTFT: 340, openclawTTFT: 670, museTotal: 3100, openclawTotal: 4100 },
  { context: '128K (코드 레포)', museTTFT: 610, openclawTTFT: 1520, museTotal: 6200, openclawTotal: 8900 },
  { context: '512K (대용량 데이터)', museTTFT: 990, openclawTTFT: 4100, museTotal: 11900, openclawTotal: 21200 },
  { context: '1M (초대형 세션)', museTTFT: 1490, openclawTTFT: 8900, museTotal: 19500, openclawTotal: 36800 },
];

// Tool call round-trip latency comparison (milliseconds)
const TOOL_LATENCY_DATA = [
  { tool: '웹 검색 & 스크래핑', muse: 450, openclaw: 880, desc: 'Muse 전용 가속 인덱스 vs OpenClaw 로컬 브라우저 구동' },
  { tool: 'SQL 쿼리 & 파싱', muse: 320, openclaw: 120, desc: '로컬 Postgres 직접 소켓 접근 시 OpenClaw가 압도적 고속' },
  { tool: '파일 시스템 I/O', muse: 580, openclaw: 35, desc: 'Secure VM 업로드 지연 vs 로컬 NVMe 직접 Read/Write' },
  { tool: '외부 API 결제/메일', muse: 720, openclaw: 640, desc: 'Muse eBPF 센티넬 Taint 검사(80ms) vs 오픈클로 직호출' },
  { tool: '코드 린트 및 AST', muse: 890, openclaw: 210, desc: '로컬 ts-morph 파싱 시 OpenClaw의 극단적 저지연' },
];

// 60-Minute Host Resource Footprint Simulation (RAM in MB)
const RESOURCE_TIMELINE_LIVE = [
  { time: '0분 (대기)', museRam: 45, openclawRam: 180, museCpu: 1, openclawCpu: 4 },
  { time: '10분 (문서 인덱싱)', museRam: 52, openclawRam: 620, museCpu: 2, openclawCpu: 38 },
  { time: '20분 (벡터 검색)', museRam: 48, openclawRam: 1150, museCpu: 2, openclawCpu: 52 },
  { time: '30분 (멀티 도구 병렬)', museRam: 55, openclawRam: 1580, museCpu: 3, openclawCpu: 68 },
  { time: '40분 (코드 리팩토링)', museRam: 50, openclawRam: 1820, museCpu: 2, openclawCpu: 45 },
  { time: '50분 (백그라운드 지속)', museRam: 48, openclawRam: 1740, museCpu: 1, openclawCpu: 18 },
  { time: '60분 (정리 & 캐시)', museRam: 45, openclawRam: 1620, museCpu: 1, openclawCpu: 8 },
];

const RESOURCE_TIMELINE_HISTORICAL = [
  { time: '0분 (대기)', museRam: 42, openclawRam: 160, museCpu: 1, openclawCpu: 3 },
  { time: '10분 (문서 인덱싱)', museRam: 49, openclawRam: 580, museCpu: 2, openclawCpu: 32 },
  { time: '20분 (벡터 검색)', museRam: 46, openclawRam: 1080, museCpu: 2, openclawCpu: 48 },
  { time: '30분 (멀티 도구 병렬)', museRam: 51, openclawRam: 1490, museCpu: 3, openclawCpu: 62 },
  { time: '40분 (코드 리팩토링)', museRam: 48, openclawRam: 1710, museCpu: 2, openclawCpu: 40 },
  { time: '50분 (백그라운드 지속)', museRam: 45, openclawRam: 1650, museCpu: 1, openclawCpu: 15 },
  { time: '60분 (정리 & 캐시)', museRam: 42, openclawRam: 1540, museCpu: 1, openclawCpu: 6 },
];

// 12-Month Resource Consumption Projection Data (Monthly Scaling)
const TWELVE_MONTH_PROJECTION = [
  { month: '1M (초기)', museRam: 45, openclawRam: 480, museStress: 15, openclawStress: 28, openclawDbGb: 0.8 },
  { month: '2M', museRam: 46, openclawRam: 650, museStress: 15, openclawStress: 36, openclawDbGb: 1.9 },
  { month: '3M (확장)', museRam: 48, openclawRam: 920, museStress: 16, openclawStress: 48, openclawDbGb: 3.4 },
  { month: '4M', museRam: 47, openclawRam: 1250, museStress: 15, openclawStress: 58, openclawDbGb: 5.6 },
  { month: '5M', museRam: 49, openclawRam: 1620, museStress: 16, openclawStress: 68, openclawDbGb: 8.2 },
  { month: '6M (중기)', museRam: 50, openclawRam: 2050, museStress: 17, openclawStress: 76, openclawDbGb: 11.5 },
  { month: '7M (고도화)', museRam: 51, openclawRam: 2480, museStress: 17, openclawStress: 83, openclawDbGb: 15.2 },
  { month: '8M [임계근접]', museRam: 52, openclawRam: 2980, museStress: 18, openclawStress: 88, openclawDbGb: 19.8 }, // > 85% warning!
  { month: '9M [초과]', museRam: 52, openclawRam: 3520, museStress: 18, openclawStress: 92, openclawDbGb: 25.1 },
  { month: '10M', museRam: 54, openclawRam: 4100, museStress: 19, openclawStress: 95, openclawDbGb: 31.4 },
  { month: '11M', museRam: 55, openclawRam: 4650, museStress: 19, openclawStress: 97, openclawDbGb: 38.2 },
  { month: '12M (엔터프라이즈)', museRam: 56, openclawRam: 5240, museStress: 20, openclawStress: 99, openclawDbGb: 46.0 },
];

// Past 6 Months Monthly Token Expenditure Trends Data (May ~ Oct 2026)
const SIX_MONTH_COST_TREND = [
  {
    month: '5월',
    metaMuse: 16,
    openClaw: 42,
    museRawApi: 85,
    tokensM: 75,
  },
  {
    month: '6월',
    metaMuse: 16,
    openClaw: 78,
    museRawApi: 172,
    tokensM: 160,
  },
  {
    month: '7월',
    metaMuse: 16,
    openClaw: 145,
    museRawApi: 340,
    tokensM: 320,
  },
  {
    month: '8월 (초과)',
    metaMuse: 16,
    openClaw: 260,
    museRawApi: 590,
    tokensM: 580,
  },
  {
    month: '9월',
    metaMuse: 16,
    openClaw: 340,
    museRawApi: 820,
    tokensM: 780,
  },
  {
    month: '10월 (현재)',
    metaMuse: 16,
    openClaw: 415,
    museRawApi: 1010,
    tokensM: 950,
  },
];

// System stress radar data (Scale 0 to 100)
const SYSTEM_STRESS_RADAR_LIVE = [
  { metric: '호스트 CPU 점유율', muse: 8, openclaw: 78, fullMark: 100 },
  { metric: '호스트 RAM 소모량', muse: 5, openclaw: 88, fullMark: 100 }, // Trigger > 85%
  { metric: '로컬 디스크 I/O', muse: 12, openclaw: 82, fullMark: 100 },
  { metric: '네트워크 아웃바운드', muse: 25, openclaw: 70, fullMark: 100 },
  { metric: '노트북 배터리 소모', muse: 15, openclaw: 89, fullMark: 100 }, // Trigger > 85%
  { metric: '실행 응답 즉각성', muse: 92, openclaw: 68, fullMark: 100 },
];

const SYSTEM_STRESS_RADAR_HISTORICAL = [
  { metric: '호스트 CPU 점유율', muse: 7, openclaw: 72, fullMark: 100 },
  { metric: '호스트 RAM 소모량', muse: 5, openclaw: 82, fullMark: 100 },
  { metric: '로컬 디스크 I/O', muse: 10, openclaw: 76, fullMark: 100 },
  { metric: '네트워크 아웃바운드', muse: 22, openclaw: 65, fullMark: 100 },
  { metric: '노트북 배터리 소모', muse: 14, openclaw: 81, fullMark: 100 },
  { metric: '실행 응답 즉각성', muse: 90, openclaw: 66, fullMark: 100 },
];

interface WorkloadProfile {
  id: string;
  name: string;
  taskDesc: string;
  museTime: string;
  clawTime: string;
  museRam: string;
  clawRam: string;
  museBandwidth: string;
  clawBandwidth: string;
  winner: 'muse' | 'openclaw' | 'tied';
  bottleneckAnalysis: string;
}

const WORKLOAD_PROFILES: WorkloadProfile[] = [
  {
    id: 'large_pdf',
    name: '100만 토큰 대형 문서 종합 분석 (1M Docs)',
    taskDesc: '500페이지 분량의 금융 연례 보고서 3종을 동시 인덱싱하여 다년간의 재무 수치 대조 분석',
    museTime: '18.6초',
    clawTime: '62.4초',
    museRam: '48 MB (브라우저 탭)',
    clawRam: '2,400 MB (로컬 임베딩 DB)',
    museBandwidth: '3.2 MB (UI 스트림)',
    clawBandwidth: '148 MB (API 송수신)',
    winner: 'muse',
    bottleneckAnalysis: '메타 뮤즈의 Spark 1.3 1M 네이티브 TPUs 분산 가속으로 지연 시간과 로컬 PC 부담이 거의 없습니다.'
  },
  {
    id: 'local_codebase',
    name: '로컬 코드베이스 전체 AST 리팩토링 (5,000 파일)',
    taskDesc: 'React 18 -> 19 마이그레이션 및 타입스크립트 엄격 모드 오류 120개 자동 수정 & Git PR 생성',
    museTime: '94.2초',
    clawTime: '22.8초',
    museRam: '55 MB',
    clawRam: '1,350 MB',
    museBandwidth: '85 MB (전체 파일 업로드)',
    clawBandwidth: '12 MB (순수 diff 토큰)',
    winner: 'openclaw',
    bottleneckAnalysis: '오픈클로는 로컬 NVMe SSD 및 MCP 파일시스템 도구에 직접 접근하므로 파일 업로드 지연 없이 압도적으로 빠릅니다.'
  },
  {
    id: 'background_monitor',
    name: '24시간 무중단 원격 서버 및 경쟁사 모니터링',
    taskDesc: '지정된 20개 엔드포인트의 가동 상태를 감시하고 이상 징후 감지 시 텔레그램 경보 발송',
    museTime: '24시간 지속 (클라우드 VM)',
    clawTime: '24시간 지속 (로컬 데몬)',
    museRam: '0 MB (PC 종료 가능)',
    clawRam: '950 MB (상시 백그라운드 구동)',
    museBandwidth: '1.2 MB / 일',
    clawBandwidth: '35 MB / 일',
    winner: 'muse',
    bottleneckAnalysis: 'PC를 꺼도 메타 클라우드 백그라운드 Micro-VM에서 자율 실행되므로 호스트 전력 소모가 0W입니다.'
  },
  {
    id: 'sql_pipeline',
    name: '사내 온프레미스 PostgreSQL 1,000만 건 정밀 분석',
    taskDesc: '방화벽 내부의 민감 고객 거래 테이블에서 복합 JOIN 쿼리 실행 후 리포트 시각화 생성',
    museTime: '수행 불가 (로컬망 접근 불가)',
    clawTime: '4.8초 (로컬 직접 쿼리)',
    museRam: 'N/A',
    clawRam: '480 MB',
    museBandwidth: 'N/A',
    clawBandwidth: '0.8 MB',
    winner: 'openclaw',
    bottleneckAnalysis: '폐쇄망 및 온프레미스 인프라는 클라우드 에이전트 진입이 차단되므로 로컬 MCP를 지닌 오픈클로가 유일한 해법입니다.'
  }
];

interface PerformanceMetricsSectionProps {
  onDownloadReport?: () => void;
  isDownloading?: boolean;
  onShowToast?: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const PerformanceMetricsSection: React.FC<PerformanceMetricsSectionProps> = ({
  onDownloadReport,
  isDownloading = false,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'latency' | 'resources' | 'projection' | 'cost' | 'simulator'>('cost');
  const [selectedWorkload, setSelectedWorkload] = useState<string>('large_pdf');
  const [viewMode, setViewMode] = useState<'live' | 'historical'>('live');
  const [warningThreshold, setWarningThreshold] = useState<number>(85);
  const [isExportingCostPdf, setIsExportingCostPdf] = useState(false);

  // Cost Simulator States
  const [monthlyTokens, setMonthlyTokens] = useState<number>(300); // Millions of tokens
  const [monthlyBudget, setMonthlyBudget] = useState<number>(150); // USD
  const [byokModel, setByokModel] = useState<'claude-3-7' | 'gpt-5-turbo' | 'llama-local'>('claude-3-7');
  const [tokenRatio, setTokenRatio] = useState<'balanced' | 'heavy_in' | 'heavy_out'>('balanced');

  const currentWorkload = WORKLOAD_PROFILES.find((w) => w.id === selectedWorkload) || WORKLOAD_PROFILES[0];

  // Pick dataset based on toggle
  const latencyData = viewMode === 'live' ? LATENCY_LIVE : LATENCY_HISTORICAL;
  const resourceTimelineData = viewMode === 'live' ? RESOURCE_TIMELINE_LIVE : RESOURCE_TIMELINE_HISTORICAL;
  const stressRadarData = viewMode === 'live' ? SYSTEM_STRESS_RADAR_LIVE : SYSTEM_STRESS_RADAR_HISTORICAL;

  // Threshold alert check: any stress metric exceeding warningThreshold (85%)
  const breachedMetrics = stressRadarData.filter((item) => item.openclaw >= warningThreshold || item.muse >= warningThreshold);
  const isThresholdBreached = breachedMetrics.length > 0;
  const maxStressValue = Math.max(...stressRadarData.map((item) => Math.max(item.openclaw, item.muse)));

  // Cost Calculation Engine
  const inRatio = tokenRatio === 'balanced' ? 0.7 : tokenRatio === 'heavy_in' ? 0.9 : 0.5;
  const outRatio = 1 - inRatio;
  const inputTokensM = monthlyTokens * inRatio;
  const outputTokensM = monthlyTokens * outRatio;

  // Meta Muse Subscription Tier determination
  let musePlanCost = 0;
  let musePlanName = 'Free Plan';
  if (monthlyTokens > 400 && monthlyTokens <= 2150) {
    musePlanCost = 16;
    musePlanName = 'Power Plan ($16/월)';
  } else if (monthlyTokens > 2150) {
    musePlanCost = 200;
    musePlanName = 'Maximum Plan ($200/월)';
  } else {
    musePlanName = 'Free Plan ($0/월)';
  }

  // Muse Raw API cost
  const museRawApiCost = Math.round(inputTokensM * 1.25 + outputTokensM * 4.25);
  const museSavings = Math.max(0, museRawApiCost - musePlanCost);

  // OpenClaw Model Pricing
  let byokInputRate = 3.0;
  let byokOutputRate = 15.0;
  let byokInfraCost = 0;
  if (byokModel === 'gpt-5-turbo') {
    byokInputRate = 2.5;
    byokOutputRate = 10.0;
  } else if (byokModel === 'llama-local') {
    byokInputRate = 0;
    byokOutputRate = 0;
    byokInfraCost = 40; // Host electricity & cloud VPS cost
  }

  const openClawApiCost = Math.round(inputTokensM * byokInputRate + outputTokensM * byokOutputRate);
  const openClawStorageCost = Math.round(monthlyTokens * 0.04);
  const openClawTotalCost = openClawApiCost + byokInfraCost + openClawStorageCost;

  // Budget comparison & alert trigger
  const highestEstimatedCost = Math.max(musePlanCost, openClawTotalCost);
  const isBudgetBreached = highestEstimatedCost > monthlyBudget;
  const budgetOverAmount = Math.max(0, highestEstimatedCost - monthlyBudget);
  const budgetOverPercent = Math.round((budgetOverAmount / monthlyBudget) * 100);
  const budgetUsagePercentClaw = Math.round((openClawTotalCost / monthlyBudget) * 100);
  const budgetUsagePercentMuse = Math.round((musePlanCost / monthlyBudget) * 100);

  // Tiered data for Cost Recharts BarChart
  const costTierChartData = [
    {
      tier: '50M (가벼운 작업)',
      musePlan: 0,
      museApi: Math.round(50 * inRatio * 1.25 + 50 * outRatio * 4.25),
      openClaw: Math.round(50 * inRatio * byokInputRate + 50 * outRatio * byokOutputRate + byokInfraCost + 2),
    },
    {
      tier: '250M (팀 협업)',
      musePlan: 0,
      museApi: Math.round(250 * inRatio * 1.25 + 250 * outRatio * 4.25),
      openClaw: Math.round(250 * inRatio * byokInputRate + 250 * outRatio * byokOutputRate + byokInfraCost + 10),
    },
    {
      tier: '750M (개발 자동화)',
      musePlan: 16,
      museApi: Math.round(750 * inRatio * 1.25 + 750 * outRatio * 4.25),
      openClaw: Math.round(750 * inRatio * byokInputRate + 750 * outRatio * byokOutputRate + byokInfraCost + 30),
    },
    {
      tier: '2,000M (엔터프라이즈)',
      musePlan: 16,
      museApi: Math.round(2000 * inRatio * 1.25 + 2000 * outRatio * 4.25),
      openClaw: Math.round(2000 * inRatio * byokInputRate + 2000 * outRatio * byokOutputRate + byokInfraCost + 80),
    },
  ];

  const handleExportCostReport = async () => {
    if (isExportingCostPdf) return;
    setIsExportingCostPdf(true);
    if (onShowToast) {
      onShowToast('월간 지출 예측 PDF 리포트를 생성 중입니다...', 'info');
    }
    try {
      await generateCostForecastPdf({
        monthlyTokens,
        monthlyBudget,
        byokModel,
        tokenRatio,
        inRatio,
        outRatio,
        inputTokensM,
        outputTokensM,
        musePlanCost,
        musePlanName,
        museRawApiCost,
        museSavings,
        openClawTotalCost,
        openClawApiCost,
        byokInfraCost,
        openClawStorageCost,
        highestEstimatedCost,
        isBudgetBreached,
        budgetOverAmount,
        budgetOverPercent,
        budgetUsagePercentClaw,
        budgetUsagePercentMuse,
        includeVisualCanvas: true,
        elementIdToCapture: 'cost-simulator-container',
      });
      if (onShowToast) {
        onShowToast('월간 지출 예측 PDF 리포트가 성공적으로 다운로드되었습니다.', 'success');
      }
    } catch (err) {
      console.error('Failed to export cost forecast PDF:', err);
      if (onShowToast) {
        onShowToast('PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.', 'warning');
      }
    } finally {
      setIsExportingCostPdf(false);
    }
  };

  return (
    <section id="performance" className="space-y-8 pt-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-l-4 border-emerald-600 pl-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              Hardware & Latency Benchmark
            </span>
            <span className="text-xs text-slate-400 font-mono">Recharts Engine</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            성능 벤치마크: 응답 지연 시간 & 12개월 스케일링 예측
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
            초거대 클라우드 인프라(Meta TPU Cluster)의 연산 가속 능력과 로컬 호스트(Local NVMe & MCP Direct Socket)의 자원 소모 추세를 실시간 및 12개월 장기 관점에서 분석합니다.
          </p>
        </div>

        {onDownloadReport && (
          <button
            onClick={onDownloadReport}
            disabled={isDownloading}
            className="self-start md:self-auto shrink-0 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs hover:shadow transition flex items-center gap-2 border border-slate-700 disabled:opacity-50"
            title="현재 벤치마크 및 대시보드 데이터를 PDF 리포트로 다운로드"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            ) : (
              <FileDown className="w-4 h-4 text-emerald-400" />
            )}
            <span>{isDownloading ? 'PDF 리포트 생성 중...' : '이해관계자 PDF 리포트 출력'}</span>
          </button>
        )}
      </div>

      {/* Control Bar: Live Metrics vs Historical Baseline Radio Toggle & Threshold Monitor Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Radio Button Group: Live vs Historical */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-indigo-600" />
            데이터 관점:
          </span>
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <label
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition ${
                viewMode === 'live'
                  ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-300 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <input
                type="radio"
                name="metricsView"
                value="live"
                checked={viewMode === 'live'}
                onChange={() => setViewMode('live')}
                className="hidden"
              />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>실시간 측정치 (Live Metrics)</span>
            </label>

            <label
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition ${
                viewMode === 'historical'
                  ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-300 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <input
                type="radio"
                name="metricsView"
                value="historical"
                checked={viewMode === 'historical'}
                onChange={() => setViewMode('historical')}
                className="hidden"
              />
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              <span>역대 기준선 (Historical Baseline)</span>
            </label>
          </div>
        </div>

        {/* Threshold Controller Slider */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 px-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-1.5 text-xs text-slate-700">
            <Sliders className="w-3.5 h-3.5 text-rose-600" />
            <span className="font-semibold">경고 임계치:</span>
            <span className="font-mono font-bold text-rose-600">{warningThreshold}%</span>
          </div>
          <input
            type="range"
            min="60"
            max="95"
            step="1"
            value={warningThreshold}
            onChange={(e) => setWarningThreshold(Number(e.target.value))}
            className="w-28 sm:w-36 accent-rose-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <span className="text-[10px] text-slate-400 font-mono">(기본 85%)</span>
        </div>
      </div>

      {/* Visual Warning Alert Banner when Resource Consumption Exceeds Threshold (> 85%) */}
      {isThresholdBreached && (
        <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-white p-4 sm:p-5 rounded-3xl shadow-lg border border-rose-600/50 animate-in fade-in duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-300 shrink-0 mt-0.5 animate-pulse">
              <AlertTriangle className="w-6 h-6 text-rose-400" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white tracking-wider uppercase">
                  RESOURCE WARNING &gt; {warningThreshold}%
                </span>
                <span className="font-bold text-sm text-rose-100">
                  자원 소모 임계치 초과 경보 감지 (피크: {maxStressValue}%)
                </span>
              </div>
              <p className="text-xs text-rose-200 leading-relaxed max-w-2xl">
                OpenClaw 호스트 머신에서 <b>{breachedMetrics.map((b) => `${b.metric}(${b.openclaw}%)`).join(', ')}</b> 항목이 안전 운영 기준선({warningThreshold}%)을 초과했습니다. 장기 실행 시 시스템 스로틀링 및 메모리 부족(OOM) 오류가 우려됩니다.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="p-2.5 bg-black/30 rounded-xl border border-white/10 text-[11px] text-rose-100">
              <b>스케일업 권고:</b> 최소 32GB RAM 증설 또는 cgroups 메모리 격리
            </div>
          </div>
        </div>
      )}

      {/* Main Tab Controller */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-200">
          <button
            onClick={() => setActiveTab('latency')}
            className={`flex-1 min-w-[130px] py-4 px-3 sm:px-6 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'latency'
                ? 'text-sky-700 bg-sky-50/60 border-b-2 border-sky-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Gauge className="w-4 h-4 text-sky-600" />
            <span>응답 지연 시간 (Latency)</span>
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex-1 min-w-[130px] py-4 px-3 sm:px-6 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'resources'
                ? 'text-amber-700 bg-amber-50/60 border-b-2 border-amber-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-4 h-4 text-amber-600" />
            <span>호스트 자원 소모량</span>
          </button>
          <button
            onClick={() => setActiveTab('projection')}
            className={`flex-1 min-w-[130px] py-4 px-3 sm:px-6 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'projection'
                ? 'text-indigo-700 bg-indigo-50/60 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>12개월 스케일링 예측 (Trend)</span>
          </button>
          <button
            onClick={() => setActiveTab('cost')}
            className={`flex-1 min-w-[130px] py-4 px-3 sm:px-6 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'cost'
                ? 'text-rose-700 bg-rose-50/60 border-b-2 border-rose-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Coins className="w-4 h-4 text-rose-600" />
            <span>비용 & 예산 시뮬레이터</span>
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex-1 min-w-[130px] py-4 px-3 sm:px-6 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'simulator'
                ? 'text-emerald-700 bg-emerald-50/60 border-b-2 border-emerald-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>실전 워크로드 시뮬레이터</span>
          </button>
        </div>

        {/* Tab 1: Latency View */}
        {activeTab === 'latency' && (
          <div className="p-6 sm:p-8 space-y-8">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-600" />
                    컨텍스트 크기별 전체 작업 완료 시간 (Total Task Latency, ms)
                  </h4>
                  <p className="text-xs text-slate-500">
                    현재 모드: <span className="font-bold text-indigo-700 font-mono">{viewMode === 'live' ? '실시간 라이브 벤치마크' : '3개월 집계 기준선'}</span> (낮을수록 고속)
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold self-start sm:self-auto">
                  <span className="flex items-center gap-1.5 text-sky-700">
                    <span className="w-3 h-3 rounded-md bg-sky-600"></span>
                    Meta Muse (Cloud TPU)
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-700">
                    <span className="w-3 h-3 rounded-md bg-amber-500"></span>
                    OpenClaw (Local + API)
                  </span>
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={latencyData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="context" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#cbd5e1' }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#cbd5e1' }} tickFormatter={(value) => `${value / 1000}s`} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const muse = payload.find((p) => p.dataKey === 'museTotal')?.value as number;
                          const claw = payload.find((p) => p.dataKey === 'openclawTotal')?.value as number;
                          return (
                            <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-700 text-xs space-y-1">
                              <p className="font-bold text-slate-300">{label}</p>
                              <p className="text-sky-300">Meta Muse: {(muse / 1000).toFixed(2)}초 ({muse}ms)</p>
                              <p className="text-amber-300">OpenClaw: {(claw / 1000).toFixed(2)}초 ({claw}ms)</p>
                              <p className="text-[10px] text-emerald-400 font-mono pt-1 border-t border-slate-700">
                                Muse가 {((claw / muse) * 100 - 100).toFixed(0)}% 더 빠른 완료율 기록
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="museTotal" name="Meta Muse" fill="#0284c7" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="openclawTotal" name="OpenClaw" fill="#d97706" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tool Calling Round-trip Latency */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    도구 호출(Tool Calling) 영역별 왕복 소요 시간 (ms)
                  </h4>
                  <p className="text-xs text-slate-500">
                    로컬 시스템(파일, SQL, 린트) 제어는 OpenClaw가 압도적 우위, 웹 탐색 및 대규모 검색은 Muse가 우위를 보입니다.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={TOOL_LATENCY_DATA} margin={{ top: 10, right: 20, left: 40, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                      <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} unit="ms" />
                      <YAxis type="category" dataKey="tool" tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }} width={90} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-700 text-xs space-y-1">
                                <p className="font-bold text-slate-200">{label}</p>
                                <p className="text-sky-300">Meta Muse: {payload[0].value}ms</p>
                                <p className="text-amber-300">OpenClaw: {payload[1].value}ms</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="muse" fill="#0284c7" radius={[0, 4, 4, 0]} name="Meta Muse" />
                      <Bar dataKey="openclaw" fill="#d97706" radius={[0, 4, 4, 0]} name="OpenClaw" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2">
                  {TOOL_LATENCY_DATA.map((t) => (
                    <div key={t.tool} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-800">{t.tool}</span>
                        <span className="font-mono text-[11px] text-slate-500">
                          Muse: <span className="text-sky-700">{t.muse}ms</span> vs Claw: <span className="text-amber-700">{t.openclaw}ms</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Resource Footprint View */}
        {activeTab === 'resources' && (
          <div className="p-6 sm:p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Area Chart: 60-min RAM usage */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-emerald-600" />
                    60분 지속 실행 시 호스트 메모리 점유율 (MB)
                  </h4>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">RAM Peak</span>
                </div>
                <p className="text-xs text-slate-500">
                  OpenClaw는 로컬 ChromaDB 벡터 인덱싱과 Node 런타임으로 인해 메모리가 증가하는 반면, Meta Muse는 클라우드 격리 실행으로 로컬 부담이 없습니다.
                </p>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={resourceTimelineData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                      <defs>
                        <linearGradient id="museRamGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="clawRamGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d97706" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 10 }} unit="MB" />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-700 text-xs space-y-1">
                                <p className="font-bold text-slate-300">{label}</p>
                                <p className="text-sky-300">Meta Muse 호스트 RAM: {payload[0].value} MB</p>
                                <p className="text-amber-300">OpenClaw 호스트 RAM: {payload[1].value} MB</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area type="monotone" dataKey="museRam" stroke="#0284c7" fillOpacity={1} fill="url(#museRamGrad)" name="Meta Muse" />
                      <Area type="monotone" dataKey="openclawRam" stroke="#d97706" fillOpacity={1} fill="url(#clawRamGrad)" name="OpenClaw" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Radar Chart: Multi-stress analysis */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    호스트 시스템 부하 6대 축 종합 레이더 차트
                  </h4>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">0~100 스케일</span>
                </div>
                <p className="text-xs text-slate-500">
                  빨간 선({warningThreshold}%)을 초과하는 항목은 주의가 필요합니다.
                </p>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={stressRadarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" tick={{ fontSize: 9 }} />
                      <Radar name="Meta Muse" dataKey="muse" stroke="#0284c7" fill="#0284c7" fillOpacity={0.3} />
                      <Radar name="OpenClaw" dataKey="openclaw" stroke="#d97706" fill="#d97706" fillOpacity={0.3} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 12-Month Resource Consumption Projection (Trend Line Chart) */}
        {activeTab === 'projection' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h4 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  향후 12개월 리소스 소모 및 하드웨어 스케일링 예측선
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  에이전트 사용량이 누적됨에 따라 발생하는 로컬 RAM 소모량(OpenClaw)과 클라우드 고정 요금(Muse)의 장기 트렌드를 비교합니다.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                  위험 임계선: {warningThreshold}% 설정 중
                </span>
              </div>
            </div>

            {/* Trend Line Chart using Recharts */}
            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TWELVE_MONTH_PROJECTION} margin={{ top: 15, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    unit="MB"
                    domain={[0, 6000]}
                    label={{ value: '호스트 RAM (MB)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    unit="%"
                    domain={[0, 100]}
                    label={{ value: '시스템 부하율 (%)', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 10 }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[200px]">
                            <p className="font-bold text-slate-300 border-b border-slate-700 pb-1">{label} 프로젝션</p>
                            <div className="flex justify-between">
                              <span className="text-sky-300">Meta Muse RAM:</span>
                              <span className="font-bold font-mono">{data.museRam} MB</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-amber-300">OpenClaw RAM:</span>
                              <span className="font-bold font-mono">{data.openclawRam} MB</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-rose-300">OpenClaw 시스템 부하:</span>
                              <span className="font-bold font-mono">{data.openclawStress}%</span>
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                              <span>로컬 Vector DB 누적:</span>
                              <span className="font-mono text-emerald-400 font-bold">{data.openclawDbGb} GB</span>
                            </div>
                            {data.openclawStress >= warningThreshold && (
                              <div className="text-[10px] text-rose-400 font-bold bg-rose-950/80 p-1.5 rounded mt-1 border border-rose-800">
                                ⚠️ 임계치({warningThreshold}%) 초과: 메모리 스케일업 권장
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />

                  {/* Reference Threshold Line */}
                  <ReferenceLine
                    yAxisId="right"
                    y={warningThreshold}
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    label={{
                      value: `위험 임계치 (${warningThreshold}%)`,
                      fill: '#ef4444',
                      fontSize: 10,
                      position: 'top',
                    }}
                  />

                  {/* Lines */}
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="openclawRam"
                    name="OpenClaw 호스트 RAM (MB)"
                    stroke="#d97706"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#d97706' }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="museRam"
                    name="Meta Muse 호스트 RAM (MB)"
                    stroke="#0284c7"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#0284c7' }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="openclawStress"
                    name="OpenClaw 부하 지수 (%)"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stakeholder Scaling Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
                <span className="font-bold text-amber-900 block">1. 8개월차 임계치 도달 경고</span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  OpenClaw는 8개월차에 ChromaDB 벡터 인덱스가 20GB에 육박하며 <b>시스템 부하 88%</b>로 임계선({warningThreshold}%)을 돌파합니다. 16GB RAM 표준 PC의 스케일업(32GB 전환)이 필수적입니다.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-1">
                <span className="font-bold text-sky-900 block">2. Meta Muse 무한 스케일링 안전성</span>
                <p className="text-[11px] text-sky-800 leading-relaxed">
                  12개월 동안 지속적으로 사용해도 로컬 호스트 RAM은 <b>56MB 내외</b>로 완벽히 평탄(Flat)하게 유지되며, 엔터프라이즈 하드웨어 증설 비용이 일체 발생하지 않습니다.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1">
                <span className="font-bold text-indigo-900 block">3. TCO(총소유비용) 분기점</span>
                <p className="text-[11px] text-indigo-800 leading-relaxed">
                  6개월 이후에는 오픈클로 호스트 서버 운영비 및 스토리지 관리 인건비가 Muse 구독 요금제($16/월)의 누적 비용을 상회하므로 엔터프라이즈에서는 하이브리드 도입을 권장합니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Cost & Budget Threshold Simulator */}
        {activeTab === 'cost' && (
          <div id="cost-simulator-container" className="p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
            {/* Header & Presets */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 uppercase tracking-wider">
                    OPEX & TCO Simulation
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Token Model Engine</span>
                </div>
                <h4 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2 mt-1">
                  <Coins className="w-5 h-5 text-rose-600" />
                  토큰 소비 기반 운영 비용(TCO) 추정 및 예산 임계치 시뮬레이터
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  월간 예상 토큰 규모와 모델별 요율을 바탕으로 비용을 예측하고, 예산 한도 초과 시 실시간 알림을 제공합니다.
                </p>
              </div>

              {/* Action Buttons: Presets + PDF Export */}
              <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0">
                {/* Quick Presets */}
                <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => {
                      setMonthlyTokens(80);
                      setMonthlyBudget(50);
                      setByokModel('claude-3-7');
                      setTokenRatio('balanced');
                    }}
                    className="px-2 py-1 rounded-lg hover:bg-white text-slate-700 text-[11px] font-bold transition"
                  >
                    개인 ($50)
                  </button>
                  <button
                    onClick={() => {
                      setMonthlyTokens(300);
                      setMonthlyBudget(150);
                      setByokModel('claude-3-7');
                      setTokenRatio('balanced');
                    }}
                    className="px-2 py-1 rounded-lg hover:bg-white text-slate-700 text-[11px] font-bold transition"
                  >
                    팀 ($150)
                  </button>
                  <button
                    onClick={() => {
                      setMonthlyTokens(1500);
                      setMonthlyBudget(800);
                      setByokModel('gpt-5-turbo');
                      setTokenRatio('balanced');
                    }}
                    className="px-2 py-1 rounded-lg hover:bg-white text-slate-700 text-[11px] font-bold transition"
                  >
                    엔터프라이즈 ($800)
                  </button>
                </div>

                {/* PDF Export Button */}
                <button
                  onClick={handleExportCostReport}
                  disabled={isExportingCostPdf}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold shadow-xs hover:shadow transition flex items-center gap-2 disabled:opacity-50"
                  title="현재 시뮬레이터 파라미터를 바탕으로 월간 지출 예측 리포트를 PDF로 내보내기"
                >
                  {isExportingCostPdf ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <FileDown className="w-4 h-4 text-white" />
                  )}
                  <span>{isExportingCostPdf ? 'PDF 생성 중...' : '지출 예측 PDF 리포트 내보내기'}</span>
                </button>
              </div>
            </div>

            {/* Interactive Parameter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              {/* Slider 1: Monthly Tokens */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">월간 예상 토큰 소모량</span>
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {monthlyTokens < 1000 ? `${monthlyTokens}M 토큰` : `${(monthlyTokens / 1000).toFixed(2)}B 토큰`}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="2500"
                  step="10"
                  value={monthlyTokens}
                  onChange={(e) => setMonthlyTokens(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>10M (경량)</span>
                  <span>1.0B (팀 단위)</span>
                  <span>2.5B (헤비)</span>
                </div>
              </div>

              {/* Slider 2: Monthly Budget Limit */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">월간 가용 예산 한도</span>
                  <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    ${monthlyBudget} / 월
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="2000"
                  step="10"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>$20 (최소)</span>
                  <span>$500 (표준)</span>
                  <span>$2,000 (기업)</span>
                </div>
              </div>

              {/* Select: OpenClaw BYOK Model */}
              <div className="space-y-2">
                <span className="font-bold text-slate-700 block">OpenClaw 백엔드 모델</span>
                <select
                  value={byokModel}
                  onChange={(e) => setByokModel(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="claude-3-7">Claude 3.7 Sonnet ($3 / $15)</option>
                  <option value="gpt-5-turbo">GPT-5 Turbo ($2.5 / $10)</option>
                  <option value="llama-local">Local Ollama Llama 3.3 70B (호스팅 $40)</option>
                </select>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {byokModel === 'llama-local' ? 'API 무료, 로컬 전기세/VPS 고정비' : '입력/출력 1M 토큰당 종량제'}
                </span>
              </div>

              {/* Select: Prompt I/O Ratio */}
              <div className="space-y-2">
                <span className="font-bold text-slate-700 block">토큰 I/O 입출력 비율</span>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => setTokenRatio('balanced')}
                    className={`p-1.5 rounded-lg border text-center transition ${
                      tokenRatio === 'balanced'
                        ? 'bg-slate-900 text-white border-slate-900 font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    70:30 (일반)
                  </button>
                  <button
                    onClick={() => setTokenRatio('heavy_in')}
                    className={`p-1.5 rounded-lg border text-center transition ${
                      tokenRatio === 'heavy_in'
                        ? 'bg-slate-900 text-white border-slate-900 font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    90:10 (문서)
                  </button>
                  <button
                    onClick={() => setTokenRatio('heavy_out')}
                    className={`p-1.5 rounded-lg border text-center transition ${
                      tokenRatio === 'heavy_out'
                        ? 'bg-slate-900 text-white border-slate-900 font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    50:50 (코드)
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 block font-mono">입력(Input) : 출력(Output)</span>
              </div>
            </div>

            {/* BUDGET ALERT / SAFE BANNER */}
            {isBudgetBreached ? (
              <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-white border border-rose-600/60 shadow-xl space-y-3 animate-in fade-in duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-300 shrink-0 mt-0.5 animate-pulse">
                      <AlertTriangle className="w-6 h-6 text-rose-400" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white tracking-wider uppercase">
                          BUDGET THRESHOLD EXCEEDED
                        </span>
                        <span className="font-bold text-sm text-rose-100">
                          월간 예산 초과 경보 (+${budgetOverAmount.toLocaleString()} / +{budgetOverPercent}% 초과)
                        </span>
                      </div>
                      <p className="text-xs text-rose-200 leading-relaxed max-w-3xl">
                        선택하신 조건에서 예상 운영 비용(최대 <b>${highestEstimatedCost.toLocaleString()}/월</b>)이 설정된 월 예산(<b>${monthlyBudget.toLocaleString()}</b>)을 초과했습니다.
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="text-[10px] text-rose-300 font-mono block">예산 소진율</span>
                    <span className="text-xl font-black text-rose-300 font-mono">
                      {Math.max(budgetUsagePercentClaw, budgetUsagePercentMuse)}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-900/80 rounded-full h-2.5 overflow-hidden border border-rose-800">
                  <div
                    className="bg-gradient-to-r from-amber-400 via-rose-500 to-rose-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(budgetUsagePercentClaw, budgetUsagePercentMuse))}%` }}
                  ></div>
                </div>

                <div className="pt-2 border-t border-rose-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-rose-200">
                  <div className="p-2 bg-black/20 rounded-xl">
                    💡 <b>Meta Muse 최적화 팁:</b> 종량제 대신 <b>Power 정액 플랜($16/월)</b>을 채택하면 초과 비용 없이 월 20억 토큰까지 안정적으로 운용할 수 있습니다.
                  </div>
                  <div className="p-2 bg-black/20 rounded-xl">
                    💡 <b>OpenClaw 최적화 팁:</b> 프롬프트 캐싱을 활성화하고, 단순 린트/검색 작업은 로컬 Llama 3 8B 모델로 라우팅하여 API 요금을 60% 절감할 수 있습니다.
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white border border-emerald-500/40 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 uppercase">
                        WITHIN BUDGET
                      </span>
                      <span className="font-bold text-sm text-emerald-100">
                        예산 내 안전 운영 (예산 잔여액: ${monthlyBudget - highestEstimatedCost})
                      </span>
                    </div>
                    <p className="text-xs text-emerald-200/80 mt-0.5">
                      예상 운영 비용(${highestEstimatedCost}/월)이 설정된 월 예산(${monthlyBudget})의 {Math.round((highestEstimatedCost / monthlyBudget) * 100)}% 수준으로 안정적입니다.
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block text-right">
                  <span className="text-[10px] text-emerald-300/80 font-mono block">예산 안전 여유</span>
                  <span className="text-xl font-black text-emerald-300 font-mono">
                    {Math.round(((monthlyBudget - highestEstimatedCost) / monthlyBudget) * 100)}% 여유
                  </span>
                </div>
              </div>
            )}

            {/* Cost Cards Grid (Meta Muse vs OpenClaw) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Meta Muse Cost Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-white to-sky-50/50 border border-sky-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">Meta Muse 예상 월 비용</span>
                  </div>
                  <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                    {musePlanName}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-3xl font-black text-slate-900 font-mono">${musePlanCost}</span>
                    <span className="text-xs text-slate-500 font-normal"> / 월 (고정 구독료)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">예산 대비 점유율</span>
                    <span className="font-mono font-bold text-sky-700 text-sm">{budgetUsagePercentMuse}%</span>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-sky-100 text-xs space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>동일 사용량 API 직호출 시:</span>
                    <span className="font-mono font-bold text-slate-800">${museRawApiCost.toLocaleString()} /월</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold border-t border-slate-100 pt-1.5">
                    <span>정액 플랜 채택 시 절감액:</span>
                    <span className="font-mono">약 ${museSavings.toLocaleString()} /월 절약</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  메타 뮤즈는 클라우드 정액제를 채택하므로 대량 토큰을 사용하더라도 추가 인프라 관리 비용이나 초과 청구 위험이 없습니다.
                </p>
              </div>

              {/* OpenClaw BYOK Cost Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-white to-amber-50/50 border border-amber-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                      <Coins className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">OpenClaw (BYOK) 예상 월 비용</span>
                  </div>
                  <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    {byokModel === 'llama-local' ? 'Local Llama' : byokModel === 'claude-3-7' ? 'Claude 3.7' : 'GPT-5'}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-3xl font-black text-slate-900 font-mono">${openClawTotalCost}</span>
                    <span className="text-xs text-slate-500 font-normal"> / 월 (실제 청구 추정치)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">예산 대비 점유율</span>
                    <span className={`font-mono font-bold text-sm ${budgetUsagePercentClaw > 100 ? 'text-rose-600' : 'text-amber-700'}`}>
                      {budgetUsagePercentClaw}%
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-amber-100 text-xs space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>LLM API 호출 토큰 요금:</span>
                    <span className="font-mono font-bold text-slate-800">${openClawApiCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>호스트 전기세 & 백그라운드 인프라:</span>
                    <span className="font-mono font-bold text-slate-800">${byokInfraCost}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 border-t border-slate-100 pt-1.5">
                    <span>ChromaDB 벡터 인덱싱 & 스토리지:</span>
                    <span className="font-mono font-bold text-slate-800">${openClawStorageCost}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  OpenClaw는 모델 공급자(Anthropic, OpenAI)의 사용량 기반으로 과금되므로, 복합 멀티턴 루프 실행 시 토큰 사용량 모니터링이 필수적입니다.
                </p>
              </div>
            </div>

            {/* Recharts Cost Comparison Chart Across Workload Tiers */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h5 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    토큰 사용량 구간별 월간 비용 비교 & 예산 기준선 (USD)
                  </h5>
                  <p className="text-xs text-slate-500">
                    붉은 점선은 설정하신 월간 예산 한도(${monthlyBudget})입니다.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold self-start sm:self-auto">
                  <span className="flex items-center gap-1.5 text-sky-700">
                    <span className="w-3 h-3 rounded-md bg-sky-600"></span>
                    Meta Muse 플랜
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-700">
                    <span className="w-3 h-3 rounded-md bg-amber-500"></span>
                    OpenClaw BYOK
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <span className="w-3 h-3 rounded-md bg-slate-400"></span>
                    Muse API 직호출
                  </span>
                </div>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costTierChartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="tier" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} unit="$" />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1.5">
                              <p className="font-bold text-slate-200 border-b border-slate-700 pb-1">{label}</p>
                              <p className="text-sky-300">Meta Muse 플랜: ${payload[0].value}/월</p>
                              <p className="text-amber-300">OpenClaw BYOK: ${payload[1].value}/월</p>
                              <p className="text-slate-300">Muse API 직호출: ${payload[2].value}/월</p>
                              <p className="text-rose-400 font-bold border-t border-slate-700 pt-1">
                                예산 한도: ${monthlyBudget}/월
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    {/* Budget Reference Line */}
                    <ReferenceLine
                      y={monthlyBudget}
                      stroke="#f43f5e"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      label={{
                        value: `월 예산 한도 ($${monthlyBudget})`,
                        fill: '#f43f5e',
                        fontSize: 10,
                        position: 'top',
                      }}
                    />
                    <Bar dataKey="musePlan" fill="#0284c7" name="Meta Muse 플랜" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="openClaw" fill="#d97706" name="OpenClaw BYOK" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="museApi" fill="#94a3b8" name="Muse API 직호출" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* PAST 6 MONTHS EXPENDITURE MULTI-LINE TREND CHART */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                      Historical 6-Month OPEX
                    </span>
                    <span className="text-xs text-slate-400 font-mono">2026.05 ~ 2026.10</span>
                  </div>
                  <h5 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2 mt-1">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    지난 6개월간 Meta Muse vs OpenClaw 월별 토큰 비용 지출 추이 (Multi-Line)
                  </h5>
                  <p className="text-xs text-slate-500 mt-0.5">
                    실제 프로덕션 환경에서 5월부터 10월까지 축적된 토큰 소모량에 따른 월별 청구액 추이를 비교합니다. Meta Muse는 고정 $16로 안정적인 반면, OpenClaw는 8월부터 예산($150)을 초과 돌파했습니다.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-bold self-start sm:self-auto">
                  <span className="flex items-center gap-1.5 text-sky-700">
                    <span className="w-3.5 h-1 rounded bg-sky-600"></span>
                    Meta Muse (고정 $16)
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-700">
                    <span className="w-3.5 h-1 rounded bg-amber-500"></span>
                    OpenClaw (BYOK 종량제)
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <span className="w-3.5 h-1 rounded border-b border-dashed border-slate-500"></span>
                    동일량 API 직호출 환산
                  </span>
                </div>
              </div>

              {/* Recharts LineChart */}
              <div className="h-80 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={SIX_MONTH_COST_TREND} margin={{ top: 15, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      unit="$"
                      domain={[0, 1100]}
                      label={{ value: '월 지출액 (USD)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const isBreached = data.openClaw > monthlyBudget;
                          return (
                            <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[220px]">
                              <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                                <span className="font-bold text-slate-200">{label} 실 청구 분석</span>
                                <span className="text-[10px] text-emerald-400 font-mono">{data.tokensM}M 토큰 처리</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sky-300">Meta Muse (구독):</span>
                                <span className="font-bold font-mono">${data.metaMuse}/월</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-amber-300">OpenClaw (종량제):</span>
                                <span className="font-bold font-mono">${data.openClaw}/월</span>
                              </div>
                              <div className="flex justify-between text-slate-400 text-[11px]">
                                <span>API 직호출 시 환산:</span>
                                <span className="font-mono">${data.museRawApi}/월</span>
                              </div>
                              <div className="flex justify-between pt-1 border-t border-slate-800 text-[11px]">
                                <span className="text-slate-400">현재 설정 예산:</span>
                                <span className="font-mono font-bold text-rose-300">${monthlyBudget}/월</span>
                              </div>
                              {isBreached && (
                                <div className="text-[10px] text-rose-400 font-bold bg-rose-950/80 p-1.5 rounded mt-1 border border-rose-800">
                                  ⚠️ 예산 초과: +${data.openClaw - monthlyBudget} (+{Math.round(((data.openClaw - monthlyBudget) / monthlyBudget) * 100)}%)
                                </div>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />

                    {/* Dynamic Monthly Budget Reference Line */}
                    <ReferenceLine
                      y={monthlyBudget}
                      stroke="#ef4444"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      label={{
                        value: `설정 월 예산 ($${monthlyBudget})`,
                        fill: '#ef4444',
                        fontSize: 10,
                        position: 'top',
                      }}
                    />

                    {/* OpenClaw BYOK Multi-Line */}
                    <Line
                      type="monotone"
                      dataKey="openClaw"
                      name="OpenClaw BYOK 실제 지출"
                      stroke="#d97706"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#d97706' }}
                      activeDot={{ r: 7 }}
                    />

                    {/* Meta Muse Flat Line */}
                    <Line
                      type="monotone"
                      dataKey="metaMuse"
                      name="Meta Muse Power 플랜 ($16)"
                      stroke="#0284c7"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#0284c7' }}
                      activeDot={{ r: 7 }}
                    />

                    {/* Muse Raw API Equivalent Line */}
                    <Line
                      type="monotone"
                      dataKey="museRawApi"
                      name="동일량 API 직호출 환산액"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 3, fill: '#94a3b8' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* 4 Summary Scorecards for the 6-Month Trend */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-1">
                  <span className="text-[10px] text-sky-700 font-bold uppercase block">Meta Muse 6개월 누적</span>
                  <div className="text-lg font-black text-sky-900 font-mono">$96 <span className="text-xs font-normal text-sky-700">(월 $16 고정)</span></div>
                  <p className="text-[10px] text-sky-800">변동성 0%, 5억 토큰/주 한도 내 예측 가능성 100%</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <span className="text-[10px] text-amber-700 font-bold uppercase block">OpenClaw 6개월 누적</span>
                  <div className="text-lg font-black text-amber-900 font-mono">$1,280 <span className="text-xs font-normal text-amber-700">(9.8배 급증)</span></div>
                  <p className="text-[10px] text-amber-800">5월 $42에서 10월 $415로 워크플로 확장 시 지출 급등</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase block">Meta Muse 총 절감액</span>
                  <div className="text-lg font-black text-emerald-900 font-mono">+$2,921 <span className="text-xs font-normal text-emerald-700">(96.8% 절약)</span></div>
                  <p className="text-[10px] text-emerald-800">직호출 API 총액($3,017) 대비 누적 비용 절감</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
                  <span className="text-[10px] text-rose-700 font-bold uppercase block">예산(${monthlyBudget}) 임계치 초과</span>
                  <div className="text-lg font-black text-rose-900 font-mono">8월부터 돌파 <span className="text-xs font-normal text-rose-700">($260)</span></div>
                  <p className="text-[10px] text-rose-800">10월 지출 $415는 현재 예산의 {Math.round((415 / monthlyBudget) * 100)}% 수준</p>
                </div>
              </div>
            </div>

            {/* Hidden Cost Factors & TCO Takeaway */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 block">1. 무중단 데몬 상시 구동 비용</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  OpenClaw를 24시간 가동하려면 상시 전력(월 $15~$25) 또는 AWS EC2/클라우드 VPS(월 $40~$80) 인프라 비용이 추가로 고정 발생합니다.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 block">2. 엔터프라이즈 정액제 유리성</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  월 500M 이상의 대규모 토큰을 연속 소비하는 팀은 종량제(BYOK)보다 메타 뮤즈의 <b>Power($16)</b> 또는 <b>Maximum($200)</b> 플랜이 최소 80% 이상 비용 효율적입니다.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 block">3. 로컬 Llama 70B의 손익분기</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  월 1.5B 토큰 이상을 처리할 경우 고성능 워크스테이션(RTX 4090/A6000)을 직접 구매하여 OpenClaw를 로컬 구동하는 것이 14개월 후 손익분기점(BEP)을 달성합니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Workload Simulator */}
        {activeTab === 'simulator' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-600" />
                현업 실전 시나리오별 성능 & 자원 소비 시뮬레이터
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                수행하려는 작업 유형을 선택하면 예상 처리 시간, 메모리 피크 및 병목 원인을 즉시 도출합니다.
              </p>
            </div>

            {/* Workload Presets Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {WORKLOAD_PROFILES.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setSelectedWorkload(w.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedWorkload === w.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-400/40'
                      : 'bg-slate-50/80 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-[10px] font-mono text-slate-400 font-bold mb-1">
                    SCENARIO #{w.id.toUpperCase().slice(0, 4)}
                  </div>
                  <div className="font-bold text-xs leading-snug line-clamp-2">{w.name}</div>
                </button>
              ))}
            </div>

            {/* Active Workload Detailed Metrics Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-6 shadow-lg border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
                      선택된 워크로드
                    </span>
                    <h5 className="font-bold text-base text-white">{currentWorkload.name}</h5>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{currentWorkload.taskDesc}</p>
                </div>
                <div className="shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    currentWorkload.winner === 'muse'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                  }`}>
                    {currentWorkload.winner === 'muse' ? '🏆 Meta Muse 추천' : '🏆 OpenClaw 추천'}
                  </span>
                </div>
              </div>

              {/* Side by side comparison cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Meta Muse Metrics */}
                <div className="p-4 rounded-2xl bg-white/5 border border-sky-400/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-sky-300">☁️ Meta Muse 예상 지표</span>
                    <span className="text-[10px] bg-sky-950 text-sky-200 px-2 py-0.5 rounded border border-sky-800 font-mono">
                      Cloud Accelerated
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="p-2.5 bg-slate-800/80 rounded-xl">
                      <div className="text-[10px] text-slate-400">완료 소요 시간</div>
                      <div className="font-mono font-bold text-sky-300 text-sm mt-0.5">{currentWorkload.museTime}</div>
                    </div>
                    <div className="p-2.5 bg-slate-800/80 rounded-xl">
                      <div className="text-[10px] text-slate-400">호스트 RAM 점유</div>
                      <div className="font-mono font-bold text-emerald-300 text-sm mt-0.5">{currentWorkload.museRam}</div>
                    </div>
                    <div className="p-2.5 bg-slate-800/80 rounded-xl">
                      <div className="text-[10px] text-slate-400">네트워크 대역폭</div>
                      <div className="font-mono font-bold text-slate-200 text-sm mt-0.5">{currentWorkload.museBandwidth}</div>
                    </div>
                  </div>
                </div>

                {/* OpenClaw Metrics */}
                <div className="p-4 rounded-2xl bg-white/5 border border-amber-400/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-300">💻 OpenClaw 예상 지표</span>
                    <span className="text-[10px] bg-amber-950 text-amber-200 px-2 py-0.5 rounded border border-amber-800 font-mono">
                      Local MCP Native
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="p-2.5 bg-slate-800/80 rounded-xl">
                      <div className="text-[10px] text-slate-400">완료 소요 시간</div>
                      <div className="font-mono font-bold text-amber-300 text-sm mt-0.5">{currentWorkload.clawTime}</div>
                    </div>
                    <div className="p-2.5 bg-slate-800/80 rounded-xl">
                      <div className="text-[10px] text-slate-400">호스트 RAM 점유</div>
                      <div className="font-mono font-bold text-rose-300 text-sm mt-0.5">{currentWorkload.clawRam}</div>
                    </div>
                    <div className="p-2.5 bg-slate-800/80 rounded-xl">
                      <div className="text-[10px] text-slate-400">네트워크 대역폭</div>
                      <div className="font-mono font-bold text-slate-200 text-sm mt-0.5">{currentWorkload.clawBandwidth}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottleneck Analysis */}
              <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs space-y-1">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  아키텍처 병목 분석 및 아키텍트 권고사항
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed pt-0.5">
                  {currentWorkload.bottleneckAnalysis}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INSTANT RECOMMENDATION CENTER ("추천해줘" 기능 연동 카드) */}
      <div id="recommendation-center" className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-900/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base sm:text-lg text-white">
                💡 실시간 맞춤 에이전트 추천 센터 (Persona Recommendation)
              </h4>
              <p className="text-xs text-indigo-200 mt-0.5">
                질문하신 상황에 따라 가장 이상적인 2026 자율 에이전트 선택 가이드를 즉시 확인하세요.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1 rounded-full self-start sm:self-auto">
            AI 진단 완료
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Marketer & PM */}
          <div className="p-5 rounded-2xl bg-white/5 border border-sky-400/30 hover:border-sky-400/60 transition space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/40">
                  기획 / 마케팅 / 일상 업무
                </span>
                <span className="text-xs font-mono font-bold text-sky-400">적합도 98%</span>
              </div>
              <h5 className="font-bold text-sm text-white flex items-center gap-1.5">
                <Check className="w-4 h-4 text-sky-400" />
                Meta Muse (Spark 1.3) 강력 추천
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                별도 터미널 명령어 설치나 인프라 관리 없이, 브라우저와 모바일에서 100만 토큰으로 24시간 백그라운드 리서치 및 문서 번역을 자율 수행합니다.
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 text-[11px] text-sky-300 font-medium flex items-center justify-between">
              <span>추천 요금제: Power ($16/월)</span>
              <a href="#muse" className="hover:underline flex items-center gap-0.5">상세보기 &rarr;</a>
            </div>
          </div>

          {/* Card 2: Developer & DevOps */}
          <div className="p-5 rounded-2xl bg-white/5 border border-amber-400/30 hover:border-amber-400/60 transition space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  개발자 / 엔지니어 / 쉘 제어
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">적합도 96%</span>
              </div>
              <h5 className="font-bold text-sm text-white flex items-center gap-1.5">
                <Check className="w-4 h-4 text-amber-400" />
                OpenClaw + Docker 샌드박스
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                로컬 소스코드 레포지토리, 온프레미스 PostgreSQL 쿼리, 터미널 스크립트 실행 등 시스템 완전 장악 및 데이터 주권이 필요할 때 가장 독보적입니다.
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 text-[11px] text-amber-300 font-medium flex items-center justify-between">
              <span>필수 설정: exec.approval: true</span>
              <a href="#openclaw" className="hover:underline flex items-center gap-0.5">상세보기 &rarr;</a>
            </div>
          </div>

          {/* Card 3: Enterprise & High-Security */}
          <div className="p-5 rounded-2xl bg-white/5 border border-indigo-400/30 hover:border-indigo-400/60 transition space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/40">
                  기업 기밀 / 금융 / 대규모 조직
                </span>
                <span className="text-xs font-mono font-bold text-indigo-400">적합도 94%</span>
              </div>
              <h5 className="font-bold text-sm text-white flex items-center gap-1.5">
                <Check className="w-4 h-4 text-indigo-400" />
                하이브리드 듀얼 에이전트 구축
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                고수준 웹 리서치와 요약은 Meta Muse Secure VM에 맡기고, 기밀 코드 리팩토링 및 내부 DB 분석은 NVIDIA OpenShell 격리 환경의 OpenClaw에 위임합니다.
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 text-[11px] text-indigo-300 font-medium flex items-center justify-between">
              <span>보안 표준: Cisco DefenseClaw</span>
              <a href="#security" className="hover:underline flex items-center gap-0.5">상세보기 &rarr;</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
