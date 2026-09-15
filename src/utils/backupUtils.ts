import { saveAs } from 'file-saver';

export interface BackupData {
  version: string;
  timestamp: string;
  appName: string;
  data: any;
}

// ============ CREAR RESPALDO ============
export function createBackup(state: any): BackupData {
  return {
    version: '2.0',
    timestamp: new Date().toISOString(),
    appName: 'ComplianceEC - Sistema de Cumplimiento LOPDP Ecuador',
    data: {
      users: state.users,
      enterprises: state.enterprises,
      activeEnterpriseId: state.activeEnterpriseId,
      logs: state.logs,
    }
  };
}

// ============ DESCARGAR RESPALDO ============
export function downloadBackup(backup: BackupData, filename?: string) {
  const defaultName = `ComplianceEC_Backup_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0].replace(/:/g, '-')}`;
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  saveAs(blob, `${filename || defaultName}.json`);
}

// ============ GUARDAR RESPALDO EN LOCALSTORAGE ============
export function saveBackupToLocalStorage(backup: BackupData) {
  try {
    localStorage.setItem('compliance-ec-last-backup', JSON.stringify(backup));
    return true;
  } catch (error) {
    console.error('Error al guardar respaldo en localStorage:', error);
    return false;
  }
}

// ============ OBTENER ÚLTIMO RESPALDO DE LOCALSTORAGE ============
export function getLastBackupFromLocalStorage(): BackupData | null {
  try {
    const data = localStorage.getItem('compliance-ec-last-backup');
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Error al leer respaldo de localStorage:', error);
    return null;
  }
}

// ============ CARGAR RESPALDO DESDE ARCHIVO ============
export function loadBackupFromFile(file: File): Promise<BackupData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const backup = JSON.parse(content);
        
        // Validar estructura del backup
        if (!backup.version || !backup.data || !backup.data.enterprises) {
          reject(new Error('El archivo no tiene el formato de respaldo válido'));
          return;
        }
        
        resolve(backup);
      } catch (error) {
        reject(new Error('Error al leer el archivo de respaldo'));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsText(file);
  });
}

// ============ RESTAURAR RESPALDO ============
export function restoreBackup(backup: BackupData): any {
  return {
    users: backup.data.users || [],
    enterprises: backup.data.enterprises || [],
    activeEnterpriseId: backup.data.activeEnterpriseId || null,
    logs: backup.data.logs || [],
  };
}

// ============ AUTO-BACKUP AL CERRAR ============
export function setupAutoBackup(getState: () => any) {
  const handleBeforeUnload = () => {
    const state = getState();
    const backup = createBackup(state);
    
    // Guardar en localStorage
    saveBackupToLocalStorage(backup);
    
    // Intentar descargar el archivo (puede ser bloqueado por el navegador)
    try {
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ComplianceEC_AutoBackup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('No se pudo descargar el respaldo automático:', error);
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}
