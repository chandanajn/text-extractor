import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

const ImageUploader = ({ onUpload, isUploading }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Only JPG and PNG are supported');
      return;
    }
    onUpload(file);
  };

  return (
    <div 
      className="glass-panel"
      style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        border: isDragOver ? '2px dashed var(--accent-1)' : '1px solid var(--border-light)',
        transition: 'all 0.3s ease',
        backgroundColor: isDragOver ? 'rgba(139, 92, 246, 0.05)' : 'var(--bg-card)',
        cursor: isUploading ? 'not-allowed' : 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isUploading && fileInputRef.current.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleChange} 
        accept="image/png, image/jpeg" 
        style={{ display: 'none' }}
        disabled={isUploading}
      />
      
      {isUploading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div className="skeleton" style={{ width: '80px', height: '80px', borderRadius: '50%' }}></div>
          <div className="skeleton" style={{ width: '200px', height: '24px' }}></div>
          <div className="skeleton" style={{ width: '150px', height: '16px' }}></div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            background: 'rgba(139, 92, 246, 0.1)', 
            padding: '1.5rem', 
            borderRadius: '50%',
            color: 'var(--accent-1)'
          }}>
            <UploadCloud size={48} strokeWidth={1.5} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 500 }}>
            Drag & drop an image to extract text
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>or click to browse from your computer</p>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <ImageIcon size={16} /> Supports PNG, JPG
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
