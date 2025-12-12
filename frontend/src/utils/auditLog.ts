import type { AuditLog } from '../types/index';

const AUDIT_LOG_KEY = 'sgii_audit_logs';

export const getAuditLogs = (): AuditLog[] => {
  const logs = localStorage.getItem(AUDIT_LOG_KEY);
  return logs ? JSON.parse(logs) : [];
};

export const saveAuditLogs = (logs: AuditLog[]) => {
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs));
};

export const addAuditLog = (
  userId: string,
  userName: string,
  action: string,
  entity: string,
  entityId: string,
  details: string
) => {
  const logs = getAuditLogs();
  const newLog: AuditLog = {
    id: Date.now().toString(),
    userId,
    userName,
    action,
    entity,
    entityId,
    details,
    timestamp: new Date().toISOString(),
  };
  
  logs.unshift(newLog);
  
  // Mantener solo los últimos 1000 registros
  if (logs.length > 1000) {
    logs.splice(1000);
  }
  
  saveAuditLogs(logs);
  return newLog;
};

export const getAuditLogsByEntity = (entity: string, entityId: string): AuditLog[] => {
  const logs = getAuditLogs();
  return logs.filter(log => log.entity === entity && log.entityId === entityId);
};

export const getAuditLogsByUser = (userId: string): AuditLog[] => {
  const logs = getAuditLogs();
  return logs.filter(log => log.userId === userId);
};

export const clearOldAuditLogs = (daysToKeep: number = 90) => {
  const logs = getAuditLogs();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  
  const filteredLogs = logs.filter(log => new Date(log.timestamp) > cutoffDate);
  saveAuditLogs(filteredLogs);
};
