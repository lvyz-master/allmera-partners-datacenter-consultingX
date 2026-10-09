export interface JurisdictionPolicy {
  country: string;
  flag: string;
  ppaModel: string;
  selfGenerationLaw: string;
  gridChargesExemption: string;
  irecStatus: string;
  twentyFourSevenReadiness: string;
  waterAndCoolingMandates: string;
  taxIncentivesSummary: string;
  keyRegulatoryBody: string;
  strategicTakeaway: string;
}

export const REGULATORY_COMPENDIUM: JurisdictionPolicy[] = [
  {
    country: 'Brasil',
    flag: '🇧🇷',
    keyRegulatoryBody: 'ANEEL, CCEE, ONS, MME',
    ppaModel: 'Ambiente de Contratação Livre (ACL) com contratos bilaterais de compra e venda de energia (CCVEE). Total flexibilidade para prazos de 10 a 20 anos.',
    selfGenerationLaw: 'Autoprodução por Equiparação (Lei Federal 9.074/1995 e Lei 14.120/2021). Permite que o data center adquira participação societária em usina eólica ou solar para ser considerado autoprodutor de energia.',
    gridChargesExemption: 'Isenção legal de encargos da Conta de Desenvolvimento Energético (CDE) e PROINFA sobre a parcela de energia autoproduzida, gerando economia tarifária de 20% a 35% no custo final do MWh.',
    irecStatus: 'Mercado de I-REC plenamente ativo operado pelo Instituto Totum, com ampla oferta de certificados eólicos, solares e de biomassa.',
    twentyFourSevenReadiness: 'Alta viabilidade técnica devido à complementaridade do Sistema Interligado Nacional (SIN): hidroelétricas atuam como "baterias naturais" virtuais para suportar eólica/solar.',
    waterAndCoolingMandates: 'Resoluções da ANA e agências estaduais (ex: DAEE em SP) impõem limites severos e outorgas onerosas para captação de água em bacias sob estresse hídrico. Recomenda-se Direct Liquid Cooling de circuito fechado com trocadores adiabáticos.',
    taxIncentivesSummary: 'Regime Especial de Incentivos para o Desenvolvimento da Infraestrutura (REIDI) com suspensão de PIS/COFINS (9.25%) na aquisição de bens de capital de subestações e geração renovável.',
    strategicTakeaway: 'O modelo de Autoprodução de Energia brasileiro é o mecanismo regulatório mais vantajoso da América Latina para viabilizar datacenters de IA de 50MW+ com tarifas líquidas na faixa de $50-$65/MWh 100% renováveis.',
  },
  {
    country: 'México',
    flag: '🇲🇽',
    keyRegulatoryBody: 'CFE, CRE, CENACE, SENER',
    ppaModel: 'Mercado Eléctrico Mayorista (MEM). Contratos de cobertura elétrica bilateral entre Usuários Qualificados (>1 MW) e Fornecedores Qualificados.',
    selfGenerationLaw: 'Abasto Aislado (Geração no Local) e Co-geração: A lei permite gerar energia no mesmo sítio do data center sem usar a rede de transmissão da CFE, mitigando as filas de conexão do CENACE.',
    gridChargesExemption: 'Tarifas de transmissão (porteo) são determinadas pela CRE. No Abasto Aislado sem injeção na rede, não há cobrança de tarifas de transmissão pública.',
    irecStatus: 'Certificados de Energías Limpias (CELs) e I-RECs aceitos, embora o mercado de CELs sofra com incertezas regulatórias devido a disputas políticas em torno da prioridade de despacho da CFE.',
    twentyFourSevenReadiness: 'Complexa. A matriz mexicana ainda possui quase 70% de dependência de térmicas a gás natural; alcançar 100% CFE 24/7 exige grandes investimentos próprios em BESS (Baterias) e solar on-site.',
    waterAndCoolingMandates: 'Extrema restrição na região central (Querétaro). O governo do estado e a CONAGUA proíbem o uso de poços artesianos para consumo em resfriamento de servidores. Licenças exigem 100% de sistemas de ar seco ou água de reuso industrial.',
    taxIncentivesSummary: 'Apoio em nível estadual em Querétaro e Nuevo León; amortização acelerada de equipamentos de energia renovável no imposto sobre a renda federal (LISR).',
    strategicTakeaway: 'Para contornar os atrasos de 3+ anos na conexão à rede da CFE, desenvolvedores adotam o modelo "Off-Grid / Islanded" ou Abasto Aislado combinando turbinas a gás de transição com solar + BESS.',
  },
  {
    country: 'Chile',
    flag: '🇨🇱',
    keyRegulatoryBody: 'CNE, Coordinador Eléctrico Nacional (CEN), SEC, SEA',
    ppaModel: 'Mercado livre altamente desregulamentado e competitivo. Clientes livres (>500 kW) negociam livremente preços com geradores renováveis.',
    selfGenerationLaw: 'Regime de Pequenos Meios de Geração Distribuída (PMGD até 9 MW) e projetos de grande porte com livre injeção no Sistema Elétrico Nacional (SEN).',
    gridChargesExemption: 'Não há subsídio cruzado direto, mas o LCOE solar no Deserto do Atacama é um dos mais baixos do mundo (<$25/MWh), permitindo PPAs competitivos mesmo com pedágios de transmissão.',
    irecStatus: 'Ampla adoção de I-RECs e sistema nacional de rastreamento de atributos ambientais operado pelo CEN.',
    twentyFourSevenReadiness: 'Alta viabilidade de dia (solar massiva), necessitando de contratos com hidrelétricas do sul ou grandes baterias BESS (4h a 8h) para suprir o período noturno no Atacama.',
    waterAndCoolingMandates: 'O Serviço de Avaliação Ambiental (SEA) e a DGA impõem escrutínio rigoroso. Datacenters na bacia de Maipo/Santiago são proibidos de evaporar água subterrânea após contestação pública de comunidades locais. Projetos aprovados são 100% resfriados a ar seco.',
    taxIncentivesSummary: 'Estabilidade tributária através de contratos de investimento estrangeiro (Decreto Lei 600 / InvestChile), sem retenção de dividendos sob tratados de dupla tributação OCDE.',
    strategicTakeaway: 'Chile oferece a maior segurança jurídica da região para PPAs solares de longo prazo, mas exige soluções de refrigeração com consumo zero de água potável.',
  },
  {
    country: 'Colômbia',
    flag: '🇨🇴',
    keyRegulatoryBody: 'CREG, UPME, XM, MinEnergía',
    ppaModel: 'Mercado de Energia Atacadista (MEM) com contratos bilaterais livremente pactuados. Plataforma DERIVEX para instrumentos financeiros de hedge de energia.',
    selfGenerationLaw: 'Resoluções CREG 174/2021 e CREG 030/2018: Autoprodução de Grande Escala (AGPE) e Pequena Escala (AGPE), permitindo venda de excedentes ao mercado.',
    gridChargesExemption: 'Lei 1715 de 2014 e Lei 2099 de 2021: Isenção de IVA e aranzel aduaneiro em equipamentos de energia solar, eólica e biomassa, além de crédito fiscal de 50% no Imposto de Renda investido.',
    irecStatus: 'I-RECs amplamente emitidos e transacionados pelo sistema EcoRegistry com tecnologia blockchain.',
    twentyFourSevenReadiness: 'Média/Alta. A matriz é 70%+ hidrelétrica limpa, mas eventos de El Niño podem elevar o custo marginal da energia durante secas temporárias.',
    waterAndCoolingMandates: 'A altitude de Bogotá (2.600m) e temperaturas de 9°C a 19°C eliminam a necessidade de resfriamento intensivo de água. A CAR impõe outorgas padrão para efluentes sanitários.',
    taxIncentivesSummary: 'Zonas Francas permanentes conferem redução de imposto de renda corporativo de 35% para 20% e 0% de IVA/direitos aduaneiros na importação de servidores e transformadores.',
    strategicTakeaway: 'A união entre o regime de Zona Franca (economia de 15% em imposto corporativo) e o free cooling natural de Bogotá torna a Colômbia um dos destinos mais eficientes para OPEX operacional.',
  },
  {
    country: 'Estados Unidos (Texas / ERCOT)',
    flag: '🇺🇸',
    keyRegulatoryBody: 'PUCT, ERCOT (Isolado de FERC)',
    ppaModel: 'Mercado elétrico "Energy-Only" do ERCOT completamente desregulamentado. Liberdade total para PPAs corporativos físicos e virtuais (VPPA).',
    selfGenerationLaw: 'Facilidade sem precedentes para implantação de geração "Behind-the-Meter" (solar, turbinas a gás aeroderivadas ou BESS) co-localizada com clusters de IA.',
    gridChargesExemption: 'Sem jurisdição federal da FERC; custos de transmissão (4CP - Four Coincident Peaks) podem ser zerados operando BESS ou geradores próprios durante as 4 horas de maior pico do verão texano.',
    irecStatus: 'Mercado de REC (Renewable Energy Certificates) mais líquido do mundo através da plataforma ERCOT/NEPOOL.',
    twentyFourSevenReadiness: 'Alta graças à explosão de gigawatts de baterias BESS instaladas no ERCOT e enorme capacidade eólica no West Texas.',
    waterAndCoolingMandates: 'Escassez hídrica crescente no oeste e centro do Texas leva cidades a taxarem água para resfriamento de datacenters. O padrão da indústria migrou para Direct Liquid Cooling com resfriadores secos (dry coolers).',
    taxIncentivesSummary: 'Inflation Reduction Act (IRA): Créditos tributários de investimento (ITC) de até 30-50% para energia solar e baterias BESS; isenções locais de impostos de propriedade (Chapter 380/381).',
    strategicTakeaway: 'O ERCOT no Texas é atualmente a principal válvula de escape para hiperescalas americanas contornarem os congestionamentos de 5 a 7 anos da Virgínia e PJM.',
  },
  {
    country: 'Estados Unidos (Virginia / PJM)',
    flag: '🇺🇸',
    keyRegulatoryBody: 'Virginia SCC, PJM Interconnection, FERC',
    ppaModel: 'Mercado PJM com contratos VPPAs (Virtual PPAs) e Tarifas Especializadas para Hiperescala (Rate 65 / Schedule 6) da concessionária Dominion Energy.',
    selfGenerationLaw: 'Instalação de usinas on-site e células de combustível a gás permitidas sob regulamentação de emissões do Virginia DEQ.',
    gridChargesExemption: 'Encargos de capacidade de transmissão e capacidade do PJM repassados integralmente na tarifa da Dominion.',
    irecStatus: 'PJM GATS (Generation Attribute Tracking System) é a referência institucional americana para RECs.',
    twentyFourSevenReadiness: 'Complexa a curto prazo devido à dependência de usinas a carvão e gás da Dominion para atender ao aumento exponencial da demanda de IA.',
    waterAndCoolingMandates: 'Moratórias municipais em Loudoun County e Prince William County limitam consumo de água e impõem limites de emissão acústica (decibéis) para ventiladores de chillers externos.',
    taxIncentivesSummary: 'Virginia Retail Sales and Use Tax Exemption: Isenção de impostos sobre vendas para computadores e equipamentos de infraestrutura de data centers elegíveis.',
    strategicTakeaway: 'Embora concentre o maior volume de fibra e tráfego da Terra, as restrições severas de capacidade da rede (o "Power Wall") forçam os operadores a buscar novos mercados em outras regiões.',
  },
  {
    country: 'Canadá (Quebec)',
    flag: '🇨🇦',
    keyRegulatoryBody: 'Hydro-Québec, Régie de l’énergie',
    ppaModel: 'Tarifa industrial regulada da concessionária estatal provincial Hydro-Québec. Alocação de potência através de chamadas públicas (RFP).',
    selfGenerationLaw: 'Muito restrito; quase a totalidade da transmissão e geração é monopolizada pela Hydro-Québec.',
    gridChargesExemption: 'Tarifa "LG" para grandes cargas industriais com preço unitário estável e baixo ($45-$50/MWh).',
    irecStatus: 'Atributos limpos certificados diretamente pela província (grid 99.8% hidrelétrico de emissão quase zero).',
    twentyFourSevenReadiness: 'A mais alta do continente: a energia hidrelétrica contínua com reservatórios de grande porte garante 24/7 Carbon-Free Energy real o ano inteiro sem intermitência.',
    waterAndCoolingMandates: 'Inexistência de estresse hídrico; o clima frio permite operar em Direct Fresh Air Cooling durante praticamente 300 dias do ano sem gasto de água potável.',
    taxIncentivesSummary: 'Crédito tributário federal e provincial de Pesquisa Científica e Desenvolvimento Experimental (SR&ED) e incentivos específicos para inteligência artificial.',
    strategicTakeaway: 'É o local mais limpo e energeticamente estável das Américas para IA de baixa pegada de carbono, limitado apenas pelo teto de blocos de megawatts disponibilizados pelo governo provincial.',
  },
];
