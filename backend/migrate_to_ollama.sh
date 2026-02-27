#!/bin/bash

echo "🦙 Migrating LegalMind AI to Ollama"
echo "===================================="
echo ""

# Step 1: Remove Google dependencies
echo "1. Removing Google Gemini dependencies..."
npm uninstall @google/generative-ai @langchain/google-genai
echo "✅ Google dependencies removed"
echo ""

# Step 2: Check if Ollama is installed
echo "2. Checking Ollama installation..."
if command -v ollama &> /dev/null; then
    echo "✅ Ollama is installed"
else
    echo "❌ Ollama is not installed"
    echo ""
    echo "Please install Ollama:"
    echo "  macOS/Linux: curl -fsSL https://ollama.ai/install.sh | sh"
    echo "  Windows: https://ollama.ai/download"
    echo ""
    exit 1
fi
echo ""

# Step 3: Check if Ollama is running
echo "3. Checking if Ollama is running..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama is running"
else
    echo "⚠️  Ollama is not running"
    echo "Starting Ollama..."
    ollama serve &
    sleep 3
    echo "✅ Ollama started"
fi
echo ""

# Step 4: Pull Mistral model
echo "4. Pulling Mistral model..."
if ollama list | grep -q "mistral:7b-instruct"; then
    echo "✅ Mistral model already installed"
else
    echo "Downloading Mistral (4.1 GB)..."
    ollama pull mistral:7b-instruct
    echo "✅ Mistral model installed"
fi
echo ""

# Step 5: Test Ollama
echo "5. Testing Ollama..."
node test_ollama.js
echo ""

# Step 6: Update .env
echo "6. Updating .env file..."
if grep -q "AI_PROVIDER=ollama" .env; then
    echo "✅ .env already configured for Ollama"
else
    echo "⚠️  Please update your .env file:"
    echo "  AI_PROVIDER=ollama"
    echo "  OLLAMA_BASE_URL=http://localhost:11434"
    echo "  OLLAMA_MODEL=mistral:7b-instruct"
fi
echo ""

echo "===================================="
echo "✅ Migration Complete!"
echo ""
echo "Next steps:"
echo "1. Update .env if needed"
echo "2. Start backend: npm run dev"
echo "3. Start frontend: cd ../frontend && npm run dev"
echo ""
echo "Your system is now 100% local and free! 🎉"
