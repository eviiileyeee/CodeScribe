import { useState } from 'react';
import CodeEditor from '@/components/CodeEditor';
import LanguageSelector from '@/components/LanguageSelector';

function CodeUploadEditor() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript'); // default language

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: check extension for user feedback
    const allowedExtensions = /\.(js|py|java|ts|cpp|c|cs|rb|go|php|rs|kt|txt)$/i;
    if (!allowedExtensions.test(file.name)) {
      setError('Only code files are allowed.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name);

    const res = await fetch('/api/code/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.status === 'success') {
      setCode(data.code);
    } else {
      setError(data.message || 'Failed to extract code.');
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".js,.py,.java,.ts,.cpp,.c,.cs,.rb,.go,.php,.rs,.kt,.txt"
        onChange={handleFileChange}
      />
      <LanguageSelector label="Select language" value={selectedLanguage} onChange={setSelectedLanguage} />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <CodeEditor value={code} onChange={setCode} language={selectedLanguage} />
    </div>
  );
}

export default CodeUploadEditor; 