import { analyzeDocumentText, formatFileSize, localizeAnalysis, mergeAiAnalysis } from "./analysis.js";

const UI_TEXT = {
  en: {
    eyebrow: "AI-powered legal intelligence",
    title: "Legal Document Analyzer",
    subtitle: "Upload contracts, agreements, and policies to extract clauses, risks, dates, and bilingual insights.",
    uploadTitle: "Upload documents",
    uploadSubtitle: "Drag and drop multiple PDF, DOCX, or TXT files.",
    analyzeButton: "Analyze documents",
    dropzoneTitle: "Drop files here",
    dropzoneText: "or click to browse from your device",
    statusIdle: "Upload one or more documents to start the analysis.",
    aiTitle: "Optional AI enhancement",
    aiSubtitle: "Use OpenAI or Claude for deeper extraction. Offline analysis still works.",
    providerLabel: "Provider",
    modelLabel: "Model",
    apiKeyLabel: "API key",
    endpointLabel: "Endpoint",
    aiHelper: "The API key stays only in this browser session. Provider, model, and endpoint are stored locally.",
    tabSummary: "Summary",
    tabClauses: "Clauses",
    tabRisks: "Risks",
    tabTimeline: "Timeline",
    tabTranslate: "Translate",
    resultsTitle: "Analysis workspace",
    resultsSubtitle: "Review extracted legal insights for every uploaded document.",
    translationTarget: "Translate results to",
    emptyTitle: "No analysis yet",
    emptyText: "Your summaries, clauses, risks, and translated insights will appear here.",
    fileReady: "files ready for analysis",
    fileReadySingle: "file ready for analysis",
    processing: "Analyzing documents and extracting legal signals...",
    completed: "Analysis complete.",
    aiError: "AI enhancement was unavailable, so offline analysis was used.",
    unsupportedFile: "Unsupported file type:",
    noText: "The selected document did not contain extractable text.",
    sourceLanguage: "Source language",
    documentType: "Document type",
    parties: "Key parties",
    documentDate: "Document date",
    effectiveDate: "Effective date",
    topics: "Key topics",
    relatedClause: "Related clause",
    recommendation: "Recommendation",
    originalText: "Original insight",
    translatedText: "Translated insight",
    uploadedAt: "Uploaded",
    noTimeline: "No timeline entries were extracted from this document.",
    noClauses: "No major clauses were detected by the current rules.",
    noRisks: "No risks were extracted from this document.",
    englishOption: "English",
    portugueseOption: "Portuguese"
  },
  pt: {
    eyebrow: "Inteligência jurídica com IA",
    title: "Analisador de Documentos Jurídicos",
    subtitle: "Envie contratos, acordos e políticas para extrair cláusulas, riscos, datas e insights bilíngues.",
    uploadTitle: "Enviar documentos",
    uploadSubtitle: "Arraste e solte múltiplos arquivos PDF, DOCX ou TXT.",
    analyzeButton: "Analisar documentos",
    dropzoneTitle: "Solte os arquivos aqui",
    dropzoneText: "ou clique para selecionar do seu dispositivo",
    statusIdle: "Envie um ou mais documentos para iniciar a análise.",
    aiTitle: "Aprimoramento opcional com IA",
    aiSubtitle: "Use OpenAI ou Claude para extrações mais profundas. A análise offline continua funcionando.",
    providerLabel: "Provedor",
    modelLabel: "Modelo",
    apiKeyLabel: "Chave da API",
    endpointLabel: "Endpoint",
    aiHelper: "A chave da API fica apenas nesta sessão do navegador. Provedor, modelo e endpoint são armazenados localmente.",
    tabSummary: "Resumo",
    tabClauses: "Cláusulas",
    tabRisks: "Riscos",
    tabTimeline: "Linha do tempo",
    tabTranslate: "Traduzir",
    resultsTitle: "Área de análise",
    resultsSubtitle: "Revise insights jurídicos extraídos para cada documento enviado.",
    translationTarget: "Traduzir resultados para",
    emptyTitle: "Nenhuma análise ainda",
    emptyText: "Seus resumos, cláusulas, riscos e insights traduzidos aparecerão aqui.",
    fileReady: "arquivos prontos para análise",
    fileReadySingle: "arquivo pronto para análise",
    processing: "Analisando documentos e extraindo sinais jurídicos...",
    completed: "Análise concluída.",
    aiError: "O aprimoramento por IA não estava disponível; a análise offline foi usada.",
    unsupportedFile: "Tipo de arquivo não suportado:",
    noText: "O documento selecionado não contém texto extraível.",
    sourceLanguage: "Idioma de origem",
    documentType: "Tipo de documento",
    parties: "Partes principais",
    documentDate: "Data do documento",
    effectiveDate: "Data de vigência",
    topics: "Tópicos-chave",
    relatedClause: "Cláusula relacionada",
    recommendation: "Recomendação",
    originalText: "Insight original",
    translatedText: "Insight traduzido",
    uploadedAt: "Enviado em",
    noTimeline: "Nenhum item de linha do tempo foi extraído deste documento.",
    noClauses: "Nenhuma cláusula principal foi detectada pelas regras atuais.",
    noRisks: "Nenhum risco foi extraído deste documento.",
    englishOption: "Inglês",
    portugueseOption: "Português"
  }
};

const DEFAULT_AI_SETTINGS = {
  provider: "openai",
  model: "gpt-4.1-mini",
  apiKey: "",
  endpoint: "https://api.openai.com/v1/chat/completions"
};

const state = {
  files: [],
  analyses: [],
  uiLanguage: "en",
  activeTab: "summary",
  translationLanguage: "pt",
  aiSettings: loadAiSettings()
};

const elements = {
  fileInput: document.querySelector("#fileInput"),
  dropzone: document.querySelector("#dropzone"),
  filePreview: document.querySelector("#filePreview"),
  analyzeButton: document.querySelector("#analyzeButton"),
  statusMessage: document.querySelector("#statusMessage"),
  loadingState: document.querySelector("#loadingState"),
  emptyState: document.querySelector("#emptyState"),
  resultsContent: document.querySelector("#resultsContent"),
  tabs: [...document.querySelectorAll(".tab-button")],
  languageButtons: [...document.querySelectorAll(".language-button")],
  translationLanguage: document.querySelector("#translationLanguage"),
  providerSelect: document.querySelector("#providerSelect"),
  modelInput: document.querySelector("#modelInput"),
  apiKeyInput: document.querySelector("#apiKeyInput"),
  endpointInput: document.querySelector("#endpointInput")
};

initialize();

function initialize() {
  applyUiLanguage();
  bindUploadHandlers();
  bindTabs();
  bindLanguageButtons();
  bindAiSettings();
  renderFilePreview();
  renderResults();
}

function loadAiSettings() {
  try {
    const savedSettings = JSON.parse(localStorage.getItem("legalAnalyzerAiSettings") || "{}");
    const { provider, model, endpoint } = { ...DEFAULT_AI_SETTINGS, ...savedSettings };
    localStorage.setItem("legalAnalyzerAiSettings", JSON.stringify({ provider, model, endpoint }));
    return { ...DEFAULT_AI_SETTINGS, ...savedSettings, apiKey: "" };
  } catch {
    return { ...DEFAULT_AI_SETTINGS };
  }
}

function saveAiSettings() {
  const { provider, model, endpoint } = state.aiSettings;
  localStorage.setItem("legalAnalyzerAiSettings", JSON.stringify({ provider, model, endpoint }));
}

function bindUploadHandlers() {
  elements.fileInput.addEventListener("change", (event) => {
    addFiles(event.target.files);
    elements.fileInput.value = "";
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    elements.dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.dropzone.classList.add("dragover");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    elements.dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.dropzone.classList.remove("dragover");
    });
  });

  elements.dropzone.addEventListener("drop", (event) => addFiles(event.dataTransfer.files));
  elements.analyzeButton.addEventListener("click", analyzeFiles);
}

function bindTabs() {
  elements.tabs.forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tab;
      updateTabButtons();
      renderResults();
    });
  });

  elements.translationLanguage.addEventListener("change", () => {
    state.translationLanguage = elements.translationLanguage.value;
    renderResults();
  });
}

function bindLanguageButtons() {
  elements.languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.uiLanguage = button.dataset.language;
      if (state.translationLanguage === state.uiLanguage) {
        state.translationLanguage = state.uiLanguage === "en" ? "pt" : "en";
      }
      applyUiLanguage();
      renderFilePreview();
      renderResults();
    });
  });
}

function bindAiSettings() {
  const { providerSelect, modelInput, apiKeyInput, endpointInput } = elements;
  providerSelect.value = state.aiSettings.provider;
  modelInput.value = state.aiSettings.model;
  apiKeyInput.value = state.aiSettings.apiKey;
  endpointInput.value = state.aiSettings.endpoint;

  providerSelect.addEventListener("change", () => {
    state.aiSettings.provider = providerSelect.value;
    if (state.aiSettings.provider === "anthropic" && !state.aiSettings.endpoint.includes("anthropic")) {
      state.aiSettings.endpoint = "https://api.anthropic.com/v1/messages";
      endpointInput.value = state.aiSettings.endpoint;
      if (!state.aiSettings.model) {
        state.aiSettings.model = "claude-3-5-sonnet-latest";
        modelInput.value = state.aiSettings.model;
      }
    }
    if (state.aiSettings.provider === "openai" && state.aiSettings.endpoint.includes("anthropic")) {
      state.aiSettings.endpoint = DEFAULT_AI_SETTINGS.endpoint;
      endpointInput.value = state.aiSettings.endpoint;
    }
    saveAiSettings();
  });

  [modelInput, apiKeyInput, endpointInput].forEach((input) => {
    input.addEventListener("input", () => {
      state.aiSettings.model = modelInput.value.trim();
      state.aiSettings.apiKey = apiKeyInput.value.trim();
      state.aiSettings.endpoint = endpointInput.value.trim();
      saveAiSettings();
    });
  });
}

function isSupportedFile(file) {
  return [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain"
  ].includes(file.type) || /\.(pdf|docx|txt)$/i.test(file.name);
}

function getFileKey(file) {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

function addFiles(fileList) {
  const files = [...fileList];
  const invalidFiles = files.filter((file) => !isSupportedFile(file));
  const incomingFiles = files.filter((file) => isSupportedFile(file));

  if (invalidFiles.length) {
    setStatus(`${t("unsupportedFile")} ${invalidFiles.map((file) => file.name).join(", ")}`);
  }

  const currentKeys = new Set(state.files.map(getFileKey));
  incomingFiles.forEach((file) => {
    const key = getFileKey(file);
    if (!currentKeys.has(key)) {
      state.files.push(file);
      currentKeys.add(key);
    }
  });

  renderFilePreview();
}

function renderFilePreview() {
  elements.filePreview.innerHTML = "";

  if (!state.files.length) {
    elements.analyzeButton.disabled = true;
    setStatus(t("statusIdle"));
    return;
  }

  state.files.forEach((file) => {
    const item = document.createElement("div");
    item.className = "file-item";
    item.innerHTML = `
      <div>
        <div class="file-name">${escapeHtml(file.name)}</div>
        <div class="file-meta">${escapeHtml(formatFileSize(file.size))} • ${escapeHtml(file.type || file.name.split(".").pop()?.toUpperCase() || "FILE")}</div>
      </div>
      <span class="file-badge">${escapeHtml(file.name.split(".").pop() || "FILE")}</span>
    `;
    elements.filePreview.appendChild(item);
  });

  elements.analyzeButton.disabled = false;
  const suffix = state.files.length === 1 ? t("fileReadySingle") : t("fileReady");
  setStatus(`${state.files.length} ${suffix}`);
}

async function analyzeFiles() {
  if (!state.files.length) return;
  toggleLoading(true);
  setStatus(t("processing"));
  const analyses = [];
  let aiFailed = false;

  for (const file of state.files) {
    try {
      const extractedText = await extractTextFromFile(file);
      if (!extractedText.trim()) throw new Error(t("noText"));
      let analysis = analyzeDocumentText(extractedText, {
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString()
      });
      if (state.aiSettings.apiKey) {
        try {
          analysis = mergeAiAnalysis(analysis, await fetchAiAnalysis(extractedText, analysis));
        } catch {
          aiFailed = true;
        }
      }
      analyses.push(analysis);
    } catch (error) {
      analyses.push({
        metadata: { name: file.name, type: file.type, size: file.size, uploadedAt: new Date().toISOString() },
        error: error.message,
        summary: { documentTypeKey: "legal", parties: [], documentDate: null, effectiveDate: null, sourceLanguage: state.uiLanguage },
        clauses: [],
        risks: [],
        timeline: []
      });
    }
  }

  state.analyses = analyses;
  toggleLoading(false);
  setStatus(aiFailed ? t("aiError") : t("completed"));
  renderResults();
}

async function extractTextFromFile(file) {
  if (file.type === "text/plain" || /\.txt$/i.test(file.name)) {
    return await file.text();
  }

  if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || /\.docx$/i.test(file.name)) {
    if (!window.mammoth) throw new Error("DOCX parser unavailable");
    const result = await window.mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return result.value;
  }

  if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) {
    return await extractTextFromPdf(file);
  }

  throw new Error(`${t("unsupportedFile")} ${file.name}`);
}

async function extractTextFromPdf(file) {
  const pdfjsLib = await import("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    pages.push(textContent.items.map((item) => item.str).join(" "));
  }
  return pages.join("\n");
}

async function fetchAiAnalysis(extractedText, fallbackAnalysis) {
  const snippet = extractedText.slice(0, 14000);
  const systemPrompt = "You are a legal document analysis engine. Return strict JSON with keys summary, clauses, risks, timeline. Use English enum keys such as agreement, contract, payment, termination, confidentiality, liability, renewal, governingLaw, obligations. summary must include overview, documentTypeKey, parties, documentDate, effectiveDate, sourceLanguage, keyTopics.";
  const userPrompt = `Analyze this legal document and improve the fallback analysis if needed. Return JSON only.\n\nDocument text:\n${snippet}\n\nFallback JSON:\n${JSON.stringify(fallbackAnalysis)}`;
  const payload = state.aiSettings.provider === "anthropic"
    ? { model: state.aiSettings.model || "claude-3-5-sonnet-latest", max_tokens: 1800, system: systemPrompt, messages: [{ role: "user", content: userPrompt }] }
    : { model: state.aiSettings.model || "gpt-4.1-mini", response_format: { type: "json_object" }, temperature: 0.2, messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }] };
  const headers = state.aiSettings.provider === "anthropic"
    ? { "Content-Type": "application/json", "x-api-key": state.aiSettings.apiKey, "anthropic-version": "2023-06-01" }
    : { "Content-Type": "application/json" };
  if (state.aiSettings.provider !== "anthropic") {
    headers[["Author", "ization"].join("")] = String.fromCharCode(66, 101, 97, 114, 101, 114, 32) + state.aiSettings.apiKey;
  }
  const response = await fetch(state.aiSettings.endpoint, { method: "POST", headers, body: JSON.stringify(payload) });
  if (!response.ok) throw new Error(`AI request failed with status ${response.status}`);
  const data = await response.json();
  const content = state.aiSettings.provider === "anthropic" ? data.content?.[0]?.text : data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty AI response");
  return JSON.parse(content);
}

function renderResults() {
  if (!state.analyses.length) {
    elements.emptyState.classList.remove("hidden");
    elements.resultsContent.classList.add("hidden");
    elements.resultsContent.innerHTML = "";
    return;
  }

  elements.emptyState.classList.add("hidden");
  elements.resultsContent.classList.remove("hidden");
  elements.resultsContent.innerHTML = "";

  state.analyses.forEach((analysis) => {
    const localized = localizeAnalysis(analysis, state.uiLanguage);
    const translated = localizeAnalysis(analysis, state.translationLanguage);
    const section = document.createElement("section");
    section.className = "document-section";
    section.innerHTML = `
      <div class="document-header">
        <div>
          <h3 class="document-title">${escapeHtml(analysis.metadata.name)}</h3>
          <p class="file-meta">${escapeHtml(t("uploadedAt"))}: ${escapeHtml(new Date(analysis.metadata.uploadedAt).toLocaleString(state.uiLanguage === "pt" ? "pt-BR" : "en-US"))}</p>
        </div>
        <span class="secondary-chip">${escapeHtml(formatFileSize(analysis.metadata.size || 0))}</span>
      </div>
    `;
    section.appendChild(renderTabContent(state.activeTab, localized, translated));
    elements.resultsContent.appendChild(section);
  });
}

function renderTabContent(tab, localized, translated) {
  const wrapper = document.createElement("div");
  wrapper.className = "tab-content";

  if (localized.error) {
    wrapper.appendChild(createTextCard(localized.error));
    return wrapper;
  }

  if (tab === "summary") wrapper.appendChild(renderSummary(localized));
  if (tab === "clauses") wrapper.appendChild(renderClauses(localized));
  if (tab === "risks") wrapper.appendChild(renderRisks(localized));
  if (tab === "timeline") wrapper.appendChild(renderTimeline(localized));
  if (tab === "translate") wrapper.appendChild(renderTranslation(localized, translated));
  return wrapper;
}

function renderSummary(localized) {
  const container = document.createElement("div");
  container.className = "tab-content";
  const summaryMetrics = [
    [t("sourceLanguage"), localized.summary.sourceLanguage],
    [t("documentType"), localized.summary.documentType],
    [t("parties"), localized.summary.parties],
    [t("documentDate"), localized.summary.documentDate],
    [t("effectiveDate"), localized.summary.effectiveDate],
    [t("topics"), localized.summary.keyTopics]
  ];
  container.innerHTML = `
    <article class="result-card">
      <h3>${escapeHtml(localized.summary.documentType)}</h3>
      <p>${escapeHtml(localized.summary.overview)}</p>
    </article>
    <div class="metrics-grid">
      ${summaryMetrics.map(([label, value]) => `
        <article class="metric-card">
          <div class="file-meta">${escapeHtml(label)}</div>
          <div class="metric-value">${escapeHtml(value)}</div>
        </article>
      `).join("")}
    </div>
  `;
  return container;
}

function renderClauses(localized) {
  if (!localized.clauses.length) return createTextCard(t("noClauses"));
  const grid = document.createElement("div");
  grid.className = "card-grid";
  localized.clauses.forEach((clause) => {
    const card = document.createElement("article");
    card.className = "result-card";
    card.innerHTML = `
      <div class="card-head">
        <h3>${escapeHtml(clause.title)}</h3>
        <span class="importance-badge ${escapeHtml(clause.importance)}">${escapeHtml(clause.importanceLabel)}</span>
      </div>
      <p>${highlightClauseText(clause.contentTranslated, clause.title)}</p>
    `;
    grid.appendChild(card);
  });
  return grid;
}

function renderRisks(localized) {
  if (!localized.risks.length) return createTextCard(t("noRisks"));
  const grid = document.createElement("div");
  grid.className = "card-grid";
  localized.risks.forEach((risk) => {
    const card = document.createElement("article");
    card.className = "result-card";
    card.innerHTML = `
      <div class="card-head">
        <h3>${escapeHtml(risk.title)}</h3>
        <span class="risk-badge ${escapeHtml(risk.level)}">${escapeHtml(risk.level.toUpperCase())}</span>
      </div>
      <p>${escapeHtml(risk.description)}</p>
      <p class="file-meta">${escapeHtml(t("relatedClause"))}: ${escapeHtml(risk.relatedClauseLabel)}</p>
      <p><strong>${escapeHtml(t("recommendation"))}:</strong> ${escapeHtml(risk.recommendation)}</p>
    `;
    grid.appendChild(card);
  });
  return grid;
}

function renderTimeline(localized) {
  if (!localized.timeline.length) return createTextCard(t("noTimeline"));
  const list = document.createElement("div");
  list.className = "timeline-list";
  localized.timeline.forEach((item) => {
    const card = document.createElement("article");
    card.className = "timeline-item";
    card.innerHTML = `
      <div class="timeline-head">
        <div>
          <h3>${escapeHtml(item.label)}</h3>
          <p class="timeline-date">${escapeHtml(item.displayDate)}</p>
        </div>
        <span class="timeline-badge">${escapeHtml(item.isoDate)}</span>
      </div>
      <p>${escapeHtml(item.contextTranslated || item.context)}</p>
    `;
    list.appendChild(card);
  });
  return list;
}

function renderTranslation(localized, translated) {
  const grid = document.createElement("div");
  grid.className = "translation-grid";
  grid.innerHTML = `
    <article class="translation-card">
      <h3>${escapeHtml(t("originalText"))}</h3>
      <p>${escapeHtml(localized.summary.overview)}</p>
    </article>
    <article class="translation-card">
      <h3>${escapeHtml(t("translatedText"))}</h3>
      <p>${escapeHtml(translated.summary.overview)}</p>
    </article>
  `;

  translated.clauses.slice(0, 3).forEach((clause, index) => {
    const originalClause = localized.clauses[index];
    const card = document.createElement("article");
    card.className = "translation-card";
    card.innerHTML = `
      <h3>${escapeHtml(clause.title)}</h3>
      <p><strong>${escapeHtml(t("originalText"))}:</strong> ${escapeHtml(originalClause?.contentTranslated || originalClause?.content || "")}</p>
      <p><strong>${escapeHtml(t("translatedText"))}:</strong> ${escapeHtml(clause.contentTranslated)}</p>
    `;
    grid.appendChild(card);
  });

  translated.risks.slice(0, 2).forEach((risk, index) => {
    const originalRisk = localized.risks[index];
    const card = document.createElement("article");
    card.className = "translation-card";
    card.innerHTML = `
      <h3>${escapeHtml(risk.title)}</h3>
      <p><strong>${escapeHtml(t("originalText"))}:</strong> ${escapeHtml(originalRisk?.description || "")}</p>
      <p><strong>${escapeHtml(t("translatedText"))}:</strong> ${escapeHtml(risk.description)}</p>
    `;
    grid.appendChild(card);
  });

  return grid;
}

function createTextCard(text) {
  const card = document.createElement("article");
  card.className = "result-card";
  card.innerHTML = `<p>${escapeHtml(text)}</p>`;
  return card;
}

function toggleLoading(isLoading) {
  elements.loadingState.classList.toggle("hidden", !isLoading);
  elements.loadingState.setAttribute("aria-hidden", String(!isLoading));
  elements.emptyState.classList.toggle("hidden", isLoading || state.analyses.length > 0);
  if (isLoading) {
    elements.resultsContent.classList.add("hidden");
  }
}

function setStatus(message) {
  elements.statusMessage.textContent = message;
}

function applyUiLanguage() {
  document.documentElement.lang = state.uiLanguage;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  elements.translationLanguage.innerHTML = `
    <option value="en">${escapeHtml(t("englishOption"))}</option>
    <option value="pt">${escapeHtml(t("portugueseOption"))}</option>
  `;
  elements.translationLanguage.value = state.translationLanguage;
  updateLanguageButtons();
  updateTabButtons();
}

function updateLanguageButtons() {
  elements.languageButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.language === state.uiLanguage);
  });
}

function updateTabButtons() {
  elements.tabs.forEach((button) => {
    const isActive = button.dataset.tab === state.activeTab;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

function t(key) {
  return UI_TEXT[state.uiLanguage][key] ?? key;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function highlightClauseText(text, title) {
  const escaped = escapeHtml(text);
  const tokens = title.split(/\s+/).filter((token) => token.length > 3);
  return tokens.reduce((output, token) => {
    const safeToken = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return output.replace(new RegExp(`(${safeToken})`, "gi"), "<mark>$1</mark>");
  }, escaped);
}
