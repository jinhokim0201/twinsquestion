import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = 'AIzaSyDfQcDbQOhKHsajiLIB1aiSHjXNV9jbHDk';
const genAI = new GoogleGenerativeAI(API_KEY);

async function testNewKey() {
    try {
        console.log('Testing new API key with gemini-1.5-flash...\n');

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent("Hello, say hi!");

        console.log('✅ SUCCESS! API key works!');
        console.log(`Response: ${result.response.text()}\n`);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testNewKey();
