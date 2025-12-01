import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = 'AIzaSyChwMPKEqY521i1QmOGB2hqbZWyB0K_RRs';
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        console.log('Fetching available models...\n');

        // Try different model names
        const modelsToTry = [
            'gemini-pro',
            'gemini-1.5-pro',
            'gemini-1.5-flash',
            'gemini-1.0-pro',
            'models/gemini-pro',
            'models/gemini-1.5-pro',
            'models/gemini-1.5-flash'
        ];

        for (const modelName of modelsToTry) {
            try {
                console.log(`Testing model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Say hello");
                console.log(`✅ ${modelName} works!`);
                console.log(`Response: ${result.response.text()}\n`);
            } catch (error) {
                console.log(`❌ ${modelName} failed: ${error.message}\n`);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

listModels();
