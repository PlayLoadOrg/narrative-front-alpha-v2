import React, { useState, useEffect, useRef } from 'react';
import { Typewriter } from './Typewriter';
import { User, Shield } from 'lucide-react';

/**
 * Filter Chat Component
 * Simulates a chat interface where Filter's messages appear
 */
export function FilterChat({ messages, t }) {
  const chatEndRef = useRef(null);
  const [displayedMessages, setDisplayedMessages] = useState([]);

  // Add messages one at a time with slight delay
  useEffect(() => {
    if (messages.length === 0) {
      setDisplayedMessages([]);
      return;
    }

    setDisplayedMessages([]); // Reset
    
    messages.forEach((msg, index) => {
      setTimeout(() => {
        setDisplayedMessages(prev => [...prev, msg]);
      }, index * 100); // Stagger message appearance
    });
  }, [messages]);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayedMessages]);

  if (messages.length === 0) {
    return (
      <div className="filter-chat-container">
        <div className="filter-chat-empty">
          <Shield size={32} className="filter-icon-large" />
          <p>{t('game.filterChatPlaceholder')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="filter-chat-container">
      <div className="filter-chat-messages">
        {displayedMessages.map((message, index) => (
          <div 
            key={index} 
            className={`chat-message ${message.sender === 'filter' ? 'filter-message' : 'system-message'}`}
          >
            <div className="message-avatar">
              {message.sender === 'filter' ? (
                <Shield size={20} />
              ) : (
                <User size={20} />
              )}
            </div>
            <div className="message-content">
              <div className="message-sender">
                {message.sender === 'filter' ? 'Filter' : 'System'}
              </div>
              <div className="message-text">
                {index === displayedMessages.length - 1 ? (
                  <Typewriter text={message.text} />
                ) : (
                  message.text
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}

/**
 * Helper function to create message objects
 */
export function createFilterMessage(text) {
  return {
    sender: 'filter',
    text,
    timestamp: Date.now()
  };
}

export function createSystemMessage(text) {
  return {
    sender: 'system',
    text,
    timestamp: Date.now()
  };
}