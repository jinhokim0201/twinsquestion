import React, { useState, useRef } from 'react';

const FileUpload = ({ onFileSelect }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    };

    const processFile = (file) => {
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);

        onFileSelect(file);
    };

    const clearFile = () => {
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onFileSelect(null);
    };

    return (
        <div className="card">
            <h2 className="text-xl font-bold mb-4">문제 이미지 업로드</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 왼쪽: 업로드 영역 */}
                <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors h-64 flex flex-col items-center justify-center ${isDragging
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-slate-600 hover:border-primary-400 hover:bg-slate-800'
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        onClick={(e) => { e.target.value = null; }}
                        accept="image/*"
                        className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="p-2 bg-slate-700 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-base font-medium text-slate-200">
                                클릭 또는 드래그하여 업로드
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                JPG, PNG 형식 지원
                            </p>
                        </div>
                    </div>
                </div>

                {/* 오른쪽: 미리보기 영역 */}
                <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-4 flex items-center justify-center overflow-auto relative group min-h-64 max-h-[600px]">
                    {!previewUrl ? (
                        <div className="text-center text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm">이미지가 여기에 표시됩니다</p>
                        </div>
                    ) : (
                        <>
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="max-w-full max-h-full object-contain rounded"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        clearFile();
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-lg transform scale-90 hover:scale-100 transition-all flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    삭제
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUpload;
