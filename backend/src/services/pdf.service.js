const fs = require('fs').promises;
const pdfParse = require('pdf-parse');

class PDFService {
  async extractText(filePath) {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const pdfData = await pdfParse(dataBuffer);
      
      return {
        text: pdfData.text,
        numPages: pdfData.numpages,
        info: pdfData.info,
      };
    } catch (error) {
      throw new Error(`PDF extraction failed: ${error.message}`);
    }
  }

  cleanText(text) {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
}

module.exports = new PDFService();
