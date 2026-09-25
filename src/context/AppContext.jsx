import { useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import AppContext from './app-context.js';
import {
  DEFAULT_SETTINGS,
  SEED_DOCUMENTS,
  convertQuoteToInvoice,
  normalizeDocuments,
  normalizeSettings,
  setDocumentStatus,
} from '../utils/documents.js';

export function AppProvider({ children }) {
  const [documents, setDocuments] = useLocalStorage(
    'fi_docs',
    SEED_DOCUMENTS,
    normalizeDocuments,
  );
  const [settings, setSettings] = useLocalStorage(
    'fi_settings',
    DEFAULT_SETTINGS,
    normalizeSettings,
  );

  const value = useMemo(
    () => ({
      documents,
      settings,
      addDocument(document) {
        setDocuments((current) => [document, ...current]);
      },
      updateStatus(id, status) {
        setDocuments((current) => setDocumentStatus(current, id, status));
      },
      convertQuote(id) {
        const quote = documents.find((document) => document.id === id);
        if (!quote || quote.type !== 'Quote') return null;
        const converted = convertQuoteToInvoice(quote, documents);
        setDocuments((current) => [converted, ...current]);
        return converted;
      },
      saveSettings(nextSettings) {
        setSettings(normalizeSettings(nextSettings));
      },
    }),
    [documents, setDocuments, settings, setSettings],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
