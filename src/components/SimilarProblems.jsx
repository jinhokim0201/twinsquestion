import React, { useState } from 'react';

const ProblemCard = ({ problem, index, onSave }) => {
    const [showAnswer, setShowAnswer] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        onSave(problem);
        setIsSaved(true);
    };

    return (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-primary-500/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <span className="bg-primary-500/20 text-primary-300 text-xs font-bold px-2 py-1 rounded">
                    문제 {index + 1}
                </span>
                <button
                    onClick={handleSave}
                    disabled={isSaved}
                    className={`text-sm px-3 py-1 rounded transition-colors ${isSaved
                        ? 'bg-green-500/20 text-green-400 cursor-default'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                        }`}
                >
                    {isSaved ? '저장됨' : '문제은행에 저장'}
                </button>
            </div>

            <div className="mb-6 text-lg whitespace-pre-wrap leading-relaxed">
                {problem.question}
            </div>

            <div className="space-y-2 mb-6">
                {problem.choices.map((choice, idx) => (
                    <div key={idx} className="flex items-center p-2 rounded hover:bg-slate-700/50">
                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-700 text-xs mr-3 text-slate-400">
                            {idx + 1}
                        </span>
                        <span>{choice}</span>
                    </div>
                ))}
            </div>

            <div className="border-t border-slate-700 pt-4">
                <button
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="text-sm text-primary-400 hover:text-primary-300 font-medium flex items-center"
                >
                    {showAnswer ? '정답 및 해설 숨기기' : '정답 및 해설 보기'}
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transition-transform ${showAnswer ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>

                {showAnswer && (
                    <div className="mt-4 bg-slate-900/50 rounded p-4 text-sm animate-fade-in">
                        <div className="mb-2">
                            <span className="font-bold text-green-400 mr-2">정답:</span>
                            {problem.answer}번
                        </div>
                        <div>
                            <span className="font-bold text-blue-400 block mb-1">해설:</span>
                            <p className="text-slate-300 leading-relaxed">{problem.explanation}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const SimilarProblems = ({ problems, onSaveProblem, onGenerateMore, onViewExam }) => {
    if (!problems || problems.length === 0) return null;

    return (
        <div className="card mt-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">생성된 유사 문제</h2>
                <div className="space-x-2">
                    <button
                        onClick={() => onGenerateMore('twin')}
                        className="btn btn-secondary text-sm py-2"
                    >
                        쌍둥이 문제 더 만들기
                    </button>
                    <button
                        onClick={() => onGenerateMore('similar')}
                        className="btn btn-secondary text-sm py-2"
                    >
                        유사 문제 더 만들기
                    </button>
                    <button
                        onClick={onViewExam}
                        className="btn btn-primary text-sm py-2"
                    >
                        📄 시험지 형식으로 보기
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {problems.map((problem, index) => (
                    <ProblemCard
                        key={index}
                        problem={problem}
                        index={index}
                        onSave={onSaveProblem}
                    />
                ))}
            </div>
        </div>
    );
};

export default SimilarProblems;
