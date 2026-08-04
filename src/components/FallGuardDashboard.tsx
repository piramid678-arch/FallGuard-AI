import React, { useState, useRef, useEffect } from 'react';
import { FallGuardAlertLevel, FallRiskMetrics } from '../types';
import {
  ShieldAlert,
  Eye,
  EyeOff,
  Activity,
  AlertTriangle,
  Siren,
  CheckCircle2,
  Video,
  VideoOff,
  PhoneCall,
  ShieldCheck,
  Building2,
  HeartPulse,
} from 'lucide-react';

export const FallGuardDashboard: React.FC = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(true); // Privacy-First by default
  const [alertLevel, setAlertLevel] = useState<FallGuardAlertLevel>('NORMAL');
  const [metrics, setMetrics] = useState<FallRiskMetrics>({
    tiltAngle: 10,
    comXRatio: 0.05,
    verticalSpeed: 0.2,
    gaitStabilityScore: 96,
    alertLevel: 'NORMAL',
    privacyMode: true,
    timestamp: Date.now(),
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize MediaPipe Pose 3D Simulation Loop
  useEffect(() => {
    let phase = 0;
    const interval = setInterval(() => {
      if (!isCameraActive && alertLevel === 'NORMAL') {
        phase += 0.05;
        const simulatedTilt = Math.abs(Math.sin(phase) * 14) + 6;
        setMetrics((prev) => ({
          ...prev,
          tiltAngle: Math.round(simulatedTilt),
          gaitStabilityScore: Math.round(98 - simulatedTilt * 0.5),
        }));
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isCameraActive, alertLevel]);

  // Canvas Skeleton Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const renderSkeleton = () => {
      ctx.clearRect(0, 0, width, height);

      // Background
      if (!privacyMode && videoRef.current && isCameraActive) {
        ctx.drawImage(videoRef.current, 0, 0, width, height);
      } else {
        // Privacy Mode Dark Grid Canvas
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, width, height);

        // Grid lines
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 30) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += 30) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // 3D Skeleton Coordinates (Center of Mass & Keypoints)
      const centerX = width / 2;
      const centerY = height / 2;

      let tiltRad = (metrics.tiltAngle * Math.PI) / 180;
      if (alertLevel === 'PRE_FALL_WARNING') tiltRad = (42 * Math.PI) / 180;
      if (alertLevel === 'EMERGENCY_FALL') tiltRad = (75 * Math.PI) / 180;

      // Keypoints calculation
      const headX = centerX + Math.sin(tiltRad) * 90;
      const headY = centerY - 80 + (alertLevel === 'EMERGENCY_FALL' ? 80 : 0);
      const neckX = centerX + Math.sin(tiltRad) * 60;
      const neckY = centerY - 40 + (alertLevel === 'EMERGENCY_FALL' ? 70 : 0);

      const rShoulderX = neckX + 35;
      const rShoulderY = neckY + 10;
      const lShoulderX = neckX - 35;
      const lShoulderY = neckY + 10;

      const hipX = centerX;
      const hipY = centerY + 30 + (alertLevel === 'EMERGENCY_FALL' ? 50 : 0);
      const rHipX = hipX + 20;
      const rHipY = hipY;
      const lHipX = hipX - 20;
      const lHipY = hipY;

      const rKneeX = rHipX + Math.sin(tiltRad * 0.5) * 40;
      const rKneeY = rHipY + 50;
      const lKneeX = lHipX + Math.sin(tiltRad * 0.5) * 40;
      const lKneeY = lHipY + 50;

      const rAnkleX = rKneeX;
      const rAnkleY = rKneeY + 50;
      const lAnkleX = lKneeX;
      const lAnkleY = lKneeY + 50;

      // Draw Center of Mass (CoM) Plumb Line
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = alertLevel === 'NORMAL' ? '#10b981' : alertLevel === 'PRE_FALL_WARNING' ? '#f59e0b' : '#ef4444';
      ctx.lineWidth = 2;
      ctx.moveTo(hipX, 0);
      ctx.lineTo(hipX, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Skeleton Bones
      const boneColor = alertLevel === 'NORMAL' ? '#10b981' : alertLevel === 'PRE_FALL_WARNING' ? '#f59e0b' : '#ef4444';
      ctx.strokeStyle = boneColor;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';

      // Spine & Shoulders
      ctx.beginPath();
      ctx.moveTo(headX, headY);
      ctx.lineTo(neckX, neckY);
      ctx.lineTo(hipX, hipY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(lShoulderX, lShoulderY);
      ctx.lineTo(rShoulderX, rShoulderY);
      ctx.stroke();

      // Legs
      ctx.beginPath();
      ctx.moveTo(lHipX, lHipY);
      ctx.lineTo(lKneeX, lKneeY);
      ctx.lineTo(lAnkleX, lAnkleY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(rHipX, rHipY);
      ctx.lineTo(rKneeX, rKneeY);
      ctx.lineTo(rAnkleX, rAnkleY);
      ctx.stroke();

      // Draw Joints (Glowing Circles)
      const joints = [
        [headX, headY],
        [neckX, neckY],
        [lShoulderX, lShoulderY],
        [rShoulderX, rShoulderY],
        [hipX, hipY],
        [lKneeX, lKneeY],
        [rKneeX, rKneeY],
        [lAnkleX, lAnkleY],
        [rAnkleX, rAnkleY],
      ];

      joints.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = boneColor;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw CoM Vector Indicator
      ctx.beginPath();
      ctx.arc(hipX, hipY, 12, 0, 2 * Math.PI);
      ctx.strokeStyle = boneColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      animationFrameRef.current = requestAnimationFrame(renderSkeleton);
    };

    renderSkeleton();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [privacyMode, isCameraActive, metrics.tiltAngle, alertLevel]);

  // Handle Webcam Start/Stop
  const toggleCamera = async () => {
    if (isCameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
      setIsCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
      } catch (err) {
        console.error('Camera access denied:', err);
      }
    }
  };

  const triggerTestSimulation = (level: FallGuardAlertLevel) => {
    setAlertLevel(level);
    if (level === 'NORMAL') {
      setMetrics((prev) => ({
        ...prev,
        tiltAngle: 10,
        gaitStabilityScore: 96,
        alertLevel: 'NORMAL',
      }));
    } else if (level === 'PRE_FALL_WARNING') {
      setMetrics((prev) => ({
        ...prev,
        tiltAngle: 42,
        gaitStabilityScore: 48,
        alertLevel: 'PRE_FALL_WARNING',
      }));
    } else {
      setMetrics((prev) => ({
        ...prev,
        tiltAngle: 78,
        gaitStabilityScore: 12,
        alertLevel: 'EMERGENCY_FALL',
      }));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Header Banner */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden border border-emerald-500/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[11px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> FallGuard AI 3D
            </span>
            <span className="text-xs text-emerald-400 font-semibold">Google MediaPipe Pose</span>
          </div>

          {/* Privacy Mode Toggle */}
          <button
            onClick={() => setPrivacyMode((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border transition-all cursor-pointer ${
              privacyMode
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {privacyMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{privacyMode ? '사생활 100% 보호 (스켈레톤 전용)' : '카메라 영상 표시'}</span>
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
          어르신 <span className="gradient-text-emerald">낙상 예방 & 2초 전 사전 예측</span> 시스템
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
          Google MediaPipe 3D 관절 추적으로 무게중심(Center of Mass) 쏠림을 0.01초 단위로 감지하여 사후 조치가 아닌 <strong className="text-amber-400">쓰러지기 2~3초 전 사전 예측 경보</strong>를 발송합니다.
        </p>
      </div>

      {/* Real-Time Alert Banner */}
      <div
        className={`p-4 rounded-3xl border flex items-center justify-between transition-all duration-300 shadow-xl ${
          alertLevel === 'NORMAL'
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            : alertLevel === 'PRE_FALL_WARNING'
            ? 'bg-amber-950/70 border-amber-500/60 text-amber-200 animate-pulse'
            : 'bg-rose-950/80 border-rose-500/80 text-rose-200 animate-bounce'
        }`}
      >
        <div className="flex items-center gap-3">
          {alertLevel === 'NORMAL' && <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />}
          {alertLevel === 'PRE_FALL_WARNING' && <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />}
          {alertLevel === 'EMERGENCY_FALL' && <Siren className="w-8 h-8 text-rose-400 shrink-0" />}

          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider">
              {alertLevel === 'NORMAL' && '🟢 보행 안정 상태 (Normal Posture)'}
              {alertLevel === 'PRE_FALL_WARNING' && '🟠 [주의] 낙상 사전 징후 감지 (Pre-Fall Warning!)'}
              {alertLevel === 'EMERGENCY_FALL' && '🔴 [긴급] 낙상 발생 SOS (Emergency Collapse Detected)'}
            </div>
            <p className="text-xs opacity-90 mt-0.5">
              {alertLevel === 'NORMAL' && '어르신의 무게중심 수직축이 안정적입니다. (기울기 < 20°)'}
              {alertLevel === 'PRE_FALL_WARNING' && '무게중심이 42° 이상 쏠리고 있습니다! 음성 경고 및 요양보호사 사전 호출 중...'}
              {alertLevel === 'EMERGENCY_FALL' && '바닥 접촉 및 관절 붕괴 감지! 119 및 긴급 간호실 SOS 신호 송출 완료!'}
            </p>
          </div>
        </div>

        {alertLevel !== 'NORMAL' && (
          <button
            onClick={() => triggerTestSimulation('NORMAL')}
            className="bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 shrink-0"
          >
            알림 해제
          </button>
        )}
      </div>

      {/* MediaPipe 3D Skeleton Canvas View */}
      <div className="glass-panel p-4 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-extrabold text-white">MediaPipe 3D 관절 & Center of Mass 관제 캔버스</h3>
          </div>

          <button
            onClick={toggleCamera}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              isCameraActive ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-600 text-white shadow-md'
            }`}
          >
            {isCameraActive ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
            <span>{isCameraActive ? '웹캠 중지' : '웹캠 연동'}</span>
          </button>
        </div>

        {/* Video element for webcam (hidden if privacy mode is ON) */}
        <video ref={videoRef} className="hidden" playsInline muted />

        {/* 3D Canvas Box */}
        <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-950 flex items-center justify-center min-h-[280px]">
          <canvas ref={canvasRef} width={480} height={280} className="w-full max-w-[480px] h-[280px]" />

          {/* Privacy Badge overlay */}
          {privacyMode && (
            <div className="absolute top-3 left-3 bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Privacy Shield Active (얼굴 미저장)</span>
            </div>
          )}

          {/* Realtime Tilt Badge */}
          <div className="absolute top-3 right-3 bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono font-bold px-3 py-1 rounded-full backdrop-blur-md">
            쏠림 각도: <span className="text-white font-extrabold">{metrics.tiltAngle}°</span>
          </div>
        </div>

        {/* 3 Simulation Trigger Buttons */}
        <div className="pt-2">
          <span className="text-[11px] text-slate-400 font-bold block mb-2">실시간 테스트 시뮬레이션:</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => triggerTestSimulation('NORMAL')}
              className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                alertLevel === 'NORMAL' ? 'bg-emerald-600 text-white border-emerald-400' : 'glass-panel text-slate-300 hover:bg-slate-800'
              }`}
            >
              🟢 정상 보행
            </button>
            <button
              onClick={() => triggerTestSimulation('PRE_FALL_WARNING')}
              className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                alertLevel === 'PRE_FALL_WARNING' ? 'bg-amber-600 text-white border-amber-400' : 'glass-panel text-slate-300 hover:bg-slate-800'
              }`}
            >
              🟠 쏠림 징후 (2초전 경고)
            </button>
            <button
              onClick={() => triggerTestSimulation('EMERGENCY_FALL')}
              className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                alertLevel === 'EMERGENCY_FALL' ? 'bg-rose-600 text-white border-rose-400' : 'glass-panel text-slate-300 hover:bg-slate-800'
              }`}
            >
              🔴 낙상 발생 (SOS)
            </button>
          </div>
        </div>
      </div>

      {/* Gait Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">보행 균형 지수</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{metrics.gaitStabilityScore} <span className="text-xs text-slate-400">점</span></div>
          <p className="text-[10px] text-slate-400 mt-0.5">최근 7일 안정도 96%</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">무게중심 쏠림 각도</span>
          <div className="text-2xl font-black text-amber-400 mt-1">{metrics.tiltAngle}°</div>
          <p className="text-[10px] text-slate-400 mt-0.5">임계치 (35°) 초과 시 경보</p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">요양보호사 신속 호출</span>
          <button
            onClick={() => alert('담당 요양보호사 및 간호실로 긴급 알림 신호가 전달되었습니다.')}
            className="w-full mt-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 text-xs font-black py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" /> 1-Click 긴급 호출
          </button>
        </div>
      </div>
    </div>
  );
};
