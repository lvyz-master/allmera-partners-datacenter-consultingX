/**
 * Types and interfaces for Allmera BESS Consulting Platform
 */

export type BessChemistry = 'LFP'; // Lithium Iron Phosphate (LiFePO4) - Brazilian industrial standard
export type BessCooling = 'Liquid Cooling' | 'Air Cooling';
export type BessApplicationId = 
  | 'peak_shaving'
  | 'energy_arbitrage'
  | 'critical_backup'
  | 'solar_pv_integration'
  | 'demand_charge_management'
  | 'power_quality'
  | 'capacity_reserve';

export interface BessApplicationItem {
  id: BessApplicationId;
  title: string;
  shortName: string;
  category: 'Comercial & Tarifário' | 'Resiliência & Backup' | 'Geração & Rede';
  description: string;
  technicalDetails: string;
  typicalSavingsRate: string;
  recommendedDurationHours: number;
  iconName: string;
  tags: string[];
}

export interface BessClientProfile {
  clientName: string;
  projectName: string;
  city: string;
  state: string;
  utilityCompany: string; // Concessionária (Enel SP, Cemig, CPFL, Neoenergia, etc.)
  subgroup: 'A4 (2.3kV - 25kV)' | 'A3a (30kV - 44kV)' | 'A2 (88kV - 138kV)' | 'A1 (>=230kV)';
  tariffModality: 'Horária Verde' | 'Horária Azul';
  connectionVoltage: string; // ex: 13.8 kV, 34.5 kV
  peakTariff: number; // R$/kWh
  offPeakTariff: number; // R$/kWh
  contractedDemandKw: number;
  demandTariff: number; // R$/kW.mês
  projectLifeYears: number; // 10, 15, 20
  waccDiscountRate: number; // % a.a. (ex: 11%)
}

export interface BessSizingInput {
  targetPowerKw: number;
  durationHours: number;
  dailyPeakHours: number;
  peakLoadKw: number;
  offPeakLoadKw: number;
  solarPvCapacityKwp: number;
  cyclesPerDay: number;
  depthOfDischargePercent: number; // Typically 90%
  roundTripEfficiencyPercent: number; // Typically 88-92%
  annualDegradationPercent: number; // Typically 2.0% - 2.5%
  selectedApplications: BessApplicationId[];
}

export interface BessSizingResult {
  nominalPowerKw: number;
  nominalPowerMw: number;
  nominalEnergyKwh: number;
  nominalEnergyMwh: number;
  usableEnergyKwh: number;
  usableEnergyMwh: number;
  cRate: number; // Power / Energy
  
  // Physical / Infrastructure quantities
  batteryContainersCount: number;
  containerUnitCapacityMwh: number;
  pcsInverterCount: number;
  pcsUnitRatingKw: number;
  mvTransformerSkidCount: number;
  transformerRatingMva: number;
  
  // Electrical & Thermal specs
  coolingType: BessCooling;
  chemistry: BessChemistry;
  fireSuppressionSystem: string;
  complianceStandards: string[];
  
  // Financial metrics (BRL & USD)
  totalCapexBrl: number;
  totalCapexUsd: number;
  bessEquipmentCapexBrl: number;
  pcsAndTransformerCapexBrl: number;
  bopCivilElectricalCapexBrl: number;
  engineeringCommissioningCapexBrl: number;
  
  annualOpexBrl: number;
  
  // Savings / Revenues
  annualPeakShavingSavingsBrl: number;
  annualArbitrageRevenueBrl: number;
  annualDemandReductionSavingsBrl: number;
  annualSolarCurtailmentSavingsBrl: number;
  totalAnnualBenefitBrl: number;
  
  // Financial indicators
  simplePaybackYears: number;
  discountedPaybackYears: number;
  irrPercent: number; // TIR
  npvBrl: number; // VPL em 15 anos
  lcosBrlPerKwh: number; // Levelized Cost of Storage
}

export type BessVendorId = 'huawei' | 'sungrow' | 'byd' | 'weg' | 'tesla';

export interface BessVendorProduct {
  id: BessVendorId;
  vendorName: string;
  flagCountry: string;
  productLine: string;
  architectureType: 'Smart String Descentralizado' | 'Centralizado Integrado' | 'Blade CTP Modular' | 'Industrial Nacionalizado';
  coolingMethod: 'Liquid Cooling Inteligente' | 'Liquid Cooling Microcanal' | 'Liquid Cooling / Ar Híbrido';
  standardBlockSizeMwh: number;
  standardBlockPowerMw: number;
  roundTripEfficiency: number; // %
  warrantyYears: number;
  guaranteedCycles: number;
  finameBndesEligible: boolean;
  brazilLocalPresence: {
    headquarters: string;
    fieldServiceSLA: string;
    partsInventoryInBrazil: boolean;
    localEngineeringSupport: string;
  };
  safetyCertifications: string[];
  estimatedCapexPerKwhBrl: number;
  strengths: string[];
  keyConsiderations: string[];
  recommendedUseCases: string[];
  overallRating: number; // 1 to 5
}
