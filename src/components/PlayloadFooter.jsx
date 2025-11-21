import React from 'react';

/**
 * Playload.org footer component
 * Fixed to bottom of screen with hover interaction
 */
const PlayloadFooter = () => {
  return (
    <footer style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100vw',
      backgroundColor: '#000000',
      padding: '0.4rem 0',
      zIndex: 9999,
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <a
          href="https://playloadorg.github.io/landing-main-1/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#ffffff',
            fontSize: '0.75rem',
            textDecoration: 'none',
            transition: 'opacity 0.3s ease',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '0.7'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          POWERED BY PLAYLOAD.ORG
        </a>
      </div>
    </footer>
  );
};

export default PlayloadFooter;