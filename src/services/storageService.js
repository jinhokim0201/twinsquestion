const STORAGE_KEY = 'twins_question_bank';

/**
 * 저장된 모든 문제를 가져옵니다.
 * @returns {Array} 문제 목록
 */
export const getStoredProblems = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

/**
 * 새로운 문제를 저장합니다.
 * @param {Object} problem - 저장할 문제 객체
 * @returns {Object} 저장된 문제 (ID 포함)
 */
export const saveProblem = (problem) => {
    const problems = getStoredProblems();
    const newProblem = {
        ...problem,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
    };

    problems.unshift(newProblem); // 최신 문제가 위로 오도록
    localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));

    return newProblem;
};

/**
 * 문제를 삭제합니다.
 * @param {string} id - 삭제할 문제 ID
 */
export const deleteProblem = (id) => {
    const problems = getStoredProblems();
    const filteredProblems = problems.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProblems));
};

/**
 * 문제를 검색합니다.
 * @param {string} query - 검색어
 * @returns {Array} 검색된 문제 목록
 */
export const searchProblems = (query) => {
    const problems = getStoredProblems();
    if (!query) return problems;

    const lowerQuery = query.toLowerCase();
    return problems.filter(p =>
        p.question.toLowerCase().includes(lowerQuery) ||
        p.analysis?.topic?.toLowerCase().includes(lowerQuery) ||
        p.analysis?.subTopic?.toLowerCase().includes(lowerQuery)
    );
};
