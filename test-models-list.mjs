import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import https from 'https';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env 파일 로드
dotenv.config({ path: join(__dirname, '.env') });

const API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error('❌ VITE_GEMINI_API_KEY가 설정되지 않았습니다.');
    process.exit(1);
}

console.log('✅ API Key loaded');

// REST API를 사용하여 모델 목록 조회
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log(`\n🔍 Fetching available models from: ${url.replace(API_KEY, 'HIDDEN_KEY')}`);

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const response = JSON.parse(data);
            if (response.error) {
                console.error('❌ API Error:', response.error);
            } else if (response.models) {
                console.log('\n✅ Available Models:');

                // 파일에 저장
                const modelList = response.models.map(m => `${m.name} (${m.version}) - ${m.displayName}`).join('\n');
                fs.writeFileSync('available-models.txt', modelList, 'utf8');
                console.log('Saved model list to available-models.txt');

                response.models.forEach(model => {
                    console.log(`- ${model.name} (${model.version}) - ${model.displayName}`);
                });
            } else {
                console.log('⚠️ No models found or unexpected response format:', data);
            }
        } catch (e) {
            console.error('❌ Failed to parse response:', e);
            console.log('Raw data:', data);
        }
    });

}).on('error', (err) => {
    console.error('❌ Request failed:', err);
});
