import { create } from 'zustand';

type Lang = 'en' | 'zh';

interface LanguageState {
  language: Lang;
  setLanguage: (lang: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<Lang, Record<string, string>> = {
  en: {
    'footer': 'Secure P2P Transfer. No cloud storage.',
    'send': 'Send File',
    'receive': 'Receive File',
    'home_desc': 'Transfer files directly between devices without limits.',
    'sender_title': 'Sender Mode',
    'receiver_title': 'Receiver Mode',
    'connect_peer': 'Enter Receiver ID',
    'my_id': 'Your ID',
    'waiting': 'Waiting for connection...',
    'select_file': 'Select File',
    'sending': 'Sending...',
    'receiving': 'Receiving...',
    'completed': 'Transfer Completed!',
    'connect': 'Connect',
    'back': 'Back Home',
    'id_placeholder': 'e.g. funny-cat-99',
    'drag_drop': 'Drag & Drop or Click to Upload',
    'copy': 'Copy',
    'copied': 'Copied!',
  },
  zh: {
    'footer': '安全P2P传输。无云端存储。',
    'send': '发送文件',
    'receive': '接收文件',
    'home_desc': '设备间直接传输，无大小限制。',
    'sender_title': '发送方',
    'receiver_title': '接收方',
    'connect_peer': '输入接收方ID',
    'my_id': '你的 ID',
    'waiting': '等待连接...',
    'select_file': '选择文件',
    'sending': '发送中...',
    'receiving': '接收中...',
    'completed': '传输完成！',
    'connect': '连接',
    'back': '返回首页',
    'id_placeholder': '例如：funny-cat-99',
    'drag_drop': '拖拽或点击上传',
    'copy': '复制',
    'copied': '已复制!',
  }
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: 'zh', // Default to Chinese as per prompt context
  setLanguage: (language) => set({ language }),
  t: (key) => translations[get().language][key] || key,
}));