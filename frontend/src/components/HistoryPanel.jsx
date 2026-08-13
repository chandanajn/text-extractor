import React from 'react';
import { Clock, RefreshCw, ChevronRight } from 'lucide-react';

const HistoryPanel = ({ history, onRefresh, onSelect }) => {
  return (
    <div className="glass-panel" style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'sticky',
      top: '2rem',
      maxHeight: 'calc(100vh - 4rem)'
    }}>
      <div style={{ 
        padding: '1.5rem', 
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} className="text-gradient" /> 
          Recent Extractions
        </h2>
        <button 
          onClick={onRefresh}
          style={{
            background: 'none', border: 'none', color: 'var(--text-secondary)',
            cursor: 'pointer', padding: '0.5rem', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s', backgroundColor: 'rgba(255,255,255,0.05)'
          }}
          title="Refresh History"
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>
            No recent extractions found.
          </div>
        ) : (
          history.map((record) => (
            <div 
              key={record.id}
              onClick={() => onSelect(record)}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-light)',
                borderRadius: '0.75rem',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ 
                  fontSize: '0.9rem', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  maxWidth: '85%'
                }}>
                  {record.filename}
                </h4>
                <ChevronRight size={16} color="var(--text-secondary)" />
              </div>
              
              <p style={{ 
                fontSize: '0.8rem', 
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {record.extracted_text}
              </p>
              
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-1)', fontWeight: 500 }}>
                {new Date(record.upload_time).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
