// Simple file-based store for demo purposes (survives server restarts)
// In production, this would be replaced with a proper database

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface UserSession {
  resumeText?: string;
  hasResume: boolean;
  uploadedAt?: string;
}

const SESSION_FILE = join(process.cwd(), '.sessions.json');

// Load sessions from file or create empty store
function loadSessions(): Map<string, UserSession> {
  if (existsSync(SESSION_FILE)) {
    try {
      const data = readFileSync(SESSION_FILE, 'utf8');
      const sessionData = JSON.parse(data);
      return new Map(Object.entries(sessionData));
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  }
  return new Map();
}

// Save sessions to file
function saveSessions(sessionStore: Map<string, UserSession>): void {
  try {
    const sessionData = Object.fromEntries(sessionStore);
    writeFileSync(SESSION_FILE, JSON.stringify(sessionData, null, 2));
  } catch (error) {
    console.error('Error saving sessions:', error);
  }
}

const sessionStore = loadSessions();

// Generate a simple session ID (in production, use proper session management)
export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function setUserResume(sessionId: string, resumeText: string): void {
  console.log('Setting resume for session:', sessionId);
  sessionStore.set(sessionId, {
    resumeText,
    hasResume: true,
    uploadedAt: new Date().toISOString()
  });
  saveSessions(sessionStore);
  console.log('Session store size:', sessionStore.size);
}

export function getUserSession(sessionId: string): UserSession | null {
  return sessionStore.get(sessionId) || null;
}

export function hasUserResume(sessionId: string): boolean {
  console.log('Checking resume for session:', sessionId);
  console.log('Available sessions:', Array.from(sessionStore.keys()));
  const session = sessionStore.get(sessionId);
  console.log('Found session:', session);
  return session?.hasResume || false;
}

// Clean up old sessions (remove sessions older than 1 hour)
export function cleanupOldSessions(): void {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  let cleaned = false;
  for (const [sessionId, session] of sessionStore.entries()) {
    if (session.uploadedAt && new Date(session.uploadedAt) < oneHourAgo) {
      sessionStore.delete(sessionId);
      cleaned = true;
    }
  }
  if (cleaned) {
    saveSessions(sessionStore);
  }
}

// Run cleanup every 30 minutes
setInterval(cleanupOldSessions, 30 * 60 * 1000);