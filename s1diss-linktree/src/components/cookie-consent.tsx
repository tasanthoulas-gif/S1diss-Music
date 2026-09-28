import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Settings2, ShieldCheck, X } from "lucide-react";

type ConsentChoices = { externalContent: boolean };
type StoredConsent = {
  status: "accepted" | "rejected" | "customized";
  choices: ConsentChoices;
  timestamp: string;
  version: string;
};

type ConsentContextValue = {
  consent: StoredConsent | null;
  isReady: boolean;
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  saveChoices: (choices: ConsentChoices) => void;
  hasExternalContentConsent: boolean;
};

const CONSENT_VERSION = "2026-09-28-v1";
const CONSENT_STORAGE_KEY = "s1dis_cookie_consent";
const defaultChoices: ConsentChoices = { externalContent: false };
const ConsentContext = createContext<ConsentContextValue | null>(null);

function readConsent(): StoredConsent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (
      parsed.version !== CONSENT_VERSION ||
      typeof parsed.timestamp !== "string" ||
      !parsed.choices ||
      typeof parsed.choices.externalContent !== "boolean" ||
      !["accepted", "rejected", "customized"].includes(parsed.status ?? "")
    ) {
      return null;
    }
    return {
      status: parsed.status as StoredConsent["status"],
      choices: { externalContent: parsed.choices.externalContent },
      timestamp: parsed.timestamp,
      version: CONSENT_VERSION,
    };
  } catch {
    return null;
  }
}

function writeConsent(
  status: StoredConsent["status"],
  choices: ConsentChoices,
): StoredConsent {
  const value: StoredConsent = {
    status,
    choices: { ...choices },
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Keep the choice in memory when browser storage is unavailable.
  }
  return value;
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<StoredConsent | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setIsReady(true);
    const handleStorage = () => setConsent(readConsent());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    const fontStylesheet = document.getElementById("s1dis-external-fonts");
    if (consent?.choices.externalContent) {
      if (!fontStylesheet) {
        const link = document.createElement("link");
        link.id = "s1dis-external-fonts";
        link.rel = "stylesheet";
        link.href =
          "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap";
        document.head.appendChild(link);
      }
    } else {
      fontStylesheet?.remove();
    }
  }, [consent]);

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);
  const saveChoices = useCallback((choices: ConsentChoices) => {
    const status = choices.externalContent ? "accepted" : "customized";
    setConsent(writeConsent(status, choices));
    setSettingsOpen(false);
  }, []);
  const acceptAll = useCallback(() => {
    setConsent(writeConsent("accepted", { externalContent: true }));
    setSettingsOpen(false);
  }, []);
  const rejectNonEssential = useCallback(() => {
    setConsent(writeConsent("rejected", defaultChoices));
    setSettingsOpen(false);
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      isReady,
      settingsOpen,
      openSettings,
      closeSettings,
      acceptAll,
      rejectNonEssential,
      saveChoices,
      hasExternalContentConsent: consent?.choices.externalContent === true,
    }),
    [
      acceptAll,
      closeSettings,
      consent,
      isReady,
      openSettings,
      rejectNonEssential,
      saveChoices,
      settingsOpen,
    ],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useCookieConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useCookieConsent must be used inside CookieConsentProvider");
  }
  return context;
}

function Banner() {
  const { acceptAll, rejectNonEssential, openSettings } = useCookieConsent();
  return (
    <aside className="cookie-banner" aria-label="Επιλογές cookies">
      <div className="cookie-banner__copy">
        <div className="cookie-banner__eyebrow">
          <ShieldCheck size={16} aria-hidden /> Απόρρητο και επιλογές
        </div>
        <h2>Επιλέξτε πώς θα χρησιμοποιείται το εξωτερικό περιεχόμενο</h2>
        <p>
          Το Spotify player και οι γραμματοσειρές Google φορτώνουν μόνο αν το
          επιλέξετε. Μπορείτε να αλλάξετε την επιλογή σας οποιαδήποτε στιγμή από
          τις ρυθμίσεις cookies.
        </p>
      </div>
      <div className="cookie-banner__actions">
        <button type="button" className="cookie-button cookie-button--primary" onClick={acceptAll}>
          Αποδοχή όλων
        </button>
        <button type="button" className="cookie-button cookie-button--secondary" onClick={rejectNonEssential}>
          Απόρριψη μη απαραίτητων
        </button>
        <button type="button" className="cookie-button cookie-button--link" onClick={openSettings}>
          Ρυθμίσεις Cookies
        </button>
      </div>
    </aside>
  );
}

function SettingsDialog() {
  const {
    consent,
    settingsOpen,
    closeSettings,
    acceptAll,
    rejectNonEssential,
    saveChoices,
  } = useCookieConsent();
  const [externalContent, setExternalContent] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!settingsOpen) return;
    setExternalContent(consent?.choices.externalContent === true);
    closeButton.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSettings();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeSettings, consent, settingsOpen]);

  if (!settingsOpen) return null;
  return (
    <div className="cookie-modal-backdrop" role="presentation">
      <section
        className="cookie-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-settings-title"
        aria-describedby="cookie-settings-description"
      >
        <div className="cookie-modal__header">
          <div>
            <div className="cookie-banner__eyebrow">
              <Settings2 size={16} aria-hidden /> Διαχείριση συγκατάθεσης
            </div>
            <h2 id="cookie-settings-title">Ρυθμίσεις Cookies</h2>
          </div>
          <button
            ref={closeButton}
            type="button"
            className="cookie-icon-button"
            onClick={closeSettings}
            aria-label="Κλείσιμο ρυθμίσεων"
          >
            <X size={20} aria-hidden />
          </button>
        </div>
        <p id="cookie-settings-description" className="cookie-modal__intro">
          Οι απαραίτητες τεχνολογίες είναι πάντα ενεργές. Το Spotify και οι
          γραμματοσειρές Google παραμένουν απενεργοποιημένα μέχρι να δώσετε
          συγκατάθεση.
        </p>
        <div className="cookie-category cookie-category--locked">
          <div>
            <h3>Απαραίτητες τεχνολογίες</h3>
            <p>Αποθήκευση της επιλογής συγκατάθεσης για να θυμάται η σελίδα τις ρυθμίσεις σας.</p>
          </div>
          <span className="cookie-status">Πάντα ενεργές</span>
        </div>
        <label className="cookie-category cookie-category--toggle" htmlFor="external-content-toggle">
          <div>
            <h3>Εξωτερικό περιεχόμενο</h3>
            <p>Spotify player και γραμματοσειρές Google. Οι πάροχοι μπορεί να λαμβάνουν τεχνικά δεδομένα σύνδεσης.</p>
          </div>
          <input
            id="external-content-toggle"
            type="checkbox"
            checked={externalContent}
            onChange={(event) => setExternalContent(event.target.checked)}
          />
          <span className="cookie-toggle" aria-hidden><span /></span>
        </label>
        <div className="cookie-modal__actions">
          <button type="button" className="cookie-button cookie-button--secondary" onClick={rejectNonEssential}>
            Απόρριψη μη απαραίτητων
          </button>
          <button type="button" className="cookie-button cookie-button--secondary" onClick={() => saveChoices({ externalContent })}>
            Αποθήκευση επιλογών
          </button>
          <button type="button" className="cookie-button cookie-button--primary" onClick={acceptAll}>
            Αποδοχή όλων
          </button>
        </div>
      </section>
    </div>
  );
}

export function CookieConsentManager() {
  const { consent, isReady } = useCookieConsent();
  if (!isReady) return null;
  return <>{consent === null && <Banner />}<SettingsDialog /></>;
}