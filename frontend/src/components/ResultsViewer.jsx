import React, { useState } from 'react';
import { Copy, CheckCircle2, FileText, Image as ImageIcon } from 'lucide-react';

const ResultsViewer = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.extracted_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText className="text-gradient" /> Extraction Result
        </h3>
        <button 
          onClick={handleCopy}
          style={{
            background: copied ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${copied ? '#10b981' : 'var(--border-light)'}`,
            color: copied ? '#10b981' : 'var(--text-primary)',
            padding: '0.5rem 1rem',
            borderRadius: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontWeight: 500
          }}
        >
          {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy Text'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem', minHeight: '350px' }}>
        {/* Left: Image Preview or Placeholder */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '1rem',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          {result.imageUrl ? (
            <img 
              src={result.imageUrl} 
              alt="Uploaded" 
              style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '0.5rem' }} 
            />
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              <ImageIcon size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
              <p>Image preview unavailable from history</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>{result.filename}</p>
            </div>
          )}
        </div>

        {/* Right: Extracted Text */}
        <div style={{ position: 'relative', height: '100%' }}>
          <textarea
            value={result.extracted_text}
            readOnly
            style={{
              width: '100%',
              height: '100%',
              minHeight: '350px',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '1rem',
              color: 'var(--text-primary)',
              padding: '1.5rem',
              fontSize: '1rem',
              lineHeight: 1.6,
              resize: 'none',
              fontFamily: 'monospace'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultsViewer;
