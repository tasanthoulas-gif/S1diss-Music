import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useCookieConsent } from "../components/cookie-consent";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [
      { title: "Πολιτική Cookies — S1diss" },
      {
        name: "description",
        content: "Πληροφορίες για τα cookies και το εξωτερικό περιεχόμενο του S1diss.",
      },
    ],
  }),
  component: CookiePolicy,
});

function CookiePolicy() {
  const { openSettings } = useCookieConsent();
  return (
    <main className="policy-page">
      <article className="policy-card">
        <Link to="/" className="policy-back">
          <ArrowLeft size={16} aria-hidden /> Επιστροφή
        </Link>
        <div className="policy-kicker">
          <ShieldCheck size={18} aria-hidden /> S1diss · Πολιτική Cookies
        </div>
        <h1>Πολιτική Cookies</h1>
        <p className="policy-lead">
          Εδώ περιγράφονται οι τεχνολογίες αποθήκευσης και οι εξωτερικές υπηρεσίες που χρησιμοποιεί ο ιστότοπος.
        </p>

        <h2>1. Απαραίτητη αποθήκευση</h2>
        <p>
          Το localStorage χρησιμοποιείται για να θυμάται την επιλογή σας σχετικά με το εξωτερικό περιεχόμενο. Δεν χρησιμοποιούμε analytics, διαφημιστικά pixels ή marketing trackers.
        </p>
        <div className="policy-inventory">
          <div>
            <strong><code>s1dis_cookie_consent</code></strong>
            <span>First-party localStorage item με την επιλογή, την ημερομηνία και την έκδοση της συγκατάθεσης. Απαραίτητο για να αποθηκεύονται οι ρυθμίσεις σας.</span>
          </div>
        </div>

        <h2>2. Εξωτερικό περιεχόμενο</h2>
        <p>
          Το Spotify player και οι γραμματοσειρές Google δεν φορτώνονται πριν δώσετε συγκατάθεση στην κατηγορία «Εξωτερικό περιεχόμενο». Οι υπηρεσίες αυτές μπορεί να λαμβάνουν τεχνικά δεδομένα, όπως τη διεύθυνση IP, και να εφαρμόζουν δικές τους πολιτικές.
        </p>
        <div className="policy-inventory">
          <div>
            <strong>Spotify Embed</strong>
            <span>Πάροχος: Spotify AB · αναπαραγωγή μουσικής · φορτώνεται μόνο μετά από συγκατάθεση.</span>
          </div>
          <div>
            <strong>Google Fonts</strong>
            <span>Πάροχος: Google LLC · γραμματοσειρές Syne και Inter · φορτώνονται μόνο μετά από συγκατάθεση.</span>
          </div>
        </div>

        <h2>3. Αλλαγή ή ανάκληση</h2>
        <p>
          Μπορείτε να αλλάξετε ή να ανακαλέσετε την επιλογή σας οποιαδήποτε στιγμή από τις ρυθμίσεις cookies. Η ανάκληση σταματά τις μελλοντικές φορτώσεις των εξωτερικών υπηρεσιών.
        </p>
        <button type="button" className="cookie-button cookie-button--primary policy-button" onClick={openSettings}>
          Άνοιγμα Ρυθμίσεων Cookies
        </button>

        <h2>4. Ενημερώσεις</h2>
        <p>
          Η πολιτική μπορεί να ενημερώνεται όταν αλλάζουν οι τεχνολογίες του ιστότοπου. Η παρούσα τεχνική περιγραφή δεν αποτελεί νομική συμβουλή ή εγγύηση συμμόρφωσης.
        </p>
        <p className="policy-note">Τελευταία ενημέρωση: 28 Σεπτεμβρίου 2026.</p>
      </article>
    </main>
  );
}