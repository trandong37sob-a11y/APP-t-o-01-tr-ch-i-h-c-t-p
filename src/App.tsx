/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  PlusCircle, 
  Copy, 
  Trash2, 
  Download, 
  Upload, 
  RefreshCw, 
  Gamepad2, 
  Sparkles, 
  Code2, 
  UserPlus, 
  Wrench, 
  Zap,
  Info,
  ChevronRight,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  BookOpen,
  GraduationCap,
  Target,
  Palette,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GamePromptData, 
  GAME_TYPES, 
  UI_STYLES, 
  STUDENT_LEVELS, 
  DATA_TYPES, 
  TECH_REQUIREMENTS, 
  LANGUAGES, 
  QUICK_IDEAS, 
  AUXILIARY_PROMPTS 
} from './constants';
import { 
  generateMainPrompt, 
  generateFiveIdeas, 
  generateImproveUIPrompt, 
  generateChibiPrompt, 
  generateDebuggerPrompt, 
  generateProfessionalVersionPrompt 
} from './lib/promptEngine';

const INITIAL_DATA: GamePromptData = {
  subject: '',
  grade: '',
  lessonName: '',
  coreContent: '',
  objectives: '',
  questionCount: 10,
  gameType: GAME_TYPES[0],
  uiStyle: UI_STYLES[0],
  studentLevel: STUDENT_LEVELS[1],
  dataTypes: [DATA_TYPES[0]],
  technicalRequirements: [TECH_REQUIREMENTS[0], TECH_REQUIREMENTS[1], TECH_REQUIREMENTS[3], TECH_REQUIREMENTS[10]],
  language: LANGUAGES[0],
  teacherNotes: '',
  enableVsMode: true,
};

export default function App() {
  const [formData, setFormData] = useState<GamePromptData>(INITIAL_DATA);
  const [resultPrompt, setResultPrompt] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showIdeas, setShowIdeas] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  const suggestWithAI = async (field: 'lessonName' | 'coreContent' | 'objectives' | 'teacherNotes') => {
    if (!formData.subject && field !== 'lessonName') {
      showNotification("Thầy cô nên nhập Tên môn học trước để AI gợi ý chính xác hơn!", "info");
    }

    setLoadingAI(field);
    try {
      let prompt = "";
      if (field === 'lessonName') {
        prompt = `Tôi là giáo viên dạy môn ${formData.subject || 'phổ thông'}. Hãy gợi ý một tên bài học hay, cụ thể và thu hút học sinh lớp ${formData.grade || 'bất kỳ'}. Chỉ trả về tên bài học, không thêm gì khác.`;
      } else if (field === 'coreContent') {
        prompt = `Hãy tóm tắt 5-7 nội dung trọng tâm (dạng các gạch đầu dòng) cho bài học "${formData.lessonName}" môn ${formData.subject} cho học sinh ${formData.grade}. Nội dung cần ngắn gọn, súc tích để đưa vào game học tập.`;
      } else if (field === 'objectives') {
        prompt = `Hãy viết 3 mục tiêu học tập chính cho bài học "${formData.lessonName}" môn ${formData.subject}. Sử dụng các động từ hành động (như: nhận biết, vận dụng, phân tích...).`;
      } else if (field === 'teacherNotes') {
        prompt = `Dựa trên môn "${formData.subject}", bài học "${formData.lessonName}" lớp ${formData.grade}. Hãy đề xuất 1 ý tưởng trò chơi tương tác (HTML/JS) độc đáo, sáng tạo nhất. Mô tả ngắn gọn kiểu chơi và lý do nó hấp dẫn. Trả về dưới 50 từ.`;
      }

      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();
      if (data.suggestion) {
        handleInputChange(field, data.suggestion.trim());
        showNotification("AI đã hoàn thành gợi ý!");
      } else {
        throw new Error(data.error || "Không nhận được phản hồi từ AI");
      }
    } catch (error) {
      console.error("AI Error:", error);
      showNotification("Có lỗi khi gọi AI. Thầy cô vui lòng kiểm tra lại!", "info");
    } finally {
      setLoadingAI(null);
    }
  };

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ai_game_assistant_data');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    const savedPrompt = localStorage.getItem('ai_game_assistant_prompt');
    if (savedPrompt) setResultPrompt(savedPrompt);

    // Kiểm tra và hiển thị Hướng dẫn cho lần truy cập đầu tiên
    const tutorialSeen = localStorage.getItem('ai_game_assistant_tutorial_seen');
    if (!tutorialSeen) {
      setShowTutorial(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('ai_game_assistant_data', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('ai_game_assistant_prompt', resultPrompt);
  }, [resultPrompt]);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (field: keyof GamePromptData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'dataTypes' | 'technicalRequirements', item: string) => {
    setFormData(prev => {
      const current = prev[field] as string[];
      if (current.includes(item)) {
        return { ...prev, [field]: current.filter(i => i !== item) };
      } else {
        return { ...prev, [field]: [...current, item] };
      }
    });
  };

  const handleGenerate = () => {
    if (!formData.subject || !formData.lessonName) {
      showNotification("Vui lòng nhập Tên môn học và Tên bài học!", "info");
      return;
    }
    const prompt = generateMainPrompt(formData);
    setResultPrompt(prompt);
    window.scrollTo({ top: document.getElementById('result-area')?.offsetTop || 0, behavior: 'smooth' });
    showNotification("Đã tạo câu lệnh thành công!");
  };

  const handleCopy = () => {
    if (!resultPrompt) return;
    navigator.clipboard.writeText(resultPrompt);
    setCopied(true);
    showNotification("Đã sao chép vào bộ nhớ tạm!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!resultPrompt) return;
    const element = document.createElement("a");
    const file = new Blob([resultPrompt], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Prompt_Game_${formData.lessonName || 'AI'}.txt`;
    document.body.appendChild(element);
    element.click();
    showNotification("Đang tải file...");
  };

  const handleReset = () => {
    if (confirm("Xóa toàn bộ dữ liệu đã nhập?")) {
      setFormData(INITIAL_DATA);
      setResultPrompt('');
      localStorage.removeItem('ai_game_assistant_data');
      localStorage.removeItem('ai_game_assistant_prompt');
      showNotification("Đã xóa dữ liệu");
    }
  };

  const handleSelectIdea = (idea: typeof QUICK_IDEAS[0]) => {
    if (idea.id === 'ai-idea') {
      if (!formData.lessonName) {
        showNotification("Thầy cô hãy nhập tên bài học trước để AI gợi ý ý tưởng!", "info");
        return;
      }
      suggestWithAI('teacherNotes'); // Use teacherNotes field as a proxy or just trigger a custom AI prompt for ideas
      showNotification("AI đang lên ý tưởng game phù hợp nhất...");
    } else {
      setFormData(prev => ({ ...prev, gameType: idea.type }));
      showNotification(`Đã chọn mẫu: ${idea.name}`);
    }
    setShowIdeas(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuxAction = (type: string) => {
    let p = '';
    switch(type) {
      case '5-ideas': p = generateFiveIdeas(formData); break;
      case 'ui': p = generateImproveUIPrompt(); break;
      case 'chibi': p = generateChibiPrompt(); break;
      case 'debug': p = generateDebuggerPrompt(); break;
      case 'pro': p = generateProfessionalVersionPrompt(); break;
    }
    setResultPrompt(p);
    showNotification("Đã cập nhật prompt mới!");
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-white selection:bg-indigo-500 selection:text-white bg-[#0a0f1d] relative pb-12">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/15 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-purple-600/15 blur-[100px] rounded-full"></div>
        <div className="absolute top-[20%] right-[10%] w-[35%] h-[35%] bg-pink-600/10 blur-[80px] rounded-full"></div>
      </div>

      {/* Chibi Mascot Decorative */}
      <div className="fixed bottom-10 right-10 z-0 opacity-15 pointer-events-none hidden lg:block">
        <svg width="150" height="150" viewBox="0 0 200 200" className="animate-float">
          <circle cx="100" cy="110" r="60" fill="#4f46e5" />
          <circle cx="75" cy="100" r="8" fill="white" />
          <circle cx="125" cy="100" r="8" fill="white" />
          <path d="M 85 125 Q 100 140 115 125" stroke="white" strokeWidth="4" fill="none" />
          <circle cx="60" cy="80" r="20" fill="#7c3aed" />
          <circle cx="140" cy="80" r="20" fill="#7c3aed" />
        </svg>
      </div>

      {/* Header Section */}
      <header className="px-6 md:px-12 py-6 flex flex-col sm:flex-row justify-between items-center shrink-0 gap-4 border-b border-white/5 bg-[#0a0f1d]/60 backdrop-blur-md relative z-10 mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 bg-indigo-600 border-2 border-indigo-400 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)]">
            <span className="text-xl font-black text-white">AI</span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
              PROMPT GAME HỌC TẬP
            </h1>
            <p className="text-[10px] md:text-xs font-black text-indigo-400 tracking-widest uppercase">Cùng Thầy Trần Đông • Sáng tạo không giới hạn</p>
          </div>
        </motion.div>
        
        <div className="flex flex-wrap gap-2.5 z-10">
          <button 
            onClick={() => setShowTutorial(true)}
            className="px-4 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 border-2 border-indigo-500/30 rounded-xl text-[11px] font-black transition-all flex items-center gap-2 backdrop-blur-sm shadow-xl text-indigo-300"
          >
            <HelpCircle size={14} className="text-indigo-400" /> HƯỚNG DẪN SỬ DỤNG
          </button>
           <button 
            onClick={() => handleReset()}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border-2 border-slate-700/70 rounded-xl text-[11px] font-black transition-all flex items-center gap-2 backdrop-blur-sm shadow-xl"
          >
            <RefreshCw size={14} className="text-amber-400" /> LÀM MỚI FORM
          </button>
          <button 
            onClick={handleDownload}
            disabled={!resultPrompt}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-[11px] font-black transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 border-2 border-indigo-400/50"
          >
            <Save size={14} /> LƯU FILE PROMPT (.TXT)
          </button>
        </div>
      </header>

      {/* Main Content Area: 3-Parts Flow Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (LG: 7 Columns) - Contains Part 1 and Part 2 */}
        <section className="lg:col-span-7 flex flex-col gap-8">
          
          {/* ======================================================== */}
          {/* PHẦN 1: ĐIỀN ĐỦ THÔNG TIN BÀI HỌC VÀ THIẾT LẬP GAME */}
          {/* ======================================================== */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 md:p-8 rounded-[2rem] border-2 border-indigo-500/20 shadow-2xl flex flex-col relative"
          >
            {/* Phase Badge & Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center text-lg font-black shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                  1
                </div>
                <div>
                  <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                    PHẦN 1: ĐIỀN ĐỦ THÔNG TIN THIẾT LẬP
                  </h2>
                  <p className="text-[11px] text-zinc-400 font-bold">Hãy điền các thông tin dưới đây để AI thấu hiểu trò chơi của bạn</p>
                </div>
              </div>
              
              <button 
                onClick={() => setShowIdeas(!showIdeas)}
                className={`px-5 py-2 text-[10px] font-black rounded-full transition-all flex items-center gap-2 ${showIdeas ? 'bg-indigo-600 text-white' : 'bg-white/5 text-indigo-300 hover:bg-white/10 border-2 border-indigo-500/20'}`}
              >
                <Gamepad2 size={13} />
                {showIdeas ? 'QUAY LẠI NHẬP LIỆU' : 'XEM KHO Ý TƯỞNG GAM HỌC TẬP'}
              </button>
            </div>

            {/* Input Content Container */}
            <div className="space-y-6">
              {!showIdeas ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  
                  {/* Row 1: Subject and Grade */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2 flex flex-col">
                      <label className="text-[11px] font-extrabold text-indigo-300 uppercase ml-1 tracking-wider flex items-center gap-1.5">
                        <BookOpen size={14} className="text-indigo-400" />
                        Môn học / Chủ đề học tập <span className="text-red-400 ml-0.5">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="Ví dụ: Toán, Tiếng Anh, Lịch sử..." 
                        className="w-full px-4 py-3.5 glass-input rounded-xl text-sm font-semibold border-2 border-slate-600 bg-slate-900/40 text-white shadow-inner"
                      />
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <label className="text-[11px] font-extrabold text-indigo-300 uppercase ml-1 tracking-wider flex items-center gap-1.5">
                        <GraduationCap size={15} className="text-indigo-400" />
                        Đối tượng / Lớp học <span className="text-red-400 ml-0.5">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={formData.grade}
                        onChange={(e) => handleInputChange('grade', e.target.value)}
                        placeholder="Ví dụ: Lớp 3, Lớp 10, Cấp 2..." 
                        className="w-full px-4 py-3.5 glass-input rounded-xl text-sm font-semibold border-2 border-slate-600 bg-slate-900/40 text-white shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Row 2: Lesson Name */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-extrabold text-indigo-300 uppercase ml-1 tracking-wider flex items-center gap-1.5">
                        <FileText size={14} className="text-indigo-400" />
                        Tên bài học <span className="text-red-400 ml-0.5">*</span>
                      </label>
                      <button 
                        onClick={() => suggestWithAI('lessonName')}
                        disabled={loadingAI === 'lessonName'}
                        className="text-[10px] font-black text-indigo-300 hover:text-white flex items-center gap-1.5 transition-all disabled:opacity-30 bg-indigo-500/20 hover:bg-indigo-500/40 px-3 py-1.5 rounded-lg border border-indigo-400/30"
                      >
                        <Sparkles size={11} className={loadingAI === 'lessonName' ? 'animate-spin' : ''} />
                        AI GỢI Ý TÊN HAY
                      </button>
                    </div>
                    <input 
                      type="text" 
                      value={formData.lessonName}
                      onChange={(e) => handleInputChange('lessonName', e.target.value)}
                      placeholder="Nhập tên bài học cụ thể (ví dụ: Phản số học, Câu điều kiện loại 1...)" 
                      className="w-full px-4 py-3.5 glass-input rounded-xl text-sm font-semibold border-2 border-slate-600 bg-slate-900/40 text-white shadow-inner"
                    />
                  </div>

                  {/* Row 3: Core Content */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-extrabold text-indigo-300 uppercase ml-1 tracking-wider flex items-center gap-1.5">
                        <Target size={14} className="text-indigo-400" />
                        Kiến thức trọng tâm chính <span className="text-red-400 ml-0.5">*</span>
                      </label>
                      <button 
                        onClick={() => suggestWithAI('coreContent')}
                        disabled={loadingAI === 'coreContent' || !formData.lessonName}
                        className="text-[10px] font-black text-indigo-300 hover:text-white flex items-center gap-1.5 transition-all disabled:opacity-30 bg-indigo-500/20 hover:bg-indigo-500/40 px-3 py-1.5 rounded-lg border border-indigo-400/30"
                      >
                        <Sparkles size={11} className={loadingAI === 'coreContent' ? 'animate-spin' : ''} />
                        AI TÓM TẮT KIẾN THỨC
                      </button>
                    </div>
                    <textarea 
                      rows={4} 
                      value={formData.coreContent}
                      onChange={(e) => handleInputChange('coreContent', e.target.value)}
                      placeholder="Nhập các nội dung chính, lý thuyết hoặc bộ câu hỏi đáp án bạn muốn đưa vào game học tập..." 
                      className="w-full px-4 py-3 glass-input rounded-xl text-sm font-semibold border-2 border-slate-600 bg-slate-900/40 text-white shadow-inner resize-none custom-scrollbar"
                    />
                  </div>

                  {/* Row 4: Game Type & UI Style */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2 flex flex-col">
                      <label className="text-[11px] font-extrabold text-indigo-300 uppercase ml-1 tracking-wider flex items-center gap-1.5">
                        <Gamepad2 size={15} className="text-indigo-400" />
                        Kiểu chơi / Thể loại Game
                      </label>
                      <div className="relative">
                        <select 
                          value={formData.gameType}
                          onChange={(e) => handleInputChange('gameType', e.target.value)}
                          className="w-full px-4 py-3.5 glass-input rounded-xl text-sm font-semibold border-2 border-slate-600 bg-slate-900/40 text-white shadow-inner appearance-none cursor-pointer pr-10"
                        >
                          {GAME_TYPES.map(type => <option key={type} value={type} className="bg-[#121c33] text-white font-medium">{type}</option>)}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400 font-bold">
                          ▼
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <label className="text-[11px] font-extrabold text-indigo-300 uppercase ml-1 tracking-wider flex items-center gap-1.5">
                        <Palette size={15} className="text-indigo-400" />
                        Giao diện / Phong cách Mỹ thuật
                      </label>
                      <div className="relative">
                        <select 
                          value={formData.uiStyle}
                          onChange={(e) => handleInputChange('uiStyle', e.target.value)}
                          className="w-full px-4 py-3.5 glass-input rounded-xl text-sm font-semibold border-2 border-slate-600 bg-slate-900/40 text-white shadow-inner appearance-none cursor-pointer pr-10"
                        >
                          {UI_STYLES.map(style => <option key={style} value={style} className="bg-[#121c33] text-white font-medium">{style}</option>)}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400 font-bold">
                          ▼
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 5: VS Mode Config */}
                  <div 
                    className="p-4 bg-indigo-500/10 hover:bg-indigo-500/15 border-2 border-indigo-500/30 rounded-2xl flex items-center justify-between cursor-pointer transition-all select-none" 
                    onClick={() => handleInputChange('enableVsMode', !formData.enableVsMode)}
                  >
                    <div className="flex gap-3.5 items-center">
                      <div className="w-10 h-10 bg-[#161a35] rounded-xl flex items-center justify-center border border-indigo-500/30 shrink-0">
                        <UserPlus size={18} className="text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">Chế độ Đối Kháng 1VS1 (Real-Time Split-Screen)</h4>
                        <p className="text-[10px] text-indigo-300 font-bold">Chia đôi màn hình thi đấu, lưu lịch sử BXH Top 5 của học sinh cực hồi hộp</p>
                      </div>
                    </div>
                    <div className={`w-11 h-6 rounded-full p-1 transition-all duration-300 shrink-0 ${formData.enableVsMode ? 'bg-indigo-500 shadow-[0_0_12px_rgba(79,70,229,0.5)]' : 'bg-slate-700'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 transform ${formData.enableVsMode ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <p className="text-[11px] font-black text-indigo-400 uppercase tracking-widest px-1">💡 GỢI Ý MẪU GAME Ý TƯỞNG THÀNH CÔNG</p>
                  {QUICK_IDEAS.map((idea) => (
                    <div 
                      key={idea.id}
                      onClick={() => handleSelectIdea(idea)}
                      className="glass-card hover:border-indigo-500/60 cursor-pointer group flex items-center gap-6 border-slate-700 bg-slate-900/30 p-4 rounded-2xl transition-all"
                    >
                      <div className="bg-indigo-500/10 p-3 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0 border border-indigo-500/20 shadow-xl">
                        <Zap size={24} className={idea.id === 'ai-idea' ? 'text-yellow-400 animate-pulse' : 'text-indigo-400'} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-extrabold text-white text-base group-hover:text-indigo-300 transition-all">{idea.name}</h3>
                        <p className="text-[12px] text-zinc-400 font-medium leading-normal mt-0.5">{idea.description}</p>
                        <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mt-1.5 inline-block py-1 px-2.5 bg-indigo-500/20 rounded-md">{idea.suitable}</span>
                      </div>
                      <ChevronRight size={24} className="text-slate-500 group-hover:text-indigo-400 transition-all shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* ======================================================== */}
          {/* PHẦN 2: CHUYỂN ĐỔI SANG SIÊU CÂU LỆNH PROMPT AI */}
          {/* ======================================================== */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-[2rem] border-2 border-indigo-500/20 shadow-2xl flex flex-col relative"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-indigo-500 text-white rounded-full flex items-center justify-center text-lg font-black shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                2
              </div>
              <div>
                <h2 className="text-base font-black text-white uppercase tracking-wider">
                  PHẦN 2: BƯỚC CHUYỂN ĐỔI CÂU LỆNH
                </h2>
                <p className="text-[11px] text-zinc-400 font-bold">Kích hoạt chuyển đổi thông tin thiết lập ở trên thành siêu prompt tối ưu của Thầy Đông</p>
              </div>
            </div>

            <div className="space-y-4">
              {formData.subject && formData.lessonName && formData.coreContent ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold rounded-xl flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span><strong>THIẾT LẬP HOÀN HOÀN!</strong> Tất cả các thông tin đã sẵn sàng để chuyển đổi sang siêu prompt.</span>
                </div>
              ) : (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold rounded-xl flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Hệ thống khuyên bạn: Nên nhập đủ <strong>Môn học</strong>, <strong>Lớp học</strong>, <strong>Tên bài ôn</strong>, <strong>Nội dung tóm tắt</strong>.</span>
                </div>
              )}

              <button 
                onClick={handleGenerate}
                className="w-full py-5 bg-gradient-to-r from-emerald-600 via-indigo-600 to-purple-600 hover:from-emerald-500 hover:via-indigo-500 hover:to-purple-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex flex-col items-center justify-center group active:scale-[0.98] border-2 border-white/20 relative overflow-hidden"
              >
                {/* Visual glow on hover */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <span className="text-sm md:text-base flex items-center gap-2.5 tracking-tight">
                  <Zap className="fill-white text-yellow-300 animate-bounce" size={18} />
                  BẤM VÀO ĐÂY: CHUYỂN ĐỔI SANG PROMPT GEMINI SIÊU PHẨM
                </span>
                <span className="text-[9.5px] opacity-90 uppercase tracking-[0.1em] mt-0.5 font-bold">Sử dụng công thức câu lệnh đa chiều, kết cấu Parallax, nhạc kịch và sửa lỗi độc quyền</span>
              </button>
            </div>
          </motion.div>
        </section>

        {/* Right Column (LG: 5 Columns) - Contains Part 3 (Terminal Console) */}
        <section id="result-area" className="lg:col-span-5 flex flex-col gap-6">
          
          {/* ======================================================== */}
          {/* PHẦN 3: SAO CHÉP SIÊU CÂU LỆNH TẠO TRÒ CHƠI */}
          {/* ======================================================== */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 md:p-8 rounded-[2rem] border-2 border-indigo-500/20 shadow-3xl flex flex-col h-full min-h-[500px] bg-slate-950/90 relative"
          >
            {/* Phase Badge & Header */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800 shrink-0">
              <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center text-lg font-black shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                3
              </div>
              <div className="flex-1">
                <h2 className="text-base font-black text-white uppercase tracking-wider">
                  PHẦN 3: LẤY SIÊU CÂU LỆNH
                </h2>
                <p className="text-[11px] text-zinc-400 font-bold">Nhắp sao chép và mang dán vào các kênh AI lớn để sinh mã game</p>
              </div>
            </div>

            {/* Terminal Top Lights */}
            <div className="flex justify-between items-center mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70 shadow-[0_0_8px_rgba(244,63,94,0.4)]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                <span className="ml-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">AI_OUTPUT_PROMPT</span>
              </div>
              
              <button 
                onClick={handleCopy}
                disabled={!resultPrompt}
                className={`px-5 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 border-2 ${resultPrompt ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 border-indigo-400 shadow-xl shadow-indigo-500/10' : 'bg-white/5 text-slate-500 cursor-not-allowed border-slate-700'}`}
              >
                {copied ? <CheckCircle2 size={16} className="text-emerald-300" /> : <Copy size={16} />}
                {copied ? 'ĐÃ COPY THÀNH CÔNG!' : 'SAO CHÉP SIÊU PROMPT'}
              </button>
            </div>
            
            {/* Prompt Render Panel */}
            <div className="flex-1 overflow-y-auto max-h-[480px] text-xs md:text-sm font-mono text-cyan-100 leading-relaxed p-4 bg-[#060b16] border border-slate-800 rounded-2xl custom-scrollbar-dark scroll-smooth select-all">
              {!resultPrompt ? (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center opacity-50 p-6">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 rounded-full border-2 border-dashed border-indigo-500/30 flex items-center justify-center mb-5"
                  >
                    <Sparkles className="text-indigo-400" size={32} />
                  </motion.div>
                  <p className="text-indigo-300 text-xs font-black uppercase tracking-wider mb-1">Hệ thống đang chờ lệnh...</p>
                  <span className="text-[10px] text-zinc-400 font-medium">Nhấn nút "CHUYỂN ĐỔI SANG PROMPT" ở Phần 2 để điền tự động câu lệnh hoàn mỹ tại đây.</span>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="text-indigo-400 mb-3 flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Siêu Câu Lệnh của Thầy Đông Đã Thiết Lập</span>
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed opacity-95">{resultPrompt}</div>
                </div>
              )}
            </div>

            {/* Instruction Footer inside Terminal Card */}
            {resultPrompt && (
              <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-3 shrink-0 animate-in fade-in">
                <div className="flex flex-wrap gap-1.5">
                   <div className="px-2.5 py-1 bg-indigo-500/10 rounded-md border border-indigo-500/20 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                      <span className="text-[8.5px] font-black text-indigo-300 uppercase">PROMPT CHUẨN</span>
                   </div>
                   <div className="px-2.5 py-1 bg-emerald-500/10 rounded-md border border-emerald-500/20 flex items-center gap-1.5">
                      <CheckCircle2 size={9} className="text-emerald-400" />
                      <span className="text-[8.5px] font-black text-emerald-300 uppercase">Giao diện: Parallax</span>
                   </div>
                   {formData.enableVsMode && (
                     <div className="px-2.5 py-1 bg-indigo-500/10 rounded-md border border-indigo-500/20 flex items-center gap-1.5">
                        <Gamepad2 size={9} className="text-indigo-400" />
                        <span className="text-[8.5px] font-black text-indigo-300 uppercase">HỆ THỐNG 1VS1 ACTIVE</span>
                     </div>
                   )}
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider mb-0.5">🚀 HƯỚNG DẪN TIẾP THEO:</p>
                  <p className="text-[10px] text-zinc-400 leading-normal">Bấm nút sao chép, truy cập <strong className="text-slate-200">Gemini 1.5 Pro / GPT-4o</strong>, dán toàn bộ prompt này vào và yêu cầu AI xuất bản file code <strong className="text-slate-200">HTML chạy ngay</strong> cực đỉnh!</p>
                </div>
              </div>
            )}
          </motion.div>
        </section>
      </main>

      {/* Footer Status Bar */}
      <footer className="px-8 py-4 flex justify-between items-center shrink-0 border-t border-white/5 bg-white/[0.02] backdrop-blur-md relative z-10">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Operational</span>
          </div>
          <span className="text-[10px] text-slate-600 font-bold hidden sm:inline tracking-tighter uppercase">V.3.0.0 • POWERED BY GOOGLE AI STUDIO Build</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest">Docs</a>
          <a href="#" className="text-[10px] font-black text-indigo-500 hover:text-indigo-400 transition-all uppercase tracking-widest underline underline-offset-4 decoration-indigo-500/30">Library</a>
        </div>
      </footer>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto"
          >
            <div className="px-8 py-4 glass-panel rounded-3xl flex items-center gap-4 shadow-3xl min-w-[300px]">
              {notification.type === 'success' ? (
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 size={18} className="text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                  <Info size={18} className="text-white" />
                </div>
              )}
              <span className="text-sm font-black tracking-tight text-white">{notification.message.toUpperCase()}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial Modal */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0c0a24]/90 backdrop-blur-md z-[110] flex items-center justify-center p-4 md:p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg md:max-w-xl glass-panel p-6 md:p-8 rounded-[2rem] border border-white/10 shadow-3xl overflow-hidden text-left"
            >
              {/* Decorative Background Blob */}
              <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/15 blur-[60px] rounded-full pointer-events-none"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[50px] rounded-full pointer-events-none"></div>

              {/* Close Button */}
              <button 
                onClick={() => {
                  setShowTutorial(false);
                  localStorage.setItem('ai_game_assistant_tutorial_seen', 'true');
                }}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-slate-400 hover:text-white group z-20"
              >
                <X size={14} className="group-hover:scale-110 transition-transform" />
              </button>

              {/* Header Info */}
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <BookOpen size={22} className="text-white animate-pulse" />
                </div>
                <div>
                  <span className="text-[9px] font-black tracking-[0.2em] text-indigo-400 uppercase">Học làm game cùng Thầy Trần Đông</span>
                  <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">HƯỚNG DẪN TẠO PROMPT GAME</h3>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-4 mb-8 relative z-10">
                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex gap-4 hover:border-indigo-500/10 transition-all">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-black text-indigo-400">1</div>
                  <div className="flex-1">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Thiết lập bài học</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                      Nhập Môn học, Lớp, Tên bài học. Nhấp <span className="text-indigo-400 font-bold">AI GỢI Ý</span> để trí tuệ nhân tạo tự động lên nội dung chuẩn sư phạm cho thầy cô.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex gap-4 hover:border-indigo-500/10 transition-all">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-black text-indigo-400">2</div>
                  <div className="flex-1">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Kích hoạt Chế độ Đặc biệt</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                      Chọn kiểu chơi và tùy biến bật/tắt <span className="text-indigo-400 font-bold">Chế độ Đối kháng 1VS1</span> (chia đôi màn hình thi đấu kịch tính) hoặc chơi đơn lưu <span className="text-indigo-400 font-bold">Bảng xếp hạng Top 5</span>.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex gap-4 hover:border-indigo-500/10 transition-all">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-black text-indigo-400">3</div>
                  <div className="flex-1">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Tạo Câu Lệnh Siêu Cấp</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                      Nhấn <span className="text-indigo-400 font-bold">TẠO CÂU LỆNH SIÊU CẤP</span> để kết xuất Prompt cực kỳ đầy đủ gồm: luật sư phạm, bản đồ thần tiên Parallax, nhạc Web Audio và thế giới Chibi động đổi biểu cảm.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex gap-4 hover:border-indigo-500/10 transition-all">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-black text-indigo-400">4</div>
                  <div className="flex-1">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Dán vào AI & Trải nghiệm</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                      Sao chép mã Prompt, dán vào <span className="text-indigo-400 font-bold">Gemini 1.5/2.0 hoặc ChatGPT</span> để nhận game chạy ngay dạng 1 file HTML, mang đến bất ngờ cho cả lớp học!
                    </p>
                  </div>
                </div>
              </div>

              {/* Close Action Button */}
              <button 
                onClick={() => {
                  setShowTutorial(false);
                  localStorage.setItem('ai_game_assistant_tutorial_seen', 'true');
                }}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/10 transition-all flex items-center justify-center gap-2 group active:scale-[0.98] text-xs uppercase tracking-wider relative z-10"
              >
                <span>Bắt đầu kiến tạo ngay</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
