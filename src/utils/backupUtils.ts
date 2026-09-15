import { saveAs } from 'file-saver';

export interface BackupData {
  version: string;
  timestamp: string;
  appName: string;
  source: 'auto-close' | 'auto-interval' | 'manual';
  data: any;
}

const DB_NAME = 'ComplianceECBackups';
const DB_VERSION = 1;
const STORE_NAME = 'backups';
const MAX_BACKUPS = 20;

// ============ INDEXEDDB HELPERS ============
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveBackupToIndexedDB(backup: BackupData): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.add(backup);
    
    // Limpiar respaldos antiguos (mantener solo los últimos MAX_BACKUPS)
    const countRequest = store.count();
    countRequest.onsuccess = () => {
      if (countRequest.result > MAX_BACKUPS) {
        const getAllRequest = store.getAll();
        getAllRequest.onsuccess = () => {
          const allBackups = getAllRequest.result as BackupData[];
          allBackups.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          const toDelete = allBackups.slice(0, allBackups.length - MAX_BACKUPS);
          toDelete.forEach(b => store.delete((b as any).id));
        };
      }
    };
    
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch (error) {
    console.error('Error al guardar en IndexedDB:', error);
  }
}

export async function getBackupsFromIndexedDB(): Promise<BackupData[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const backups = request.result as BackupData[];
        backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        resolve(backups);
      };
      request.onerror = () => reject(request.error);
      db.close();
    });
  } catch (error) {
    console.error('Error al leer de IndexedDB:', error);
    return [];
  }
}

export async function deleteBackupFromIndexedDB(id: number): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch (error) {
    console.error('Error al eliminar respaldo:', error);
  }
}

export async function clearAllBackups(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch (error) {
    console.error('Error al limpiar respaldos:', error);
  }
}

// ============ CREAR RESPALDO ============
export function createBackup(state: any, source: 'auto-close' | 'auto-interval' | 'manual' = 'manual'): BackupData {
  return {
    version: '2.0',
    timestamp: new Date().toISOString(),
    appName: 'ComplianceEC - Sistema de Cumplimiento LOPDP Ecuador',
    source,
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
  const date = new Date(backup.timestamp);
  const defaultName = `ComplianceEC_Backup_${date.toISOString().split('T')[0]}_${date.toTimeString().split(' ')[0].replace(/:/g, '-')}`;
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
        if (!backup.data || !backup.data.enterprises) {
          reject(new Error('El archivo no tiene el formato de respaldo válido'));
          return;
        }
        
        // Si no tiene version, asignar una por defecto
        if (!backup.version) backup.version = '1.0';
        if (!backup.timestamp) backup.timestamp = new Date().toISOString();
        if (!backup.appName) backup.appName = 'ComplianceEC';
        if (!backup.source) backup.source = 'manual';
        
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
    const backup = createBackup(state, 'auto-close');
    
    // Guardar en localStorage (síncrono)
    saveBackupToLocalStorage(backup);
    
    // Guardar en IndexedDB (asíncrono, puede no completarse)
    saveBackupToIndexedDB(backup).catch(() => {});
    
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
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('No se pudo descargar el respaldo automático:', error);
    }
  };

  // También guardar cuando la página se oculta (mobile, cambiar de pestaña)
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      const state = getState();
      const backup = createBackup(state, 'auto-close');
      saveBackupToLocalStorage(backup);
      saveBackupToIndexedDB(backup).catch(() => {});
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}
