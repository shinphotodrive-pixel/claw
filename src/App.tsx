import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ExecutiveOverview } from './components/ExecutiveOverview';
import { MetaMuseSection } from './components/MetaMuseSection';
import { OpenClawSection } from './components/OpenClawSection';
import { MemoryComparisonSection } from './components/MemoryComparisonSection';
import { PerformanceMetricsSection } from './components/PerformanceMetricsSection';
import { SecurityMatrixSection } from './components/SecurityMatrixSection';
import { SetupGuideSection } from './components/SetupGuideSection';
import { StrategicSummary } from './components/StrategicSummary';
import { Footer } from './components/Footer';
import { DecisionAdvisorModal } from './components/DecisionAdvisorModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { generateStakeholderPdf } from './utils/generatePdfReport';

export default function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'warning' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleDownloadReport = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    addToast('이해관계자용 종합 성능 및 인텔리전스 PDF 리포트 생성 중...', 'info');

    try {
      await generateStakeholderPdf({
        includeVisualCanvas: true,
        performanceElementId: 'performance',
      });
      addToast('이해관계자용 성능 분석 PDF 리포트가 성공적으로 다운로드되었습니다.', 'success');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      addToast('PDF 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'warning');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'muse', 'openclaw', 'memory', 'performance', 'security', 'guide'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f5] text-slate-800 antialiased font-sans">
      {/* Sticky Navigation Bar */}
      <Navbar
        onOpenAdvisor={() => setIsAdvisorOpen(true)}
        activeSection={activeSection}
        onDownloadReport={handleDownloadReport}
        isDownloading={isGeneratingPdf}
      />

      {/* Main Content Dashboard */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        <ExecutiveOverview />
        <MetaMuseSection onShowToast={addToast} />
        <OpenClawSection onShowToast={addToast} />
        <MemoryComparisonSection />
        <PerformanceMetricsSection
          onDownloadReport={handleDownloadReport}
          isDownloading={isGeneratingPdf}
          onShowToast={addToast}
        />
        <SecurityMatrixSection onShowToast={addToast} />
        <SetupGuideSection onShowToast={addToast} />
        <StrategicSummary />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Questionnaire Modal */}
      <DecisionAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
      />

      {/* Clean in-app Toast notifications (replaces window.alert) */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
