import Tesseract from 'tesseract.js';

/**
 * 이미지에서 텍스트를 추출합니다.
 * @param {File} imageFile - 업로드된 이미지 파일
 * @param {Function} onProgress - 진행률 콜백 함수 (progress: number)
 * @returns {Promise<string>} 추출된 텍스트
 */
export const extractTextFromImage = async (imageFile, onProgress = () => {}) => {
  try {
    const result = await Tesseract.recognize(
      imageFile,
      'kor+eng', // 한글과 영어 모두 인식
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            onProgress(parseInt(m.progress * 100));
          }
        },
      }
    );

    return result.data.text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('이미지에서 텍스트를 추출하는 중 오류가 발생했습니다.');
  }
};
