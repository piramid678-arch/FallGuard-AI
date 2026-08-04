export type FallGuardAlertLevel = 'NORMAL' | 'PRE_FALL_WARNING' | 'EMERGENCY_FALL';

export interface FallRiskMetrics {
  tiltAngle: number; // 0 to 90 degrees
  comXRatio: number; // Center of Mass X deviation
  verticalSpeed: number; // Vertical drop speed
  gaitStabilityScore: number; // 0 to 100
  alertLevel: FallGuardAlertLevel;
  privacyMode: boolean;
  timestamp: number;
}

export interface SeniorProfile {
  id: string;
  name: string;
  age: number;
  roomNumber: string;
  caregiverPhone: string;
  riskCategory: 'High' | 'Moderate' | 'Low';
}
