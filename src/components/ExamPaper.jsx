import React, { useState } from 'react';

const ExamPaper = ({ problems, analysisResult, onClose }) => {
    const [showAnswers, setShowAnswers] = useState(false);

    if (!problems || problems.length === 0) return null;

    const currentDate = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto">
            <div className="min-h-screen p-4 md:p-8">
                <div className="max-w-4xl mx-auto bg-white text-black shadow-2xl exam-paper">
                    {/* 시험지 헤더 */}
                    <div className="exam-header border-b-2 border-black pb-4 mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-2xl font-bold mb-1">
                                    {analysisResult?.subject || '수학'} 유사 문제
                                </h1>
                                <p className="text-sm text-gray-600">{currentDate}</p>
                            </div>
                            <div className="text-right text-sm border border-black p-2">
                                <div className="mb-1">수험번호:</div>
                                <div className="mb-1">성    명:</div>
                            </div>
                        </div>

                        {/* 유의사항 */}
                        <div className="bg-gray-50 p-3 rounded text-xs border border-gray-300">
                            <p className="font-bold mb-1">※ 유의사항</p>
                            <ul className="list-disc list-inside space-y-0.5 text-gray-700">
                                <li>문제지는 총 {problems.length}문항입니다.</li>
                                <li>각 문항의 정답을 선택지에서 골라 답안을 작성하시기 바랍니다.</li>
                                <li>문제는 AI가 생성한 유사 문제입니다.</li>
                            </ul>
                        </div>
                    </div>

                    {/* 문제 영역 */}
                    <div className="exam-content space-y-8">
                        {problems.map((problem, index) => (
                            <div key={index} className="exam-problem">
                                {/* 문제 번호 및 배점 */}
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg font-bold">{index + 1}.</h3>
                                    <span className="text-sm text-gray-600">[5점]</span>
                                </div>

                                {/* 문제 내용 */}
                                <div className="mb-4 pl-6 text-base leading-relaxed whitespace-pre-wrap">
                                    {problem.question}
                                </div>

                                {/* 선택지 */}
                                <div className="pl-6 space-y-2">
                                    {problem.choices.map((choice, idx) => (
                                        <div key={idx} className="flex items-start">
                                            <span className="font-medium mr-3 min-w-[24px]">
                                                {'①②③④⑤'[idx]}
                                            </span>
                                            <span className="flex-1">{choice}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* 정답 표시 (옵션) */}
                                {showAnswers && (
                                    <div className="mt-4 pl-6 bg-blue-50 border-l-4 border-blue-500 p-3">
                                        <p className="font-bold text-blue-900 mb-1">
                                            정답: {problem.answer}번
                                        </p>
                                        <p className="text-sm text-blue-800">
                                            <span className="font-semibold">해설: </span>
                                            {problem.explanation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 페이지 번호 */}
                    <div className="exam-footer text-center text-sm text-gray-500 mt-8 pt-4 border-t border-gray-300">
                        <p>총 {problems.length}문항 중 {problems.length}문항</p>
                    </div>
                </div>

                {/* 컨트롤 버튼들 (인쇄 시 숨김) */}
                <div className="max-w-4xl mx-auto mt-4 flex justify-center gap-3 print:hidden">
                    <button
                        onClick={() => setShowAnswers(!showAnswers)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-colors"
                    >
                        {showAnswers ? '정답 숨기기' : '정답 보기'}
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-colors flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                        </svg>
                        인쇄하기
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-colors"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExamPaper;
