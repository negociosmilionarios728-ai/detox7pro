import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const ServerStatus = () => {
    const [isOnline, setIsOnline] = useState(false);
    const [checking, setChecking] = useState(true);

    const checkHealth = async () => {
        try {
            // Short timeout to detect offline quickly
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            const response = await fetch('/api/health', {
                method: 'GET',
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                setIsOnline(true);
            } else {
                setIsOnline(false);
            }
        } catch (error) {
            setIsOnline(false);
        } finally {
            setChecking(false);
        }
    };

    useEffect(() => {
        checkHealth();
        // Poll every 30 seconds
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    if (checking) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: isOnline ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            transition: 'all 0.3s ease',
            cursor: 'help'
        }}
            title={isOnline ? "Conectado ao Banco de Dados (Nuvem)" : "Modo Local (Dados salvos apenas neste dispositivo)"}
        >
            {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
            {isOnline ? 'Online (DB)' : 'Modo Offline'}
        </div>
    );
};

export default ServerStatus;
