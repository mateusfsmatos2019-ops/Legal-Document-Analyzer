const I18N = {
  en: {
    docTypes: {
      contract: "Contract",
      agreement: "Agreement",
      nda: "Non-disclosure agreement",
      employment: "Employment agreement",
      policy: "Policy",
      lease: "Lease agreement",
      legal: "Legal document"
    },
    clauseTypes: {
      payment: "Payment",
      termination: "Termination",
      confidentiality: "Confidentiality",
      liability: "Liability",
      renewal: "Renewal",
      governingLaw: "Governing law",
      obligations: "Obligations"
    },
    importance: { high: "High", medium: "Medium", low: "Low" },
    dateLabels: {
      effective: "Effective date",
      payment: "Payment date",
      renewal: "Renewal date",
      termination: "Termination date",
      deadline: "Deadline",
      document: "Document date"
    },
    riskTitles: {
      unlimitedLiability: "Unlimited liability exposure",
      unilateralTermination: "Unilateral termination rights",
      vaguePayment: "Unclear payment obligations",
      automaticRenewal: "Automatic renewal clause",
      broadConfidentiality: "Broad confidentiality restriction",
      lowRisk: "No critical legal risks detected"
    },
    riskDescriptions: {
      unlimitedLiability: "The document appears to impose broad liability without clear limitations or caps.",
      unilateralTermination: "One party may be able to terminate the agreement with limited notice or no reciprocal protection.",
      vaguePayment: "Payment triggers, due dates, or penalties appear incomplete and may lead to disputes.",
      automaticRenewal: "The agreement includes renewal language that could extend obligations automatically.",
      broadConfidentiality: "Confidentiality commitments appear broad or indefinite and may need negotiation.",
      lowRisk: "No high-signal risk patterns were found using the offline analysis rules."
    },
    recommendations: {
      unlimitedLiability: "Confirm whether liability caps, exclusions, or indemnity limits should be added.",
      unilateralTermination: "Review the termination notice period and consider adding balanced exit rights.",
      vaguePayment: "Clarify invoice timing, payment deadlines, late fees, and acceptance conditions.",
      automaticRenewal: "Verify renewal notice deadlines and opt-out procedures.",
      broadConfidentiality: "Check duration, scope, and exceptions for legally required disclosures.",
      lowRisk: "Perform a final legal review, but no urgent offline red flags were detected."
    },
    overview: ({ documentType, partyCount, clauseCount, riskCount }) =>
      `This ${documentType.toLowerCase()} references ${partyCount} key parties, ${clauseCount} major clauses, and ${riskCount} identified risk patterns.`
  },
  pt: {
    docTypes: {
      contract: "Contrato",
      agreement: "Acordo",
      nda: "Acordo de confidencialidade",
      employment: "Contrato de trabalho",
      policy: "Política",
      lease: "Contrato de locação",
      legal: "Documento jurídico"
    },
    clauseTypes: {
      payment: "Pagamento",
      termination: "Rescisão",
      confidentiality: "Confidencialidade",
      liability: "Responsabilidade",
      renewal: "Renovação",
      governingLaw: "Lei aplicável",
      obligations: "Obrigações"
    },
    importance: { high: "Alta", medium: "Média", low: "Baixa" },
    dateLabels: {
      effective: "Data de vigência",
      payment: "Data de pagamento",
      renewal: "Data de renovação",
      termination: "Data de rescisão",
      deadline: "Prazo",
      document: "Data do documento"
    },
    riskTitles: {
      unlimitedLiability: "Exposição a responsabilidade ilimitada",
      unilateralTermination: "Rescisão unilateral",
      vaguePayment: "Obrigações de pagamento pouco claras",
      automaticRenewal: "Cláusula de renovação automática",
      broadConfidentiality: "Restrição ampla de confidencialidade",
      lowRisk: "Nenhum risco jurídico crítico detectado"
    },
    riskDescriptions: {
      unlimitedLiability: "O documento parece impor responsabilidade ampla sem limites ou tetos claros.",
      unilateralTermination: "Uma das partes pode rescindir o acordo com pouco aviso ou sem proteção recíproca.",
      vaguePayment: "Gatilhos de pagamento, vencimentos ou penalidades parecem incompletos e podem gerar disputas.",
      automaticRenewal: "O acordo inclui linguagem de renovação que pode estender obrigações automaticamente.",
      broadConfidentiality: "Os compromissos de confidencialidade parecem amplos ou indefinidos e podem exigir negociação.",
      lowRisk: "Nenhum padrão de risco relevante foi encontrado pelas regras offline de análise."
    },
    recommendations: {
      unlimitedLiability: "Confirme se devem ser incluídos limites de responsabilidade, exclusões ou tetos indenizatórios.",
      unilateralTermination: "Revise o prazo de aviso prévio e considere direitos de saída mais equilibrados.",
      vaguePayment: "Esclareça momento de faturamento, prazos, juros e condições de aceite.",
      automaticRenewal: "Verifique prazos de aviso e procedimentos de cancelamento da renovação.",
      broadConfidentiality: "Cheque duração, escopo e exceções para divulgações legalmente obrigatórias.",
      lowRisk: "Ainda é recomendável revisão jurídica final, mas não há alertas offline urgentes."
    },
    overview: ({ documentType, partyCount, clauseCount, riskCount }) =>
      `Este ${documentType.toLowerCase()} menciona ${partyCount} partes principais, ${clauseCount} cláusulas relevantes e ${riskCount} padrões de risco identificados.`
  }
};

const TRANSLATION_MAP = {
  en: [
    ["acordo", "agreement"],
    ["contrato", "contract"],
    ["pagamento", "payment"],
    ["rescisão", "termination"],
    ["confidencialidade", "confidentiality"],
    ["responsabilidade", "liability"],
    ["renovação", "renewal"],
    ["data de vigência", "effective date"],
    ["lei aplicável", "governing law"],
    ["parte", "party"],
    ["serviços", "services"],
    ["aviso", "notice"],
    ["prazo", "deadline"],
    ["fatura", "invoice"],
    ["taxas", "fees"],
    ["deverá", "shall"],
    ["deve", "must"]
  ],
  pt: [
    ["agreement", "acordo"],
    ["contract", "contrato"],
    ["payment", "pagamento"],
    ["termination", "rescisão"],
    ["confidentiality", "confidencialidade"],
    ["liability", "responsabilidade"],
    ["renewal", "renovação"],
    ["effective date", "data de vigência"],
    ["governing law", "lei aplicável"],
    ["party", "parte"],
    ["services", "serviços"],
    ["notice", "aviso"],
    ["deadline", "prazo"],
    ["invoice", "fatura"],
    ["fees", "taxas"],
    ["shall", "deverá"],
    ["must", "deve"]
  ]
};

const CLAUSE_PATTERNS = [
  { key: "payment", importance: "high", patterns: [/payment|fees?|invoice|compensation|pagamento|fatura|remuneraç/i] },
  { key: "termination", importance: "high", patterns: [/termination|terminate|notice period|rescis[aã]o|encerramento|aviso prévio/i] },
  { key: "confidentiality", importance: "high", patterns: [/confidential|non-disclosure|nda|confidencial/i] },
  { key: "liability", importance: "high", patterns: [/liability|damages|indemnif|limitation of liability|responsabil|indeniza/i] },
  { key: "renewal", importance: "medium", patterns: [/renewal|auto-renew|extension|renova/i] },
  { key: "governingLaw", importance: "medium", patterns: [/governing law|jurisdiction|applicable law|foro|lei aplic[aá]vel/i] },
  { key: "obligations", importance: "medium", patterns: [/obligations|duties|responsibilities|obrigaç|deveres/i] }
];

const DATE_PATTERN = /(\b\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}\b|\b\d{4}[\/\-.]\d{1,2}[\/\-.]\d{1,2}\b|\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+\d{1,2},?\s+\d{4}\b)/gi;

function normalizeWhitespace(text) {
  return text.replace(/\s+/g, " ").trim();
}

function uniqueBy(items, keyGetter) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyGetter(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function formatFileSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function detectDocumentType(text) {
  const value = text.toLowerCase();
  if (/non-disclosure|nda|confidentiality agreement|acordo de confidencialidade/.test(value)) return "nda";
  if (/employment|employee|employer|contrato de trabalho/.test(value)) return "employment";
  if (/lease|tenant|landlord|loca[cç][aã]o/.test(value)) return "lease";
  if (/policy|compliance policy|privacy policy|pol[ií]tica/.test(value)) return "policy";
  if (/agreement|acordo/.test(value)) return "agreement";
  if (/contract|contrato/.test(value)) return "contract";
  return "legal";
}

export function detectLanguage(text) {
  const sample = ` ${text.toLowerCase()} `;
  const portugueseSignals = [" vigência ", " confidencialidade ", " cláusula ", " pagamento ", " acordo ", " rescisão "];
  return portugueseSignals.filter((signal) => sample.includes(signal)).length >= 2 ? "pt" : "en";
}

export function extractParties(text) {
  const flattenedText = text.replace(/\n+/g, " ");
  const matches = [];
  const betweenMatch = flattenedText.match(/(?:between|entre)\s+(.{3,80}?)\s+(?:and|e)\s+(.{3,80}?)(?:[.,;\n]|effective|dated|for the purpose)/i);
  if (betweenMatch) {
    matches.push(betweenMatch[1].trim(), betweenMatch[2].trim());
  }

  const entityRegex = /\b([A-Z][A-Za-z&.,\- ]{2,40}\s(?:LLC|LTD|INC|CORP|S\.A\.|LTDA|LIMITED|COMPANY))\b/g;
  for (const match of flattenedText.matchAll(entityRegex)) {
    matches.push(match[1].trim());
  }

  return uniqueBy(
    matches
      .map((item) => normalizeWhitespace(item.replace(/^[,:\-\s]+|[,:\-\s]+$/g, "")))
      .filter((item) => item.length > 2),
    (item) => item.toLowerCase()
  ).slice(0, 6);
}

function getContextualLabel(context) {
  const value = context.toLowerCase();
  if (/effective|vig[êe]ncia|start/.test(value)) return "effective";
  if (/payment|invoice|fee|pagamento|fatura/.test(value)) return "payment";
  if (/renew|extension|renova/.test(value)) return "renewal";
  if (/termination|expire|rescis[aã]o|encerramento/.test(value)) return "termination";
  if (/deadline|within|prazo|até\s/.test(value)) return "deadline";
  return "document";
}

export function parseDateString(value) {
  const trimmed = value.trim();
  if (/^\d{4}[\/\-.]\d{1,2}[\/\-.]\d{1,2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split(/[\/\-.]/).map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  if (/^\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}$/.test(trimmed)) {
    let [day, month, year] = trimmed.split(/[\/\-.]/).map(Number);
    if (year < 100) year += 2000;
    return new Date(Date.UTC(year, month - 1, day));
  }

  const translated = trimmed
    .replace(/janeiro/i, "January")
    .replace(/fevereiro/i, "February")
    .replace(/março/i, "March")
    .replace(/abril/i, "April")
    .replace(/maio/i, "May")
    .replace(/junho/i, "June")
    .replace(/julho/i, "July")
    .replace(/agosto/i, "August")
    .replace(/setembro/i, "September")
    .replace(/outubro/i, "October")
    .replace(/novembro/i, "November")
    .replace(/dezembro/i, "December");

  const date = new Date(translated);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function extractDates(text) {
  const items = [];

  for (const match of text.matchAll(DATE_PATTERN)) {
    const rawDate = match[0];
    const parsedDate = parseDateString(rawDate);
    if (!parsedDate) continue;
    const start = Math.max(0, match.index - 64);
    const end = Math.min(text.length, match.index + rawDate.length + 64);
    const context = text.slice(start, end);
    items.push({
      rawDate,
      isoDate: parsedDate.toISOString().slice(0, 10),
      labelKey: getContextualLabel(context),
      context: normalizeWhitespace(context)
    });
  }

  return uniqueBy(items, (item) => `${item.isoDate}:${item.labelKey}`)
    .sort((a, b) => a.isoDate.localeCompare(b.isoDate))
    .slice(0, 12);
}

function extractClauseSnippet(text, matcher) {
  const match = text.match(matcher);
  if (!match) return null;
  const source = match[0];
  const expanded = text.slice(Math.max(0, match.index - 20), Math.min(text.length, match.index + source.length + 220));
  return normalizeWhitespace(expanded).slice(0, 420);
}

export function extractClauses(text) {
  return uniqueBy(
    CLAUSE_PATTERNS.map((definition) => {
      const snippet = definition.patterns.map((pattern) => extractClauseSnippet(text, pattern)).find(Boolean);
      return snippet ? { key: definition.key, importance: definition.importance, content: snippet } : null;
    }).filter(Boolean),
    (item) => item.key
  );
}

export function detectRisks(text, clauses, language = "en") {
  const risks = [];
  const content = text.toLowerCase();
  const localized = I18N[language];

  const addRisk = (key, level, relatedClause) => {
    risks.push({
      key,
      level,
      relatedClause,
      title: localized.riskTitles[key],
      description: localized.riskDescriptions[key],
      recommendation: localized.recommendations[key]
    });
  };

  if (/unlimited liability|without limitation|liable for all damages|responsabilidade ilimitada/i.test(content)) {
    addRisk("unlimitedLiability", "high", "liability");
  }
  if (/terminate at any time|sole discretion|immediately terminate|rescindir a qualquer momento|rescis[aã]o imediata/i.test(content)) {
    addRisk("unilateralTermination", "high", "termination");
  }
  if (/payment shall be agreed|fees? to be determined|pagamento a combinar|valor será definido/i.test(content)) {
    addRisk("vaguePayment", "medium", "payment");
  }
  if (/automatic renewal|automatically renew|renova[cç][aã]o autom[aá]tica/i.test(content)) {
    addRisk("automaticRenewal", "medium", "renewal");
  }
  if (/perpetual confidentiality|indefinite confidentiality|confidencialidade por prazo indeterminado/i.test(content)) {
    addRisk("broadConfidentiality", "medium", "confidentiality");
  }

  if (!risks.length) {
    addRisk("lowRisk", "low", clauses[0]?.key ?? "obligations");
  }

  return uniqueBy(risks, (item) => item.key);
}

function pickFirstDate(dates, labelKey) {
  return dates.find((item) => item.labelKey === labelKey)?.isoDate ?? null;
}

function extractTopics(clauses, language) {
  return clauses.map((clause) => I18N[language].clauseTypes[clause.key]);
}

function formatDisplayDate(dateString, language) {
  if (!dateString) return language === "pt" ? "Não identificado" : "Not identified";
  return new Intl.DateTimeFormat(language === "pt" ? "pt-BR" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${dateString}T00:00:00Z`));
}

export function translateText(text, targetLanguage) {
  const rules = TRANSLATION_MAP[targetLanguage] ?? [];
  let output = text;
  for (const [from, to] of rules) {
    output = output.replace(new RegExp(`\\b${escapeRegExp(from)}\\b`, "gi"), to);
  }
  return output;
}

function buildSummaryBase(base, language) {
  const locale = I18N[language];
  const documentType = locale.docTypes[base.documentTypeKey] ?? locale.docTypes.legal;
  const parties = base.parties.length
    ? base.parties.map((party) => translateText(party, language)).join(", ")
    : language === "pt"
      ? "Não identificadas"
      : "Not identified";
  const keyTopics = extractTopics(base.clauses, language).join(", ") || (language === "pt" ? "Sem tópicos identificados" : "No topics identified");
  return {
    overview: locale.overview({
      documentType,
      partyCount: Math.max(base.parties.length, 1),
      clauseCount: base.clauses.length,
      riskCount: base.risks.length
    }),
    documentType,
    parties,
    documentDate: formatDisplayDate(base.documentDate, language),
    effectiveDate: formatDisplayDate(base.effectiveDate, language),
    keyTopics,
    sourceLanguage: base.sourceLanguage.toUpperCase()
  };
}

export function localizeAnalysis(analysis, language = "en") {
  const locale = I18N[language];
  const base = {
    documentTypeKey: analysis.summary.documentTypeKey,
    parties: analysis.summary.parties,
    documentDate: analysis.summary.documentDate,
    effectiveDate: analysis.summary.effectiveDate,
    sourceLanguage: analysis.summary.sourceLanguage,
    clauses: analysis.clauses,
    risks: analysis.risks
  };

  return {
    ...analysis,
    summary: buildSummaryBase(base, language),
    clauses: analysis.clauses.map((clause) => ({
      ...clause,
      title: locale.clauseTypes[clause.key],
      importanceLabel: locale.importance[clause.importance],
      contentTranslated: translateText(clause.content, language)
    })),
    risks: analysis.risks.map((risk) => ({
      ...risk,
      title: locale.riskTitles[risk.key] ?? risk.title,
      description: locale.riskDescriptions[risk.key] ?? risk.description,
      recommendation: locale.recommendations[risk.key] ?? risk.recommendation,
      relatedClauseLabel: locale.clauseTypes[risk.relatedClause] ?? risk.relatedClause
    })),
    timeline: analysis.timeline.map((item) => ({
      ...item,
      label: locale.dateLabels[item.labelKey] ?? item.label,
      displayDate: formatDisplayDate(item.isoDate, language),
      contextTranslated: translateText(item.context, language)
    }))
  };
}

export function analyzeDocumentText(text, fileMetadata = {}) {
  const normalizedText = normalizeWhitespace(text || "");
  const sourceLanguage = detectLanguage(normalizedText);
  const clauses = extractClauses(normalizedText);
  const risks = detectRisks(normalizedText, clauses, sourceLanguage);
  const dates = extractDates(normalizedText);
  const documentTypeKey = detectDocumentType(normalizedText);
  const parties = extractParties(normalizedText);
  const base = {
    id: fileMetadata.id ?? `${Date.now()}`,
    metadata: {
      name: fileMetadata.name ?? "Untitled document",
      type: fileMetadata.type ?? "text/plain",
      size: fileMetadata.size ?? normalizedText.length,
      uploadedAt: fileMetadata.uploadedAt ?? new Date().toISOString()
    },
    originalText: normalizedText,
    summary: {
      documentTypeKey,
      parties,
      documentDate: pickFirstDate(dates, "document") ?? dates[0]?.isoDate ?? null,
      effectiveDate: pickFirstDate(dates, "effective") ?? dates[0]?.isoDate ?? null,
      sourceLanguage
    },
    clauses,
    risks,
    timeline: dates.map((item) => ({
      ...item,
      label: I18N[sourceLanguage].dateLabels[item.labelKey],
      displayDate: formatDisplayDate(item.isoDate, sourceLanguage)
    }))
  };

  const localized = localizeAnalysis(base, sourceLanguage);
  return {
    ...base,
    summary: {
      ...base.summary,
      overview: localized.summary.overview,
      documentType: localized.summary.documentType,
      partiesLabel: localized.summary.parties,
      documentDateLabel: localized.summary.documentDate,
      effectiveDateLabel: localized.summary.effectiveDate,
      keyTopics: localized.summary.keyTopics
    }
  };
}

export function mergeAiAnalysis(fallbackAnalysis, aiAnalysis = {}) {
  return {
    ...fallbackAnalysis,
    summary: {
      ...fallbackAnalysis.summary,
      ...(aiAnalysis.summary ?? {})
    },
    clauses: Array.isArray(aiAnalysis.clauses) && aiAnalysis.clauses.length ? aiAnalysis.clauses : fallbackAnalysis.clauses,
    risks: Array.isArray(aiAnalysis.risks) && aiAnalysis.risks.length ? aiAnalysis.risks : fallbackAnalysis.risks,
    timeline: Array.isArray(aiAnalysis.timeline) && aiAnalysis.timeline.length ? aiAnalysis.timeline : fallbackAnalysis.timeline
  };
}

export { I18N };
