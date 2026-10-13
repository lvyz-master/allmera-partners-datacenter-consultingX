import { BessApplicationItem, BessVendorProduct } from '../types/bess';

/**
 * Cardápio Oficial de Aplicações de BESS (Battery Energy Storage Systems)
 * Estruturado para o mercado brasileiro de energia (C&I, Geração Distribuída e Mercado Livre ACL)
 */
export const BESS_APPLICATIONS_MENU: BessApplicationItem[] = [
  {
    id: 'peak_shaving',
    title: 'Peak Shaving (Corte de Horário de Ponta)',
    shortName: 'Peak Shaving',
    category: 'Comercial & Tarifário',
    description: 'Descarga da bateria nas 3 horas de ponta da distribuidora (geralmente entre 17h30 e 20h30), substituindo o consumo da rede onde a tarifa TE+TUSD chega a ser 4x a 7x mais cara.',
    technicalDetails: 'Reduz o consumo faturado no posto tarifário ponta a praticamente zero. Ideal para indústrias e comércio no Grupo A (A4/A3a/A2) em tarifas Verde ou Azul.',
    typicalSavingsRate: 'R$ 1,20 a R$ 2,10 de spread líquido por kWh descarregado',
    recommendedDurationHours: 3.0,
    iconName: 'Zap',
    tags: ['Tarifa Ponta', 'Grupo A', 'Alta Rentabilidade', 'TUSD/TE'],
  },
  {
    id: 'energy_arbitrage',
    title: 'Arbitragem de Energia no Mercado Livre (ACL)',
    shortName: 'Arbitragem ACL',
    category: 'Comercial & Tarifário',
    description: 'Armazenamento de energia nos períodos de preços spot/PLD reduzidos (madrugada ou excedente solar ao meio-dia) e consumo/venda nos momentos de PLD elevado e estresse do SIN.',
    technicalDetails: 'Aproveita a volatilidade horária do PLD e curvas de preços em contratos bilaterais com comercializadoras e geradores no mercado livre.',
    typicalSavingsRate: 'R$ 280 a R$ 650 por MWh arbitrado dependendo da sazonalidade',
    recommendedDurationHours: 2.0,
    iconName: 'TrendingUp',
    tags: ['Mercado Livre', 'PLD Horário', 'CCEE', 'Trading'],
  },
  {
    id: 'critical_backup',
    title: 'Backup & Resiliência Crítica (No-Break Industrial / UPS)',
    shortName: 'Backup & UPS',
    category: 'Resiliência & Backup',
    description: 'Transição ultra-rápida (< 10-20ms) em ilhamento automático para manter cargas críticas (servidores, linhas de produção contínua, climatização) operando sem interrupção durante apagões ou quedas de tensão.',
    technicalDetails: 'Substitui ou complementa geradores a diesel ruidosos e poluentes, eliminando perdas por parada não programada e atrasos de sincronismo de gerador.',
    typicalSavingsRate: 'Elimina 100% dos custos com diesel e paradas de linha (milhares de R$/hora)',
    recommendedDurationHours: 2.0,
    iconName: 'ShieldAlert',
    tags: ['Sem Interrupção', 'Data Center', 'Cargas Críticas', 'Substitui Diesel'],
  },
  {
    id: 'solar_pv_integration',
    title: 'Hibridização Solar FV (PV + Storage / FTM & BTM)',
    shortName: 'Hibridização Solar FV',
    category: 'Geração & Rede',
    description: 'Armazena a geração solar que seria cortada por ordens do ONS (Curtailment) ou por restrição de exportação da distribuidora, permitindo injetar ou consumir energia limpa no início da noite.',
    technicalDetails: 'Ramp-rate control para suavizar flutuações rápidas de irradiação solar causadas por nuvens, garantindo estabilidade e curva de injeção previsível no Ponto de Conexão (PDC).',
    typicalSavingsRate: 'Recupera até 95% da energia cortada por curtailment',
    recommendedDurationHours: 4.0,
    iconName: 'SunMedium',
    tags: ['Curtailment', 'Solar Híbrido', 'Suavização de Rampa', 'ONS'],
  },
  {
    id: 'demand_charge_management',
    title: 'Gestão & Redução da Demanda Contratada (kW)',
    shortName: 'Otimização de Demanda',
    category: 'Comercial & Tarifário',
    description: 'Injeção instantânea de potência durante partidas pesadas de motores e picos operacionais para limitar a demanda máxima medida, reduzindo o valor da Demanda Contratada (kW) e evitando multas de ultrapassagem.',
    technicalDetails: 'Algoritmo preditivo de EMS detecta a curva de carga da planta e corta picos antes que a média de 15 minutos do medidor da concessionária seja ultrapassada.',
    typicalSavingsRate: 'Economia de 15% a 35% na fatura mensal de demanda contratada',
    recommendedDurationHours: 1.0,
    iconName: 'Activity',
    tags: ['Partida de Motores', 'Demanda Faturada', 'Evita Multas'],
  },
  {
    id: 'power_quality',
    title: 'Qualidade de Energia & Suporte de Tensão/Frequência',
    shortName: 'Qualidade & Frequência',
    category: 'Resiliência & Backup',
    description: 'Compensação dinâmica de potência reativa (var), correção automática do fator de potência em tempo real (evitando cobrança de reativos excedentes) e amortecimento de oscilações de tensão da rede.',
    technicalDetails: 'PCS operando nos quatro quadrantes P-Q como STATCOM com resposta em submilisegundos, protegendo equipamentos eletrônicos sensíveis.',
    typicalSavingsRate: 'Zera cobrança de energia reativa excedente na conta de luz',
    recommendedDurationHours: 1.0,
    iconName: 'Sliders',
    tags: ['Fator de Potência', 'STATCOM', 'Sem Multa de Reativo'],
  },
  {
    id: 'capacity_reserve',
    title: 'Reserva de Capacidade (Leilões LRCAP ONS / Aneel)',
    shortName: 'Reserva de Capacidade',
    category: 'Geração & Rede',
    description: 'Participação em leilões de reserva de capacidade do Ministério de Minas e Energia (MME), recebendo receita fixa garantida em R$/MW.ano para disponibilizar potência firme nos momentos críticos do SIN.',
    technicalDetails: 'Projetos Utility-scale de 10 MW a 100+ MW conectados ao grid básico ou em subestações de transmissão/distribuição com contrato de receita de capacidade de longo prazo.',
    typicalSavingsRate: 'Receita fixa garantida por disponibilidade de potência',
    recommendedDurationHours: 4.0,
    iconName: 'Building2',
    tags: ['Leilão Aneel', 'MME / ONS', 'Receita Garantida', 'Utility Scale'],
  },
];

/**
 * Concessionárias brasileiras e dados de referência tarifária
 */
export const BRAZILIAN_UTILITIES_DATA = [
  {
    id: 'enel_sp',
    name: 'Enel Distribuição São Paulo',
    state: 'SP',
    averagePeakTariff: 2.18,
    averageOffPeakTariff: 0.49,
    averageDemandTariff: 34.50,
  },
  {
    id: 'cemig_mg',
    name: 'Cemig Distribuição (Minas Gerais)',
    state: 'MG',
    averagePeakTariff: 2.05,
    averageOffPeakTariff: 0.46,
    averageDemandTariff: 38.20,
  },
  {
    id: 'cpfl_paulista',
    name: 'CPFL Paulista (Interior de SP)',
    state: 'SP',
    averagePeakTariff: 2.12,
    averageOffPeakTariff: 0.48,
    averageDemandTariff: 35.80,
  },
  {
    id: 'neoenergia_elektro',
    name: 'Neoenergia Elektro (SP/MS)',
    state: 'SP',
    averagePeakTariff: 2.08,
    averageOffPeakTariff: 0.47,
    averageDemandTariff: 33.90,
  },
  {
    id: 'copel_pr',
    name: 'Copel Distribuição (Paraná)',
    state: 'PR',
    averagePeakTariff: 1.95,
    averageOffPeakTariff: 0.44,
    averageDemandTariff: 31.40,
  },
  {
    id: 'equatorial_go',
    name: 'Equatorial Energia Goiás',
    state: 'GO',
    averagePeakTariff: 2.24,
    averageOffPeakTariff: 0.52,
    averageDemandTariff: 36.10,
  },
  {
    id: 'light_rj',
    name: 'Light Serviços de Eletricidade (Rio de Janeiro)',
    state: 'RJ',
    averagePeakTariff: 2.32,
    averageOffPeakTariff: 0.54,
    averageDemandTariff: 42.00,
  },
  {
    id: 'enel_ce',
    name: 'Enel Distribuição Ceará (Fortaleza)',
    state: 'CE',
    averagePeakTariff: 2.29,
    averageOffPeakTariff: 0.51,
    averageDemandTariff: 37.80,
  },
];

export interface UtilityTariffRef {
  utility: string;
  state: string;
  peakKwhGreen: number;
  offPeakKwh: number;
  demandKwMonth: number;
}

export const BRAZIL_UTILITY_TARIFFS: UtilityTariffRef[] = BRAZILIAN_UTILITIES_DATA.map((u) => ({
  utility: u.name,
  state: u.state,
  peakKwhGreen: u.averagePeakTariff,
  offPeakKwh: u.averageOffPeakTariff,
  demandKwMonth: u.averageDemandTariff,
}));

/**
 * Soluções Comerciais e Técnicas de Fabricantes de BESS Disponíveis no Brasil
 */
export const BRAZIL_BESS_VENDORS: BessVendorProduct[] = [
  {
    id: 'huawei',
    vendorName: 'Huawei Digital Power',
    flagCountry: '🇨🇳 / 🇧🇷',
    productLine: 'Smart String ESS (LUNA2000-2.0MWH-2H1 / LUNA2000-100KTL)',
    architectureType: 'Smart String Descentralizado',
    coolingMethod: 'Liquid Cooling Inteligente',
    standardBlockSizeMwh: 2.0,
    standardBlockPowerMw: 1.0,
    roundTripEfficiency: 91.5,
    warrantyYears: 10,
    guaranteedCycles: 6800,
    finameBndesEligible: false,
    brazilLocalPresence: {
      headquarters: 'São Paulo (SP) - Centro de Distribuição em Louveira & Sorocaba',
      fieldServiceSLA: 'Atendimento de campo em até 24h a 48h com time de engenharia próprio',
      partsInventoryInBrazil: true,
      localEngineeringSupport: 'Time de suporte N3 e pós-venda dedicado no Brasil, certificação técnica Huawei Gold Partners',
    },
    safetyCertifications: ['UL 9540A', 'NFPA 855', 'IEC 62619', 'UN 38.3', 'Proteção Ativa AFCI por Inteligência Artificial'],
    estimatedCapexPerKwhBrl: 1650, // R$/kWh
    strengths: [
      'Topologia de inversores descentralizada: 1 otimizador independente por pack de bateria, eliminando perda de capacidade por efeito barril (mismatch).',
      'Manutenção sem parada do sistema: troca modular de pack defeituoso sem desbalancear as outras baterias e sem calibração complexa.',
      'Refrigeração líquida inteligente com gradiente térmico < 2.5°C entre células, elevando vida útil em 50%.',
      'Proteção contra arco elétrico (AFCI) baseada em algoritmos neurais com desligamento ultra-rápido em 0.5s.',
      'Excelente integração com a linha de inversores solares Huawei já amplamente instalada no Brasil.',
    ],
    keyConsiderations: [
      'Solução importada (não elegível diretamente a financiamento Finame BNDES padrão, mas financiável via linhas verdes e bancos privados como Santander, BV, BB).',
      'Investimento inicial ligeramente superior ao de soluções centralizadas brutas, amplamente compensado pelo menor Opex e maior energia descarregada.',
    ],
    recommendedUseCases: [
      'Projetos C&I industriais e comerciais de 500 kW a 5 MW',
      'Sistemas de missão crítica (Data Centers, Hospitais, Telecom)',
      'Usinas solares híbridas que exigem alta disponibilidade sem parada total para manutenção',
    ],
    overallRating: 4.9,
  },
  {
    id: 'sungrow',
    vendorName: 'Sungrow Power Supply',
    flagCountry: '🇨🇳 / 🇧🇷',
    productLine: 'PowerTitan Series (ST2752K / ST5016K Liquid Cooled ESS)',
    architectureType: 'Centralizado Integrado',
    coolingMethod: 'Liquid Cooling Inteligente',
    standardBlockSizeMwh: 2.75,
    standardBlockPowerMw: 1.37,
    roundTripEfficiency: 91.0,
    warrantyYears: 10,
    guaranteedCycles: 6500,
    finameBndesEligible: false,
    brazilLocalPresence: {
      headquarters: 'São Paulo (SP) e suporte regional em MG e Nordeste',
      fieldServiceSLA: 'SLA de 48h para chamados técnicos em campo',
      partsInventoryInBrazil: true,
      localEngineeringSupport: 'Líder em volume de vendas no Brasil para usinas solares e BESS utility scale',
    },
    safetyCertifications: ['UL 9540', 'UL 9540A', 'NFPA 855', 'IEC 62477-1', 'IEC 62619'],
    estimatedCapexPerKwhBrl: 1520, // R$/kWh
    strengths: [
      'Maior densidade energética por metro quadrado em contêineres de 20 e 40 pés padronizados.',
      'Líder global de mercado e alta bancabilidade comprovada internacionalmente por relatórios BloombergNEF.',
      'Sistema PCS integrado e pré-comissionado de fábrica, reduzindo tempo e custos de montagem em campo (EPC).',
      'Controle de temperatura por zona que minimiza consumo parasitário dos chillers.',
    ],
    keyConsiderations: [
      'Arquitetura centralizada: eventual falha no PCS ou conjunto de strings paralelos afeta um bloco maior de capacidade.',
      'Requer guindastes pesados e fundação civil robusta no local da obra.',
    ],
    recommendedUseCases: [
      'Projetos de grande porte e Utility Scale (acima de 5 MW / 10 MWh)',
      'Usinas FTM de transmissão e leilões de reserva de capacidade',
      'Grandes indústrias com espaço físico concentrado',
    ],
    overallRating: 4.8,
  },
  {
    id: 'byd',
    vendorName: 'BYD Energy Brasil',
    flagCountry: '🇨🇳 / 🇧🇷',
    productLine: 'MC Cube ESS (Blade Battery CTP Technology)',
    architectureType: 'Blade CTP Modular',
    coolingMethod: 'Liquid Cooling Microcanal',
    standardBlockSizeMwh: 2.6,
    standardBlockPowerMw: 1.25,
    roundTripEfficiency: 90.5,
    warrantyYears: 10,
    guaranteedCycles: 7000,
    finameBndesEligible: false, // Em fase de homologação parcial de componentes
    brazilLocalPresence: {
      headquarters: 'Campinas (SP), Manaus (AM) e complexo industrial em Camaçari (BA)',
      fieldServiceSLA: 'Presença fabril e assistência técnica de grande capilaridade no Brasil',
      partsInventoryInBrazil: true,
      localEngineeringSupport: 'Fábrica e laboratórios de homologação instalados no Brasil',
    },
    safetyCertifications: ['UL 9540A', 'NFPA 855', 'IEC 62619', 'Nail Penetration Test (Aprovado sem chamas)'],
    estimatedCapexPerKwhBrl: 1580, // R$/kWh
    strengths: [
      'Célula Blade proprietária com extrema segurança química intrínseca: não entra em fuga térmica mesmo sob perfuração mecânica.',
      'Tecnologia Cell-to-Pack (CTP) com redução drástica de cabeamento interno e maior aproveitamento de volume.',
      'Forte infraestrutura corporativa no Brasil, com fábrica e suporte de longo prazo.',
      'Excelente resistência a ciclos profundos contínuos (100% DoD).',
    ],
    keyConsiderations: [
      'Demanda de entrega e prazos sujeitos à alocação global de produção da BYD.',
      'Integração de PCS externo requer alinhamento detalhado com fabricantes de inversores homologados.',
    ],
    recommendedUseCases: [
      'Instalações em áreas com exigências severas de segurança contra incêndio e proximidade de centros urbanos',
      'Aplicações industriais pesadas de múltiplos ciclos diários',
      'Projetos com preferência por fornecedores com investimentos fabris no Brasil',
    ],
    overallRating: 4.7,
  },
  {
    id: 'weg',
    vendorName: 'WEG Equipamentos Elétricos',
    flagCountry: '🇧🇷',
    productLine: 'WEG W-ESS (Solução Integrada de Armazenamento Nacional)',
    architectureType: 'Industrial Nacionalizado',
    coolingMethod: 'Liquid Cooling / Ar Híbrido',
    standardBlockSizeMwh: 1.5,
    standardBlockPowerMw: 0.75,
    roundTripEfficiency: 89.5,
    warrantyYears: 10,
    guaranteedCycles: 6000,
    finameBndesEligible: true, // Diferencial chave
    brazilLocalPresence: {
      headquarters: 'Jaraguá do Sul (SC) com fábricas em SP, RS, MG, PE e filiais em todo o Brasil',
      fieldServiceSLA: 'Atendimento e corpo técnico próprio ou autorizado em praticamente qualquer município do país',
      partsInventoryInBrazil: true,
      localEngineeringSupport: '100% nacional com engenharia de aplicação da WEG, sem barreiras de idioma ou importação',
    },
    safetyCertifications: ['ABNT NBR', 'NR-10', 'NR-12', 'IEC 62619', 'UL 9540'],
    estimatedCapexPerKwhBrl: 1780, // R$/kWh
    strengths: [
      'Elegibilidade comprovada para financiamento FINAME / BNDES, com acesso a taxas de juros subsidiadas e linhas de crédito público brasileiras.',
      'Inversores bidirecionais, transformadores elevadores, cubículos de média tensão e painéis de proteção de fabricação própria WEG.',
      'Capilaridade incomparável de assistência técnica no território nacional.',
      'Facilidade extrema de homologação e aprovação de projeto junto a todas as distribuidoras de energia do Brasil (Enel, Cemig, CPFL, etc.).',
    ],
    keyConsiderations: [
      'Preço base por kWh ligeiramente superior devido aos custos de montagem nacionalizada.',
      'Células de bateria LFP são integradas de fornecedores parceiros Tier 1 globais.',
    ],
    recommendedUseCases: [
      'Projetos que dependem de financiamento via BNDES / FINAME / FCO / FNE',
      'Empresas públicas, estatais e concessões que exigem conteúdo local brasileiro',
      'Plantas industriais que já utilizam padrão WEG em seus motores, inversores e subestações',
    ],
    overallRating: 4.7,
  },
  {
    id: 'tesla',
    vendorName: 'Tesla Energy',
    flagCountry: '🇺🇸 / 🇧🇷 (Importação)',
    productLine: 'Megapack 2XL Series (3.9 MWh All-In-One Container)',
    architectureType: 'Centralizado Integrado',
    coolingMethod: 'Liquid Cooling Inteligente',
    standardBlockSizeMwh: 3.9,
    standardBlockPowerMw: 1.95,
    roundTripEfficiency: 92.0,
    warrantyYears: 15,
    guaranteedCycles: 7500,
    finameBndesEligible: false,
    brazilLocalPresence: {
      headquarters: 'Atendimento via integradores credenciados e suporte internacional para a América Latina',
      fieldServiceSLA: 'SLA contratual mediante integrador local certificado',
      partsInventoryInBrazil: false,
      localEngineeringSupport: 'Equipe de software remota 24/7 com diagnósticos de telemetria OTA',
    },
    safetyCertifications: ['UL 9540', 'UL 9540A', 'NFPA 855', 'IEC 62619', 'FM Global Data Sheet 5-33'],
    estimatedCapexPerKwhBrl: 1850, // R$/kWh (incluindo taxas e logística de importação)
    strengths: [
      'Solução turnkey all-in-one mais testada e respeitada globalmente com 3.9 MWh em único contêiner compacto.',
      'Software preditivo de arbitragem Autobidder com algoritmos de machine learning líderes de mercado.',
      'Garantia estendida de fábrica de até 15 a 20 anos com curva de degradação muito conservadora.',
      'Maior valor de marca e bancabilidade em fundos de investimento internacionais de infraestrutura.',
    ],
    keyConsiderations: [
      'Necessidade de importação formal com tributos de nacionalização e exposição cambial direta.',
      'Sem inventário de peças e sem time fabril próprio no Brasil (dependência de parceiros locais certificados).',
      'Prazos de entrega mais dilatados.',
    ],
    recommendedUseCases: [
      'Grandes investidores internacionais e fundos de private equity com capital em dólares',
      'Projetos complexos focados em arbitragem pura de energia e algoritmos de trading',
    ],
    overallRating: 4.6,
  },
];

/**
 * Presets de Dimensionamento BESS Prontos para Teste
 */
export const BESS_PROJECT_PRESETS = [
  {
    id: 'industrial_peak_shaving',
    name: 'Indústria Automotiva / Manufatura (Peak Shaving & Demanda)',
    badge: 'C&I Industrial - Grupo A4',
    clientName: 'Indústria Metalmecânica do Brasil S/A',
    city: 'Campinas',
    state: 'SP',
    utilityCompany: 'CPFL Paulista (Interior de SP)',
    subgroup: 'A4 (2.3kV - 25kV)' as const,
    tariffModality: 'Horária Verde' as const,
    connectionVoltage: '13.8 kV',
    targetPowerKw: 1000, // 1 MW
    durationHours: 3.0, // 3 MWh
    dailyPeakHours: 3,
    peakLoadKw: 1800,
    offPeakLoadKw: 1200,
    solarPvCapacityKwp: 500,
    contractedDemandKw: 1500,
    peakTariff: 2.12,
    offPeakTariff: 0.48,
    demandTariff: 35.80,
    cyclesPerDay: 1.0,
    selectedApplications: ['peak_shaving', 'demand_charge_management', 'critical_backup'] as const,
  },
  {
    id: 'datacenter_critical_backup',
    name: 'Hyperscale Data Center (Backup Crítico + Corte de Ponta)',
    badge: 'Missão Crítica - Grupo A2',
    clientName: 'Americas Cloud & AI Data Center Tier III',
    city: 'Vinhedo / Barueri',
    state: 'SP',
    utilityCompany: 'Enel Distribuição São Paulo',
    subgroup: 'A2 (88kV - 138kV)' as const,
    tariffModality: 'Horária Azul' as const,
    connectionVoltage: '88 kV / 13.8 kV',
    targetPowerKw: 5000, // 5 MW
    durationHours: 2.0, // 10 MWh
    dailyPeakHours: 3,
    peakLoadKw: 8000,
    offPeakLoadKw: 7500,
    solarPvCapacityKwp: 0,
    contractedDemandKw: 8500,
    peakTariff: 2.18,
    offPeakTariff: 0.49,
    demandTariff: 34.50,
    cyclesPerDay: 1.2,
    selectedApplications: ['critical_backup', 'peak_shaving', 'power_quality'] as const,
  },
  {
    id: 'solar_farm_hybrid',
    name: 'Usina Solar Fotovoltaica Híbrida (Mitigação de Curtailment)',
    badge: 'Geração Híbrida - FTM ACL',
    clientName: 'Complexo Solar UFV Sertão Verde (40 MWp)',
    city: 'Pirapora',
    state: 'MG',
    utilityCompany: 'Cemig Distribuição (Minas Gerais)',
    subgroup: 'A2 (88kV - 138kV)' as const,
    tariffModality: 'Horária Azul' as const,
    connectionVoltage: '138 kV / 34.5 kV',
    targetPowerKw: 10000, // 10 MW
    durationHours: 4.0, // 40 MWh
    dailyPeakHours: 3,
    peakLoadKw: 15000,
    offPeakLoadKw: 10000,
    solarPvCapacityKwp: 40000,
    contractedDemandKw: 12000,
    peakTariff: 2.05,
    offPeakTariff: 0.46,
    demandTariff: 38.20,
    cyclesPerDay: 1.5,
    selectedApplications: ['solar_pv_integration', 'energy_arbitrage', 'capacity_reserve'] as const,
  },
  {
    id: 'commercial_shopping',
    name: 'Shopping Center / Hospital Regional (Resiliência & Ponta)',
    badge: 'Comercial Grande Porte - Grupo A4',
    clientName: 'Plaza Shopping & Medical Center',
    city: 'Belo Horizonte',
    state: 'MG',
    utilityCompany: 'Cemig Distribuição (Minas Gerais)',
    subgroup: 'A4 (2.3kV - 25kV)' as const,
    tariffModality: 'Horária Verde' as const,
    connectionVoltage: '13.8 kV',
    targetPowerKw: 600, // 600 kW
    durationHours: 3.0, // 1.8 MWh
    dailyPeakHours: 3,
    peakLoadKw: 1100,
    offPeakLoadKw: 700,
    solarPvCapacityKwp: 350,
    contractedDemandKw: 950,
    peakTariff: 2.05,
    offPeakTariff: 0.46,
    demandTariff: 38.20,
    cyclesPerDay: 1.0,
    selectedApplications: ['peak_shaving', 'critical_backup', 'demand_charge_management'] as const,
  },
];
