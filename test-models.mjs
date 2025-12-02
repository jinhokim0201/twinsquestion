import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env 파일 로드
dotenv.config({ path: join(__dirname, '.env') });

const API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error('❌ VITE_GEMINI_API_KEY가 설정되지 않았습니다.');
    process.exit(1);
}

console.log('✅ API Key loaded:', API_KEY.substring(0, 20) + '...');

const genAI = new GoogleGenerativeAI(API_KEY);

// 사용 가능한 모델 테스트
const modelsToTest = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro',
    'gemini-1.5-pro-latest',
    'gemini-pro',
    'gemini-pro-vision',
];

console.log('\n🔍 Testing available models...\n');

for (const modelName of modelsToTest) {
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello');
        const response = await result.response;
        console.log(`✅ ${modelName} - SUCCESS`);
        console.log(`   Response: ${response.text().substring(0, 50)}...`);
    } catch (error) {
        console.log(`❌ ${modelName} - FAILED`);
        console.log(`   Error: ${error.message.substring(0, 100)}...`);
    }
}
