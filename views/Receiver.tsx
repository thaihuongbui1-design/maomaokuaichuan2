import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, QrCode, Wifi, Loader2 } from 'lucide-react';
import { useP2PStore } from '../store/useP2P';
import { useLanguageStore } from '../store/useLanguage';

export const Receiver = () => {
  const { myId, status, progress, currentMeta, reset } = useP2PStore();
  const { t } = useLanguageStore();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (myId) {
      navigator.clipboard.writeText(myId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-in slide-in-from-bottom-8 duration-500">
      <button 
        onClick={reset}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
      >
        <ArrowLeft size={16} />
        {t('back')}
      </button>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xl shadow-zinc-200/50 dark:shadow-black/50">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">{t('receiver_title')}</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
             {status === 'idle' ? 'Share your ID to receive files' :
              status === 'connected' ? 'Connected! Waiting for file...' :
              status === 'transferring' ? 'Downloading...' : 'Status'}
          </p>
        </div>

        {status === 'idle' && !myId && (
           <div className="flex justify-center py-12">
             <Loader2 className="animate-spin text-indigo-500" size={32} />
           </div>
        )}

        {myId && (status === 'idle' || status === 'connected') && (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              {/* Decorative QR placeholder since we don't have a QR lib installed, using icon */}
              <div className="w-48 h-48 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-200 dark:border-zinc-800 mb-6 shadow-sm">
                <QrCode size={80} className="text-zinc-800 dark:text-zinc-200 opacity-80" />
              </div>
              
              <div className="w-full">
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 text-center">
                  {t('my_id')}
                </label>
                <button
                  onClick={copyToClipboard}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500 transition-all group"
                >
                  <span className="font-mono text-lg font-bold text-zinc-900 dark:text-zinc-50 truncate">
                    {myId}
                  </span>
                  {copied ? (
                    <Check size={20} className="text-green-500" />
                  ) : (
                    <Copy size={20} className="text-zinc-400 group-hover:text-indigo-500 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {status === 'connected' && (
              <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 animate-pulse font-medium">
                <Wifi size={20} />
                <span>Connected securely</span>
              </div>
            )}
          </div>
        )}

        {(status === 'transferring' || status === 'completed') && (
          <div className="space-y-6 py-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 truncate px-4">
                {currentMeta?.name}
              </h3>
              <p className="text-sm text-zinc-500">
                {currentMeta && (currentMeta.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-zinc-500">
                  {status === 'completed' ? t('completed') : t('receiving')}
                </span>
                <span className="font-mono">{progress}%</span>
              </div>
              <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${status === 'completed' ? 'bg-green-500' : 'bg-purple-500'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {status === 'completed' && (
              <button 
                onClick={reset}
                className="w-full py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-50 font-medium transition-colors"
              >
                Receive New File
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};