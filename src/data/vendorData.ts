export interface VendorProfile {
  id: string;
  name: string;
  brand: string;
  origin: string;
  flag: string;
  marketShareLatam: string;
  marketShareGlobal: string;
  marketTier?: 'emerging' | 'mature';
  leadTimeWeeks: string;
  averagePueAi: number;
  capexIndexUsdPerMw: number; // Estimated turnkey infrastructure CapEx per MW (substation, UPS, cooling, prefab modules)
  opexAnnualMaintPercent: number; // Annual maintenance & service SLA cost as % of CapEx
  powerPodSolution: {
    name: string;
    description: string;
    efficiencyRating: string;
    footprintFootprintReduction: string;
    bessTech: string;
  };
  coolingSolution: {
    name: string;
    type: string;
    maxDensityPerRackKw: number;
    waterConsumptionLitrePerKwh: number;
    techHighlights: string;
  };
  modularPrefabSolution: {
    name: string;
    deploymentTimeMonths: number;
    description: string;
  };
  dcimSoftware: {
    name: string;
    aiFeatures: string;
  };
  geopoliticalAndCompliance: {
    usNdaaCompliance: boolean;
    usHyperscalerAcceptance: 'Restrito/Bloqueado' | 'Universal (AWS, MSFT, GOOG, META)' | 'Ampla';
    latamSupportNetwork: string;
    tariffsAndImportTaxesLatam: string;
  };
  pros: string[];
  cons: string[];
  recommendedUseCases: string[];
}

export const VENDORS_DATA: VendorProfile[] = [
  {
    id: 'huawei',
    name: 'Huawei Digital Power',
    brand: 'Huawei',
    origin: 'China',
    flag: '🇨🇳',
    marketShareLatam: '~32% em novos módulos pré-fabricados e telecom',
    marketShareGlobal: '~18% (líder na Ásia e forte em mercados emergentes)',
    leadTimeWeeks: '16 - 24 semanas (Altíssima agilidade na cadeia de suprimentos)',
    averagePueAi: 1.15,
    capexIndexUsdPerMw: 1850000, // $1.85M / MW
    opexAnnualMaintPercent: 3.2,
    powerPodSolution: {
      name: 'PowerPOD 3.0 / SmartLi UPS',
      description: 'Solução integrada de subestação a montante, barramento pré-fabricado e baterias SmartLi LFP. Elimina cabeamento tradicional e reduz em 40% o espaço ocupado.',
      efficiencyRating: 'Até 97.5% em modo online dupla conversão e 99.1% em modo S-ECO inteligente.',
      footprintFootprintReduction: '-40% de área na sala elétrica (mais espaço para racks de GPUs)',
      bessTech: 'SmartLi (LFP de alta densidade com controle ativo de balanceamento de células e extintor de aerossol embutido no pack).',
    },
    coolingSolution: {
      name: 'NetCol8000 / Direct-to-Chip + Evaporative Indirect',
      type: 'Híbrido Líquido Direct-to-Chip + Resfriamento Evaporativo Indireto a Ar',
      maxDensityPerRackKw: 120,
      waterConsumptionLitrePerKwh: 0.15, // Quase zero em modo seco
      techHighlights: 'CDUs integradas com controle preditivo iCooling por IA, ajustando velocidade de bombas conforme a carga térmica em tempo real dos clusters de IA.',
    },
    modularPrefabSolution: {
      name: 'FusionDC 1000A / 1000B (Prefabricated Modular Data Center)',
      deploymentTimeMonths: 6, // 6 a 9 meses
      description: 'Módulos pré-testados e pré-comissionados em fábrica com estrutura de contêiner e arquitetura multicamada LEGO. Montagem em campo 50% mais rápida.',
    },
    dcimSoftware: {
      name: 'NetEco 6000 / iManager',
      aiFeatures: 'Otimização energética contínua via algoritmos de Machine Learning (iCooling e iPower), reduzindo o PUE em até 8% a 15% através de ajuste térmico dinâmico.',
    },
    geopoliticalAndCompliance: {
      usNdaaCompliance: false,
      usHyperscalerAcceptance: 'Restrito/Bloqueado',
      latamSupportNetwork: 'Centros de peças e engenharia de suporte direto em São Paulo, Rio, Querétaro, Santiago, Bogotá e Buenos Aires.',
      tariffsAndImportTaxesLatam: 'Excelente competitividade tarifária; parcerias diretas com integradores e fábricas no Brasil e México.',
    },
    pros: [
      'Menor CapEx do mercado (15% a 25% mais econômico que concorrentes norte-americanos e europeus).',
      'Prazos de entrega imbatíveis (16-24 semanas vs 40-60+ semanas em fornecedores ocidentais com gargalo de transformadores).',
      'Alta integração de ponta a ponta: do painel de média tensão à CDU líquida e baterias SmartLi no mesmo ecossistema.',
      'Excelente penetração e suporte técnico local nos polos da América Latina (Brasil, Chile, México).',
    ],
    cons: [
      'Restrições geopolíticas severas nos Estados Unidos (NDAA, FCC): inviável para datacenters que buscam locação direta para agências federais dos EUA ou contratos diretos com certas hiperescalas americanas restritas.',
      'Risco de percepção de marca corporativa para fundos institucionais norte-americanos de private equity.',
    ],
    recommendedUseCases: [
      'Datacenters de IA de operadoras de telecomunicações e provedores de colocation regionais na América Latina.',
      'Projetos de IA soberana e privada que priorizam menor CapEx e entrada em operação urgente (Time-to-Market < 9 meses).',
      'Mercados emergentes onde prazos de entrega ocidentais de 50+ semanas atrasariam a viabilidade comercial do projeto.',
    ],
  },
  {
    id: 'vertiv',
    name: 'Vertiv (ex-Emerson Network Power)',
    brand: 'Vertiv',
    origin: 'Estados Unidos',
    flag: '🇺🇸',
    marketTier: 'mature',
    marketShareLatam: '~30% em colocation e infraestrutura corporativa',
    marketShareGlobal: '~28% (Líder em infraestrutura de missão crítica e refrigeração líquida para IA)',
    leadTimeWeeks: '36 - 52 semanas (Gargalo global em transformadores e CDUs de grande porte)',
    averagePueAi: 1.18,
    capexIndexUsdPerMw: 2350000, // $2.35M / MW
    opexAnnualMaintPercent: 4.1,
    powerPodSolution: {
      name: 'Vertiv Trinergy / Liebert EXL S1 / Vertiv Power Module',
      description: 'Topologia escalável monolítica e modular com arquitetura 2N ou N+1 tolerante a falhas, combinando UPS Trinergy e gabinetes de baterias de lítio com redundância avançada.',
      efficiencyRating: 'Até 97% em dupla conversão e 99% em modo Dynamic Online.',
      footprintFootprintReduction: '-25% comparado a sistemas legados de transformadores isolados.',
      bessTech: 'Integração flexível com parceiros certificados de LFP (Samsung SDI, CATL, Vertiv HPL).',
    },
    coolingSolution: {
      name: 'Vertiv 360AI / Liebert XDU / Liebert DCD',
      type: 'Direct-to-Chip Liquid Cooling + CDUs de Alto Fluxo + Free Cooling Seco',
      maxDensityPerRackKw: 140,
      waterConsumptionLitrePerKwh: 0.05,
      techHighlights: 'Parceria de referência com a NVIDIA para arquiteturas GB200 NVL72; CDUs com capacidade de dissipação de até 1.35 MW térmico por unidade.',
    },
    modularPrefabSolution: {
      name: 'Vertiv MegaMod / SmartMod',
      deploymentTimeMonths: 11, // 10 a 14 meses
      description: 'Módulos construídos sob medida em fábricas nos EUA e Europa, com certificação Uptime Institute Tier III pronta para entrega.',
    },
    dcimSoftware: {
      name: 'Vertiv Environet Alert & Trellis Suite',
      aiFeatures: 'Monitoramento granular de telemetria de rack, vazão de fluido dieletrico e modelagem de CFD (Dinâmica dos Fluidos Computacional).',
    },
    geopoliticalAndCompliance: {
      usNdaaCompliance: true,
      usHyperscalerAcceptance: 'Universal (AWS, MSFT, GOOG, META)',
      latamSupportNetwork: 'Extensa rede de assistência e engenharia técnica presente há décadas em todos os países das Américas.',
      tariffsAndImportTaxesLatam: 'Importação sujeita a tarifas plenas e flutuações cambiais em dólar.',
    },
    pros: [
      'Padrão de ouro e preferência número 1 dos grandes hyperscalers dos EUA (AWS, Microsoft, Meta, Google).',
      'Arquitetura de refrigeração líquida certificada e validada em conjunto com os nós de GPU da NVIDIA.',
      '100% de conformidade com as exigências regulatórias, de cibersegurança e compliance dos EUA.',
      'Extensa base de engenheiros certificados e peças de reposição já instaladas nos grandes centros de dados da América Latina.',
    ],
    cons: [
      'CapEx significativamente mais elevado (25% a 30% superior à solução equivalente da Huawei).',
      'Fila de espera e lead time de entrega dilatados (36 a 52 semanas) para grandes transformadores e CDUs.',
      'Custo de peças e contratos de manutenção SLA anuais mais onerosos.',
    ],
    recommendedUseCases: [
      'Projetos desenvolvidos para locação (Lease) direta a hiperescalas norte-americanas (Wholesale Colocation Tier III/IV).',
      'Infraestrutura financiada por fundos institucionais de infraestrutura dos EUA/Europa com cláusulas estritas de governança.',
      'Superclusters de GPU NVIDIA GB200 onde a compatibilidade de referência do ecossistema é o fator decisivo.',
    ],
  },
  {
    id: 'schneider',
    name: 'Schneider Electric',
    brand: 'Schneider Electric',
    origin: 'França / União Europeia',
    flag: '🇪🇺',
    marketTier: 'mature',
    marketShareLatam: '~26% em gestão de energia e distribuição',
    marketShareGlobal: '~24% (Líder em automação elétrica e switchgear)',
    leadTimeWeeks: '32 - 48 semanas',
    averagePueAi: 1.17,
    capexIndexUsdPerMw: 2280000, // $2.28M / MW
    opexAnnualMaintPercent: 3.8,
    powerPodSolution: {
      name: 'Galaxy VX / Galaxy V-Series / EcoStruxure Power',
      description: 'Líder mundial em painéis de média tensão (SM6, Premset) e no-breaks Galaxy com tecnologia patentada ECOnversion, atingindo 99% de eficiência.',
      efficiencyRating: 'Até 99% de eficiência em modo ECOnversion patenteado Classe 1.',
      footprintFootprintReduction: '-30% de pegada com barramentos Canalis e baterias Li-Ion.',
      bessTech: 'Integração de baterias de íon de lítio com sistema BMS monitorado pela nuvem EcoStruxure.',
    },
    coolingSolution: {
      name: 'Uniflair / Motivair Liquid Cooling (Adquirida)',
      type: 'Direct-to-Chip CDUs + Chillers Adiabáticos de Circuito Fechado',
      maxDensityPerRackKw: 130,
      waterConsumptionLitrePerKwh: 0.08,
      techHighlights: 'Aquisição da Motivair (pioneira americana em resfriamento líquido de supercomputadores) trouxe CDUs de altíssima densidade compatíveis com chips Blackwell.',
    },
    modularPrefabSolution: {
      name: 'EcoStruxure Modular Data Centers (All-in-One & Power Modules)',
      deploymentTimeMonths: 10,
      description: 'Módulos customizados montados em fábricas regionais (incluindo México e Europa), com certificação ISO e rastreamento de pegada de carbono embodied.',
    },
    dcimSoftware: {
      name: 'EcoStruxure IT (Data Center Expert & Advisor)',
      aiFeatures: 'Algoritmos preditivos de manutenção para quadros elétricos e disjuntores inteligentes; inventário digital e rastreamento de emissões de Escopo 1, 2 e 3.',
    },
    geopoliticalAndCompliance: {
      usNdaaCompliance: true,
      usHyperscalerAcceptance: 'Universal (AWS, MSFT, GOOG, META)',
      latamSupportNetwork: 'Fábricas de montagem e quadros em São Paulo e México; milhares de integradores certificados.',
      tariffsAndImportTaxesLatam: 'Boa flexibilidade fiscal devido a produção de quadros elétricos e transformadores dentro do Mercosul e México.',
    },
    pros: [
      'Melhor portfólio elétrico do mercado: da subestação de 138kV até o disjuntor final do rack (Medium & Low Voltage integrada).',
      'Plena aceitação regulatória em todo o continente americano (EUA, Canadá, México, Brasil, Chile).',
      'Forte liderança em relatórios e auditorias ESG de sustentabilidade e cálculo de emissões em tempo real.',
      'Aquisição da Motivair fortaleceu enormemente o portfólio de CDUs e cold plates para IA.',
    ],
    cons: [
      'Preço de aquisição (CapEx) substancialmente superior à Huawei.',
      'Sistemas legados de refrigeração exigem integração cuidadosa com as novas linhas Motivair para clusters extremos de 100kW+.',
    ],
    recommendedUseCases: [
      'Projetos que exigem conformidade ESG e reporte estrito de emissões para acionistas globais.',
      'Campi de hiperescala que necessitam de distribuição elétrica unificada da subestação de alta tensão ao rack.',
      'Datacenters corporativos, bancários e de IA híbrida em mercados regulados da América Latina.',
    ],
  },
  {
    id: 'eaton',
    name: 'Eaton Corporation',
    brand: 'Eaton',
    origin: 'Estados Unidos / Irlanda',
    flag: '🇺🇸',
    marketTier: 'mature',
    marketShareLatam: '~12% em distribuição e proteção elétrica',
    marketShareGlobal: '~14% (Forte em no-breaks de alta eficiência e grid-interactive)',
    leadTimeWeeks: '30 - 44 semanas',
    averagePueAi: 1.20,
    capexIndexUsdPerMw: 2150000, // $2.15M / MW
    opexAnnualMaintPercent: 3.6,
    powerPodSolution: {
      name: 'Power Xpert 9395XR / EnergyAware UPS',
      description: 'Tecnologia pioneira que transforma o no-break do datacenter em um ativo de rede (Grid-Interactive UPS), permitindo vender serviços de regulação de frequência para a concessionária.',
      efficiencyRating: 'Até 97% em dupla conversão e 99% com tecnologia ESS (Energy Saver System).',
      footprintFootprintReduction: '-20% de área na sala de no-breaks.',
      bessTech: 'Sistemas BESS modulares com compatibilidade multiparceiro e software de despacho inteligente.',
    },
    coolingSolution: {
      name: 'Cooling Distribution Units (CDU) em parceria com especialistas térmicos',
      type: 'Parcerias OEM para Refrigeração Líquida + In-Row Chilled Water',
      maxDensityPerRackKw: 100,
      waterConsumptionLitrePerKwh: 0.12,
      techHighlights: 'Foco na proteção elétrica, barramentos de altíssima corrente e monitoramento térmico de pontos quentes em barramentos.',
    },
    modularPrefabSolution: {
      name: 'Eaton Modular Power Solutions',
      deploymentTimeMonths: 10,
      description: 'Skids e contêineres elétricos plug-and-play para subestações e no-breaks externos, liberando área útil de piso (white space) interno.',
    },
    dcimSoftware: {
      name: 'Brightlayer Data Centers suite',
      aiFeatures: 'Gestão de microrrede, gerenciamento de picos de demanda (Peak Shaving) e controle bidirecional de energia com a rede local.',
    },
    geopoliticalAndCompliance: {
      usNdaaCompliance: true,
      usHyperscalerAcceptance: 'Universal (AWS, MSFT, GOOG, META)',
      latamSupportNetwork: 'Forte presença em quadros e distribuição industrial no Brasil e México.',
      tariffsAndImportTaxesLatam: 'Fábricas de componentes elétricos no Brasil e México proporcionam facilidades de entrega em média tensão.',
    },
    pros: [
      'Pioneirismo em UPS Grid-Interactive (permite monetizar o BESS do datacenter participando de leilões de reserva de capacidade com concessionárias).',
      'Excelente engenharia de manobra e seletividade em painéis elétricos industriais de alta confiabilidade.',
      'Total conformidade com leis e padrões de compras dos Estados Unidos.',
    ],
    cons: [
      'Portfólio de refrigeração líquida direta é menos integrado nativamente que o da Vertiv e Huawei (depende mais de alianças e parceiros de CDUs).',
      'Menor escala em soluções all-in-one para contêineres de dados completos de IA.',
    ],
    recommendedUseCases: [
      'Datacenters instalados em regiões com redes instáveis ou onde há incentivos regulatórios para suporte de frequência à rede (ex: Texas ERCOT e Nordeste do Brasil).',
      'Projetos focados em infraestrutura elétrica modular externa (Power Skids).',
    ],
  },
];
