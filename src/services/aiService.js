import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = 'AIzaSyDfQcDbQOhKHsajiLIB1aiSHjXNV9jbHDk';
const genAI = new GoogleGenerativeAI(API_KEY);

// JSON 응답을 파싱하기 위한 헬퍼 함수
const parseJSON = (text) => {
  try {
    // 마크다운 코드 블록 제거 (```json ... ```)
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("JSON Parsing Error:", error);
    throw new Error("AI 응답을 처리하는 중 오류가 발생했습니다.");
  }
};

/**
 * 문제 텍스트를 분석하여 과목, 주제, 유형을 추출합니다.
 * @param {string} text - 문제 텍스트
 * @returns {Promise<Object>} 분석 결과 { subject, topic, type, difficulty }
 */
export const analyzeProblem = async (text) => {
  if (!API_KEY) throw new Error("Gemini API Key가 설정되지 않았습니다.");

  // 모델 초기화 (gemini-1.5-flash 사용)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    다음 수학 문제 텍스트를 분석하여 과목, 대주제, 소주제, 문제 유형, 난이도를 JSON 형식으로 추출해줘.
    
    [문제 텍스트]
    ${text}
    
    [출력 형식]
    {
      "subject": "수학 (중등/고등)",
      "grade": "학년 (예: 중2, 고1)",
      "topic": "대주제 (예: 방정식)",
      "subTopic": "소주제 (예: 일차방정식의 활용)",
      "type": "문제 유형 설명",
      "difficulty": "난이도 (하/중/상)"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return parseJSON(response.text());
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("문제 분석 중 오류가 발생했습니다.");
  }
};

/**
 * 분석 결과와 원본 문제를 바탕으로 유사 문제를 생성합니다.
 * @param {Object} analysis - 문제 분석 결과
 * @param {string} originalText - 원본 문제 텍스트
 * @param {number} count - 생성할 문제 수
 * @param {string} mode - 'twin' (쌍둥이: 숫자만 변경) 또는 'similar' (유사: 유형 유지, 문제 변형)
 * @returns {Promise<Array>} 생성된 문제 목록
 */
export const generateSimilarProblems = async (analysis, originalText, count = 1, mode = 'twin') => {
  if (!API_KEY) throw new Error("Gemini API Key가 설정되지 않았습니다.");

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const modeDescription = mode === 'twin'
    ? "쌍둥이 문제: 원본 문제와 논리 구조, 풀이 방식이 완전히 동일하고 숫자나 변수만 바뀐 문제"
    : "유사 문제: 원본 문제와 같은 유형이고 같은 개념을 묻지만, 문제 상황이나 표현이 조금 더 변형된 문제";

  const prompt = `
    다음 원본 문제와 분석 정보를 바탕으로 ${modeDescription}를 ${count}개 생성해줘.
    반드시 JSON 배열 형식으로 출력해야 해.
    
    [원본 문제]
    ${originalText}
    
    [분석 정보]
    ${JSON.stringify(analysis)}
    
    [출력 형식]
    [
      {
        "question": "문제 지문 (수식은 LaTeX 형식이 아닌 일반 텍스트나 읽기 쉬운 형태로)",
        "choices": ["선택지1", "선택지2", "선택지3", "선택지4", "선택지5"],
        "answer": "정답 번호 (1-5)",
        "explanation": "상세한 해설"
      }
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return parseJSON(response.text());
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("유사 문제 생성 중 오류가 발생했습니다.");
  }
};
