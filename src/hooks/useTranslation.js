import { useState, useEffect } from 'react';
import { DEFAULT_LANGUAGE } from '../constants';

/**
 * Translation Hook
 * Loads and provides translation strings
 */
export function useTranslation(language = DEFAULT_LANGUAGE) {
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setLoading(true);
        // Use absolute path from src root
        const data = await import(`../data/i18n/${language}.json`);
        setTranslations(data.default || data);
      } catch (error) {
        console.error(`Failed to load translations for language: ${language}`, error);
        setTranslations({});
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  /**
   * Get translation by dot-notation key
   * Example: t('start.title') returns translations.start.title
   */
  const t = (key) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key; // Return key itself if translation missing
      }
    }
    
    return value;
  };

  return { t, loading, translations };
}