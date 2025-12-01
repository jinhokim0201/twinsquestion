import { useState } from 'react';
import FileUpload from './components/FileUpload';
import ProblemAnalysis from './components/ProblemAnalysis';
import SimilarProblems from './components/SimilarProblems';
import ProblemBank from './components/ProblemBank';
import ExamPaper from './components/ExamPaper';
import { extractTextFromImage } from './services/ocrService';
import { analyzeProblem, generateSimilarProblems } from './services/aiService';
import { saveProblem } from './services/storageService';

function App() {
  const [activeTab, setActiveTab] = useState('generate');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [originalText, setOriginalText] = useState('');
  const [generatedProblems, setGeneratedProblems] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showExamView, setShowExamView] = useState(false);

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    if (!file) {
      setAnalysisResult(null);
      setGeneratedProblems([]);
      return;
    }

    setIsAnalyzing(true);
    setOcrProgress(0);
    setAnalysisResult(null);
    setGeneratedProblems([]);

    try {
      // 1. OCR Text Extraction
      const text = await extractTextFromImage(file, (progress) => {
        setOcrProgress(progress);
      });
      setOriginalText(text);

      // 2. AI Analysis
      const analysis = await analyzeProblem(text);
      setAnalysisResult(analysis);

      // 3. Generate Twin Problem (Initial)
      const problems = await generateSimilarProblems(analysis, text, 1, 'twin');
      setGeneratedProblems(problems);

    } catch (error) {
      console.error('Error:', error);
      alert('문제 분석 중 오류가 발생했습니다.\n' + error.message);
      setAnalysisResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateMore = async (mode) => {
    if (!analysisResult || !originalText) return;

    const count = mode === 'twin' ? 1 : 2;
    setIsAnalyzing(true);
    try {
      const newProblems = await generateSimilarProblems(analysisResult, originalText, count, mode);
      setGeneratedProblems(prev => [...prev, ...newProblems]);
    } catch (error) {
      console.error('Error generating more:', error);
      alert('추가 문제 생성 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveProblem = (problem) => {
    const problemToSave = {
      ...problem,
      originalSubject: analysisResult.subject,
      originalTopic: analysisResult.topic,
      difficulty: analysisResult.difficulty
    };
    saveProblem(problemToSave);
    alert('문제은행에 저장되었습니다.');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-6">
      <header className="max-w-5xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            유사 쌍둥이 문제 생성기
          </h1>
          <p className="text-slate-400 mt-1">AI로 기출문제 분석하고 쌍둥이 문제 만들기</p>
        </div>

        <nav className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'generate'
              ? 'bg-slate-700 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            문제 생성
          </button>
          <button
            onClick={() => setActiveTab('bank')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'bank'
              ? 'bg-slate-700 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            문제은행
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto">
        {activeTab === 'generate' ? (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">AI 기반 문제 분석 및 생성</h2>
              <p className="text-slate-400">
                문제 이미지를 업로드하면 AI가 분석하여 유사한 쌍둥이 문제를 자동으로 생성해줍니다.
              </p>
            </div>

            <FileUpload onFileSelect={handleFileSelect} />

            <ProblemAnalysis
              isAnalyzing={isAnalyzing}
              ocrProgress={ocrProgress}
              analysisResult={analysisResult}
            />

            <SimilarProblems
              problems={generatedProblems}
              onSaveProblem={handleSaveProblem}
              onGenerateMore={handleGenerateMore}
              onViewExam={() => setShowExamView(true)}
            />

            {/* 시험지 뷰 */}
            {showExamView && (
              <ExamPaper
                problems={generatedProblems}
                analysisResult={analysisResult}
                onClose={() => setShowExamView(false)}
              />
            )}
          </div>
        ) : (
          <ProblemBank />
        )}
      </main>
    </div>
  );
}

export default App;
