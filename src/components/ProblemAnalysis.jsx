import React from 'react';

const ProblemAnalysis = ({ isAnalyzing, ocrProgress, analysisResult }) => {
    if (!isAnalyzing && !analysisResult) return null;

    return (
        <div className="card mt-6 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">문제 분석</h2>

            {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="loading-spinner"></div>
                    <div className="text-center">
                        <p className="text-lg font-medium text-slate-200">
                            {ocrProgress < 100 ? '이미지에서 텍스트를 추출하고 있습니다...' : 'AI가 문제를 분석하고 있습니다...'}
                        </p>
                        {ocrProgress < 100 && (
                            <div className="w-64 h-2 bg-slate-700 rounded-full mt-2 overflow-hidden">
                                <div
                                    className="h-full bg-primary-500 transition-all duration-300"
                                    style={{ width: `${ocrProgress}%` }}
                                ></div>
                            </div>
                        )}
                        <p className="text-sm text-slate-400 mt-2">
                            {ocrProgress < 100 ? `${ocrProgress}% 완료` : '잠시만 기다려주세요'}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-slate-400 mb-1">과목</h3>
                            <div className="text-lg font-semibold text-white bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                                {analysisResult.subject} <span className="text-sm text-slate-400 ml-2">({analysisResult.grade})</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-slate-400 mb-1">대주제</h3>
                            <div className="text-lg font-semibold text-white bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                                {analysisResult.topic}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-slate-400 mb-1">소주제</h3>
                            <div className="text-lg font-semibold text-white bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                                {analysisResult.subTopic}
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-slate-400 mb-1">난이도</h3>
                                <div className={`text-lg font-semibold px-4 py-2 rounded-lg border border-slate-700 text-center ${analysisResult.difficulty === '상' ? 'text-red-400 bg-red-400/10' :
                                        analysisResult.difficulty === '중' ? 'text-yellow-400 bg-yellow-400/10' :
                                            'text-green-400 bg-green-400/10'
                                    }`}>
                                    {analysisResult.difficulty}
                                </div>
                            </div>
                            <div className="flex-[2]">
                                <h3 className="text-sm font-medium text-slate-400 mb-1">유형</h3>
                                <div className="text-lg font-semibold text-white bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 truncate" title={analysisResult.type}>
                                    {analysisResult.type}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProblemAnalysis;
