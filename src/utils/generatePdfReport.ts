import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface ReportSnapshotOptions {
  includeVisualCanvas?: boolean;
  performanceElementId?: string;
}

export async function generateStakeholderPdf(options: ReportSnapshotOptions = {}): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Header Banner (Dark Navy)
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Accent Line (Electric Blue / Emerald)
  doc.setFillColor(2, 132, 199); // #0284c7
  doc.rect(0, 38, pageWidth * 0.6, 2, 'F');
  doc.setFillColor(217, 119, 6); // #d97706
  doc.rect(pageWidth * 0.6, 38, pageWidth * 0.4, 2, 'F');

  // Title in Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('2026 AI Agent Intelligence & Performance Report', margin, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // #cbd5e1
  doc.text('Executive Benchmark Snapshot: Meta Muse (Spark 1.3) vs OpenClaw (Local MCP v2.4)', margin, 22);

  const currentDate = new Date().toISOString().split('T')[0];
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // #94a3b8
  doc.text(`Generated: ${currentDate} | Classification: Stakeholder Advisory | Standards: OWASP & NIST AI RMF`, margin, 30);

  let y = 48;

  // SECTION 1: Executive KPI Summary Cards
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Executive KPI & Benchmark Scorecard', margin, y);
  y += 5;

  const cardWidth = (contentWidth - 9) / 4;
  const kpis = [
    { label: 'Context Window', val: '1,048,576', sub: 'Muse Spark 1.3 (1M)', color: [2, 132, 199] },
    { label: 'Ecosystem Scale', val: '340,000+', sub: 'OpenClaw GitHub Stars', color: [217, 119, 6] },
    { label: 'Token Efficiency', val: '-25% Cost', sub: 'Tool Calling -20%', color: [5, 150, 105] },
    { label: 'Security Alert', val: '26% Vulnerable', sub: '1,184 ClawHub Skills', color: [225, 29, 72] },
  ];

  kpis.forEach((kpi, idx) => {
    const x = margin + idx * (cardWidth + 3);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, y, cardWidth, 20, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, y, cardWidth, 20, 2, 2, 'S');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, x + 3, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(kpi.color[0], kpi.color[1], kpi.color[2]);
    doc.text(kpi.val, x + 3, y + 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.sub, x + 3, y + 16);
  });

  y += 27;

  // SECTION 2: Latency & Response Speed Comparison Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Latency & Execution Speed Comparison (Lower is Better)', margin, y);
  y += 5;

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Workload Context', margin + 3, y + 4.2);
  doc.text('Meta Muse (Cloud TPU)', margin + 50, y + 4.2);
  doc.text('OpenClaw (Local + API)', margin + 95, y + 4.2);
  doc.text('Variance & Acceleration', margin + 140, y + 4.2);
  y += 6;

  const latencyRows = [
    { ctx: '4K Context (Simple Q&A / Routing)', muse: '1.20s (TTFT: 240ms)', claw: '1.85s (TTFT: 380ms)', diff: 'Muse 35% Faster' },
    { ctx: '32K Context (Report Analysis)', muse: '2.90s (TTFT: 320ms)', claw: '3.80s (TTFT: 620ms)', diff: 'Muse 24% Faster' },
    { ctx: '128K Context (Code Repository)', muse: '5.80s (TTFT: 580ms)', claw: '8.40s (TTFT: 1450ms)', diff: 'Muse 31% Faster' },
    { ctx: '512K Context (Enterprise Data)', muse: '11.20s (TTFT: 950ms)', claw: '19.80s (TTFT: 3800ms)', diff: 'Muse 43% Faster' },
    { ctx: '1,048,576 Context (1M Full Session)', muse: '18.60s (TTFT: 1420ms)', claw: '34.50s (TTFT: 8200ms)', diff: 'Muse 46% Faster (TPU Cluster)' },
  ];

  latencyRows.forEach((row, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 5.5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    doc.text(row.ctx, margin + 3, y + 3.8);

    doc.setTextColor(2, 132, 199);
    doc.text(row.muse, margin + 50, y + 3.8);

    doc.setTextColor(217, 119, 6);
    doc.text(row.claw, margin + 95, y + 3.8);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(5, 150, 105);
    doc.text(row.diff, margin + 140, y + 3.8);

    y += 5.5;
  });

  y += 6;

  // SECTION 3: Tool-Calling Round-Trip Latency
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Tool Calling Domain Latency (Round-trip ms)', margin, y);
  y += 5;

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Tool Category', margin + 3, y + 4.2);
  doc.text('Meta Muse', margin + 50, y + 4.2);
  doc.text('OpenClaw', margin + 95, y + 4.2);
  doc.text('Architectural Rationale', margin + 130, y + 4.2);
  y += 6;

  const toolRows = [
    { tool: 'Web Search & Extraction', muse: '450 ms', claw: '880 ms', rationale: 'Muse dedicated web acceleration index vs Local headless browser' },
    { tool: 'Local PostgreSQL Query', muse: '320 ms', claw: '120 ms', rationale: 'OpenClaw direct UNIX domain socket access (Zero proxy latency)' },
    { tool: 'File System NVMe Read/Write', muse: '580 ms', claw: '35 ms', rationale: 'OpenClaw direct OS IO vs Muse Secure VM upload overhead' },
    { tool: 'External Mail & Checkout', muse: '720 ms', claw: '640 ms', rationale: 'Muse eBPF Sentinel Taint inspection +80ms safety verification' },
    { tool: 'Code AST Linting & Parsing', muse: '890 ms', claw: '210 ms', rationale: 'OpenClaw local ts-morph execution vs remote transfer' },
  ];

  toolRows.forEach((row, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 5.5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    doc.text(row.tool, margin + 3, y + 3.8);

    doc.setTextColor(2, 132, 199);
    doc.text(row.muse, margin + 50, y + 3.8);

    doc.setTextColor(217, 119, 6);
    doc.text(row.claw, margin + 95, y + 3.8);

    doc.setTextColor(100, 116, 139);
    doc.text(row.rationale, margin + 130, y + 3.8);

    y += 5.5;
  });

  y += 6;

  // SECTION 4: Host Resource Consumption & Hardware Footprint
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('4. Host Machine Footprint & System Stress', margin, y);
  y += 5;

  const resCols = [
    { metric: 'Host RAM Usage (Idle -> Peak)', muse: '45 MB -> 55 MB (Browser Tab)', claw: '180 MB -> 1,820 MB (ChromaDB + Node)' },
    { metric: 'Host CPU Utilization', muse: '1% ~ 3% (Light Render)', claw: '18% ~ 78% (Local Vector Indexing)' },
    { metric: 'Laptop Battery Depletion', muse: 'Negligible (Standard web browsing)', claw: 'High (Continuous daemon & fan activity)' },
    { metric: 'Recommended Client Spec', muse: 'Any (Chromebook, Tablet, MacBook)', claw: 'Workstation (16GB~32GB RAM + NVMe SSD)' },
  ];

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Hardware Metric', margin + 3, y + 4.2);
  doc.text('Meta Muse (Cloud Turnkey)', margin + 55, y + 4.2);
  doc.text('OpenClaw (Local Framework)', margin + 120, y + 4.2);
  y += 6;

  resCols.forEach((row, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 5.5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    doc.text(row.metric, margin + 3, y + 3.8);

    doc.setTextColor(2, 132, 199);
    doc.text(row.muse, margin + 55, y + 3.8);

    doc.setTextColor(217, 119, 6);
    doc.text(row.claw, margin + 120, y + 3.8);

    y += 5.5;
  });

  y += 6;

  // SECTION 5: Stakeholder Governance & Deployment Recommendation
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('5. Stakeholder Strategic Recommendations & Governance', margin, y);
  y += 5;

  const boxWidth = (contentWidth - 4) / 2;

  // Muse Box
  doc.setFillColor(240, 249, 255);
  doc.roundedRect(margin, y, boxWidth, 25, 2, 2, 'F');
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(margin, y, boxWidth, 25, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(2, 132, 199);
  doc.text('For Business & Marketing Stakeholders (Meta Muse)', margin + 3, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(51, 65, 85);
  doc.text('- Recommended for non-technical workflows, market research, and 24/7 background tasks.', margin + 3, y + 10);
  doc.text('- Zero local hardware dependency; run on thin clients or mobile devices.', margin + 3, y + 14);
  doc.text('- Enforce read-only connector permissions; audit Sentinel eBPF approval alerts for payments.', margin + 3, y + 18);
  doc.text('- Cost Optimization: Power Plan ($16/mo) saves ~$1,000/mo vs raw API calls at 500M tokens.', margin + 3, y + 22);

  // OpenClaw Box
  const clawBoxX = margin + boxWidth + 4;
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(clawBoxX, y, boxWidth, 25, 2, 2, 'F');
  doc.setDrawColor(253, 230, 138);
  doc.roundedRect(clawBoxX, y, boxWidth, 25, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(180, 83, 9);
  doc.text('For Engineering & Enterprise Core (OpenClaw)', clawBoxX + 3, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(51, 65, 85);
  doc.text('- Recommended for proprietary codebases, local PostgreSQL, and private air-gapped data.', clawBoxX + 3, y + 10);
  doc.text('- Requires 16GB~32GB host machine with persistent NVMe SSD for ChromaDB vectors.', clawBoxX + 3, y + 14);
  doc.text('- Mandatory: Enable "exec.approval: true" and run within NVIDIA OpenShell sandbox.', clawBoxX + 3, y + 18);
  doc.text('- Defend against 26% ClawHub vulnerabilities with Cisco DefenseClaw inspection.', clawBoxX + 3, y + 22);

  y += 28;

  // Footer on Page 1
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Page 1 of 2 | Confirms to OWASP Top 10 for Agentic Applications & NIST AI Risk Management Framework Standards', margin, y);

  // Optional Page 2: Visual Snapshot if element provided
  if (options.includeVisualCanvas && options.performanceElementId) {
    const el = document.getElementById(options.performanceElementId);
    if (el) {
      try {
        const canvas = await html2canvas(el, {
          scale: 1.5,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });

        doc.addPage('a4', 'portrait');

        // Header for Page 2
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, pageWidth, 20, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text('Interactive Dashboard Visual Capture & Recharts Data Snapshot', margin, 12);

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const maxImgHeight = pageHeight - 35;
        const finalHeight = Math.min(imgHeight, maxImgHeight);

        doc.addImage(imgData, 'PNG', margin, 24, imgWidth, finalHeight);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(148, 163, 184);
        doc.text('Page 2 of 2 | High-Resolution Graphical Snapshot of Recharts Performance Engine', margin, pageHeight - 6);
      } catch (err) {
        console.warn('Canvas snapshot skipped:', err);
      }
    }
  }

  // Trigger download (saves cleanly without window.alert or window.open)
  doc.save(`2026_AI_Agent_Performance_Report_${currentDate}.pdf`);
}

export interface CostForecastPdfOptions {
  monthlyTokens: number;
  monthlyBudget: number;
  byokModel: 'claude-3-7' | 'gpt-5-turbo' | 'llama-local';
  tokenRatio: 'balanced' | 'heavy_in' | 'heavy_out';
  inRatio: number;
  outRatio: number;
  inputTokensM: number;
  outputTokensM: number;
  musePlanCost: number;
  musePlanName: string;
  museRawApiCost: number;
  museSavings: number;
  openClawTotalCost: number;
  openClawApiCost: number;
  byokInfraCost: number;
  openClawStorageCost: number;
  highestEstimatedCost: number;
  isBudgetBreached: boolean;
  budgetOverAmount: number;
  budgetOverPercent: number;
  budgetUsagePercentClaw: number;
  budgetUsagePercentMuse: number;
  includeVisualCanvas?: boolean;
  elementIdToCapture?: string;
}

export async function generateCostForecastPdf(options: CostForecastPdfOptions): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const currentDate = new Date().toISOString().split('T')[0];

  // Header Banner (Dark Slate with Crimson/Emerald Accents)
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Accent Lines
  doc.setFillColor(options.isBudgetBreached ? 225 : 5, options.isBudgetBreached ? 29 : 150, options.isBudgetBreached ? 72 : 105);
  doc.rect(0, 38, pageWidth * 0.5, 2, 'F');
  doc.setFillColor(2, 132, 199);
  doc.rect(pageWidth * 0.5, 38, pageWidth * 0.5, 2, 'F');

  // Title in Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('2026 AI Agent Monthly Expenditure & Budget Forecast', margin, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text('Financial Modeling & OPEX Simulation: Meta Muse (Subscription) vs OpenClaw (BYOK)', margin, 22);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  const statusLabel = options.isBudgetBreached
    ? `BUDGET OVERRUN ALERT (+${options.budgetOverPercent}%)`
    : 'WITHIN ALLOCATED BUDGET';
  doc.text(`Generated: ${currentDate} | Target Budget: $${options.monthlyBudget.toLocaleString()}/mo | Status: ${statusLabel}`, margin, 30);

  let y = 47;

  // SECTION 1: Key Financial KPI Scorecard (4 Cards)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Executive Financial Summary & Budget Health Scorecard', margin, y);
  y += 5;

  const cardWidth = (contentWidth - 9) / 4;
  const kpis = [
    {
      label: 'Monthly Budget Limit',
      val: `$${options.monthlyBudget.toLocaleString()}`,
      sub: 'Allocated Ceiling',
      color: [71, 85, 105],
    },
    {
      label: 'Meta Muse Projected',
      val: `$${options.musePlanCost}/mo`,
      sub: `${options.musePlanName} (Saves $${options.museSavings})`,
      color: [2, 132, 199],
    },
    {
      label: 'OpenClaw BYOK Total',
      val: `$${options.openClawTotalCost.toLocaleString()}/mo`,
      sub: `${options.budgetUsagePercentClaw}% of Budget (${options.byokModel})`,
      color: options.budgetUsagePercentClaw > 100 ? [225, 29, 72] : [217, 119, 6],
    },
    {
      label: 'Budget Variance',
      val: options.isBudgetBreached ? `+$${options.budgetOverAmount.toLocaleString()} Over` : `-$${options.monthlyBudget - options.highestEstimatedCost} Left`,
      sub: options.isBudgetBreached ? `Deficit (+${options.budgetOverPercent}%)` : `Surplus Remaining`,
      color: options.isBudgetBreached ? [225, 29, 72] : [5, 150, 105],
    },
  ];

  kpis.forEach((kpi, idx) => {
    const x = margin + idx * (cardWidth + 3);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, y, cardWidth, 20, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, y, cardWidth, 20, 2, 2, 'S');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, x + 3, y + 4.8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(kpi.color[0], kpi.color[1], kpi.color[2]);
    doc.text(kpi.val, x + 3, y + 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.sub, x + 3, y + 16.5);
  });

  y += 26;

  // SECTION 2: Active Simulation Parameters & Workload Assumptions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Simulation Parameters & Workload Assumptions', margin, y);
  y += 4.5;

  const modelNames: Record<string, string> = {
    'claude-3-7': 'Anthropic Claude 3.7 Sonnet ($3.00 in / $15.00 out per 1M)',
    'gpt-5-turbo': 'OpenAI GPT-5 Turbo ($2.50 in / $10.00 out per 1M)',
    'llama-local': 'Local Ollama Llama 3.3 70B ($0 API, $40 host compute/power)',
  };

  const ratioDescriptions: Record<string, string> = {
    balanced: '70% Prompt Input : 30% Generation Output (Standard Multi-Turn)',
    heavy_in: '90% Prompt Input : 10% Generation Output (Document & Repository Parsing)',
    heavy_out: '50% Prompt Input : 50% Generation Output (Heavy Autonomous Code Generation)',
  };

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 18, 1.5, 1.5, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 18, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text('Projected Volume:', margin + 3, y + 5);
  doc.text('I/O Token Ratio:', margin + 3, y + 10);
  doc.text('Selected BYOK Model:', margin + 3, y + 15);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  const tokenVolStr = options.monthlyTokens < 1000
    ? `${options.monthlyTokens} Million Tokens/Month (${Math.round(options.inputTokensM)}M in / ${Math.round(options.outputTokensM)}M out)`
    : `${(options.monthlyTokens / 1000).toFixed(2)} Billion Tokens/Month (${Math.round(options.inputTokensM)}M in / ${Math.round(options.outputTokensM)}M out)`;
  doc.text(tokenVolStr, margin + 35, y + 5);
  doc.text(ratioDescriptions[options.tokenRatio] || options.tokenRatio, margin + 35, y + 10);
  doc.text(modelNames[options.byokModel] || options.byokModel, margin + 35, y + 15);

  y += 24;

  // SECTION 3: Itemized Monthly Expense Comparison Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Detailed Monthly Expense Itemization & Cost Allocation', margin, y);
  y += 4.5;

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(71, 85, 105);
  doc.text('Expense Line Item', margin + 3, y + 3.8);
  doc.text('Meta Muse (Turnkey Plan)', margin + 60, y + 3.8);
  doc.text('OpenClaw (Local BYOK)', margin + 105, y + 3.8);
  doc.text('Procurement Variance & Analysis', margin + 142, y + 3.8);
  y += 5.5;

  const itemizedRows = [
    {
      item: 'LLM API Token Inference',
      muse: `$0 (Included in ${options.musePlanName})`,
      claw: `$${options.openClawApiCost.toLocaleString()} /mo (Token Usage)`,
      note: 'Muse flat rate eliminates token volatility',
    },
    {
      item: 'Host Machine Power & 24/7 VPS Daemon',
      muse: '$0 (Cloud Micro-VM Included)',
      claw: `$${options.byokInfraCost.toLocaleString()} /mo (Continuous Host)`,
      note: 'OpenClaw requires dedicated active host/VPS',
    },
    {
      item: 'Vector Database Storage (ChromaDB)',
      muse: '$0 (Managed Long-Term Memory)',
      claw: `$${options.openClawStorageCost.toLocaleString()} /mo (NVMe Vectors)`,
      note: 'Vector embedding & disk allocation',
    },
    {
      item: 'Gross Projected Monthly Expense',
      muse: `$${options.musePlanCost} / month`,
      claw: `$${options.openClawTotalCost.toLocaleString()} / month`,
      note: options.musePlanCost < options.openClawTotalCost
        ? `Muse saves $${(options.openClawTotalCost - options.musePlanCost).toLocaleString()}/mo`
        : `Claw saves $${(options.musePlanCost - options.openClawTotalCost).toLocaleString()}/mo`,
    },
    {
      item: 'Target Budget Utilization Rate',
      muse: `${options.budgetUsagePercentMuse}% of Budget`,
      claw: `${options.budgetUsagePercentClaw}% of Budget`,
      note: options.budgetUsagePercentClaw > 100 ? 'OpenClaw exceeds budget limit' : 'Both within budget',
    },
  ];

  itemizedRows.forEach((row, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 5.2, 'F');
    }
    doc.setFont('helvetica', i === 3 ? 'bold' : 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(15, 23, 42);
    doc.text(row.item, margin + 3, y + 3.6);

    doc.setTextColor(2, 132, 199);
    doc.text(row.muse, margin + 60, y + 3.6);

    doc.setTextColor(i === 4 && options.budgetUsagePercentClaw > 100 ? 225 : 217, i === 4 && options.budgetUsagePercentClaw > 100 ? 29 : 119, i === 4 && options.budgetUsagePercentClaw > 100 ? 72 : 6);
    doc.text(row.claw, margin + 105, y + 3.6);

    doc.setTextColor(71, 85, 105);
    doc.text(row.note, margin + 142, y + 3.6);

    y += 5.2;
  });

  y += 5;

  // SECTION 4: Multi-Tier Workload Scaling Forecast Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('4. Workload Tier Scaling Forecast (50M to 2,000M Tokens)', margin, y);
  y += 4.5;

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(71, 85, 105);
  doc.text('Monthly Scale Tier', margin + 3, y + 3.8);
  doc.text('Meta Muse Flat Plan', margin + 55, y + 3.8);
  doc.text('OpenClaw BYOK', margin + 98, y + 3.8);
  doc.text('Muse Direct Raw API', margin + 140, y + 3.8);
  y += 5.5;

  const byokIn = options.byokModel === 'gpt-5-turbo' ? 2.5 : options.byokModel === 'llama-local' ? 0 : 3.0;
  const byokOut = options.byokModel === 'gpt-5-turbo' ? 10.0 : options.byokModel === 'llama-local' ? 0 : 15.0;
  const infra = options.byokInfraCost;

  const tiers = [
    {
      scale: '50M (Individual / Low Tasks)',
      muse: '$0 / mo (Free Tier)',
      claw: `$${Math.round(50 * options.inRatio * byokIn + 50 * options.outRatio * byokOut + infra + 2)} / mo`,
      raw: `$${Math.round(50 * options.inRatio * 1.25 + 50 * options.outRatio * 4.25)} / mo`,
    },
    {
      scale: '250M (Team Small Collaboration)',
      muse: '$0 / mo (Free Tier < 400M)',
      claw: `$${Math.round(250 * options.inRatio * byokIn + 250 * options.outRatio * byokOut + infra + 10)} / mo`,
      raw: `$${Math.round(250 * options.inRatio * 1.25 + 250 * options.outRatio * 4.25)} / mo`,
    },
    {
      scale: '750M (Automated DevOps Pipeline)',
      muse: '$16 / mo (Power Plan)',
      claw: `$${Math.round(750 * options.inRatio * byokIn + 750 * options.outRatio * byokOut + infra + 30)} / mo`,
      raw: `$${Math.round(750 * options.inRatio * 1.25 + 750 * options.outRatio * 4.25)} / mo`,
    },
    {
      scale: '2,000M (Enterprise Autonomous Swarm)',
      muse: '$16 / mo (Power Plan)',
      claw: `$${Math.round(2000 * options.inRatio * byokIn + 2000 * options.outRatio * byokOut + infra + 80)} / mo`,
      raw: `$${Math.round(2000 * options.inRatio * 1.25 + 2000 * options.outRatio * 4.25)} / mo`,
    },
  ];

  tiers.forEach((t, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 5.2, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(15, 23, 42);
    doc.text(t.scale, margin + 3, y + 3.6);

    doc.setTextColor(2, 132, 199);
    doc.text(t.muse, margin + 55, y + 3.6);

    doc.setTextColor(217, 119, 6);
    doc.text(t.claw, margin + 98, y + 3.6);

    doc.setTextColor(100, 116, 139);
    doc.text(t.raw, margin + 140, y + 3.6);

    y += 5.2;
  });

  y += 5;

  // SECTION 5: Strategic Cost Recommendations & Governance
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('5. Financial Governance & IT Procurement Guidance', margin, y);
  y += 4.5;

  const boxWidth = (contentWidth - 4) / 2;

  // Advisory Box 1 (Meta Muse Plan Efficiency)
  doc.setFillColor(240, 249, 255);
  doc.roundedRect(margin, y, boxWidth, 23, 2, 2, 'F');
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(margin, y, boxWidth, 23, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(2, 132, 199);
  doc.text('Turnkey Subscription Advantage (Meta Muse)', margin + 3, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(51, 65, 85);
  doc.text('- Zero token billing surprises with fixed $16/mo Power Plan.', margin + 3, y + 9);
  doc.text('- Up to 500M tokens/week (~2.15B tokens/mo) without incremental cost.', margin + 3, y + 13);
  doc.text(`- Financial Savings: Saves ~$${options.museSavings.toLocaleString()}/mo vs pay-as-you-go API.`, margin + 3, y + 17);
  doc.text('- Recommended for product teams, marketing, and cross-functional staff.', margin + 3, y + 21);

  // Advisory Box 2 (OpenClaw Cost Optimization)
  const clawBoxX = margin + boxWidth + 4;
  doc.setFillColor(options.isBudgetBreached ? 255 : 254, options.isBudgetBreached ? 241 : 243, options.isBudgetBreached ? 242 : 199);
  doc.roundedRect(clawBoxX, y, boxWidth, 23, 2, 2, 'F');
  doc.setDrawColor(options.isBudgetBreached ? 254 : 253, options.isBudgetBreached ? 205 : 230, options.isBudgetBreached ? 211 : 138);
  doc.roundedRect(clawBoxX, y, boxWidth, 23, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(options.isBudgetBreached ? 225 : 180, options.isBudgetBreached ? 29 : 83, options.isBudgetBreached ? 72 : 9);
  doc.text('BYOK Cost Optimization Strategy (OpenClaw)', clawBoxX + 3, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(51, 65, 85);
  doc.text('- Enforce Anthropic/OpenAI prompt caching (up to 50% discount on inputs).', clawBoxX + 3, y + 9);
  doc.text('- Route simple grep/AST linting tasks to local Ollama Llama 3 8B model.', clawBoxX + 3, y + 13);
  doc.text('- Set hard budget token limits in OpenClaw config to prevent infinite tool loops.', clawBoxX + 3, y + 17);
  doc.text('- Monitor host VM hardware depreciation and electricity in long-term TCO.', clawBoxX + 3, y + 21);

  y += 27;

  // Footer on Page 1
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Page 1 of 2 | 2026 AI Agent Intelligence Architecture & Financial Expenditure Simulation Matrix', margin, pageHeight - 6);

  // Optional Page 2: Visual Snapshot of the Cost Simulator Component
  if (options.includeVisualCanvas && options.elementIdToCapture) {
    const el = document.getElementById(options.elementIdToCapture);
    if (el) {
      try {
        const canvas = await html2canvas(el, {
          scale: 1.5,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });

        doc.addPage('a4', 'portrait');

        // Header for Page 2
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, pageWidth, 20, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text('Interactive Cost Simulator & Budget Threshold Visual Snapshot', margin, 12);

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const maxImgHeight = pageHeight - 35;
        const finalHeight = Math.min(imgHeight, maxImgHeight);

        doc.addImage(imgData, 'PNG', margin, 24, imgWidth, finalHeight);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(148, 163, 184);
        doc.text('Page 2 of 2 | High-Resolution Graphical Snapshot of Recharts Cost Engine & Threshold Warning', margin, pageHeight - 6);
      } catch (err) {
        console.warn('Canvas snapshot skipped:', err);
      }
    }
  }

  // Trigger download (saves cleanly without window.alert or window.open)
  doc.save(`2026_AI_Agent_Cost_Forecast_Report_${currentDate}.pdf`);
}

