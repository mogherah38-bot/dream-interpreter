import React, { useState, useEffect, useRef } from "react";

// Single-file React component for preview. Drop into a Create React App / Vite project as App.jsx.
// Styling uses Tailwind CSS utility classes (assumes Tailwind is configured in the project).

const translations = {
  ar: {
    appTitle: "مفسر الأحلام",
    subtitle: "اكتب حلمك واحصل على تفسير فوري" ,
    placeholder: "اكتب حلمك هنا...",
    analyze: "فسر الحلم",
    save: "احفظ التفسير",
    savedList: "الأحلام المحفوظة",
    clearAll: "إفراغ الكل",
    topicsTitle: "مواضيع جاهزة",
    examplesTitle: "تفسيرات سريعة",
    langSwitch: "English",
    themeLabel: "الستايل",
    download: "نزّل المحفوظات",
    noDreams: "ماعندك أحلام محفوظة",
    copied: "انسخنا"
  },
  en: {
    appTitle: "Dream Interpreter",
    subtitle: "Type your dream and get an instant interpretation",
    placeholder: "Type your dream...",
    analyze: "Interpret",
    save: "Save interpretation",
    savedList: "Saved dreams",
    clearAll: "Clear all",
    topicsTitle: "Ready topics",
    examplesTitle: "Quick interpretations",
    langSwitch: "عربي",
    themeLabel: "Theme",
    download: "Download saved",
    noDreams: "No saved dreams",
    copied: "Copied"
  }
};

const SYMBOLS = [
  { key: 'water', en: 'Water', ar: 'ماء', desc: { en: 'Emotions, purification, flow', ar: 'العواطف، التطهير، السريان' } },
  { key: 'snake', en: 'Snake', ar: 'ثعبان', desc: { en: 'Hidden threat or transformation', ar: 'خطر خفي أو تحول' } },
  { key: 'flying', en: 'Flying', ar: 'الطيران', desc: { en: 'Freedom, ambition, overview', ar: 'الحرية، الطموح، نظرة عامة' } },
  { key: 'teeth', en: 'Teeth', ar: 'أسنان', desc: { en: 'Anxiety, change in appearance or status', ar: 'قلق، تغيير في المظهر أو الموقع' } },
  { key: 'death', en: 'Death', ar: 'موت', desc: { en: 'Major change, ending and new beginning', ar: 'تغيير كبير، نهاية وبداية جديدة' } }
];

const THEMES = [
  { id: 'modern', name: { ar: 'حديث', en: 'Modern' } },
  { id: 'traditional', name: { ar: 'تراثي', en: 'Traditional' } },
  { id: 'colorful', name: { ar: 'ملون', en: 'Colorful' } }
];

// Simple keyword-based interpretation engine.
function analyzeDreamText(text, lang = 'en') {
  if (!text || !text.trim()) return lang === 'ar' ? 'اكتب حلم لتراه مفسرًا.' : 'Write a dream to get an interpretation.';
  const t = text.toLowerCase();
  const lines = [];

  // Check for symbol keywords
  if (/(water|ماء)/.test(t)) {
    lines.push(lang === 'ar' ? 'الماء يشير إلى العواطف والتطهير — تفحص مشاعرك الحالية.' : 'Water suggests emotions and purification — check your current feelings.');
  }
  if (/(snake|ثعبان)/.test(t)) {
    lines.push(lang === 'ar' ? 'الثعبان قد يدل على خطر خفي أو تحول داخل نفسك.' : 'A snake may indicate a hidden threat or inner transformation.');
  }
  if (/(fly|flying|يطير|طيران)/.test(t)) {
    lines.push(lang === 'ar' ? 'الطيران يدل على الحرية والطموح — تفكر في أهدافك.' : 'Flying indicates freedom and ambition — consider your goals.');
  }
  if (/(tooth|teeth|سن|أسنان)/.test(t)) {
    lines.push(lang === 'ar' ? 'فقدان الأسنان مرتبط بالقلق حول المظهر أو الخسارة.' : 'Losing teeth is often linked to anxiety about appearance or loss.');
  }
  if (/(death|موت|ميت)/.test(t)) {
    lines.push(lang === 'ar' ? 'الموت في الحلم عادةً يرمز إلى نهاية وبداية جديدة أو تغيير هام.' : 'Death in dreams often symbolizes ending and new beginnings or a major change.');
  }

  // Emotions
  if (/(happy|joy|سعيد|فرح)/.test(t)) {
    lines.push(lang === 'ar' ? 'السعادة في الحلم تعكس راحة داخلية أو إنجاز.' : 'Happiness reflects inner comfort or achievement.');
  }
  if (/(fear|panic|خوف|ذعر)/.test(t)) {
    lines.push(lang === 'ar' ? 'الخوف يظهر مخاوفك اليقظة—حاول تحديد مصدره.' : "Fear highlights waking-life anxieties — try to identify its source.");
  }

  // If nothing matched, do a generic interpretation
  if (lines.length === 0) {
    // try to make a mild inference
    const words = t.split(/\s+/).slice(0, 5).join(' ');
    lines.push(lang === 'ar' ? `تفسير عام: رأيت "${words}..." — تأمل السياق وحالتك النفسية.` : `General interpretation: you saw "${words}..." — reflect on context and your emotional state.`);
  }

  // Add advice
  const advice = lang === 'ar' ? 'نصيحة: سجِّل مشاعرك وحاول ربطها بأحداث اليوم.' : 'Advice: log your feelings and try relating them to recent events.';
  lines.push(advice);

  return lines.join('\n\n');
}

export default function DreamInterpreterApp() {
  const [lang, setLang] = useState('ar');
  const t = translations[lang];
  const [theme, setTheme] = useState('modern');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [saved, setSaved] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    // load saved dreams
    try {
      const raw = localStorage.getItem('dreams_v1');
      if (raw) setSaved(JSON.parse(raw));
    } catch (e) { console.warn(e); }
  }, []);

  useEffect(() => {
    localStorage.setItem('dreams_v1', JSON.stringify(saved));
  }, [saved]);

  function handleAnalyze() {
    const interpreted = analyzeDreamText(input, lang === 'ar' ? 'ar' : 'en');
    setResult(interpreted);
  }

  function handleSave() {
    if (!input.trim()) return;
    const item = {
      id: Date.now(),
      lang: lang,
      text: input.trim(),
      interpretation: result || analyzeDreamText(input, lang === 'ar' ? 'ar' : 'en'),
      createdAt: new Date().toISOString()
    };
    setSaved([item, ...saved]);
    // small feedback
    setInput('');
    setResult('');
    inputRef.current?.focus();
  }

  function clearAll() {
    if (!confirm(lang === 'ar' ? 'عايز تمسح كل الأحلام المحفوظة؟' : 'Clear all saved dreams?')) return;
    setSaved([]);
  }

  function downloadSaved() {
    const blob = new Blob([JSON.stringify(saved, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dreams.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function removeOne(id) {
    setSaved(saved.filter(s => s.id !== id));
  }

  // theme classes
  const themeClasses = {
    modern: 'bg-white text-gray-900',
    traditional: 'bg-amber-50 text-amber-900',
    colorful: 'bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 text-gray-900'
  };

  return (
    <div className={`min-h-screen p-6 ${themeClasses[theme]} transition-all`}>
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t.appTitle}</h1>
            <p className="text-sm opacity-80">{t.subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm">{t.themeLabel}:</label>
              <select value={theme} onChange={e => setTheme(e.target.value)} className="p-1 rounded border">
                {THEMES.map(th => <option key={th.id} value={th.id}>{th.name[lang]}</option>)}
              </select>
            </div>

            <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="px-3 py-1 border rounded">{t.langSwitch}</button>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="p-4 rounded-lg shadow-sm bg-white/80">
            <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} placeholder={t.placeholder} rows={8}
              className="w-full p-3 border rounded focus:outline-none focus:ring" />

            <div className="flex gap-2 mt-3">
              <button onClick={handleAnalyze} className="px-4 py-2 bg-blue-600 text-white rounded">{t.analyze}</button>
              <button onClick={handleSave} className="px-4 py-2 border rounded">{t.save}</button>
              <button onClick={() => { setInput(''); setResult(''); }} className="px-3 py-2 border rounded">Clear</button>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">{t.examplesTitle}</h3>
              <div className="flex gap-2 mt-2 flex-wrap">
                {SYMBOLS.map(s => (
                  <button key={s.key} onClick={() => setInput(prev => prev ? prev + ' ' + (lang==='ar'? s.ar || s.key : s.en) : (lang==='ar'? s.ar: s.en))} className="px-3 py-1 border rounded text-sm">{lang==='ar'? s.ar: s.en}</button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">{lang==='ar'? 'النتيجة' : 'Result'}</h3>
              <pre className="whitespace-pre-wrap p-3 bg-gray-50 rounded mt-2 min-h-[6rem]">{result || (lang==='ar'? 'مافي تفسير بعد.' : 'No interpretation yet.')}</pre>
            </div>

          </section>

          <aside className="p-4 rounded-lg shadow-sm bg-white/80">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{t.savedList}</h3>
              <div className="flex gap-2">
                <button onClick={downloadSaved} className="px-2 py-1 border rounded">{t.download}</button>
                <button onClick={clearAll} className="px-2 py-1 border rounded">{t.clearAll}</button>
              </div>
            </div>

            <div className="mt-3 space-y-3 max-h-[48vh] overflow-auto pr-2">
              {saved.length === 0 && <div className="text-sm opacity-70">{t.noDreams}</div>}

              {saved.map(item => (
                <article key={item.id} className="p-3 border rounded bg-white">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs opacity-70">{new Date(item.createdAt).toLocaleString()}</div>
                    <div className="flex gap-1">
                      <button title="remove" onClick={() => removeOne(item.id)} className="text-sm px-2">✖</button>
                    </div>
                  </div>

                  <div className="mt-2 text-sm"><strong>{lang==='ar'? 'الحلم:' : 'Dream:'}</strong> {item.text}</div>
                  <div className="mt-2 text-sm whitespace-pre-wrap"><strong>{lang==='ar'? 'التفسير:' : 'Interpretation:'}</strong> {item.interpretation}</div>
                </article>
              ))}
            </div>

            <div className="mt-4">
              <h4 className="font-semibold">{t.topicsTitle}</h4>
              <ul className="mt-2 space-y-1 text-sm opacity-80">
                <li>- {lang==='ar'? 'الرؤى الصالحة وأدلة لها' : 'Good visions and how to note them'}</li>
                <li>- {lang==='ar'? 'كيف تربط أحلامك بالمواقف اليومية' : 'How to relate dreams to daily events'}</li>
                <li>- {lang==='ar'? 'تمارين لتذكر الأحلام' : 'Exercises to remember dreams'}</li>
              </ul>
            </div>

          </aside>
        </main>

        <footer className="mt-6 text-center text-sm opacity-70">
          <div>Built with ❤️ — single-file demo. Connect to a server or model for deeper NLP interpretations.</div>
        </footer>

      </div>
    </div>
  );
}
REPLICATE_API_TOKEN=your_replicate_api_token_here
OPENAI_API_KEY=your_openai_api_key_here
{
  "version": 2,
  "builds": [
    { "src": "src/api/interpreter.js", "use": "@vercel/node" },
    { "src": "vite.config.js", "use": "@vercel/static-build", "config": { "distDir": "dist" } }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "src/api/$1" },
    { "src": "/(.*)", "dest": "/" }
  ]
}
# 🌙 Dream Interpreter / مفسر الأحلام

تطبيق ويب حديث لتفسير الأحلام باللغتين العربية والإنجليزية.
يتيح للمستخدم كتابة الحلم، تفسيره تلقائيًا عبر نموذج ذكاء اصطناعي (Replicate أو OpenAI)،
مع إمكانية حفظ وتصدير التفسيرات.

## 🚀 المميزات
- دعم لغتين (عربي / إنجليزي)
- حفظ محلي للأحلام
- واجهة بسيطة بثلاثة ثيمات
- جاهز للربط بـ API (Replicate أو OpenAI)
- نشر مباشر عبر Vercel

## ⚙️ الإعداد
```bash
git clone https://github.com/yourusername/dream-interpreter.git
cd dream-interpreter
npm install
cp .env.example .env
npm run dev
