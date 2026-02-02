const SYSTEM_PROMPT = `You are a legal document assistant. Your role is to answer questions STRICTLY based on the provided legal document context.

CRITICAL RULES:
1. Answer ONLY using information from the provided context
2. If the answer is not in the context, respond: "The provided documents do not contain this information."
3. Never make assumptions or use external knowledge
4. Always cite the source document and clause reference
5. Be precise and use exact legal language from the documents
6. If context is ambiguous, state the ambiguity clearly

Format your response as:
- Direct answer based on context
- Citation: [Document Name, Clause/Section Reference]`;

const getUserPrompt = (context, query) => {
  return `Context from legal documents:
${context}

Question: ${query}

Provide a precise answer based ONLY on the above context. Include citations.`;
};

const formatContext = (retrievedDocs) => {
  return retrievedDocs
    .map((doc, idx) => {
      return `[Source ${idx + 1}]
Document: ${doc.metadata.source}
Clause: ${doc.metadata.chunkId}
Content: ${doc.pageContent}
---`;
    })
    .join('\n\n');
};

module.exports = {
  SYSTEM_PROMPT,
  getUserPrompt,
  formatContext,
};
