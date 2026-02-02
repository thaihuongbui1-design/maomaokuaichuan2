import React, { useState } from 'react';
import { ArrowLeft, UploadCloud, Link, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useP2PStore } from '../store/useP2P';
import { useLanguageStore } from '../store/useLanguage';

export const Sender = () => {
  const { status, connectToPeer, sendFile, progress, reset, error } = useP2PStore();
  const { t } = useLanguageStore();
  const [remoteId, setRemoteId] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      sendFile(e.target.files[0]);
    }
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (remoteId.trim()) {
      connectToPeer(remoteId.trim());
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
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">{t('sender_title')}</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            {status === 'idle' ? 'Connect to the receiver first' : 
             status === 'connected' ? 'Ready to send files' : 
             status === 'transferring' ? 'Transferring data...' : 'Transfer status'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm flex items-start gap-3">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {status === 'idle' || status === 'connecting' || status === 'error' ? (
          <form onSubmit={handleConnect} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                {t('connect_peer')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={remoteId}
                  onChange={(e) => setRemoteId(e.target.value)}
                  placeholder={t('id_placeholder')}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-sm"
                />
                <Link size={18} className="absolute left-3 top-3.5 text-zinc-400" />
              </div>
            </div>
            <button
              type="submit"
              disabled={!remoteId || status === 'connecting'}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'connecting' && <Loader2 size={18} className="animate-spin" />}
              {t('connect')}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400 text-sm font-medium">
              <CheckCircle size={18} />
              Connected to receiver
            </div>

            {status === 'transferring' ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-500">{t('sending')}</span>
                  <span className="font-mono">{progress}%</span>
                </div>
                <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : status === 'completed' ? (
               <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{t('completed')}</h3>
                  <button 
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="mt-6 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline"
                  >
                    Send another file
                  </button>
               </div>
            ) : (
              <label className="block w-full cursor-pointer group">
                <input 
                  id="file-upload"
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
                <div className="flex flex-col items-center justify-center gap-4 py-12 px-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl group-hover:border-indigo-500 dark:group-hover:border-indigo-500 group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-950/10 transition-all duration-300">
                  <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:text-indigo-500 transition-colors">
                    <UploadCloud size={32} />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">{t('select_file')}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('drag_drop')}</p>
                  </div>
                </div>
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  );
};