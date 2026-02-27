/**
 * Optimized prompts for Mistral (Ollama)
 * - Short and direct
 * - Strict JSON output
 * - Minimal instructions
 * - Zero hallucination focus
 */

/**
 * Clause selection prompt - Optimized for Mistral
 */
function getClauseSelectionPrompt(query, clauseSummaries) {
  const clauseList = clauseSummaries.map((c, idx) => 
    `${idx + 1}. ${c.number} ${c.title} [ID: ${c.id}]`
  ).join('\n');
  
  return `Select the MOST relevant clause.

QUESTION: ${query}

CLAUSES:
${clauseList}

Return JSON with the ID:
{
  "selected": "<id>",
  "confidence": 0.0-1.0
}`;
}

/**
 * Grounded answer generation - Zero hallucination mode
 */
function getGroundedAnswerPrompt(query, sectionContent, clauseNumbers) {
  return `You MUST answer using ONLY the context below.

If answer not found, return:
{
  "answer": "The provided documents do not contain this information.",
  "confidence": 0.0
}

CONTEXT:
${sectionContent}

QUESTION: ${query}

Return STRICT JSON:
{
  "answer": "<clear factual answer with [Clause X.X] citations>",
  "confidence": 0.0-1.0
}

No extra text. Only JSON.`;
}

/**
 * Tree reasoning prompt - Top-level section selection
 */
function getTreeReasoningPrompt(query, documentStructure) {
  return `You are navigating a legal document structure.

QUESTION: ${query}

STRUCTURE:
${documentStructure}

Select the most relevant TOP-LEVEL section.

Return JSON:
{
  "selected_section": "<section_number>",
  "reasoning": "<short explanation>",
  "confidence": 0.0-1.0
}

Only JSON.`;
}

/**
 * Confidence evaluation prompt
 */
function getConfidenceEvaluationPrompt(query, answer, context) {
  return `Evaluate answer quality.

QUESTION: ${query}
ANSWER: ${answer}
CONTEXT: ${context.slice(0, 500)}

Rate confidence (0.0 to 1.0) based on:
- Answer supported by context
- Answer is complete
- No assumptions made

Return JSON:
{
  "confidence": 0.0-1.0,
  "reasoning": "<brief explanation>"
}

Only JSON.`;
}

/**
 * Hybrid fallback prompt - Keyword-based selection
 */
function getHybridFallbackPrompt(query, keywordMatches) {
  const matchList = keywordMatches.slice(0, 5).map((m, idx) =>
    `${idx + 1}. Clause ${m.number}: ${m.title} (Score: ${m.score.toFixed(2)})`
  ).join('\n');
  
  return `Reasoning-based search had low confidence. Here are keyword matches:

QUESTION: ${query}

MATCHES:
${matchList}

Select the most relevant match.

Return JSON:
{
  "selected": "<clause_number>",
  "reasoning": "<explanation>",
  "confidence": 0.0-1.0
}

Only JSON.`;
}

/**
 * Multi-clause synthesis - Safer version
 */
function getMultiClauseSynthesisPrompt(query, clauses) {
  const clauseContent = clauses.map(c =>
    `Clause ${c.number}: ${c.content.slice(0, 300)}`
  ).join('\n\n');
  
  return `Answer using ONLY these clauses.

QUESTION: ${query}

CLAUSES:
${clauseContent}

Return JSON:
{
  "answer": "<combined answer with [Clause X.X] citations>",
  "confidence": 0.0-1.0
}

If insufficient information:
{
  "answer": "Insufficient information in provided clauses.",
  "confidence": 0.0
}

Only JSON.`;
}

/**
 * Explanation prompt - Generate reasoning path explanation
 */
function getExplanationPrompt(query, reasoningPath) {
  const pathDescription = reasoningPath.map((step, idx) =>
    `${idx + 1}. ${step.title} (Clause ${step.number})`
  ).join(' → ');
  
  return `Explain the reasoning path.

QUESTION: ${query}
PATH: ${pathDescription}

Return JSON:
{
  "explanation": "<2-3 sentences explaining why this path was chosen>"
}

Only JSON.`;
}

module.exports = {
  getClauseSelectionPrompt,
  getGroundedAnswerPrompt,
  getTreeReasoningPrompt,
  getConfidenceEvaluationPrompt,
  getHybridFallbackPrompt,
  getMultiClauseSynthesisPrompt,
  getExplanationPrompt,
};
