import React, { useState, useEffect } from 'react';
import { getStoredProblems, deleteProblem, searchProblems } from '../services/storageService';

const ProblemBank = () => {
    const [problems, setProblems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');

    useEffect(() => {
        loadProblems();
    }, []);

    const loadProblems = () => {
        setProblems(getStoredProblems());
    };

    const handleDelete = (id) => {
        if (window.confirm('정말로 이 문제를 삭제하시겠습니까?')) {
            deleteProblem(id);
            loadProblems();
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term.trim() === '') {
            loadProblems();
        } else {
            setProblems(searchProblems(term));
        }
    };

    const filteredProblems = selectedSubject === 'all'
        ? problems
        : problems.filter(p => p.analysis?.subject?.includes(selectedSubject));

    // 고유한 과목 목록 추출
    const subjects = ['all', ...new Set(getStoredProblems().map(p => p.analysis?.subject).filter(Boolean))];

    return (
        <div className="container mx-auto py-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-8 text-gradient">나만의 문제은행</h1>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="문제 내용, 주제, 유형 검색..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full"
                    />
                </div>
                <div className="w-full md:w-48">
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full"
                    >
                        <option value="all">모든 과목</option>
                        {subjects.filter(s => s !== 'all').map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredProblems.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/50 rounded-lg border border-slate-700 border-dashed">
                    <p className="text-xl text-slate-400">저장된 문제가 없습니다.</p>
                    <p className="text-slate-500 mt-2">새로운 문제를 생성하여 저장해보세요!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredProblems.map((problem) => (
                        <div key={problem.id} className="card relative group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-2">
                                    <span className="badge badge-primary">
                                        {problem.analysis?.subject || '기타'}
                                    </span>
                                    <span className="badge bg-slate-700 text-slate-300">
                                        {problem.analysis?.topic || '주제 없음'}
                                    </span>
                                    <span className={`badge ${problem.analysis?.difficulty === '상' ? 'bg-red-900/30 text-red-400' :
                                            problem.analysis?.difficulty === '중' ? 'bg-yellow-900/30 text-yellow-400' :
                                                'bg-green-900/30 text-green-400'
                                        }`}>
                                        {problem.analysis?.difficulty || '난이도 미정'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDelete(problem.id)}
                                    className="text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                    title="삭제"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mb-4 text-lg whitespace-pre-wrap">
                                {problem.question}
                            </div>

                            <details className="group/answer">
                                <summary className="cursor-pointer text-sm text-primary-400 hover:text-primary-300 font-medium list-none flex items-center">
                                    <span className="mr-2">정답 및 해설 보기</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-open/answer:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </summary>
                                <div className="mt-4 bg-slate-900/50 rounded p-4 text-sm">
                                    <div className="mb-2">
                                        <span className="font-bold text-green-400 mr-2">정답:</span>
                                        {problem.answer}번
                                    </div>
                                    <div>
                                        <span className="font-bold text-blue-400 block mb-1">해설:</span>
                                        <p className="text-slate-300 leading-relaxed">{problem.explanation}</p>
                                    </div>
                                </div>
                            </details>

                            <div className="text-xs text-slate-500 mt-4 text-right">
                                생성일: {new Date(problem.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProblemBank;
