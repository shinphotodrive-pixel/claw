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
