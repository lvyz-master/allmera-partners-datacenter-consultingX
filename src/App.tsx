/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { AccessGate } from './components/AccessGate';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { InteractiveAmericasMap } from './components/InteractiveAmericasMap';
import { VendorTcoComparison } from './components/VendorTcoComparison';
import { RegionalExplorer } from './components/RegionalExplorer';
import { ElectricalGridSection } from './components/ElectricalGridSection';
import { LatencyMatrixSection } from './components/LatencyMatrixSection';
import { RegulatoryFrameworkSection } from './components/RegulatoryFrameworkSection';
import { FeasibilitySimulator } from './components/FeasibilitySimulator';
import { AIAssessmentModal } from './components/AIAssessmentModal';
import { Footer } from './components/Footer';
import { REGIONS_DATA } from './data/regionsData';
import { RegionData } from './types/datacenter';
import { ConsultingHub } from './components/ConsultingHub';
import { BessConsultingView } from './components/BessConsultingView';

export default function App() {
  // Session Authentication state with default user
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('allmera_auth_token') === 'true';
  });
  const [currentUser, setCurrentUser] = useState<string>(() => {
    return localStorage.getItem('allmera_auth_user') || 'Allmera';
  });

  // Current Portal: hub (selection page) | datacenter | bess
  const [currentPortal, setCurrentPortal] = useState<'hub' | 'datacenter' | 'bess'>(() => {
    return (localStorage.getItem('allmera_current_portal') as 'hub' | 'datacenter' | 'bess') || 'hub';
  });

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('br-sp');
  
  // AI Modal state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiTargetRegion, setAiTargetRegion] = useState<RegionData | null>(null);
  const [aiScenarioData, setAiScenarioData] = useState<any | null>(null);

  const handleLoginSuccess = (username: string) => {
    setIsAuthenticated(true);
    setCurrentUser(username);
    setCurrentPortal('hub');
    localStorage.setItem('allmera_auth_token', 'true');
    localStorage.setItem('allmera_auth_user', username);
    localStorage.setItem('allmera_current_portal', 'hub');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPortal('hub');
    localStorage.removeItem('allmera_auth_token');
    localStorage.removeItem('allmera_current_portal');
  };

  const handleSelectPortal = (portal: 'hub' | 'datacenter' | 'bess') => {
    setCurrentPortal(portal);
    localStorage.setItem('allmera_current_portal', portal);
  };

  if (!isAuthenticated) {
    return <AccessGate onLoginSuccess={handleLoginSuccess} />;
  }

  // Option 0: Consulting Hub selection screen (Post-login portal router)
  if (currentPortal === 'hub') {
    return (
      <ConsultingHub
        currentUser={currentUser}
        onSelectPortal={handleSelectPortal}
        onLogout={handleLogout}
      />
    );
  }

  // Option 2: BESS Consulting workspace (Sizing, Cardápio, Vendors Brazil, Single-line diagram & PDF dossier)
  if (currentPortal === 'bess') {
    return (
      <BessConsultingView
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchPortal={handleSelectPortal}
      />
    );
  }

  const handleOpenAiForRegion = (region: RegionData) => {
    setAiTargetRegion(region);
    setAiScenarioData(null);
    setIsAiModalOpen(true);
  };

  const handleOpenAiForScenario = (scenarioData: any) => {
    setAiScenarioData(scenarioData);
    setAiTargetRegion(null);
    setIsAiModalOpen(true);
  };

  const handleOpenAiGeneral = () => {
    const currentRegion = REGIONS_DATA.find((r) => r.id === selectedRegionId) || REGIONS_DATA[0];
    setAiTargetRegion(currentRegion);
    setAiScenarioData(null);
    setIsAiModalOpen(true);
  };

  const handleSimulateRegion = (regionId: string) => {
    setSelectedRegionId(regionId);
    setActiveTab('simulator');
  };

  return (
    <div className="relative min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-900 overflow-x-hidden">
      {/* Crisp pure white canvas with subtle high-end ambient accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.025] blur-[120px]" />
        <div className="absolute top-1/3 -right-20 h-[550px] w-[550px] rounded-full bg-cyan-500/[0.02] blur-[140px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAiAdvisor={handleOpenAiGeneral}
          currentUser={currentUser}
          onLogout={handleLogout}
          onSwitchPortal={handleSelectPortal}
        />

        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {activeTab === 'overview' && (
            <ExecutiveSummary
              onNavigateTab={setActiveTab}
              onSelectRegion={setSelectedRegionId}
            />
          )}

          {activeTab === 'map' && (
            <InteractiveAmericasMap
              onSelectRegion={setSelectedRegionId}
              onOpenAiAssessment={handleOpenAiForRegion}
              onSimulateRegion={handleSimulateRegion}
            />
          )}

          {activeTab === 'vendors' && (
            <VendorTcoComparison
              onSimulateWithVendor={() => setActiveTab('simulator')}
            />
          )}

          {activeTab === 'regions' && (
            <RegionalExplorer
              selectedRegionId={selectedRegionId}
              onSelectRegionId={setSelectedRegionId}
              onOpenAiAssessment={handleOpenAiForRegion}
              onSimulateRegion={handleSimulateRegion}
            />
          )}

          {activeTab === 'grid' && <ElectricalGridSection />}

          {activeTab === 'latency' && <LatencyMatrixSection />}

          {activeTab === 'regulatory' && <RegulatoryFrameworkSection />}

          {activeTab === 'simulator' && (
            <FeasibilitySimulator
              initialRegionId={selectedRegionId}
              onRequestAiConsultation={handleOpenAiForScenario}
            />
          )}
        </main>

        <Footer />
      </div>

      {/* AI Executive Advisory Modal */}
      <AIAssessmentModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        targetRegion={aiTargetRegion}
        scenarioData={aiScenarioData}
      />
    </div>
  );
}
