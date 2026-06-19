import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeDocumentText, localizeAnalysis } from '../js/analysis.js';

const SAMPLE_TEXT = `
SERVICE AGREEMENT
This Service Agreement is entered into between ALPHA TECH LLC and BETA HOLDINGS LTD on 01/03/2026.
The effective date of this Agreement is 05/03/2026.
Payment: Fees shall be invoiced monthly and payment shall be agreed by the parties after delivery.
Termination: Either party may terminate at any time at its sole discretion with 5 days notice.
Confidentiality: The parties agree to perpetual confidentiality obligations.
Liability: The supplier is responsible for all damages without limitation.
Renewal: This agreement is subject to automatic renewal on 05/03/2027 unless cancelled.
`;

test('analyzeDocumentText extracts summary, clauses, risks, and timeline data', () => {
  const analysis = analyzeDocumentText(SAMPLE_TEXT, { name: 'sample.txt', type: 'text/plain', size: 512 });
  assert.equal(analysis.summary.documentTypeKey, 'agreement');
  assert.ok(analysis.summary.parties.includes('ALPHA TECH LLC'));
  assert.ok(analysis.summary.overview.length > 20);
  assert.ok(analysis.clauses.some((clause) => clause.key === 'payment'));
  assert.ok(analysis.clauses.some((clause) => clause.key === 'termination'));
  assert.ok(analysis.risks.some((risk) => risk.key === 'unlimitedLiability'));
  assert.ok(analysis.risks.some((risk) => risk.key === 'automaticRenewal'));
  assert.ok(analysis.timeline.some((item) => item.isoDate === '2026-03-05'));
});

test('localizeAnalysis converts extracted content to Portuguese', () => {
  const analysis = analyzeDocumentText(SAMPLE_TEXT, { name: 'sample.txt', type: 'text/plain', size: 512 });
  const localized = localizeAnalysis(analysis, 'pt');
  assert.equal(localized.summary.documentType, 'Acordo');
  assert.ok(localized.clauses.some((clause) => clause.title === 'Pagamento'));
  assert.ok(localized.clauses.some((clause) => clause.contentTranslated.toLowerCase().includes('pagamento')));
  assert.ok(localized.risks.some((risk) => risk.title.includes('responsabilidade')));
  assert.ok(localized.timeline.every((item) => item.displayDate));
});
