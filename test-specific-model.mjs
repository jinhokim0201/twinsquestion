import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const API_KEY = process.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

async function testModel() {
    const modelName = 'gemini-2.0-flash';
    console.log(`Testing model: ${modelName}...`);

    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello, are you working?');
        const response = await result.response;
        console.log('✅ Success!');
        console.log('Response:', response.text());
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testModel();
