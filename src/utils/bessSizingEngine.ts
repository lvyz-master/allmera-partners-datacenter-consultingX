import { BessClientProfile, BessSizingInput, BessSizingResult, BessVendorProduct } from '../types/bess';
import { BRAZIL_BESS_VENDORS } from '../data/bessSolutions';

export function calculateBessSizing(
  client: BessClientProfile,
  input: BessSizingInput,
  selectedVendorId: string = 'huawei'
): BessSizingResult {
  const vendor: BessVendorProduct = 
    BRAZIL_BESS_VENDORS.find(v => v.id === selectedVendorId) || BRAZIL_BESS_VENDORS[0];

  const nominalPowerKw = input.targetPowerKw;
  const nominalPowerMw = Number((nominalPowerKw / 1000).toFixed(3));
  
  const nominalEnergyKwh = nominalPowerKw * input.durationHours;
  const nominalEnergyMwh = Number((nominalEnergyKwh / 1000).toFixed(3));

  const dodFraction = input.depthOfDischargePercent / 100;
  const usableEnergyKwh = nominalEnergyKwh * dodFraction;
  const usableEnergyMwh = Number((usableEnergyKwh / 1000).toFixed(3));

  const cRate = Number((nominalPowerKw / nominalEnergyKwh).toFixed(2));

  // Containers count based on vendor's standard block size or 2.0 MWh default
  const blockSizeMwh = vendor.standardBlockSizeMwh || 2.0;
  const batteryContainersCount = Math.max(1, Math.ceil(nominalEnergyMwh / blockSizeMwh));
  const containerUnitCapacityMwh = Number((nominalEnergyMwh / batteryContainersCount).toFixed(2));

  // PCS Inverters (string 200 kW or central 1250 kW)
  const isStringArch = vendor.architectureType.includes('String');
  const pcsUnitRatingKw = isStringArch ? 200 : (nominalPowerKw <= 2500 ? 500 : 1250);
  const pcsInverterCount = Math.max(1, Math.ceil(nominalPowerKw / pcsUnitRatingKw));

  // MV Transformer skid
  const transformerRatingMva = Number((nominalPowerMw * 1.25).toFixed(2));
  const mvTransformerSkidCount = Math.max(1, Math.ceil(nominalPowerMw / 2.5));

  // --- Financial Capex ---
  const capexPerKwhBrl = vendor.estimatedCapexPerKwhBrl;
  const bessEquipmentCapexBrl = nominalEnergyKwh * capexPerKwhBrl;
  const pcsAndTransformerCapexBrl = nominalPowerKw * 390; // R$ 390/kW for PCS + transformer
  const bopCivilElectricalCapexBrl = (bessEquipmentCapexBrl + pcsAndTransformerCapexBrl) * 0.11; // 11% BOP
  const engineeringCommissioningCapexBrl = (bessEquipmentCapexBrl + pcsAndTransformerCapexBrl) * 0.06; // 6% EPC/Eng

  const totalCapexBrl = bessEquipmentCapexBrl + pcsAndTransformerCapexBrl + bopCivilElectricalCapexBrl + engineeringCommissioningCapexBrl;
  const usdExchangeRate = 5.65;
  const totalCapexUsd = Math.round(totalCapexBrl / usdExchangeRate);

  const annualOpexBrl = totalCapexBrl * 0.017; // 1.7% per year

  // --- Savings / Revenues based on Selected Applications ---
  const selectedApps = input.selectedApplications;
  const rte = input.roundTripEfficiencyPercent / 100;

  // 1. Peak Shaving (252 business days in Brazil)
  let annualPeakShavingSavingsBrl = 0;
  if (selectedApps.includes('peak_shaving')) {
    const tariffSpread = Math.max(0.60, client.peakTariff - client.offPeakTariff);
    const dailyPeakDischargeKwh = Math.min(usableEnergyKwh, nominalPowerKw * input.dailyPeakHours);
    annualPeakShavingSavingsBrl = dailyPeakDischargeKwh * tariffSpread * 252 * rte;
  }

  // 2. Arbitrage in ACL (310 days)
  let annualArbitrageRevenueBrl = 0;
  if (selectedApps.includes('energy_arbitrage')) {
    const aclSpread = 0.38; // R$/kWh spread between low PLD and peak hours
    const dailyArbitrageKwh = usableEnergyKwh * 0.85;
    annualArbitrageRevenueBrl = dailyArbitrageKwh * aclSpread * 310 * rte;
  }

  // 3. Demand charge management
  let annualDemandReductionSavingsBrl = 0;
  if (selectedApps.includes('demand_charge_management')) {
    const demandReductionKw = Math.min(client.contractedDemandKw * 0.22, nominalPowerKw * 0.45);
    annualDemandReductionSavingsBrl = demandReductionKw * client.demandTariff * 12;
  }

  // 4. Solar integration / Curtailment mitigation
  let annualSolarCurtailmentSavingsBrl = 0;
  if (selectedApps.includes('solar_pv_integration') && input.solarPvCapacityKwp > 0) {
    const annualSolarGenerationKwh = input.solarPvCapacityKwp * 1650;
    const curtailmentLossAvoidedKwh = Math.min(usableEnergyKwh * 300, annualSolarGenerationKwh * 0.075);
    annualSolarCurtailmentSavingsBrl = curtailmentLossAvoidedKwh * 0.34;
  }

  const totalAnnualBenefitBrl = 
    annualPeakShavingSavingsBrl + 
    annualArbitrageRevenueBrl + 
    annualDemandReductionSavingsBrl + 
    annualSolarCurtailmentSavingsBrl;

  const netAnnualCashFlowBrl = Math.max(1, totalAnnualBenefitBrl - annualOpexBrl);

  // Simple Payback
  const simplePaybackYears = Number((totalCapexBrl / netAnnualCashFlowBrl).toFixed(1));

  // Discounted Payback, NPV and IRR (15-year horizon, WACC discount rate)
  const discountRate = (client.waccDiscountRate || 11.0) / 100;
  const projectYears = client.projectLifeYears || 15;
  
  let cumulativeDcf = -totalCapexBrl;
  let discountedPaybackYears = projectYears;
  let npvBrl = -totalCapexBrl;

  for (let year = 1; year <= projectYears; year++) {
    // Account for annual degradation (e.g. 2% capacity drop/year)
    const degradationFactor = Math.pow(1 - (input.annualDegradationPercent / 100), year - 1);
    const yearCashFlow = (totalAnnualBenefitBrl * degradationFactor) - (annualOpexBrl * 1.045); // slight opex inflation
    const discountFactor = Math.pow(1 + discountRate, year);
    const discountedYearFlow = yearCashFlow / discountFactor;

    npvBrl += discountedYearFlow;
    cumulativeDcf += discountedYearFlow;

    if (cumulativeDcf >= 0 && discountedPaybackYears === projectYears) {
      discountedPaybackYears = Number((year - 1 + (Math.abs(cumulativeDcf - discountedYearFlow) / discountedYearFlow)).toFixed(1));
    }
  }

  // Estimate IRR using Newton approximation
  let irrGuess = 0.15;
  for (let iter = 0; iter < 12; iter++) {
    let npvAtGuess = -totalCapexBrl;
    let dNpvAtGuess = 0;

    for (let yr = 1; yr <= projectYears; yr++) {
      const degradation = Math.pow(1 - (input.annualDegradationPercent / 100), yr - 1);
      const flow = (totalAnnualBenefitBrl * degradation) - annualOpexBrl;
      const df = Math.pow(1 + irrGuess, yr);
      npvAtGuess += flow / df;
      dNpvAtGuess -= (yr * flow) / Math.pow(1 + irrGuess, yr + 1);
    }

    if (Math.abs(dNpvAtGuess) < 0.0001) break;
    const nextGuess = irrGuess - (npvAtGuess / dNpvAtGuess);
    if (isNaN(nextGuess) || nextGuess < -0.5 || nextGuess > 1.5) break;
    irrGuess = nextGuess;
  }
  const irrPercent = Number(Math.max(2.0, Math.min(48.0, irrGuess * 100)).toFixed(1));

  // Levelized Cost of Storage (LCOS in R$/kWh)
  const totalLifetimeDischargedKwh = usableEnergyKwh * input.cyclesPerDay * 330 * projectYears * 0.88;
  const lcosBrlPerKwh = totalLifetimeDischargedKwh > 0 
    ? Number(((totalCapexBrl + (annualOpexBrl * projectYears)) / totalLifetimeDischargedKwh).toFixed(2)) 
    : 0.65;

  return {
    nominalPowerKw,
    nominalPowerMw,
    nominalEnergyKwh,
    nominalEnergyMwh,
    usableEnergyKwh,
    usableEnergyMwh,
    cRate,
    batteryContainersCount,
    containerUnitCapacityMwh,
    pcsInverterCount,
    pcsUnitRatingKw,
    mvTransformerSkidCount,
    transformerRatingMva,
    coolingType: 'Liquid Cooling',
    chemistry: 'LFP',
    fireSuppressionSystem: 'FK-5-1-12 (Novec 1230) com Deflagração NFPA 855 / UL 9540A',
    complianceStandards: ['ABNT NBR 16149 / 16150', 'Resolução Normativa Aneel 1.000', 'NFPA 855', 'UL 9540A', 'IEC 62619'],
    totalCapexBrl: Math.round(totalCapexBrl),
    totalCapexUsd,
    bessEquipmentCapexBrl: Math.round(bessEquipmentCapexBrl),
    pcsAndTransformerCapexBrl: Math.round(pcsAndTransformerCapexBrl),
    bopCivilElectricalCapexBrl: Math.round(bopCivilElectricalCapexBrl),
    engineeringCommissioningCapexBrl: Math.round(engineeringCommissioningCapexBrl),
    annualOpexBrl: Math.round(annualOpexBrl),
    annualPeakShavingSavingsBrl: Math.round(annualPeakShavingSavingsBrl),
    annualArbitrageRevenueBrl: Math.round(annualArbitrageRevenueBrl),
    annualDemandReductionSavingsBrl: Math.round(annualDemandReductionSavingsBrl),
    annualSolarCurtailmentSavingsBrl: Math.round(annualSolarCurtailmentSavingsBrl),
    totalAnnualBenefitBrl: Math.round(totalAnnualBenefitBrl),
    simplePaybackYears,
    discountedPaybackYears: Number(Math.min(projectYears, discountedPaybackYears).toFixed(1)),
    irrPercent,
    npvBrl: Math.round(npvBrl),
    lcosBrlPerKwh,
  };
}
