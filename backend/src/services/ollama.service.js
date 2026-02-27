/**
 * Ollama Service - Direct REST API integration
 * Provides LLM functionality using local Ollama server
 * No LangChain wrappers, no Google SDK imports
 */

class OllamaService {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || 'http://localhost:11434';
    this.model = config.model || 'mistral:7b-instruct';
    this.temperature = config.temperature !== undefined ? config.temperature : 0;
    this.timeout = config.timeout || 60000;
  }

  /**
   * Invoke Ollama with a prompt (non-streaming)
   * @param {string} prompt - The prompt to send to Ollama
   * @returns {Promise<Object>} Response object with content property
   */
  async invoke(prompt) {
    try {
      const response = await this._makeRequest('/api/generate', {
        model: this.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: this.temperature,
          top_p: 0.9,              // Deterministic sampling
          top_k: 40,               // Limit token choices
          repeat_penalty: 1.1,     // Reduce repetition
          num_predict: 1024,       // Max tokens
        },
      });

      return {
        content: response.response,
        model: response.model,
        done: response.done,
      };
    } catch (error) {
      throw new Error(`Ollama invoke failed: ${error.message}`);
    }
  }

  /**
   * Invoke Ollama with streaming support
   * @param {string} prompt - The prompt to send to Ollama
   * @param {Function} onChunk - Callback for each chunk
   * @returns {Promise<string>} Complete response
   */
  async invokeStream(prompt, onChunk) {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: true,
          options: {
            temperature: this.temperature,
          },
        }),
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.response) {
              fullResponse += json.response;
              if (onChunk) {
                onChunk(json.response);
              }
            }
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      }

      return fullResponse;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new Error('Ollama request timed out');
      }
      throw new Error(`Ollama stream failed: ${error.message}`);
    }
  }

  /**
   * Check if Ollama server is running
   * @returns {Promise<boolean>} True if server is accessible
   */
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * List available models
   * @returns {Promise<Array>} List of model names
   */
  async listModels() {
    try {
      const response = await this._makeRequest('/api/tags', null, 'GET');
      return response.models || [];
    } catch (error) {
      throw new Error(`Failed to list models: ${error.message}`);
    }
  }

  /**
   * Pull a model from Ollama registry
   * @param {string} modelName - Name of model to pull
   * @returns {Promise<void>}
   */
  async pullModel(modelName) {
    try {
      await this._makeRequest('/api/pull', {
        name: modelName,
      });
    } catch (error) {
      throw new Error(`Failed to pull model: ${error.message}`);
    }
  }

  /**
   * Make HTTP request to Ollama API
   * @private
   */
  async _makeRequest(endpoint, body = null, method = 'POST') {
    try {
      const options = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(this.timeout),
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, options);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new Error(`Request timed out after ${this.timeout}ms`);
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to Ollama. Is it running? Start with: ollama serve');
      }
      throw error;
    }
  }

  /**
   * Get model information
   * @param {string} modelName - Name of model
   * @returns {Promise<Object>} Model details
   */
  async getModelInfo(modelName = null) {
    try {
      const model = modelName || this.model;
      const response = await this._makeRequest('/api/show', {
        name: model,
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to get model info: ${error.message}`);
    }
  }
}

module.exports = OllamaService;
