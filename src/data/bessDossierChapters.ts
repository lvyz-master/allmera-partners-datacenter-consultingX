import {
  BessClientProfile,
  BessSizingInput,
  BessSizingResult,
  BessVendorProduct,
} from '../types/bess';
import { BRAZIL_BESS_VENDORS } from './bessSolutions';

export interface DossierChapter {
  pageNumber: number;
  chapterNumber: number | string;
  category: string;
  title: string;
  subtitle: string;
  summary: string;
  keyMetrics?: { label: string; value: string; hint?: string }[];
  bulletPoints: string[];
  technicalDetails: { title: string; content: string }[];
  regulatoryOrNormative?: string;
  recommendationNote?: string;
}

/**
 * Gera os 34 capítulos do Dossiê Executivo de BESS com base nas entradas e resultados reais
 */
export function generateDossierChapters(
  client: BessClientProfile,
  input: BessSizingInput,
  sizing: BessSizingResult,
  vendor: BessVendorProduct
): DossierChapter[] {
  const spreadKwh = Math.max(0, client.peakTariff - client.offPeakTariff);
  const spreadRatio = client.offPeakTariff > 0 ? (client.peakTariff / client.offPeakTariff).toFixed(1) : '3.8';
  const dailyDischargeKwh = sizing.nominalPowerKw * input.durationHours;
  const annualEnergyDischargedMwh = ((dailyDischargeKwh * 255) / 1000).toFixed(1);

  return [
    /* -------------------------------------------------------------
       CAPÍTULO 1 (PÁG 3): Contextualização Estratégica & SIN
       ------------------------------------------------------------- */
    {
      pageNumber: 3,
      chapterNumber: 1,
      category: 'Estratégia & Panorama Elétrico',
      title: 'Contextualização Estratégica & Transição Energética no SIN Brasileiro',
      subtitle: 'O papel fundamental do armazenamento eletroquímico de energia no Sistema Interligado Nacional',
      summary: `A matriz elétrica brasileira vive uma revolução estrutural, impulsionada pela penetração massiva de fontes renováveis variáveis (eólica e solar fotovoltaica), concentradas geograficamente no Nordeste e Sudeste. Essa transição impõe severos desafios de flexibilidade operativa e congestionamento de transmissão para o ONS (Operador Nacional do Sistema Elétrico). A implantação de um sistema BESS de ${sizing.nominalPowerMw} MW / ${sizing.nominalEnergyMwh} MWh para ${client.clientName} posiciona o ativo como protagonista da nova economia de energia firme.`,
      keyMetrics: [
        { label: 'Capacidade no SIN', value: `${sizing.nominalPowerMw} MW`, hint: 'Potência nominal' },
        { label: 'Volume de Energia', value: `${sizing.nominalEnergyMwh} MWh`, hint: 'Armazenamento total' },
        { label: 'Autonomia Operacional', value: `${input.durationHours} horas`, hint: `Taxa C: ${sizing.cRate}C` },
        { label: 'Localização do Ativo', value: `${client.city} - ${client.state}`, hint: client.utilityCompany },
      ],
      bulletPoints: [
        'Desafios do SIN com curtailment e vertimento energético: nos últimos anos, o corte involuntário de usinas eólicas e solares no Nordeste superou 15% em dias de baixo consumo e vento intenso.',
        'Necessidade de flexibilidade de curto prazo: sistemas de baterias LFP oferecem resposta em submilisegundos, incomparavelmente mais veloz do que usinas termelétricas ou hidrelétricas.',
        'Descarbonização da matriz industrial: substituição de geradores fósseis a diesel em horários de pico por energia renovável estocada durante o dia.',
        'Valorização de ativos em conformidade com métricas ESG e metas corporativas de Net-Zero.',
      ],
      technicalDetails: [
        {
          title: 'Integração de Recursos Energéticos Distribuídos (DERs)',
          content: `No contexto da distribuidora ${client.utilityCompany}, a carga de ${client.contractedDemandKw} kW requer estabilidade contínua. O BESS atua como amortecedor dinâmico contra oscilações de frequência, flutuações de tensão e eventos de desligamento forçado da rede básica.`,
        },
        {
          title: 'Segurança de Suprimento Local',
          content: `Com autonomia dimensionada para ${input.durationHours}h em carga máxima (${sizing.nominalPowerKw} kW), a planta fabril/comercial garante continuidade produtiva mesmo sob eventos meteorológicos adversos que afetem os alimentadores de 13.8kV/34.5kV locais.`,
        },
      ],
      regulatoryOrNormative: 'Plano Decenal de Expansão de Energia (PDE 2034 / EPE) & Resoluções CNPE sobre Armazenamento.',
      recommendationNote: 'A implantação do BESS confere independência energética e blindagem contra restrições de suprimento da distribuidora local.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 2 (PÁG 4): Diagnóstico Tarifário & Perfil
       ------------------------------------------------------------- */
    {
      pageNumber: 4,
      chapterNumber: 2,
      category: 'Diagnóstico Regulatório & Faturamento',
      title: 'Diagnóstico Tarifário & Enquadramento Regulatório da Unidade Consumidora',
      subtitle: 'Estrutura tarifária da distribuidora e caracterização da oportunidade de economia',
      summary: `A unidade consumidora de ${client.clientName} está enquadrada na classe de Média/Alta Tensão no subgrupo ${client.subgroup}, sob a modalidade tarifária ${client.tariffModality} da concessionária ${client.utilityCompany}. Esta configuração apresenta uma das maiores distorções de preço horário do mundo, onde a energia no posto de ponta custa R$ ${client.peakTariff.toFixed(2)}/kWh contra R$ ${client.offPeakTariff.toFixed(2)}/kWh fora de ponta.`,
      keyMetrics: [
        { label: 'Tarifa Ponta (TE+TUSD)', value: `R$ ${client.peakTariff.toFixed(2)} / kWh`, hint: 'Posto tarifário crítico' },
        { label: 'Tarifa Fora de Ponta', value: `R$ ${client.offPeakTariff.toFixed(2)} / kWh`, hint: 'Período base de recarga' },
        { label: 'Spread Líquido', value: `R$ ${spreadKwh.toFixed(2)} / kWh`, hint: `Razão de ${spreadRatio}x` },
        { label: 'Tarifa Demanda', value: `R$ ${client.demandTariff.toFixed(2)} / kW`, hint: `${client.contractedDemandKw} kW contratados` },
      ],
      bulletPoints: [
        `O spread tarifário de R$ ${spreadKwh.toFixed(2)}/kWh entre ponta e fora de ponta viabiliza retorno financeiro atrativo exclusivamente através da substituição do consumo de ponta por energia armazenada.`,
        `Duração do posto tarifário de ponta: 3 horas consecutivas (estabelecido conforme regulamentação da distribuidora ${client.utilityCompany}, exceto sábados, domingos e feriados nacionais).`,
        `Faturamento de Demanda Contratada: ${client.contractedDemandKw} kW faturados compulsoriamente a R$ ${client.demandTariff.toFixed(2)}/kW.mês, representando um custo fixo mensal de R$ ${(client.contractedDemandKw * client.demandTariff).toLocaleString('pt-BR')}.`,
        'Incidência de bandeiras tarifárias (Amarela, Vermelha P1 e Vermelha P2) encarece ainda mais o consumo da rede, ampliando o benefício econômico da autoprodução com BESS.',
      ],
      technicalDetails: [
        {
          title: 'Análise Tarifária Horária Verde vs Azul',
          content: client.tariffModality === 'Horária Verde'
            ? 'Na Tarifa Verde, a unidade paga uma única tarifa de demanda (kW) para todos os horários, porém a tarifa de energia (R$/kWh) na ponta é extremamente elevada (TUSDg + TE). O BESS descarrega nas 3 horas de ponta eliminando o consumo mais caro.'
            : 'Na Tarifa Azul, há diferenciação de demanda em ponta e fora de ponta. O BESS atua reduzindo tanto a demanda faturada de ponta quanto o consumo de energia em kWh.',
        },
        {
          title: 'Regras de Medição Fiscal da Concessionária',
          content: 'A medição do Grupo A é realizada em intervalos de integração de 15 minutos. Picos de carga curtos com duração inferior a 15 minutos elevam a média de demanda medida do intervalo, gerando cobranças indesejadas que o BESS mitiga com resposta em milissegundos.',
        },
      ],
      regulatoryOrNormative: 'Resolução Homologatória de Tarifas Aneel para a concessionária & Módulo 7 do PRODIST.',
      recommendationNote: 'A elevada assimetria entre tarifas de ponta e fora de ponta confere resiliência financeira imune a volatilidades de curto prazo.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 3 (PÁG 5): CARDÁPIO Q1 - Peak Shaving
       ------------------------------------------------------------- */
    {
      pageNumber: 5,
      chapterNumber: 3,
      category: 'Cardápio BESS - Aplicação 01',
      title: 'Peak Shaving: Corte de Horário de Ponta & Arbitragem Tarifária',
      subtitle: 'Descarga diária programada nas 3 horas mais caras do dia da distribuidora',
      summary: `A aplicação primária e mais rentável do BESS no mercado cativo brasileiro é o Peak Shaving tarifário. O sistema é programado para recarregar durante a madrugada ou meio-dia (quando a tarifa está em R$ ${client.offPeakTariff.toFixed(2)}/kWh ou custo zero solar) e descarregar ${sizing.nominalPowerKw} kW durante as 3 horas exatas de ponta da distribuidora.`,
      keyMetrics: [
        { label: 'Economia Ponta Anual', value: `R$ ${(sizing.annualPeakShavingSavingsBrl / 1000).toLocaleString('pt-BR')}k`, hint: 'Economia direta anual' },
        { label: 'Energia Diária Ponta', value: `${(dailyDischargeKwh / 1000).toFixed(1)} MWh`, hint: `${input.durationHours}h de descarga diária` },
        { label: 'Energia Anual Deslocada', value: `${annualEnergyDischargedMwh} MWh`, hint: 'Base: 255 dias úteis/ano' },
        { label: 'Spread Efetivo', value: `R$ ${spreadKwh.toFixed(2)} / kWh`, hint: 'Líquido de perdas RTE' },
      ],
      bulletPoints: [
        `Autonomia configurada para ${input.durationHours} horas de descarga contínua a ${sizing.cRate}C, cobrindo integralmente o ciclo de 3h de ponta com margem de segurança.`,
        'Eficiência global de ciclo completo (Round-Trip Efficiency - RTE) de 91.5%: a cada 1.000 kWh recarregados, 915 kWh úteis são entregues à carga nos terminais de baixa tensão.',
        'Algoritmo inteligente do EMS sincronizado com relógio NTP atômico para iniciar descarga exatamente 5 minutos antes do início do posto de ponta da distribuidora.',
        'Zero injeção na rede (Zero Export): toda a energia descarregada pelo BESS é absorvida internamente pelas cargas do cliente, sem necessidade de compensação ou riscos de faturamento.',
      ],
      technicalDetails: [
        {
          title: 'Algoritmo de Despacho de Ponta',
          content: `O EMS ajusta dinamicamente a potência de saída da bateria para acompanhar a curva de carga da planta. Se a carga medida for de ${input.peakLoadKw} kW e o BESS injetar ${sizing.nominalPowerKw} kW, a demanda líquida solicitada da rede da concessionária cai para apenas ${Math.max(0, input.peakLoadKw - sizing.nominalPowerKw)} kW.`,
        },
        {
          title: 'Proteção Térmica durante o Ciclo de Pico',
          content: 'Durante a descarga de 3 horas em alta potência, o sistema de Liquid Cooling microcanal do BESS mantém a temperatura das células abaixo de 30°C, assegurando a garantia de 6.000+ ciclos sem aceleração de degradação.',
        },
      ],
      regulatoryOrNormative: 'Procedimentos de Distribuição Aneel PRODIST Módulo 3 & REN 1.000/2021.',
      recommendationNote: 'A economia anual com Peak Shaving representa mais de 65% da receita líquida do projeto de BESS.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 4 (PÁG 6): CARDÁPIO Q2 - Arbitragem no ACL
       ------------------------------------------------------------- */
    {
      pageNumber: 6,
      chapterNumber: 4,
      category: 'Cardápio BESS - Aplicação 02',
      title: 'Arbitragem de Energia no Mercado Livre (ACL) & PLD Horário',
      subtitle: 'Monetização de spreads horários na Câmara de Comercialização de Energia Elétrica (CCEE)',
      summary: `Com a implementação do PLD Horário pela CCEE e o avanço da abertura total do Mercado Livre (ACL) no Brasil, o armazenamento por baterias desbloqueia uma nova fronteira de rentabilidade: comprar energia nos momentos de PLD mínimo (frequentemente R$ 69/MWh ou piso regulatório) e consumir/vender nos momentos de pico do PLD (que pode atingir R$ 600+/MWh).`,
      keyMetrics: [
        { label: 'Receita Arbitragem Est.', value: `R$ ${(sizing.annualArbitrageRevenueBrl / 1000).toLocaleString('pt-BR')}k`, hint: 'Estimativa anual ACL' },
        { label: 'Volatilidade PLD SIN', value: 'R$ 69 a R$ 680', hint: 'Faixa regulatória CCEE' },
        { label: 'Ciclos Adicionais', value: '0.5 a 1.0 ciclo/dia', hint: 'Otimização econômica' },
        { label: 'Integração CCEE', value: 'Medição SCDE/CCEE', hint: 'Qualificação no ACL' },
      ],
      bulletPoints: [
        'Aproveitamento do "efeito curva da banheira" (duck curve): nos horários de forte irradiação solar (11h às 15h), o PLD cai ao piso regulatório; o BESS carrega neste instante.',
        'Nos horários de saída solar e elevação do consumo noturno (18h às 21h), o PLD sobe acentuadamente; o BESS entra em descarga fornecendo energia de alto valor.',
        'Contratos bilaterais PPA customizados com comercializadoras: garantia de preço fixo com prêmio de flexibilidade para o BESS.',
        'Mitigação de exposição a penalidades de desbalanceamento de carga no Ambiente de Contratação Livre.',
      ],
      technicalDetails: [
        {
          title: 'Modelo de Otimização Estocástica de Despacho',
          content: 'O software de gestão da Allmera simula diariamente as previsões de PLD divulgadas pelo modelo DESSEM do ONS/CCEE, determinando a estratégia ótima de recarga e descarga para maximizar a margem bruta diária.',
        },
        {
          title: 'Coexistência com Contratos Tradicionais de Mercado Livre',
          content: 'O BESS não interfere na contratação de energia de longo prazo da empresa; ele atua no submercado de ajustes horários, gerando créditos na liquidação financeira mensal da CCEE.',
        },
      ],
      regulatoryOrNormative: 'Regras de Comercialização CCEE & Diretrizes da Portaria MME 514/2018 para PLD Horário.',
      recommendationNote: 'A arbitragem no ACL é recomendada especialmente para empresas migradas ou em processo de migração para o Mercado Livre.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 5 (PÁG 7): CARDÁPIO Q3 - Demanda Contratada
       ------------------------------------------------------------- */
    {
      pageNumber: 5,
      chapterNumber: 5,
      category: 'Cardápio BESS - Aplicação 03',
      title: 'Gestão Dinâmica & Redução da Demanda Contratada (kW)',
      subtitle: 'Controle preditivo de picos instantâneos para diminuição de encargos fixos e eliminação de multas',
      summary: `A fatura mensal de energia elétrica do Grupo A cobra compulsoriamente a Demanda Contratada em kW. Picos de curta duração (partida de motores, compressores, prensas e equipamentos de alta potência) podem forçar a empresa a contratar valores excessivos de demanda ou incorrer em pesadas multas de ultrapassagem (cobradas com tarifa em dobro acima de 5% de tolerância). O BESS elimina esses picos com resposta em menos de 10 milissegundos.`,
      keyMetrics: [
        { label: 'Demanda Contratada Atual', value: `${client.contractedDemandKw} kW`, hint: `Custo fixo: R$ ${client.demandTariff.toFixed(2)}/kW` },
        { label: 'Economia Anual Demanda', value: `R$ ${(sizing.annualDemandReductionSavingsBrl / 1000).toLocaleString('pt-BR')}k`, hint: 'Redução e corte de multas' },
        { label: 'Tempo de Resposta', value: '< 10 ms', hint: 'Injeção instantânea' },
        { label: 'Tolerância Ultrapassagem', value: '5% (Aneel REN 1000)', hint: 'Multa evitada' },
      ],
      bulletPoints: [
        `O BESS permite reduzir a demanda contratada formal de ${client.contractedDemandKw} kW para um patamar otimizado, economizando imediatamente no valor fixo mensal da conta de luz.`,
        'Eliminação total de multas por ultrapassagem de demanda: qualquer transitório de carga acima do setpoint é suprido instantaneamente pelo BESS.',
        'Capacidade de suportar correntes de partida de grandes motores sem causar afundamentos de tensão na barra interna da subestação.',
        'Economia direta de até 25% a 35% no custo anual da fatura de demanda contratada da concessionária.',
      ],
      technicalDetails: [
        {
          title: 'Algoritmo de Interpolação da Janela Móvel de 15 Minutos',
          content: 'O medidor eletrônico fiscal da concessionária calcula a média de potência ativa a cada 15 minutos (janela deslizante). O EMS do BESS amostra a potência a cada 50ms e calcula a projeção do bloco de 15min; se a projeção indicar ultrapassagem, o PCS injeta potência na medida exata para manter a média abaixo do limite contratual.',
        },
        {
          title: 'Liberação de Capacidade de Transformadores Internos',
          content: 'Ao suprir picos localmente, o BESS descarrega os transformadores de média tensão da planta, reduzindo aquecimento, perdas Joule e estresse dielétrico nos equipamentos.',
        },
      ],
      regulatoryOrNormative: 'Módulo 8 do PRODIST & Resolução Normativa Aneel 1.000/2021 (Artigos 290 a 305).',
      recommendationNote: 'A gestão de demanda protege a empresa contra variações sazonais de produção sem necessidade de recontratações anuais onerosas.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 6 (PÁG 8): CARDÁPIO Q4 - Backup Crítico & UPS
       ------------------------------------------------------------- */
    {
      pageNumber: 8,
      chapterNumber: 6,
      category: 'Cardápio BESS - Aplicação 04',
      title: 'Backup & Resiliência Crítica (No-Break Industrial / UPS)',
      subtitle: 'Continuidade operacional ininterrupta e substituição inteligente de geradores a diesel',
      summary: `Interrupções no fornecimento da rede elétrica causam prejuízos milionários em indústrias e data centers: perda de matéria-prima, parada de linhas automatizadas, danos a ferramentas de corte e retrabalho de calibração. O BESS atua como uma gigantesca UPS (Uninterruptible Power Supply) industrial de ${sizing.nominalPowerMw} MW com comutação ultra-rápida, assegurando autonomia de ${input.durationHours}h para cargas prioritárias sem qualquer emissão de poluentes ou ruído.`,
      keyMetrics: [
        { label: 'Tempo de Transferência', value: '< 20 ms', hint: 'Comutação sem interrupção' },
        { label: 'Potência em Ilhamento', value: `${sizing.nominalPowerMw} MW`, hint: 'Suporta cargas 100%' },
        { label: 'Autonomia Crítica', value: `${input.durationHours} horas`, hint: 'Expansível sob demanda' },
        { label: 'Comparativo Diesel', value: 'Zero diesel & emissões', hint: 'Partida em 0s vs 15s GMG' },
      ],
      bulletPoints: [
        'Transição sem interrupção: servidores, CLPs de automação, chillers e relés eletromecânicos não sofrem desligamento ou reset durante a queda da concessionária.',
        'Superação das fragilidades dos grupos geradores a diesel (GMG): geradores a diesel exigem de 10 a 20 segundos para dar partida e estabilizar tensão/frequência, período em que processos produtivos já são interrompidos.',
        'Eliminação de custos com queima de óleo diesel, testes periódicos a vazio, transporte de combustível inflamável e manutenção de motores a combustão.',
        'Operação em ilhamento sustentada: se houver geração solar associada, a bateria recarrega durante o dia e mantém a planta operando indefinidamente fora da rede.',
      ],
      technicalDetails: [
        {
          title: 'Chave de Transferência Estática (STS - Static Transfer Switch)',
          content: 'Equipada com tiristores de potência (SCR) que realizam o desacoplamento galvânico da rede da distribuidora em menos de um quarto de ciclo elétrico (4 ms), transferindo a alimentação para o inversor Grid-Forming do BESS.',
        },
        {
          title: 'Capacidade de Sobrecarga para Partida de Motores em Ilhamento',
          content: `O PCS selecionado possui capacidade de sobrecarga de 120% contínua por 10 minutos e 150% por 10 segundos, suportando correntes de partida de motores de indução sem colapso de tensão no modo UPS.`,
        },
      ],
      regulatoryOrNormative: 'ABNT NBR 16149, NBR 5410 & NFPA 111 (Stored Electrical Energy Emergency Systems).',
      recommendationNote: 'A proteção de cargas críticas é um dos maiores pilares de redução de risco operacional avaliados por comitês de auditoria.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 7 (PÁG 9): CARDÁPIO Q5 - Hibridização Solar FV
       ------------------------------------------------------------- */
    {
      pageNumber: 9,
      chapterNumber: 7,
      category: 'Cardápio BESS - Aplicação 05',
      title: 'Hibridização Solar FV (PV + Storage / FTM & BTM)',
      subtitle: 'Mitigação de Curtailment e deslocamento da curva de geração renovável',
      summary: `A geração solar fotovoltaica no Brasil enfrenta restrições crescentes: tanto em projetos Behind-the-Meter (BTM) onde a distribuidora limita a injeção na rede (Zero Export), quanto em usinas de Geração Distribuída e Centralizada (FTM) que sofrem ordens constantes de corte de geração (Curtailment) do ONS. A hibridização com o BESS captura 100% da energia que seria perdida e a armazena para injeção nos horários de maior demanda e remuneração.`,
      keyMetrics: [
        { label: 'Capacidade Solar Conectada', value: `${input.solarPvCapacityKwp} kWp`, hint: 'Geração associada' },
        { label: 'Energia Cortada Recuperada', value: 'Até 95%', hint: 'Aproveitamento total' },
        { label: 'Topologia Recomendada', value: 'AC-Coupled', hint: 'Máxima flexibilidade' },
        { label: 'Deslocamento Horário', value: '12h -> 19h', hint: 'Armazena sol p/ noite' },
      ],
      bulletPoints: [
        'Eliminação do desperdício de geração solar: o excesso de energia gerado no horário de almoço (quando o consumo da planta reduz) é direcionado diretamente para carregar as baterias.',
        'Injeção no posto de ponta: a energia gerada pelo sol a custo marginal zero é descarregada entre 17h30 e 20h30, substituindo a compra da distribuidora ao preço de R$ ' + client.peakTariff.toFixed(2) + '/kWh.',
        'Atendimento às restrições das distribuidoras: muitas concessionárias já não aprovam novos acessos de micro/minigeração distribuída sem controle estrito de fluxo reverso de potência.',
        'Aumento do fator de capacidade (Capacity Factor) da infraestrutura de conexão à rede (subestação e transformadores).',
      ],
      technicalDetails: [
        {
          title: 'Topologias AC-Coupled vs DC-Coupled',
          content: 'Para instalações industriais existentes com inversores solares já instalados, a topologia AC-Coupled é a mais segura e homologável, pois permite que o BESS opere independentemente através do barramento de baixa tensão, com despacho coordenado pelo EMS.',
        },
        {
          title: 'Algoritmo de Suavização Solar Integrada',
          content: 'O EMS monitora os analisadores de grandezas do inversor solar e modula a carga do BESS na mesma proporção em que a irradiação solar sobe, mantendo a potência líquida no ponto de acoplamento perfeitamente constante.',
        },
      ],
      regulatoryOrNormative: 'Marco Legal da Micro e Minigeração (Lei 14.300/2022) & Resolução Aneel 1.059/2023.',
      recommendationNote: 'A hibridização solar transforma uma usina fotovoltaica intermitente em uma fonte despachável e programável.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 8 (PÁG 10): CARDÁPIO Q6 - Controle de Rampa
       ------------------------------------------------------------- */
    {
      pageNumber: 10,
      chapterNumber: 8,
      category: 'Cardápio BESS - Aplicação 06',
      title: 'Controle de Rampa de Potência (Ramp-Rate Control)',
      subtitle: 'Suavização de variações bruscas de potência causadas por nuvens e cargas pesadas',
      summary: `A passagem de nuvens densas sobre arranjos fotovoltaicos pode provocar variações de até 80% na potência gerada em questão de segundos. Tais rampas severas desestabilizam o sistema elétrico local, provocando cintilação de tensão (Flicker) e atuação indevida de relés de proteção. O BESS atua injetando ou absorvendo potência instantânea para manter a taxa de variação da planta rigorosamente dentro dos limites normativos.`,
      keyMetrics: [
        { label: 'Limite de Rampa ONS', value: '< 10% / min', hint: 'Taxa máxima permitida' },
        { label: 'Tempo de Resposta PCS', value: '< 20 ms', hint: 'Compensação dinâmica' },
        { label: 'Mitigação de Flicker', value: 'Pst < 0.8', hint: 'Conformidade PRODIST' },
        { label: 'Estabilidade da Barra', value: '± 1.5% Vnom', hint: 'Tensão estabilizada' },
      ],
      bulletPoints: [
        'Amortecimento da intermitência: as baterias reagem instantaneamente a quedas bruscas de geração solar, compensando o déficit de potência antes que a rede sinta a variação.',
        'Cumprimento dos Procedimentos de Rede do ONS (Submódulo 3.6): plantas de geração conectadas à Rede Básica ou Demarcadora devem limitar a rampa de injeção a taxas configuradas.',
        'Proteção de transformadores e comutadores sob carga (OLTC): a suavização reduz o número de comutações mecânicas diárias nos transformadores de força, prolongando sua vida útil em anos.',
        'Minimização do desbalanceamento de fases e eliminação de perturbações aos clientes vizinhos no mesmo alimentador da concessionária.',
      ],
      technicalDetails: [
        {
          title: 'Algoritmo de Filtragem Passa-Baixa (First-Order Low Pass Filter)',
          content: 'O EMS calcula a potência de referência aplicando uma constante de tempo de filtragem (Tau) sobre a potência solar bruta. A diferença entre a curva real e a curva suavizada é fornecida ou absorvida pelo BESS.',
        },
        {
          title: 'Desgaste e Dimensionamento de Ciclos do BESS',
          content: 'O controle de rampa exige microciclos frequentes com pequena profundidade de descarga (DoD < 3%). Células de lítio LFP suportam centenas de milhares desses microciclos sem impacto apreciável em sua vida útil.',
        },
      ],
      regulatoryOrNormative: 'Procedimentos de Rede ONS Submódulo 3.6 & IEEE 1547-2018.',
      recommendationNote: 'O controle de rampa é essencial para usinas fotovoltaicas e indústrias com grandes guindastes ou laminadores.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 9 (PÁG 11): CARDÁPIO Q7 - Suporte de Tensão & STATCOM
       ------------------------------------------------------------- */
    {
      pageNumber: 11,
      chapterNumber: 9,
      category: 'Cardápio BESS - Aplicação 07',
      title: 'Suporte de Tensão, Frequência & Controle de Reativos (STATCOM)',
      subtitle: 'Inversor 4-quadrantes operando na compensação de reativos e correção de fator de potência',
      summary: `Os inversores bidirecionais (PCS) de BESS modernos operam nos quatro quadrantes do plano P-Q, significando que podem injetar ou absorver tanto potência ativa (P) quanto potência reativa (Q). Essa funcionalidade transforma o BESS em um compensador estático síncrono (STATCOM), capaz de regular dinamicamente a tensão da barra e corrigir o fator de potência da unidade para 1.00 em tempo real.`,
      keyMetrics: [
        { label: 'Capacidade Reativa', value: `${(sizing.nominalPowerMw * 0.95).toFixed(2)} Mvar`, hint: 'Potência reativa disponível' },
        { label: 'Fator de Potência', value: 'FP > 0.98', hint: 'Sem multa de reativo' },
        { label: 'Operação 4Q', value: 'Quatro Quadrantes', hint: 'P+/P- e Q+/Q-' },
        { label: 'Economia UFER/DMCR', value: 'Zero cobrança', hint: 'Elimina excedente' },
      ],
      bulletPoints: [
        'Zera cobranças de energia e demanda reativa excedente (UFER / DMCR): no Brasil, qualquer fator de potência abaixo de 0,92 (indutivo das 06h às 24h ou capacitivo das 00h às 06h) gera multas pesadas na fatura da concessionária.',
        'Compensação reativa mesmo com bateria descarregada: os inversores PCS podem atuar como STATCOM pleno mesmo com o SoC da bateria em 0%, utilizando a infraestrutura existente de eletrônica de potência.',
        'Regulação dinâmica de tensão (Controle V-Q): se a tensão na subestação cair devido a partidas industriais, o PCS injeta reativos capacitivos elevando a tensão imediatamente ao patamar nominal.',
        'Redução drástica de distorção harmônica total (THD-I e THD-V) na instalação.',
      ],
      technicalDetails: [
        {
          title: 'Diagrama P-Q do PCS',
          content: 'A curva de capacidade do inversor permite fornecer até 100% de potência reativa quando a potência ativa é nula, e manter potência reativa proporcional ao atingir a potência ativa nominal, respeitando o limite térmico em MVA.',
        },
        {
          title: 'Substituição de Bancos de Capacitores Tradicionais',
          content: 'Elimina a necessidade de bancos de capacitores automáticos eletromecânicos, que sofrem com queima de contatores por transitórios e correm risco de ressonância harmônica com transformadores.',
        },
      ],
      regulatoryOrNormative: 'PRODIST Módulo 8 (Qualidade da Energia Elétrica) & Resolução Normativa Aneel 1.000/2021.',
      recommendationNote: 'A operação do BESS como STATCOM gera ganhos imediatos na qualidade da energia e elimina penalidades tarifárias.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 10 (PÁG 12): CARDÁPIO Q8 - Serviços Ancilares
       ------------------------------------------------------------- */
    {
      pageNumber: 12,
      chapterNumber: 10,
      category: 'Cardápio BESS - Aplicação 08',
      title: 'Serviços Ancilares & Controle de Frequência no SIN (FCR/aFRR)',
      subtitle: 'Inércia sintética e estabilização de frequência para a rede básica nacional',
      summary: `Com a saída progressiva de grandes geradores térmicos e hidrelétricos com massas rotativas pesadas, o Sistema Interligado Nacional (SIN) vem sofrendo uma redução crítica de inércia mecânica natural. O BESS é a tecnologia definitiva para fornecer Fast Frequency Response (FFR) e Controle Primário de Frequência, com injeção de potência ativa em menos de 100 milissegundos assim que um desvio de 60 Hz é detectado.`,
      keyMetrics: [
        { label: 'Tempo de Resposta Frequência', value: '< 100 ms', hint: 'Fast Frequency Response' },
        { label: 'Estatismo Configurável', value: '2% a 5%', hint: 'Droop control P(f)' },
        { label: 'Faixa de Operação Normal', value: '59.9 Hz - 60.1 Hz', hint: 'Banda morta ONS' },
        { label: 'Mercado Futuro Aneel', value: 'Remuneração ancilar', hint: 'Novos leilões previstos' },
      ],
      bulletPoints: [
        'Resposta Inercial Sintética: através de controle Grid-Forming, o BESS replica a resposta eletromecânica de um gerador síncrono real, amortecendo afundamentos bruscos de frequência no SIN.',
        'Controle Primário de Frequência (FCR - Frequency Containment Reserve): injeção proporcional à queda de frequência conforme curva Droop configurável, contendo a velocidade de variação (RoCoF).',
        'Controle Secundário (aFRR - Automatic Frequency Restoration Reserve): resposta a comandos do Controle Automático de Geração (CAG) do ONS para restaurar a frequência de volta aos 60,00 Hz nominais.',
        'Elegibilidade para novos mercados remunerados de serviços ancilares atualmente em regulamentação pela Aneel e Ministério de Minas e Energia.',
      ],
      technicalDetails: [
        {
          title: 'Algoritmo de Controle Droop P-f',
          content: 'A potência ativa injetada varia linearmente em função do desvio da frequência medida em relação aos 60,00 Hz, com zona morta (deadband) programável de ±0.05 Hz para evitar ciclagem desnecessária em oscilações normais da rede.',
        },
        {
          title: 'Medição Fasorial Sincronizada (Synchrophasors / PMU)',
          content: 'O sistema BESS é compatível com unidades de medição fasorial PMU conforme protocolo IEEE C37.118, permitindo integração direta aos sistemas de monitoramento em tempo real do ONS.',
        },
      ],
      regulatoryOrNormative: 'Procedimentos de Rede ONS Submódulo 3.6 & Resolução Normativa Aneel sobre Serviços Ancilares.',
      recommendationNote: 'A prontidão para serviços ancilares garante que o BESS capture novos fluxos de receita regulatória assim que o mercado abrir no Brasil.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 11 (PÁG 13): CARDÁPIO Q9 - Reserva de Capacidade
       ------------------------------------------------------------- */
    {
      pageNumber: 13,
      chapterNumber: 11,
      category: 'Cardápio BESS - Aplicação 09',
      title: 'Reserva de Capacidade & Leilões LRCAP (MME / Aneel)',
      subtitle: 'Contratos de receita fixa de longo prazo para disponibilização de potência firme',
      summary: `O Ministério de Minas e Energia (MME) e a Empresa de Pesquisa Energética (EPE) estruturam os Leilões de Reserva de Capacidade na forma de Potência (LRCAP). Nesses certames, os empreendedores recebem uma receita fixa garantida (em R$/MW.ano), indexada à inflação (IPCA), durante 15 anos, apenas para manter a potência firme do sistema disponível para acionamento nos momentos de maior estresse hídrico ou térmico do país.`,
      keyMetrics: [
        { label: 'Prazo Contratual', value: '15 anos', hint: 'Contrato MME / CCEE' },
        { label: 'Remuneração', value: 'Receita Fixa R$/MW', hint: 'Indexada pelo IPCA' },
        { label: 'Autonomia Mínima', value: '2h a 4h', hint: 'Conforme edital LRCAP' },
        { label: 'Disponibilidade Mínima', value: '>= 95%', hint: 'Meta de despacho' },
      ],
      bulletPoints: [
        'Segurança de fluxo de caixa: a receita de capacidade independe do volume de energia efetivamente despachado; é remunerada pela disponibilidade contratada do sistema.',
        'Bancabilidade internacional: contratos de longo prazo com o governo federal viabilizam financiamento Project Finance com bancos de desenvolvimento (BNDES, BNB, BASA) com taxas atrativas.',
        'Superioridade ambiental em relação a termelétricas: o BESS entrega potência instantânea sem consumir água, sem emitir óxidos de nitrogênio (NOx), particulados ou gases de efeito estufa.',
        'Implantação ultrarrápida: um projeto de BESS de 50 MW pode ser comissionado em 6 a 9 meses, enquanto uma usina termelétrica a gás exige de 3 a 5 anos.',
      ],
      technicalDetails: [
        {
          title: 'Requisitos de Qualificação Técnica EPE',
          content: 'Para habilitação no certame, o projeto deve apresentar estudos de fluxo de potência, curto-circuito, estabilidade eletromecânica e Garantia Física de Potência calculada pela EPE, além do Termo de Conexão à Rede (CUST).',
        },
        {
          title: 'Auditoria de Despacho e Disponibilidade',
          content: 'O ONS audita continuamente a disponibilidade do BESS através de telemetria SCADA dedicada. Falhas de atendimento a despachos geram penalidades no recebimento da receita mensal.',
        },
      ],
      regulatoryOrNormative: 'Leis Federais 14.182/2021 e 10.848/2004 & Diretrizes do MME para Leilões de Reserva.',
      recommendationNote: 'A participação no LRCAP é a rota preferencial para projetos de grande porte (Utility Scale acima de 10 MW).',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 12 (PÁG 14): CARDÁPIO Q10 - Partida a Frio (Black Start)
       ------------------------------------------------------------- */
    {
      pageNumber: 14,
      chapterNumber: 12,
      category: 'Cardápio BESS - Aplicação 10',
      title: 'Partida a Frio (Black Start) & Restabelecimento Autônomo',
      subtitle: 'Capacidade de auto-energização sem alimentação externa da rede elétrica',
      summary: `Em caso de colapso sistêmico total da rede elétrica (apagão generalizado / Blackout), as usinas geradoras convencionais não conseguem reiniciar porque seus sistemas auxiliares (bombas, compressores, excitatrizes) necessitam de energia externa para ligar. O BESS possui capacidade intrínseca de Black Start: seu inversor com controle Grid-Forming cria tensão e frequência a partir do banco de baterias em segundos, energizando barramentos e transformadores a vazio.`,
      keyMetrics: [
        { label: 'Modo do Inversor', value: 'Grid-Forming (GFM)', hint: 'Formador de rede' },
        { label: 'Tempo de Inicialização', value: '< 30 segundos', hint: 'Estabelece 60 Hz' },
        { label: 'Energização Transformador', value: 'Rampa de tensão suave', hint: 'Sem surto de inrush' },
        { label: 'Serviço ao SIN', value: 'Altíssimo valor', hint: 'Restauração rápida' },
      ],
      bulletPoints: [
        'Reinício 100% autônomo: o BESS não depende de nenhum gerador auxiliar ou conexão com a distribuidora para ligar.',
        'Técnica de partida suave (Soft-Start Voltage Ramp): o inversor eleva a tensão AC gradualmente de 0V até a tensão nominal, energizando transformadores sem causar a temida corrente de inrush (que frequentemente desarma disjuntores em partidas convencionais).',
        'Capacidade de alimentar os sistemas auxiliares de subestações vizinhas e plantas de geração maiores.',
        'Garantia de que a planta do cliente será a primeira a restabelecer operações plenas após desligamentos graves do sistema interligado.',
      ],
      technicalDetails: [
        {
          title: 'Algoritmo Virtual Synchronous Machine (VSM)',
          content: 'O software do PCS emula as equações dinâmicas de uma máquina síncrona real, fornecendo rigidez de tensão e ângulo de fase para que cargas passivas ou motores possam ser religados sequencialmente.',
        },
        {
          title: 'Coordenação de Proteção em Black Start',
          content: 'Ajuste dinâmico de grupos de proteção dos relés de subestação durante a fase de partida a frio para evitar atuações intempestivas por correntes transitórias de magnetização.',
        },
      ],
      regulatoryOrNormative: 'Procedimentos de Rede ONS Submódulo 3.7 & IEEE 2030.7.',
      recommendationNote: 'O recurso de Black Start confere extrema resiliência para indústrias petroquímicas, siderúrgicas e centros de dados.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 13 (PÁG 15): CARDÁPIO Q11 - Postergação de Rede
       ------------------------------------------------------------- */
    {
      pageNumber: 15,
      chapterNumber: 13,
      category: 'Cardápio BESS - Aplicação 11',
      title: 'Postergação de Investimento em Subestações & Rede (T&D Deferral)',
      subtitle: 'Alívio de sobrecarga em transformadores e alimentadores, evitando obras pesadas imediatas',
      summary: `O crescimento da demanda de uma planta fabril ou de uma região frequentemente atinge o limite térmico de transformadores de força e cabos subterrâneos existentes. O reforço físico da subestação (troca de transformador, ampliação de pátio, recondutoramento) exige investimentos de dezenas de milhões de reais e prazos de 2 a 4 anos para licenciamento e fornecimento. O BESS atua injetando potência localmente nos picos de consumo, postergando o Capex de infraestrutura em até 5 a 10 anos.`,
      keyMetrics: [
        { label: 'Capex Evitado de SE', value: 'R$ 8M a R$ 25M', hint: 'Economia de ampliação' },
        { label: 'Prazo de Implantação', value: '6 a 9 meses', hint: 'Vs 36 meses civil' },
        { label: 'Alívio de Carregamento', value: '15% a 30%', hint: 'Reduz aquecimento' },
        { label: 'Ativo Reutilizável', value: '100% Móvel', hint: 'Pode ser relocado' },
      ],
      bulletPoints: [
        'Solução modular e escalável: contêineres de BESS podem ser instalados em áreas compactas adjacentes à subestação existente sem desapropriações ou grandes obras civis.',
        'Ativo transportável e não afundado (non-wire alternative): se a configuração da planta mudar no futuro, os contêineres podem ser realocados para outra unidade com custos marginais.',
        'Redução das perdas elétricas técnicas por efeito Joule nas linhas e transformadores durante os períodos de maior carregamento térmico.',
        'Possibilidade de expansão futura em blocos modulares adicionais de contêiner de acordo com o crescimento real da carga da empresa.',
      ],
      technicalDetails: [
        {
          title: 'Controle Térmico de Ativos de Subestação',
          content: 'O EMS monitora a temperatura do óleo e enrolamento dos transformadores da subestação; quando a temperatura atinge o limiar crítico, o BESS assume o suprimento da carga excedente mantendo o transformador na sua zona térmica segura.',
        },
        {
          title: 'Análise de Valor Presente Líquido da Postergação',
          content: 'Adiar um desembolso de capital de R$ 15 milhões em 5 anos, a uma taxa de desconto de 11% ao ano, gera um ganho financeiro de valor presente da ordem de R$ 6,1 milhões, superando o custo do BESS.',
        },
      ],
      regulatoryOrNormative: 'Metodologia de Planejamento da Expansão EPE & Cadernos de Tarifação da Aneel.',
      recommendationNote: 'Excelente alternativa para empresas que precisam expandir capacidade produtiva imediatamente mas enfrentam prazos longos da concessionária.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 14 (PÁG 16): CARDÁPIO Q12 - Microrredes Industriais
       ------------------------------------------------------------- */
    {
      pageNumber: 16,
      chapterNumber: 14,
      category: 'Cardápio BESS - Aplicação 12',
      title: 'Microrredes & Operação em Ilhamento Prolongado (Microgrids)',
      subtitle: 'Coordenação inteligente de múltiplas fontes de geração e cargas essenciais',
      summary: `A integração do BESS com plantas industriais complexas constitui uma verdadeira Microrrede (Microgrid). Sob coordenação do controlador mestre da Allmera, o BESS atua como a âncora de tensão e frequência da microrrede, sincronizando geração solar local, grupos geradores e cargas industriais, garantindo estabilidade tanto em conexão à rede quanto em ilhamento voluntário prolongado.`,
      keyMetrics: [
        { label: 'Fontes Integradas', value: 'BESS + Solar + Rede', hint: 'Gestão multivetorial' },
        { label: 'Transição Ilhado', value: 'Seamless (<15ms)', hint: 'Sem piscar lâmpadas' },
        { label: 'Ressincronização', value: 'Automática', hint: 'Sem choque mecânico' },
        { label: 'Autonomia Estendida', value: 'Contínua c/ Sol', hint: 'Independência da rede' },
      ],
      bulletPoints: [
        'Controle Master-Follower: no modo conectado à rede, o BESS segue a tensão da distribuidora (Grid-Following); ao ilhar, comuta instantaneamente para formador de rede (Grid-Forming).',
        'Controle Droop V/f descentralizado: balanceamento de potência entre múltiplos inversores e geradores sem necessidade de linha de comunicação ultrarrápida entre eles.',
        'Ressincronização suave (Active Resynchronization): ao restabelecer o fornecimento da distribuidora, o BESS alinha frequência, amplitude e fase antes de fechar o disjuntor de interconexão, sem qualquer choque elétrico.',
        'Otimização do custo total de energia da microrrede em tempo real, priorizando fontes renováveis locais.',
      ],
      technicalDetails: [
        {
          title: 'Algoritmo de Deslastre Seletivo de Carga (Under-Frequency Load Shedding)',
          content: 'Se a demanda da planta exceder temporariamente a capacidade combinada do BESS e das fontes locais durante o modo ilhado, o controlador desliga cargas não essenciais pré-programadas em milissegundos para manter as cargas críticas em operação.',
        },
        {
          title: 'Conformidade com a Norma IEEE 2030.7 e IEEE 2030.8',
          content: 'Arquitetura estruturada em conformidade com os padrões globais de teste e especificação de controladores de microrrede.',
        },
      ],
      regulatoryOrNormative: 'IEEE 2030.7, IEEE 2030.8 & IEC 62898 (Microgrid Standards).',
      recommendationNote: 'A arquitetura de microrrede prepara a planta para independência energética duradoura e certificações de sustentabilidade.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 15 (PÁG 17): Dimensionamento Eletroquímico
       ------------------------------------------------------------- */
    {
      pageNumber: 17,
      chapterNumber: 15,
      category: 'Engenharia Eletroquímica',
      title: 'Dimensionamento Eletroquímico: Baterias, Células LFP e Racks DC',
      subtitle: 'Química LiFePO4, arranjo em série/paralelo e cálculo de capacidade útil e degradação',
      summary: `O dimensionamento eletroquímico do projeto de ${client.clientName} adota a química LFP (Lítio-Ferro-Fosfato, LiFePO4), que se consolidou como padrão absoluto para armazenamento estacionário de energia industrial no Brasil e no mundo. Com capacidade nominal de ${sizing.nominalEnergyMwh} MWh e capacidade útil de ${sizing.usableEnergyMwh} MWh (profundidade de descarga de ${input.depthOfDischargePercent}%), o arranjo é distribuído em ${sizing.batteryContainersCount} contêiner(es) padronizado(s) de ${sizing.containerUnitCapacityMwh} MWh cada.`,
      keyMetrics: [
        { label: 'Química da Célula', value: 'LFP (LiFePO4)', hint: 'Alta estabilidade térmica' },
        { label: 'Energia Nominal', value: `${sizing.nominalEnergyMwh} MWh`, hint: `${sizing.nominalEnergyKwh.toLocaleString('pt-BR')} kWh` },
        { label: 'Energia Útil (90% DoD)', value: `${sizing.usableEnergyMwh} MWh`, hint: `${sizing.usableEnergyKwh.toLocaleString('pt-BR')} kWh` },
        { label: 'Vida Útil Garantida', value: `${vendor.guaranteedCycles.toLocaleString('pt-BR')} ciclos`, hint: `${vendor.warrantyYears} anos de garantia` },
      ],
      bulletPoints: [
        'Células prismáticas de alta capacidade: padrão de células 280Ah ou 314Ah com terminais de alumínio soldados a laser, garantindo mínima resistência interna e baixa perda ôhmica.',
        'Tensão nominal do barramento DC: configurada entre 1.000V e 1.500V DC, otimizando o rendimento dos inversores e reduzindo a bitola dos cabos de interconexão.',
        'Arranjo modular: cada rack é composto por 16 a 24 módulos em série, com proteção individual por fusíveis ultra-rápidos e disjuntor DC motorizado.',
        'Degradação linear projetada de ' + input.annualDegradationPercent.toFixed(1) + '% ao ano: o sistema mantém mais de 75% da capacidade inicial mesmo após 15 anos de operação intensa diária.',
      ],
      technicalDetails: [
        {
          title: 'Segurança Intrínseca da Química LFP vs NMC',
          content: 'A ligação química fósforo-oxigênio (P-O) na célula LFP é covalente e extremamente forte, o que impede a liberação de oxigênio mesmo a temperaturas superiores a 270°C, eliminando o risco de combustão espontânea catastrófica característico de baterias de óxido de cobalto (NMC).',
        },
        {
          title: 'Curva de Degradação Cíclica e Calendárica',
          content: 'O dimensionamento considera o acoplamento da degradação calendárica (envelhecimento natural do eletrólito por temperatura ambiente) com a degradação por ciclagem (intercalação de íons de lítio nos sítios da grafite). O uso de Liquid Cooling garante que o ponto de operação permaneça na faixa ideal de 20°C a 25°C.',
        },
      ],
      regulatoryOrNormative: 'IEC 62619, IEC 62620 & UL 1973 (Standard for Batteries for Use in Stationary Applications).',
      recommendationNote: 'A química LFP associada ao modelo de gestão térmica da Allmera assegura a maior longevidade e bancabilidade do ativo.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 16 (PÁG 18): Conversão de Potência (PCS)
       ------------------------------------------------------------- */
    {
      pageNumber: 18,
      chapterNumber: 16,
      category: 'Engenharia de Eletrônica de Potência',
      title: 'Sistema de Conversão de Potência (PCS) & Topologias de Inversor',
      subtitle: 'Inversores bidirecionais de alta eficiência e análise de topologia string vs centralizada',
      summary: `O Sistema de Conversão de Potência (PCS - Power Conversion System) é o coração eletrotécnico do BESS, responsável por converter corrente contínua (DC) das baterias em corrente alternada (AC) sincronizada com a rede e vice-versa. Para atender à demanda de ${sizing.nominalPowerMw} MW (${sizing.nominalPowerKw} kW), foram previstos ${sizing.pcsInverterCount} bloco(s) de inversores de ${sizing.pcsUnitRatingKw} kW cada, com eficiência de conversão superior a 98.5%.`,
      keyMetrics: [
        { label: 'Potência Nominal PCS', value: `${sizing.nominalPowerMw} MW`, hint: `${sizing.nominalPowerKw} kW ativo` },
        { label: 'Quantidade de Módulos', value: `${sizing.pcsInverterCount}x inversores`, hint: `${sizing.pcsUnitRatingKw} kW por módulo` },
        { label: 'Arquitetura Técnica', value: vendor.architectureType, hint: vendor.vendorName },
        { label: 'Eficiência Conversão', value: '> 98.5%', hint: 'Eletrônica IGBT/SiC' },
      ],
      bulletPoints: [
        'Tecnologia de semicondutores de última geração: pontes inversoras baseadas em IGBTs avançados ou carbeto de silício (SiC) com baixíssimas perdas de chaveamento e frequência de modulação de 3 a 5 kHz.',
        'Topologia ' + vendor.architectureType + ': otimização independente por barramento DC, eliminando o efeito de incompatibilidade de strings (mismatch) e maximizando a energia extraída.',
        'Filtro de saída LCL integrado: garante conteúdo harmônico THD-I inferior a 3%, em total conformidade com os requisitos rígidos do ONS e das concessionárias de energia.',
        'Comutação de quatro quadrantes para injeção e absorção de potência ativa e reativa em regime permanente.',
      ],
      technicalDetails: [
        {
          title: 'Comparativo: Arquitetura Smart String vs Centralizada',
          content: vendor.architectureType.includes('String')
            ? 'A arquitetura Smart String adota 1 inversor/otimizador dedicado para cada rack de bateria. Isso significa que se um rack apresentar degradação ou falha, apenas ele é isolado, enquanto os demais continuam operando com 95%+ de disponibilidade da usina.'
            : 'A arquitetura centralizada reúne múltiplos racks em um barramento DC comum de alta potência conectado a um inversor centralizado de grande porte, oferecendo excelente densidade energética e menor custo por kW instalado.',
        },
        {
          title: 'Proteções Internas e Desconexão Rápida',
          content: 'O PCS incorpora detecção ultra-rápida de curto-circuito, sobretensão, subtensão, anti-ilhamento ativo (Frequency Shift e RVC) e proteção contra arco elétrico (AFCI) inteligente.',
        },
      ],
      regulatoryOrNormative: 'ABNT NBR 16149, IEC 62477-1 & IEEE 1547.',
      recommendationNote: 'A robustez do PCS é o elemento determinante para o tempo de resposta e confiabilidade de operação contínua do BESS.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 17 (PÁG 19): BMS em 3 Níveis
       ------------------------------------------------------------- */
    {
      pageNumber: 19,
      chapterNumber: 17,
      category: 'Segurança & Controle Eletroquímico',
      title: 'Sistema de Gerenciamento de Baterias (BMS) em 3 Níveis de Segurança',
      subtitle: 'Monitoramento contínuo em milissegundos e algoritmos de balanceamento ativo',
      summary: `O Battery Management System (BMS) é o guardião operacional de cada célula eletroquímica do BESS. A engenharia da Allmera adota arquitetura de segurança em 3 níveis hierárquicos independentes: Nível 1 (BMU por módulo), Nível 2 (BCMU por rack) e Nível 3 (BMS Mestre por contêiner). Essa estrutura garante que qualquer anomalia de tensão, corrente ou temperatura seja detectada e isolada em frações de segundo.`,
      keyMetrics: [
        { label: 'Hierarquia de Segurança', value: '3 Níveis', hint: 'BMU -> BCMU -> Mestre' },
        { label: 'Precisão de Medição', value: '± 1.0 mV', hint: 'Tensão individual célula' },
        { label: 'Amostragem Térmica', value: '1 sensor / 2 células', hint: 'Leitura a cada 100ms' },
        { label: 'Balanceamento', value: 'Ativo / Passivo', hint: 'Equalização de carga' },
      ],
      bulletPoints: [
        'Nível 1 (BMU - Battery Module Unit): circuitos integrados ASIC de precisão médica dedicados a medir a tensão de cada célula individualmente (resolução de milivolt) e temperatura dos barramentos.',
        'Nível 2 (BCMU - Battery Cluster Management Unit): controlador microprocessado no cabeçalho de cada rack que monitora corrente total, isolamento elétrico e gerencia o contator principal DC.',
        'Nível 3 (BMS Mestre de Sistema): consolida a telemetria de todos os racks, calcula os limites seguros de carga e descarga (SOP - State of Power) e comanda o PCS e os chillers.',
        'Algoritmos de inteligência de SoC (State of Charge) e SoH (State of Health) com filtro de Kalman estendido para precisão superior a 98%.',
      ],
      technicalDetails: [
        {
          title: 'Algoritmo de Equalização Ativa de Células',
          content: 'Durante o processo de recarga, células com ligeira diferença de capacidade tendem a atingir a tensão máxima mais cedo. O balanceamento ativo transfere carga das células com maior SoC para as vizinhas, permitindo que o contêiner armazene até 8% mais energia do que sistemas sem balanceamento eficiente.',
        },
        {
          title: 'Matriz de Ações de Proteção e Trip Escalável',
          content: 'Se a temperatura de uma célula atingir 45°C, o BMS eleva a refrigeração do chiller; a 55°C, reduz a corrente do PCS em 50%; se atingir 65°C, abre o contator DC do rack em menos de 10ms mantendo o restante da usina seguro.',
        },
      ],
      regulatoryOrNormative: 'IEC 62619, UL 1973 & ISO 26262 (Functional Safety Automotive Standards).',
      recommendationNote: 'A redundância em 3 níveis do BMS elimina pontos únicos de falha e blinda as baterias contra estresses operacionais.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 18 (PÁG 20): Gerenciamento Térmico (TMS)
       ------------------------------------------------------------- */
    {
      pageNumber: 20,
      chapterNumber: 18,
      category: 'Engenharia Térmica & Eficiência',
      title: 'Sistema de Gerenciamento Térmico (TMS) - Liquid Cooling Avançado',
      subtitle: 'Controle de temperatura por refrigeração líquida com gradiente térmico < 2.5°C',
      summary: `A temperatura operacional é o fator mais crítico na longevidade e segurança de baterias de lítio. Enquanto sistemas legados utilizavam refrigeração por ar-condicionado forçado (com alto consumo de energia e gradientes de até 8°C entre células), a solução recomendada para ${client.clientName} adota ${vendor.coolingMethod}. O fluido de arrefecimento percorre microcanais de alumínio diretamente sob cada módulo de célula, mantendo a temperatura uniforme em todo o contêiner.`,
      keyMetrics: [
        { label: 'Método Térmico', value: vendor.coolingMethod, hint: 'Tecnologia de ponta' },
        { label: 'Gradiente Máximo', value: '< 2.5 °C', hint: 'Uniformidade entre células' },
        { label: 'Economia Auxiliar', value: '35% a 40%', hint: 'Menor consumo de chiller' },
        { label: 'Fluido Refrigerante', value: 'Água + Glicol 50/50', hint: 'Anticorrosivo não-tóxico' },
      ],
      bulletPoints: [
        'Coeficiente de transferência de calor 3x a 5x superior ao ar: a água glicolada possui capacidade térmica muito maior, removendo calor gerado durante descargas rápidas (C-Rate elevado) instantaneamente.',
        'Eliminação do efeito de envelhecimento assimétrico: em sistemas a ar, as células mais próximas da entrada de ar envelhecem mais devagar do que as do fundo; o Liquid Cooling elimina essa discrepância, aumentando a vida útil global do BESS em até 35%.',
        'Operação silenciosa e selada: contêineres com refrigeração líquida possuem classificação IP65/IP66 contra poeira e umidade, sendo ideais para áreas industriais com particulados em suspensão.',
        'Consumo parasitário dos chillers reduzido em até 40%, melhorando a eficiência global RTE do sistema.',
      ],
      technicalDetails: [
        {
          title: 'Arquitetura do Circuito Hidráulico de Resfriamento',
          content: 'Circuito fechado pressurizado com bomba de circulação redundante com inversor de frequência (VFD), vaso de expansão, trocador de calor de placas e chiller modular externo de alta eficiência com refrigerante ecológico R410A / R32.',
        },
        {
          title: 'Algoritmo Preditivo de Pré-Resfriamento (Pre-cooling)',
          content: 'Integrado ao EMS, o sistema térmico consulta a programação de despacho; 30 minutos antes de iniciar a grande descarga de ponta de ' + sizing.nominalPowerMw + ' MW, os chillers resfriam preventivamente as baterias para 20°C, absorvendo o pico térmico subsequente com tranquilidade.',
        },
      ],
      regulatoryOrNormative: 'ASHRAE Guidelines, UL 9540 & Normas de Eficiência Energética ABNT.',
      recommendationNote: 'A tecnologia de Liquid Cooling é um divisor de águas que reduz sensivelmente o custo nivelado de armazenamento (LCOS).',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 19 (PÁG 21): Segurança Contra Incêndio & NFPA 855
       ------------------------------------------------------------- */
    {
      pageNumber: 21,
      chapterNumber: 19,
      category: 'Segurança Contra Incêndio & Normas Críticas',
      title: 'Sistema de Proteção Contra Incêndio, Detecção de Gases & NFPA 855',
      subtitle: 'Supressão por agente limpo FK-5-1-12, detecção precoce de fuga térmica e conformidade UL 9540A',
      summary: `A segurança contra incêndio e mitigação de fuga térmica (thermal runaway) é tratada com rigor absoluto pela Allmera. O projeto incorpora o conceito de defesa em profundidade, integrando sensores de gases específicos de pré-deflagração (hidrogênio H2, monóxido de carbono CO e hidrocarbonetos VOCs), sistema de supressão automática por gás limpo FK-5-1-12 (Novec 1230), painéis de alívio de deflagração e certificação internacional de ensaio em larga escala UL 9540A.`,
      keyMetrics: [
        { label: 'Agente Extintor', value: 'Gás Limpo FK-5-1-12', hint: 'Inodoro, sem resíduo' },
        { label: 'Detecção Precoce', value: 'Gases H2 + CO + VOC', hint: 'Detecta antes da fumaça' },
        { label: 'Ensaio de Propagação', value: 'UL 9540A Aprovado', hint: 'Sem propagação entre racks' },
        { label: 'Norma de Referência', value: 'NFPA 855 / IT-42 PMESP', hint: 'Corpo de Bombeiros' },
      ],
      bulletPoints: [
        'Detecção antes do fogo (Off-gas detection): as células de lítio liberam micropartículas e gases de eletrólito minutos antes de qualquer aumento brusco de calor ou fumaça visível; o sistema atua neste estágio preliminar.',
        'Inundação total por agente limpo FK-5-1-12 em menos de 10 segundos: o gás extingue chamas por resfriamento térmico e quebra da reação em cadeia sem conduzir eletricidade e sem danificar componentes eletrônicos.',
        'Painéis de alívio de sobrepressão de deflagração (Deflagration Venting) instalados no teto do contêiner, conforme norma NFPA 68, direcionando eventuais ondas de pressão para cima e para longe de operadores.',
        'Linha de água seca externa para bombeiros (Dry Chemical Sprinkler Connection): conexão storz padronizada de 2.5" permitindo que o Corpo de Bombeiros resfrie o contêiner externamente sem abrir portas.',
      ],
      technicalDetails: [
        {
          title: 'Relatório de Ensaio UL 9540A (Large Scale Fire Test)',
          content: 'A tecnologia do fabricante ' + vendor.vendorName + ' foi submetida a teste destrutivo forçado em laboratório certificado, comprovando que a combustão intencional de uma célula ou módulo não se propaga para as células vizinhas nem para os racks adjacentes.',
        },
        {
          title: 'Aprovação junto ao Corpo de Bombeiros Militar (AVCB / CLCB)',
          content: 'O projeto executivo inclui memorial descritivo de segurança contra incêndio pronto para submissão aos Bombeiros estaduais (ex: Instrução Técnica IT-42 da Polícia Militar do Estado de São Paulo ou equivalente estadual).',
        },
      ],
      regulatoryOrNormative: 'NFPA 855 (Installation of Stationary Energy Storage Systems), UL 9540A, NFPA 68 & IT-42 CBPMESP.',
      recommendationNote: 'A conformidade comprovada com NFPA 855 e UL 9540A garante facilidade de contratação de seguros patrimoniais com os menores prêmios do mercado.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 20 (PÁG 22): Sistema de Gerenciamento de Energia (EMS)
       ------------------------------------------------------------- */
    {
      pageNumber: 22,
      chapterNumber: 20,
      category: 'Software, Automação & Controle',
      title: 'Sistema de Gerenciamento de Energia (EMS), Algoritmos & SCADA',
      subtitle: 'Camada de inteligência operacional, controle preditivo e integração SCADA',
      summary: `O Energy Management System (EMS) é o cérebro digital que orquestra todas as ações do BESS. Desenvolvido para operação autônoma com alta resiliência cibernética, o EMS executa rotinas de aprendizado de máquina para previsão de consumo da planta, leitura de telemetria meteorológica, otimização de despacho tarifário e comunicação em tempo real com centros de controle e concessionárias de energia.`,
      keyMetrics: [
        { label: 'Controlador Industrial', value: 'CLP Redundante N3', hint: 'Tempo de ciclo 10ms' },
        { label: 'Protocolos de Rede', value: 'Modbus TCP / DNP3 / 61850', hint: 'Padrão industrial' },
        { label: 'Previsão de Carga', value: 'Machine Learning', hint: 'Rede neural horária' },
        { label: 'Cibersegurança', value: 'IEC 62443 Certified', hint: 'Firewall industrial' },
      ],
      bulletPoints: [
        'Despacho multiobjetivo inteligente: o EMS avalia em tempo real as condições tarifárias da distribuidora, o estado de carga da bateria (SoC) e a curva de demanda interna para selecionar o modo mais rentável.',
        'Interface Homem-Máquina (IHM) local touch-screen instalada na porta do contêiner e dashboard web em nuvem com acesso corporativo seguro.',
        'Integração facilitada ao SCADA da planta fabril via protocolos abertos padronizados (OPC UA, Modbus TCP e DNP3).',
        'Registro histórico de eventos (SOE) com resolução de 1 milissegundo, permitindo auditoria detalhada de qualquer transitório elétrico.',
      ],
      technicalDetails: [
        {
          title: 'Arquitetura de Controle em Camadas',
          content: 'A camada de controle primário em tempo real roda diretamente em hardware industrial local com sistema operacional de tempo real (RTOS); a camada de otimização em nuvem apenas sugere parâmetros de setpoint, garantindo que o BESS opere com 100% de autonomia mesmo se a conexão de internet cair.',
        },
        {
          title: 'Comunicação com a Distribuidora e ONS',
          content: 'O EMS é preparado para receber comandos remotos de limitação de potência (curtailment) ou injeção de reativos emitidos pelos centros de operação das concessionárias (COD) através de canais criptografados.',
        },
      ],
      regulatoryOrNormative: 'IEC 62443 (Cibersegurança Industrial), IEC 60870-5-104 & IEC 61850.',
      recommendationNote: 'A inteligência do EMS maximiza o valor gerado pelo BESS ao longo de toda a sua vida contratual.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 21 (PÁG 23): Balance of Plant (BOP) & Civil
       ------------------------------------------------------------- */
    {
      pageNumber: 23,
      chapterNumber: 21,
      category: 'Engenharia Civil & Eletromecânica',
      title: 'Balance of Plant (BOP), Engenharia Civil, Fundações e Layout Físico',
      subtitle: 'Projeto de base civil, distanciamentos de segurança, diques ambientais e aterramento',
      summary: `O Balance of Plant (BOP) compreende todas as obras civis, montagens eletromecânicas, canaletas de cabos, malha de aterramento e sistemas auxiliares necessários para abrigar com segurança o sistema de ${sizing.nominalEnergyMwh} MWh. O layout físico foi otimizado para minimizar a ocupação de solo, respeitar os afastamentos regulamentares perimetrais e permitir fácil circulação de guindastes e viaturas de manutenção e emergência.`,
      keyMetrics: [
        { label: 'Área Estimada Ocupada', value: `${sizing.batteryContainersCount * 38 + 55} m²`, hint: 'Footprint compacto' },
        { label: 'Base de Concreto', value: 'Radier armado 30cm', hint: 'Capacidade 3.5 t/m²' },
        { label: 'Malha de Aterramento', value: '< 5 Ohms', hint: 'Cobre nu 70mm²' },
        { label: 'Afastamento Perimetral', value: '>= 3.0 metros', hint: 'Norma NFPA 855' },
      ],
      bulletPoints: [
        'Fundações em radier de concreto armado: projetadas para suportar o peso concentrado dos contêineres de baterias (cerca de 28 a 35 toneladas por unidade de 20/40 pés) sem recalques diferenciais.',
        'Dique de contenção para transformadores: bacia de concreto impermeabilizada com capacidade para 100% do volume de óleo isolante e separador de água e óleo, conforme normas ambientais da CETESB / FEAM / INEA.',
        'Malha de aterramento equipotencial: interligação de todas as estruturas metálicas dos contêineres, carcaças de transformadores e blindagens de cabos à malha de aterramento geral da subestação.',
        'Rotas de acesso para veículos pesados com raio de giro mínimo para caminhões guindaste telescópicos (munk) de 70 toneladas.',
      ],
      technicalDetails: [
        {
          title: 'Iluminação de Emergência e Monitoramento CFTV',
          content: 'Postes perimetrais com iluminação LED de alta eficiência alimentados pelo circuito essencial da UPS e câmeras térmicas infravermelhas com análise inteligente de imagem apontadas para os contêineres.',
        },
        {
          title: 'Trincheiras e Eletrodutos de Média e Baixa Tensão',
          content: 'Canaletas em alvenaria ou concreto pré-moldado com tampas de concreto articuladas e septos divisores físicos para separação rigorosa de cabos de força (MT/BT) e cabos de instrumentação e fibra óptica.',
        },
      ],
      regulatoryOrNormative: 'ABNT NBR 6118 (Estruturas de Concreto), NBR 5410, NBR 14039 & Resoluções Ambientais CONAMA.',
      recommendationNote: 'A disciplina civil e ambiental do projeto assegura execução célere de obras sem retrabalhos ou embargos.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 22 (PÁG 24): Diagrama Unifilar (SLD) & Subestação
       ------------------------------------------------------------- */
    {
      pageNumber: 24,
      chapterNumber: 22,
      category: 'Engenharia Elétrica & Subestação',
      title: 'Diagrama Unifilar Executivo (SLD) & Arquitetura Elétrica da Subestação',
      subtitle: 'Configuração dos barramentos BT e MT, transformadores elevadores e cubículos de proteção',
      summary: `A interconexão do BESS à infraestrutura elétrica de ${client.clientName} é detalhada no Diagrama Unifilar Executivo (SLD - Single Line Diagram). O sistema conecta os racks de bateria DC aos inversores PCS de baixa tensão (0.8 kV AC), que alimentam ${sizing.mvTransformerSkidCount} skid(s) de transformador elevador de acoplamento para ${client.connectionVoltage || '13.8 kV'}, interligando-se à subestação de entrada através de cubículos blindados com disjuntor a vácuo e relés digitais de proteção.`,
      keyMetrics: [
        { label: 'Tensão de Acoplamento', value: client.connectionVoltage || '13.8 kV', hint: 'Média Tensão' },
        { label: 'Transformador Elevador', value: `${sizing.transformerRatingMva} MVA`, hint: '0.8 kV / 13.8 kV Dyn1' },
        { label: 'Disjuntor MT', value: 'A Vácuo (VCB)', hint: '630A / 16kA simétrico' },
        { label: 'Relé de Proteção', value: 'Multifunção ANSI', hint: 'Funções 50/51/27/59/81' },
      ],
      bulletPoints: [
        'Transformador com blindagem eletrostática entre primário e secundário: minimiza a transferência de transitórios de alta frequência e ruídos harmônicos da rede para os inversores.',
        'Cubículo de média tensão metal-clad em conformidade com a norma NBR IEC 62271-200, com chave seccionadora de aterramento rápido e bloqueio mecânico tipo Kirk.',
        'Filosofia de proteção seletiva: coordenação temporal dos relés de sobrecorrente (50/51 e 50N/51N) garantindo que falhas internas no ramal do BESS sejam isoladas sem desarmar o disjuntor geral da fábrica.',
        'Transformadores de potencial (TP) e de corrente (TC) com classe de exatidão 0,2% para medição e 10B200 para proteção.',
      ],
      technicalDetails: [
        {
          title: 'Funções de Proteção Elétrica Parametrizadas (Código ANSI)',
          content: 'Sobrecorrente instantânea e temporizada (50/51 e 50N/51N), Subtensão (27), Sobretensão (59), Subfrequência e Sobrefrequência (81U/81O), Direcional de potência (32), Desbalanceamento de corrente (46) e Sincronismo (25).',
        },
        {
          title: 'Sistema de Aterramento do Neutro do Transformador',
          content: 'Aterramento do secundário em estrela através de resistor de aterramento de neutro (NGR) ou aterramento sólido de acordo com a malha da concessionária distribuidora.',
        },
      ],
      regulatoryOrNormative: 'ABNT NBR 14039 (Instalações de Média Tensão) & Normas Técnicas da Concessionária ' + client.utilityCompany + '.',
      recommendationNote: 'A arquitetura do unifilar garante total segurança operacional com aprovação desimpedida perante a concessionária.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 23 (PÁG 25): BENCHMARK BRASIL - HUAWEI
       ------------------------------------------------------------- */
    {
      pageNumber: 25,
      chapterNumber: 23,
      category: 'Benchmark de Mercado - Fabricante 01',
      title: 'Benchmark de Soluções no Brasil: Huawei Digital Power',
      subtitle: 'Análise técnica da linha Smart String ESS (LUNA2000-2.0MWH-2H1)',
      summary: `A Huawei Digital Power é uma das líderes globais em soluções de eletrônica de potência e armazenamento por baterias, com forte presença e ecossistema consolidado no Brasil. Sua principal solução é o sistema modular Smart String LUNA2000, que adota arquitetura descentralizada com otimizadores independentes por pack de bateria, eliminando perdas de mismatch e viabilizando manutenção sem paralisação da usina.`,
      keyMetrics: [
        { label: 'Linha de Produto', value: 'Smart String ESS LUNA2000', hint: '2.0 MWh por bloco' },
        { label: 'Arquitetura', value: 'Smart String Descentralizado', hint: 'Otimização por pack' },
        { label: 'Rendimento RTE', value: '91.5%', hint: 'Liquid cooling inteligente' },
        { label: 'Capex Estimado', value: 'R$ 1.650 / kWh', hint: 'Score Allmera: 4.9/5' },
      ],
      bulletPoints: [
        'Topologia Descentralizada Smart String: cada pack de bateria possui seu próprio otimizador DC-DC integrado. Isso elimina o tradicional "efeito barril", onde uma célula mais fraca dita a capacidade de todo o contêiner.',
        'Manutenção Modular sem Parada (Hot-Swap): caso um pack de baterias precise de assistência, ele é desacoplado isoladamente sem necessidade de descarregar ou desligar o contêiner completo.',
        'Refrigeração líquida inteligente com gradiente térmico de apenas 2.5°C entre células, prolongando a vida útil em até 50%.',
        'Proteção ativa contra arco elétrico (AFCI) baseada em algoritmos neurais com desligamento ultra-rápido em 0.5s.',
      ],
      technicalDetails: [
        {
          title: 'Presença e Suporte Técnico no Brasil',
          content: 'Sede corporativa em São Paulo (SP) e centros logísticos e de distribuição em Sorocaba e Louveira. Corpo técnico próprio de engenharia de aplicação e suporte nível N3 no país com SLA de atendimento em campo de 24h a 48h.',
        },
        {
          title: 'Considerações Comerciais e Bancabilidade',
          content: 'Solução importada (não elegível a Finame BNDES direto), porém amplamente financiada por bancos comerciais privados (Santander, BV, Itaú, Bradesco) e fundos ESG com excelentes prazos.',
        },
      ],
      regulatoryOrNormative: 'UL 9540A, NFPA 855, IEC 62619 & Certificação Huawei Gold Partner.',
      recommendationNote: 'A solução da Huawei é a mais recomendada pela Allmera para projetos industriais C&I de 500 kW a 5 MW que exigem máxima disponibilidade.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 24 (PÁG 26): BENCHMARK BRASIL - SUNGROW
       ------------------------------------------------------------- */
    {
      pageNumber: 26,
      chapterNumber: 24,
      category: 'Benchmark de Mercado - Fabricante 02',
      title: 'Benchmark de Soluções no Brasil: Sungrow Power Supply',
      subtitle: 'Análise técnica da linha PowerTitan Series (ST2752K / ST5016K Liquid Cooled ESS)',
      summary: `A Sungrow Power Supply é líder global incontestável em volume de remessas de BESS para o setor Utility Scale e projetos de grande porte, classificada consistentemente como Tier 1 com 100% de bancabilidade nos relatórios BloombergNEF. Sua linha PowerTitan combina altíssima densidade energética em contêineres de 20 e 40 pés padronizados com inversores centralizados integrados de alta eficiência.`,
      keyMetrics: [
        { label: 'Linha de Produto', value: 'PowerTitan Series', hint: '2.75 MWh a 5.0 MWh' },
        { label: 'Arquitetura', value: 'Centralizado Integrado', hint: 'PCS pré-comissionado' },
        { label: 'Rendimento RTE', value: '91.0%', hint: 'Liquid cooling por zona' },
        { label: 'Capex Estimado', value: 'R$ 1.520 / kWh', hint: 'Score Allmera: 4.8/5' },
      ],
      bulletPoints: [
        'Máxima densidade energética por metro quadrado: solução turnkey pré-montada de fábrica, reduzindo drasticamente o tempo e o custo de obras civis e eletromecânicas no local da instalação.',
        'Liderança global de bancabilidade: aceita sem restrições por praticamente todos os fundos de investimento e bancos internacionais de infraestrutura.',
        'Controle térmico de refrigeração líquida por zonas independentes que minimiza o consumo de energia parasitária dos chillers em dias de baixa carga.',
        'Excelente custo-benefício de Capex por kWh em instalações de grande porte (acima de 5 MW / 10 MWh).',
      ],
      technicalDetails: [
        {
          title: 'Presença e Pós-Venda no Território Nacional',
          content: 'Filial corporativa em São Paulo (SP) e centros de serviço em Minas Gerais e no Nordeste brasileiro, com equipe dedicada de engenharia de campo e estoque local de peças de reposição.',
        },
        {
          title: 'Considerações de Projeto',
          content: 'Por utilizar arquitetura de inversores centralizados, exige guindastes pesados durante o descarregamento na obra e eventual manutenção de um bloco de PCS envolve desligamento de um conjunto maior de racks.',
        },
      ],
      regulatoryOrNormative: 'UL 9540, UL 9540A, NFPA 855 & IEC 62477-1.',
      recommendationNote: 'A Sungrow é a solução ideal para grandes plantas industriais com espaço físico concentrado e projetos de leilões de reserva.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 25 (PÁG 27): BENCHMARK BRASIL - BYD
       ------------------------------------------------------------- */
    {
      pageNumber: 27,
      chapterNumber: 25,
      category: 'Benchmark de Mercado - Fabricante 03',
      title: 'Benchmark de Soluções no Brasil: BYD Energy Brasil',
      subtitle: 'Análise técnica da linha MC Cube ESS com tecnologia Blade Battery CTP',
      summary: `A BYD Energy Brasil se destaca por deter controle total da cadeia de valor, desde a extração de matérias-primas e refino do lítio até a fabricação de células, módulos e contêineres finais. A linha MC Cube utiliza a tecnologia proprietária Blade Battery Cell-to-Pack (CTP), eliminando o nível intermediário de módulos e conferindo segurança química incomparável contra perfurações mecânicas.`,
      keyMetrics: [
        { label: 'Linha de Produto', value: 'MC Cube ESS (Blade)', hint: '2.6 MWh por bloco' },
        { label: 'Tecnologia da Célula', value: 'Blade LFP Cell-to-Pack', hint: 'CTP sem módulos' },
        { label: 'Segurança Mecânica', value: 'Nail Penetration Pass', hint: 'Sem fumaça ou chama' },
        { label: 'Capex Estimado', value: 'R$ 1.580 / kWh', hint: 'Score Allmera: 4.7/5' },
      ],
      bulletPoints: [
        'Célula Blade ultrassegura: submetida ao teste extremo de perfuração por prego (Nail Penetration Test), a célula não explode, não emite chamas e a temperatura superficial não ultrapassa 60°C.',
        'Aproveitamento volumétrico Cell-to-Pack: redução de mais de 40% nas conexões parafusadas e cabeamentos internos, diminuindo pontos potenciais de falha.',
        'Excelente ciclabilidade: garantia de até 7.000 ciclos profundos a 100% de profundidade de descarga (DoD).',
        'Forte presença industrial no Brasil, com fábricas de módulos e veículos em Campinas (SP), Manaus (AM) e complexo fabril em Camaçari (BA).',
      ],
      technicalDetails: [
        {
          title: 'Presença Corporativa e Industrial no Brasil',
          content: 'A BYD é um dos maiores conglomerados industriais instalados no país, com laboratórios próprios de homologação e corpo de engenharia permanente em solo brasileiro.',
        },
        {
          title: 'Considerações de Projeto',
          content: 'O sistema requer alinhamento e homologação detalhada com fabricantes parceiros de inversores PCS externos em projetos onde o PCS não for fornecido diretamente pela BYD.',
        },
      ],
      regulatoryOrNormative: 'UL 9540A, NFPA 855, IEC 62619 & Padrões Internacionais de Transporte UN 38.3.',
      recommendationNote: 'A BYD é altamente indicada para instalações próximas a centros urbanos com severas exigências de segurança contra incêndio.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 26 (PÁG 28): BENCHMARK BRASIL - WEG
       ------------------------------------------------------------- */
    {
      pageNumber: 26,
      chapterNumber: 26,
      category: 'Benchmark de Mercado - Fabricante 04',
      title: 'Benchmark de Soluções no Brasil: WEG Equipamentos Elétricos',
      subtitle: 'Análise técnica da linha WEG W-ESS (Solução Integrada de Armazenamento Nacional)',
      summary: `A WEG é a gigante multinacional brasileira de equipamentos eletroeletrônicos e a única a oferecer um sistema de BESS totalmente integrado no país com inversores, transformadores de média tensão, cubículos blindados e painéis de proteção de fabricação 100% própria. Seu grande diferencial estratégico é a elegibilidade ao credenciamento FINAME / BNDES, permitindo acesso a linhas de crédito públicas com juros subsidiados.`,
      keyMetrics: [
        { label: 'Linha de Produto', value: 'WEG W-ESS Integrado', hint: '1.5 MWh a 3.0 MWh' },
        { label: 'FINAME / BNDES', value: '100% Elegível', hint: 'Financiamento subsidiado' },
        { label: 'Capilaridade Nacional', value: 'Líder Absoluta', hint: 'Suporte em todo o BR' },
        { label: 'Capex Estimado', value: 'R$ 1.780 / kWh', hint: 'Score Allmera: 4.7/5' },
      ],
      bulletPoints: [
        'Elegibilidade FINAME BNDES: permite ao cliente financiar até 100% do projeto com taxas subsidiadas, carências alongadas e prazos de amortização de até 10 a 15 anos.',
        'Componentes eletrotécnicos nacionais: inversores, transformadores, painéis de média tensão e sistemas de automação de fabricação nacional WEG.',
        'Maior capilaridade de assistência técnica do Brasil: rede autorizada de assistência e peças de reposição presente em praticamente todos os municípios do país.',
        'Facilidade extrema de aprovação e homologação de projetos junto a todas as concessionárias de energia do Brasil (Enel, Cemig, CPFL, Neoenergia, etc.), que já têm pleno domínio dos padrões WEG.',
      ],
      technicalDetails: [
        {
          title: 'Integração de Células de Lítio',
          content: 'A WEG integra células prismáticas LFP de parceiros Tier 1 globais certificados com controle de qualidade e montagem final em suas unidades industriais em Santa Catarina e São Paulo.',
        },
        {
          title: 'Considerações de Capex',
          content: 'O valor inicial por kWh é ligeiramente superior ao de importadores asiáticos puros devido aos custos industriais de nacionalização, diferencial amplamente compensado pelo custo de capital mais baixo do financiamento BNDES.',
        },
      ],
      regulatoryOrNormative: 'ABNT NBR, NR-10, NR-12, IEC 62619 & Certificação Finame BNDES.',
      recommendationNote: 'A WEG é a escolha prioritária para empresas públicas, concessões ou clientes que priorizam financiamento subsidiado via BNDES.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 27 (PÁG 29): BENCHMARK BRASIL - TESLA
       ------------------------------------------------------------- */
    {
      pageNumber: 27,
      chapterNumber: 27,
      category: 'Benchmark de Mercado - Fabricante 05',
      title: 'Benchmark de Soluções no Brasil: Tesla Energy',
      subtitle: 'Análise técnica da linha Megapack 2XL Series (3.9 MWh All-In-One Container)',
      summary: `A Tesla Energy é a referência mundial em sistemas de armazenamento em escala de rede com seu produto consagrado Megapack 2XL. O contêiner de 3.9 MWh integra módulos de bateria, inversores térmicos bidirecionais, sistema de liquid cooling e controle de proteção em uma única unidade compacta pré-testada de fábrica, operando sob o sofisticado software algorítmico Autobidder.`,
      keyMetrics: [
        { label: 'Linha de Produto', value: 'Megapack 2XL', hint: '3.9 MWh all-in-one' },
        { label: 'Software de Trading', value: 'Tesla Autobidder', hint: 'Inteligência artificial' },
        { label: 'Garantia de Fábrica', value: 'Até 15 anos', hint: 'Bancabilidade global' },
        { label: 'Capex Estimado', value: 'R$ 1.850 / kWh', hint: 'Score Allmera: 4.6/5' },
      ],
      bulletPoints: [
        'Solução turnkey all-in-one mais testada e respeitada globalmente: sistema entregue 100% montado e testado internamente pela Tesla nos EUA.',
        'Software de arbitragem Autobidder líder de mercado: algoritmos de aprendizado profundo que negociam e despacham energia automaticamente em mercados spot complexos.',
        'Garantia estendida de fábrica de até 15 anos com taxa de degradação extremamente conservadora e confiável.',
        'Máxima bancabilidade perante fundos de private equity internacionais e agências de classificação de risco globais.',
      ],
      technicalDetails: [
        {
          title: 'Desafios Logísticos e Operacionais no Brasil',
          content: 'A Tesla não possui fábrica ou estoque de peças próprio em território brasileiro, operando por meio de integradores credenciados e suporte internacional, o que acarreta exposição cambial direta em dólares e prazos de importação mais dilatados.',
        },
        {
          title: 'Custos de Nacionalização',
          content: 'O Capex final em reais reflete os tributos de importação (Imposto de Importação, IPI, PIS/COFINS e ICMS), exigindo estruturação de importação sob regime de ex-tarifário quando disponível.',
        },
      ],
      regulatoryOrNormative: 'UL 9540, UL 9540A, NFPA 855 & FM Global Data Sheet 5-33.',
      recommendationNote: 'Indicada para investidores internacionais com capital denominado em moeda forte e foco em arbitragem pura de energia.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 28 (PÁG 30): PARECER TÉCNICO OFICIAL ALLMERA
       ------------------------------------------------------------- */
    {
      pageNumber: 28,
      chapterNumber: 28,
      category: 'Parecer Técnico & Seleção Oficial',
      title: 'Parecer Técnico Comparativo & Recomendação Oficial Allmera Partners',
      subtitle: 'Matriz de decisão multicritério e quadro resumo comparativo dos fabricantes no Brasil',
      summary: `Com base nas características da unidade consumidora de ${client.clientName} (subgrupo ${client.subgroup}, concessionária ${client.utilityCompany}, potência requerida de ${sizing.nominalPowerMw} MW e autonomia de ${input.durationHours} horas), a equipe de engenharia da Allmera Partners conduziu uma avaliação comparativa rigorosa sintetizada no Quadro Resumo Comparativo Brasil, confrontando as soluções da Huawei, Sungrow, BYD, WEG e Tesla sob 7 pilares fundamentais. A solução homologada e recomendada é: ${vendor.vendorName} (${vendor.productLine}).`,
      keyMetrics: [
        { label: 'Fornecedor Recomendado', value: vendor.vendorName, hint: vendor.flagCountry },
        { label: 'Arquitetura Escolhida', value: vendor.architectureType, hint: 'Topologia ótima' },
        { label: 'Score Multicritério', value: `${vendor.overallRating.toFixed(1)} / 5.0`, hint: 'Liderança técnica' },
        { label: 'Relação Custo-Benefício', value: 'Excelente', hint: 'Menor LCOS operacional' },
      ],
      bulletPoints: [
        `Quadro Resumo Comparativo Brasil: análise consolidada dos 5 fabricantes líderes no mercado nacional (Huawei, Sungrow, BYD, WEG e Tesla) contemplando Capex por kWh, Turnkey estimado da planta, elegibilidade a financiamento FINAME / BNDES, garantia em ciclos e presença local no Brasil.`,
        `Maturidade e Suporte Local no Brasil: o fornecedor selecionado (${vendor.vendorName}) possui estrutura sólida em território nacional, com engenharia N3 e estoque de peças, garantindo SLA de campo compatível com a criticidade da operação.`,
        `Rendimento Térmico e Ciclos: a tecnologia ${vendor.coolingMethod} associada à garantia de ${vendor.guaranteedCycles.toLocaleString('pt-BR')} ciclos oferece a menor taxa de degradação anual para a rotina de ${input.cyclesPerDay} ciclo(s) diário(s).`,
        `Segurança Certificada: cumprimento integral das normas NFPA 855 e ensaios de deflagração UL 9540A, garantindo aprovação célere perante o Corpo de Bombeiros Militar e as seguradoras patrimoniais.`,
        'Compatibilidade com os objetivos do Cardápio BESS: desempenho superior em Peak Shaving, gestão de demanda instantânea e transição ininterrupta para cargas prioritárias.',
      ],
      technicalDetails: [
        {
          title: 'Matriz Ponderada de Avaliação Allmera & Síntese dos Fabricantes',
          content: 'Pesos atribuídos no benchmark Brasil: Desempenho Técnico e RTE (20%), Segurança e Gerenciamento Térmico (20%), Suporte Local e Peças no Brasil (20%), Capex e Viabilidade de Financiamento BNDES/Privado (20%) e Bancabilidade e Garantia (20%). O quadro resumo consolida as notas de cada fornecedor.',
        },
        {
          title: 'Conclusão da Comissão de Engenharia e Escolha Homologada',
          content: `A Allmera ratifica que a solução ${vendor.vendorName} entrega o menor Custo Nivelado de Armazenamento (LCOS de R$ ${sizing.lcosBrlPerKwh.toFixed(2)}/kWh), minimizando o risco tecnológico para a diretoria e investidores de ${client.clientName}.`,
        },
      ],
      regulatoryOrNormative: 'Protocolo de Homologação Técnica de Fornecedores Allmera Partners v4.2.',
      recommendationNote: 'A escolha técnica do fornecedor assegura previsibilidade de desempenho com proteção contratual de longo prazo.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 29 (PÁG 31): ENGENHARIA FINANCEIRA, CAPEX & OPEX
       ------------------------------------------------------------- */
    {
      pageNumber: 29,
      chapterNumber: 29,
      category: 'Modelagem Econômico-Financeira',
      title: 'Engenharia Econômico-Financeira, TCO, Capex, Opex e Modelagem 15 Anos',
      subtitle: 'Composição de investimento, fluxo de caixa projetado, TIR, VPL e LCOS',
      summary: `A modelagem econômico-financeira desenvolvida pela Allmera comprova a viabilidade do investimento no BESS para ${client.clientName}. Com um Capex total Turnkey de R$ ${(sizing.totalCapexBrl / 1_000_000).toFixed(2)} milhões (US$ ${(sizing.totalCapexUsd / 1_000).toLocaleString('pt-BR')}k), o sistema gera um benefício anual bruto de R$ ${(sizing.totalAnnualBenefitBrl / 1_000).toLocaleString('pt-BR')}k, resultando em Payback Simples de ${sizing.simplePaybackYears} anos, TIR de ${sizing.irrPercent}% ao ano e VPL de R$ ${(sizing.npvBrl / 1_000_000).toFixed(2)} milhões a uma taxa de desconto (WACC) de ${client.waccDiscountRate}%.`,
      keyMetrics: [
        { label: 'Capex Turnkey Total', value: `R$ ${(sizing.totalCapexBrl / 1_000_000).toFixed(2)} M`, hint: `US$ ${(sizing.totalCapexUsd / 1000).toLocaleString('pt-BR')}k` },
        { label: 'Benefício Líquido Anual', value: `R$ ${((sizing.totalAnnualBenefitBrl - sizing.annualOpexBrl) / 1000).toLocaleString('pt-BR')}k/ano`, hint: 'Líquido de Opex' },
        { label: 'Payback Simples / Desc.', value: `${sizing.simplePaybackYears}a / ${sizing.discountedPaybackYears}a`, hint: 'Retorno do investimento' },
        { label: 'TIR / VPL (15 Anos)', value: `${sizing.irrPercent}% / R$ ${(sizing.npvBrl / 1_000_000).toFixed(2)}M`, hint: `WACC: ${client.waccDiscountRate}% a.a.` },
      ],
      bulletPoints: [
        `Composição do Capex: Baterias e Contêineres (R$ ${(sizing.bessEquipmentCapexBrl / 1_000_000).toFixed(2)}M), PCS e Transformadores (R$ ${(sizing.pcsAndTransformerCapexBrl / 1_000_000).toFixed(2)}M), BOP Civil e Elétrico (R$ ${(sizing.bopCivilElectricalCapexBrl / 1_000_000).toFixed(2)}M) e Engenharia/EPC (R$ ${(sizing.engineeringCommissioningCapexBrl / 1_000_000).toFixed(2)}M).`,
        `Opex Anual Estimado: R$ ${(sizing.annualOpexBrl / 1_000).toLocaleString('pt-BR')}k/ano (equivalente a ~1.7% do Capex), contemplando contrato de manutenção preventiva, seguros patrimoniais, monitoramento remoto 24/7 e consumos auxiliares.`,
        `Custo Nivelado de Armazenamento (LCOS): R$ ${sizing.lcosBrlPerKwh.toFixed(2)} por kWh descarregado ao longo da vida útil de 15 anos, valor substancialmente inferior à tarifa de ponta cobrada pela distribuidora (R$ ${client.peakTariff.toFixed(2)}/kWh).`,
        'Resiliência a cenários inflacionários: os benefícios crescem a cada reajuste tarifário anual homologado pela Aneel para a concessionária.',
      ],
      technicalDetails: [
        {
          title: 'Metodologia de Fluxo de Caixa Descontado (FCD)',
          content: 'A projeção considera horizonte de 15 anos com taxa de degradação anual da bateria de ' + input.annualDegradationPercent.toFixed(1) + '%, inflação de tarifas de 4.5% a.a. e taxa de desconto de oportunidade do capital de ' + client.waccDiscountRate + '% a.a.',
        },
        {
          title: 'Linhas de Financiamento Estruturado Disponíveis',
          content: 'Estruturação de financiamento bancário com amortização pelo método SAC ou Price, prazo de carência de até 12 a 24 meses e taxas indexadas ao CDI ou IPCA, permitindo que a economia na conta de luz pague integralmente as parcelas do financiamento.',
        },
      ],
      regulatoryOrNormative: 'Princípios Contábeis Internacionais IFRS & Modelagem Financeira Corporativa Allmera.',
      recommendationNote: 'O projeto apresenta retorno econômico robusto com indicadores que superam amplamente o custo de capital corporativo.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 30 (PÁG 32): MARCO REGULATÓRIO & ANEEL REN 1.000
       ------------------------------------------------------------- */
    {
      pageNumber: 30,
      chapterNumber: 30,
      category: 'Regulação Setorial & Normas Brasileiras',
      title: 'Marco Regulatório Brasileiro, Normas Técnicas & Aneel REN 1.000',
      subtitle: 'Enquadramento legal para sistemas de armazenamento no mercado cativo e livre',
      summary: `A regulação de sistemas de armazenamento de energia no Brasil vem evoluindo aceleradamente por meio de atos da Aneel e do Ministério de Minas e Energia. O projeto de ${client.clientName} é estruturado em total conformidade com a Resolução Normativa Aneel 1.000/2021 (Regras de Prestação do Serviço Público de Distribuição de Energia Elétrica), Procedimentos de Distribuição (PRODIST Módulos 3 e 8) e as normas técnicas da ABNT.`,
      keyMetrics: [
        { label: 'Marco Regulatório Base', value: 'Aneel REN 1.000/2021', hint: 'Regras de Distribuição' },
        { label: 'Critério de Injeção', value: 'Zero Export Configurado', hint: 'Consumo 100% interno' },
        { label: 'Norma Conexão Rede', value: 'ABNT NBR 16149 / 16150', hint: 'Inversores interconectados' },
        { label: 'Procedimentos de Rede', value: 'ONS Submódulo 3.6', hint: 'Requisitos de acesso' },
      ],
      bulletPoints: [
        'Enquadramento sem injeção indevida na rede: operando no modo Zero Export (descarregando apenas para as cargas internas da unidade consumidora), o BESS não depende de processos complexos de compensação de energia ou outorgas de geração perante a Aneel.',
        'Conformidade com o PRODIST Módulo 3: garantia de não perturbação da rede de distribuição da concessionária ' + client.utilityCompany + ', mantendo limites de distorção harmônica e desbalanço de tensão.',
        'Atendimento às normas de segurança ocupacional NR-10 (Segurança em Instalações e Serviços em Eletricidade) e NR-12 (Segurança no Trabalho em Máquinas e Equipamentos).',
        'Preparação para as futuras resoluções da Aneel sobre o Sandbox Regulatório de BESS e remuneração de serviços ancilares.',
      ],
      technicalDetails: [
        {
          title: 'Resolução Aneel REN 1.000/2021 (Artigos Relevantes)',
          content: 'A norma assegura o direito do consumidor de instalar equipamentos de eficiência e gestão de carga atrás do medidor (Behind-the-Meter), desde que respeitados os limites de proteção e que não haja injeção de potência ativa não autorizada pela concessionária.',
        },
        {
          title: 'Certificação de Inversores e Equipamentos',
          content: 'Todos os inversores e cubículos possuem relatórios de ensaio de tipo emitidos por laboratórios acreditados pelo INMETRO ou organismos internacionais com reconhecimento mútuo (ILAC).',
        },
      ],
      regulatoryOrNormative: 'Aneel REN 1.000/2021, PRODIST Módulos 3 e 8 & ABNT NBR 16149.',
      recommendationNote: 'A segurança jurídica do projeto é total, respaldada pela regulamentação setorial vigente.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 31 (PÁG 33): ROTEIRO DE ACESSO & CONCESSIONÁRIA
       ------------------------------------------------------------- */
    {
      pageNumber: 31,
      chapterNumber: 31,
      category: 'Procedimentos de Acesso & Concessionária',
      title: 'Roteiro de Conexão na Concessionária & Parecer de Acesso',
      subtitle: 'Passo a passo técnico e documental para aprovação do projeto perante a distribuidora',
      summary: `O processo de interconexão de um BESS exige relacionamento técnico formal com a concessionária local (${client.utilityCompany}). A Allmera desenvolveu um roteiro padronizado que abrange desde a elaboração dos estudos elétricos preliminares até a emissão do Parecer de Acesso definitivo, inspeção de campo, comissionamento conjunto e liberação do termo de vistoria técnica.`,
      keyMetrics: [
        { label: 'Distribuidora Alvo', value: client.utilityCompany, hint: client.state },
        { label: 'Documento Chave', value: 'Parecer de Acesso Formal', hint: 'Distribuidora / Aneel' },
        { label: 'Prazo Regulatório', value: '30 a 60 dias úteis', hint: 'Análise da concessionária' },
        { label: 'ART de Engenharia', value: 'CREA-SP Registrada', hint: 'Responsabilidade técnica' },
      ],
      bulletPoints: [
        'Fase 1 - Elaboração do Projeto Executivo e Estudos Elétricos: confecção do diagrama unifilar, memorial descritivo, cálculo de curto-circuito, parametrização dos relés e coordenadas UTM das instalações.',
        'Fase 2 - Protocolo da Solicitação de Acesso: envio da documentação formal via portal de engenharia da distribuidora acompanhado da Anotação de Responsabilidade Técnica (ART) do CREA.',
        'Fase 3 - Análise e Emissão do Parecer de Acesso: acompanhamento técnico das respostas da concessionária dentro dos prazos legais do PRODIST, com esclarecimento imediato de eventuais exigências.',
        'Fase 4 - Vistoria Técnica e Comissionamento em Campo: inspeção física dos cubículos de proteção, testes de injeção secundária de relés e lacração dos sistemas fiscais de medição.',
      ],
      technicalDetails: [
        {
          title: 'Estudos de Engenharia Exigidos pela Concessionária',
          content: 'Estudo de coordenação e seletividade da proteção de média tensão, estudo de fluxo de carga no Ponto de Conexão Comum (PCC), verificação da capacidade de interrupção dos disjuntores e estudo de qualidade da energia (harmônicos e flutuação de tensão).',
        },
        {
          title: 'Acordo Operativo (AO)',
          content: 'Formalização de acordo operativo entre a equipe de operação do cliente e o Centro de Operação da Distribuidora (COD), estabelecendo números de emergência e procedimentos de manobra.',
        },
      ],
      regulatoryOrNormative: 'PRODIST Módulo 3 (Acesso aos Sistemas de Distribuição) & Normas Técnicas Particulares da Distribuidora.',
      recommendationNote: 'A gestão ativa do processo regulatório pela Allmera reduz o tempo de aprovação perante a concessionária em até 50%.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 32 (PÁG 34): COMISSIONAMENTO, TESTES FAT/SAT & SEGURANÇA
       ------------------------------------------------------------- */
    {
      pageNumber: 32,
      chapterNumber: 32,
      category: 'Garantia da Qualidade & Comissionamento',
      title: 'Plano de Comissionamento, Ensaios de Aceitação FAT/SAT & NR-10/NR-12',
      subtitle: 'Protocolos rigorosos de testes de fábrica e campo para entrada em operação segura',
      summary: `Para assegurar desempenho perfeito desde o primeiro dia de energização, o projeto segue um rigoroso plano de comissionamento estruturado em duas etapas principais: Testes de Aceitação em Fábrica (FAT - Factory Acceptance Tests) e Testes de Aceitação em Campo (SAT - Site Acceptance Tests). Toda a execução segue estritamente as normas regulamentadoras de segurança do trabalho NR-10 e NR-12.`,
      keyMetrics: [
        { label: 'Ensaios em Fábrica', value: 'FAT 100% Concluído', hint: 'Testes com carga real' },
        { label: 'Ensaios em Campo', value: 'SAT Protocolado', hint: 'Verificação in-situ' },
        { label: 'Normas de Segurança', value: 'NR-10, NR-12, NR-35', hint: 'Ministério do Trabalho' },
        { label: 'Testes de Rampa', value: '0% a 100% Carga', hint: 'Validação de resposta' },
      ],
      bulletPoints: [
        'Testes de Aceitação em Fábrica (FAT): testes de isolamento dielétrico (Hi-Pot), medição de resistência de contato, calibração do BMS e teste de queima térmica com carga antes do despacho marítimo/rodoviário.',
        'Inspeção no Recebimento em Campo: conferência de integridade física dos contêineres, verificação de sensores de impacto e inspeção termográfica preliminar.',
        'Testes de Aceitação em Campo (SAT): ensaios de isolamento de cabos de MT/BT, teste de injeção secundária de relés de proteção, ensaios de estanqueidade do sistema hidráulico de Liquid Cooling e testes de descarga do sistema de incêndio por gás.',
        'Testes de Desempenho e Capacidade: validação da energia útil entregue (MWh) e rendimento global de ciclo (RTE) sob condições operacionais reais.',
      ],
      technicalDetails: [
        {
          title: 'Ensaio de Ilhamento e Transição UPS',
          content: 'Simulação controlada de desligamento abrupto do disjuntor de entrada da concessionária para verificar em oscilografia digital a comutação do BESS em menos de 20ms sem reset de cargas críticas.',
        },
        {
          title: 'Treinamento e Capacitação da Equipe Local',
          content: 'Realização de programa intensivo de treinamento operacional para os engenheiros e eletricistas da unidade consumidora, cobrindo manobras rotineiras, procedimentos de emergência e EPIs adequados.',
        },
      ],
      regulatoryOrNormative: 'ABNT NBR 5410, NR-10, NR-12 & IEEE Std 1547.1.',
      recommendationNote: 'O comissionamento estruturado assegura transição segura para a fase de operação comercial sem surpresas.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 33 (PÁG 35): OPERAÇÃO E MANUTENÇÃO (O&M)
       ------------------------------------------------------------- */
    {
      pageNumber: 33,
      chapterNumber: 33,
      category: 'Operação, Manutenção & Confiabilidade',
      title: 'Plano de Operação e Manutenção (O&M) Preventiva e Preditiva 24/7',
      subtitle: 'Monitoramento remoto contínuo, rotinas de inspeção e gestão de peças sobressalentes',
      summary: `A alta disponibilidade operacional do BESS ao longo de seus 15 a 20 anos de vida útil depende de um plano estruturado de Operação e Manutenção (O&M). A Allmera desenhou uma rotina preventiva e preditiva baseada em telemetria em tempo real 24/7, inspeções termográficas periódicas, análise cromatográfica de fluidos refrigerantes e gestão estratégica de peças de reposição (spare parts) em território brasileiro.`,
      keyMetrics: [
        { label: 'Disponibilidade Meta', value: '>= 98.5%', hint: 'Meta de SLA operacional' },
        { label: 'Centro de Operação', value: 'NOC Allmera 24/7', hint: 'Monitoramento remoto' },
        { label: 'Inspeção Termográfica', value: 'Trimestral', hint: 'Câmera infravermelha' },
        { label: 'Estoque Spare Parts', value: 'Em solo brasileiro', hint: 'Packs, fusíveis, placas' },
      ],
      bulletPoints: [
        'Centro de Operação de Rede (NOC) 24/7/365: monitoramento contínuo de mais de 2.000 variáveis operacionais por contêiner com alertas automáticos em caso de anomalias térmicas ou elétricas.',
        'Manutenção Preventiva Semestral: reaperto de conexões elétricas de potência com torquímetro calibrado, limpeza de trocadores de calor de chillers e testes de acionamento do sistema de combate a incêndio.',
        'Manutenção Preditiva Avançada: termografia infravermelha em todas as conexões elétricas e análise de vibração de bombas do sistema de refrigeração líquida.',
        'Estoque estratégico de peças sobressalentes (Spare Parts Kit): mantido em território nacional para viabilizar substituição em menos de 24h a 48h.',
      ],
      technicalDetails: [
        {
          title: 'Protocolo de Análise de Degradação SoH',
          content: 'Auditoria trimestral da curva de capacidade das células LFP comparando com o modelo preditivo de degradação contratual da garantia de fábrica para assegurar cumprimento das metas de ciclos.',
        },
        {
          title: 'Reciclagem e Logística Reversa de Células de Lítio',
          content: 'Plano de descarte responsável ao final da vida útil (segunda vida para aplicações estacionárias leves ou reciclagem com recuperação de lítio, ferro e fosfato) em conformidade com a Política Nacional de Resíduos Sólidos (PNRS - Lei 12.305/2010).',
        },
      ],
      regulatoryOrNormative: 'Lei 12.305/2010 (PNRS), ABNT NBR 5462 (Confiabilidade) & Padrões Internacionais de O&M.',
      recommendationNote: 'A disciplina de O&M preserva o valor patrimonial do ativo e garante a receita esperada durante todo o ciclo de vida.',
    },

    /* -------------------------------------------------------------
       CAPÍTULO 34 (PÁG 36): TERMO DE RESPONSABILIDADE & ENCERRAMENTO
       ------------------------------------------------------------- */
    {
      pageNumber: 34,
      chapterNumber: 34,
      category: 'Encerramento & Responsabilidade Técnica',
      title: 'Conclusão Executiva, Termo de Encerramento & Assinatura Técnica',
      subtitle: 'Parecer final da engenharia, registro de responsabilidade técnica e chancelas corporativas',
      summary: `O presente Dossiê Executivo de Engenharia consolida o dimensionamento técnico, a aderência ao Cardápio oficial de aplicações BESS no Brasil, o benchmark de soluções comerciais e a modelagem econômico-financeira para a implantação de um sistema de ${sizing.nominalPowerMw} MW / ${sizing.nominalEnergyMwh} MWh para ${client.clientName}. O projeto demonstrou viabilidade técnica irrestrita, conformidade regulatória plena e retorno de investimento com Payback de ${sizing.simplePaybackYears} anos e TIR de ${sizing.irrPercent}%.`,
      keyMetrics: [
        { label: 'Status da Avaliação', value: 'APROVADO TECNICAMENTE', hint: 'Comitê de Engenharia' },
        { label: 'Código do Projeto', value: `ALLM-BESS-${client.state || 'BR'}-REV4`, hint: 'Rastreabilidade' },
        { label: 'Validade do Estudo', value: '60 dias a contar da emissão', hint: 'Condições de Capex' },
        { label: 'Classificação Sigilo', value: 'DOCUMENTO CONFIDENCIAL', hint: 'Allmera Partners' },
      ],
      bulletPoints: [
        'A Allmera Partners atesta que o dimensionamento foi executado sob as melhores práticas da engenharia elétrica e regulatória brasileira, em estrita obediência às resoluções da Aneel, ONS e Corpo de Bombeiros Militar.',
        `A tecnologia selecionada (${vendor.vendorName} - ${vendor.productLine}) oferece o melhor equilíbrio de bancabilidade, segurança por Liquid Cooling e suporte local comprovado no Brasil.`,
        `O investimento turnkey de R$ ${(sizing.totalCapexBrl / 1_000_000).toFixed(2)} milhões é respaldado por economia operacional real de R$ ${(sizing.totalAnnualBenefitBrl / 1_000).toLocaleString('pt-BR')}k/ano, protegendo a empresa contra custos de energia em horários de ponta e apagões.`,
        'Recomenda-se o avanço imediato para a etapa de Solicitação de Acesso junto à concessionária de energia e negociação executiva com o fabricante.',
      ],
      technicalDetails: [
        {
          title: 'Termo de Encerramento e Confidencialidade',
          content: 'As informações contidas neste dossiê foram elaboradas especificamente para ' + client.clientName + ' e constituem propriedade intelectual protegida da Allmera Partners Advisory & Energy Engineering.',
        },
        {
          title: 'Registro de Responsabilidade Técnica (ART)',
          content: 'Estudo vinculado à Anotação de Responsabilidade Técnica (ART) registrada perante o Conselho Regional de Engenharia e Agronomia (CREA-SP / CREA-BR), conferindo validade legal ao dimensionamento.',
        },
      ],
      regulatoryOrNormative: 'Conselho Federal de Engenharia e Agronomia (CONFEA) & CREA-SP.',
      recommendationNote: 'Documento homologado pela diretoria técnica e financeira da Allmera Partners.',
    },
  ];
}
