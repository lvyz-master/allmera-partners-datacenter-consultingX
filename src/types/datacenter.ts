export type MarketTier = 'mature' | 'emerging';

export type WorkloadType = 'training' | 'inference' | 'hybrid';

export interface LatencyNode {
  target: string;
  rttMs: number;
  routeType: 'terrestrial' | 'submarine' | 'hybrid';
  cableSystems?: string[];
  inferenceViable: boolean; // < 25ms ideal, < 40ms acceptable
}

export interface GridInfraDetails {
  availableCapacityMw: number;
  pipelineCapacityMw: number;
  interconnectionQueueMonths: number;
  substationVoltageKv: string;
  saidiHoursPerYear: number;
  saifiEventsPerYear: number;
  averageIndustrialTariffUsdMwh: number;
  gridRenewablePercentage: number;
  fossilPercentage: number;
  curtailmentRisk: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
  transmissionBottleneck: string;
  bessNecessity: 'Essencial' | 'Recomendado' | 'Opcional';
  substationCostPerMwUsd: number; // typically $180k - $350k per MW
}

export interface RegulatoryFramework {
  ppaStructure: string;
  freeMarketEligibility: string;
  selfGenerationRegime: string; // Autoprodução
  exemptionsAndSubsidies: string;
  irecAvailability: boolean;
  twentyFourSevenCfeFeasibility: 'Alta' | 'Média' | 'Complexa';
  waterStressLevel: 'Baixo' | 'Médio' | 'Alto' | 'Extremo';
  coolingRegulations: string;
  environmentalPermitMonths: number;
  taxIncentives: string;
}

export interface RegionData {
  id: string;
  name: string;
  country: string;
  flag: string;
  marketTier: MarketTier;
  hubRole: string;
  coordinates: { lat: number; lng: number };
  grid: GridInfraDetails;
  latency: LatencyNode[];
  regulatory: RegulatoryFramework;
  primaryWorkloadSuitability: {
    llmTrainingScore: number; // 0-100
    realtimeInferenceScore: number; // 0-100
    batchRAGScore: number; // 0-100
    summary: string;
  };
  keyAdvantages: string[];
  criticalRisks: string[];
}

export interface SimulationParams {
  itLoadMw: number;
  targetPue: number;
  coolingTech: 'direct_liquid' | 'evaporative' | 'closed_adiabatic';
  workload: WorkloadType;
  renewableSelfGenPercent: number; // 0 - 100%
  bessHours: number; // 0, 1, 2, 4 hours
  gridRegionId: string;
}

export interface SimulationResult {
  totalFacilityPowerMw: number;
  annualEnergyConsumptionGwh: number;
  annualPowerCostUsd: number;
  substationCapexUsd: number;
  bessCapexUsd: number;
  liquidCoolingCapexUsd: number;
  totalInfraCapexUsd: number;
  co2EmissionsTonsPerYear: number;
  co2AvoidedTonsPerYear: number;
  estimatedLeadTimeMonths: number;
  overallFeasibilityIndex: number; // 0-100
}
