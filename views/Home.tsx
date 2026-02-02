import React from 'react';
import { Send, Download } from 'lucide-react';
import { useP2PStore } from '../store/useP2P';
import { useLanguageStore } from '../store/useLanguage';

export const Home = () => {
  const { initialize } = useP2PStore();
  const { t } = useLanguageStore();

  return (
    <div className="flex flex-col items-center justify-center h-full flex-1 gap-12 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            P2P
          </span> File Transfer
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-md mx-auto">
          {t('home_desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <button
          onClick={() => initialize('sender')}
          className="group relative flex flex-col items-center gap-6 p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
        >
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
            <Send size={40} />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{t('send')}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Generate a transfer session
            </p>
          </div>
        </button>

        <button
          onClick={() => initialize('receiver')}
          className="group relative flex flex-col items-center gap-6 p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
        >
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
            <Download size={40} />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{t('receive')}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Connect to a device
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};