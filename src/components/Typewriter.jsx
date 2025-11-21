import { useState, useEffect, useCallback } from 'react';
import { UI_CONFIG } from '../constants';

/**
 * Typewriter effect component for Filter's dialogue
 * Click to skip and complete immediately
 */
export function Typewriter({ text, speed = UI_CONFIG.TYPEWRITER_SPEED, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length && !isComplete) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (currentIndex >= text.length && !isComplete) {
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);

  const handleClick = useCallback(() => {
    if (!isComplete) {
      setDisplayedText(text);
      setCurrentIndex(text.length);
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [isComplete, text, onComplete]);

  return (
    <span 
      onClick={handleClick}
      style={{ cursor: isComplete ? 'default' : 'pointer' }}
      title={isComplete ? '' : 'Click to skip'}
    >
      {displayedText}
      {!isComplete && <span className="typewriter-cursor">▌</span>}
    </span>
  );
}

/**
 * Text with links parser
 * Supports markdown-style links: [link: text](url)
 */
export function TextWithLinks({ text }) {
  if (!text) return null;
  
  const parts = text.split(/(\[link: .*?\]\(.*?\))/g);
  
  return (
    <>
      {parts.map((part, i) => {
        const match = /\[link: (.*?)\]\((.*?)\)/.exec(part);
        if (match) {
          return (
            <a 
              key={i} 
              href={match[2]} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-link"
            >
              {match[1]}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}