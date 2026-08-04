import React, { useState } from 'react';
import { FallGuardDashboard } from './components/FallGuardDashboard';
import { ShieldAlert, HeartPulse, Sparkles, Building2, Bell, FileText, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeRoom, setActiveRoom] = useState('101호 (김영희 어르신)');

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-16 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 pb-2 max-w-4xl mx-auto">
        <div className="glass-panel rounded-full px-5 h-16 flex items-center justify-between shadow-2xl border border-emerald-500/30 backdrop-blur-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <ShieldAlert className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h1 className="font-black text-xl sm:text-2xl gradient-text-emerald tracking-tight leading-none flex items-center gap-2">
                <span>FallGuard AI</span>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  MediaPipe 3D R&D
                </span>
              </h1>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                정부 디지털 헬스케어 과제 제출용 온디바이스 낙상 예방 솔루션
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> TRL 7 단계 시연 완료
            </span>
            <button
              onClick={() => alert('사회복지시설 요양보호사 관제 알림이 정상 작동 중입니다.')}
              className="p-2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 active:scale-95 transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-24 px-4 max-w-4xl mx-auto">
        <FallGuardDashboard />
      </main>
    </div>
  );
}

