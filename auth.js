// ── Team Endurance — gedeelde Firebase-config, auth en helpers ──────────
// Zelfde Firebase-project als startlijst.teamendurance.nl. Deze waarden
// zijn niet geheim — de beveiliging zit in de Firestore-regels + het
// gedeelde wachtwoord, niet in het verborgen houden van deze config.

const firebaseConfig = {
  apiKey: "AIzaSyBoVH5U5smbw1yMb0lyyM_Byywhc0zZMfg",
  authDomain: "inschrijving-cc2fd.firebaseapp.com",
  projectId: "inschrijving-cc2fd",
  storageBucket: "inschrijving-cc2fd.firebasestorage.app",
  messagingSenderId: "743684387377",
  appId: "1:743684387377:web:31b348fda29b68a82b9b10",
};

// Zelfde vaste inlog-e-mail als bij de Startlijst — moet overeenkomen met
// de gebruiker die je in Firebase Authentication > Users hebt aangemaakt.
const SHARED_LOGIN_EMAIL = "team@startlijst.app";

const TE = {
  db: null,
  unlocked: false,
  _listeners: [],

  /** Roep dit aan met een functie die (unlocked: boolean) krijgt telkens
   * als de inlogstatus verandert (inclusief direct bij het laden). */
  onAuthChange(fn) {
    this._listeners.push(fn);
    fn(this.unlocked);
  },

  _notify() {
    for (const fn of this._listeners) fn(this.unlocked);
  },

  init() {
    const configWarningEl = document.getElementById("configWarning");
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith("VUL_HIER")) {
      if (configWarningEl) configWarningEl.classList.add("show");
      return;
    }
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    this.db = firebase.firestore();

    const authPillEl = document.getElementById("authPill");
    const unlockFormEl = document.getElementById("unlockForm");
    const pwInputEl = document.getElementById("pwInput");
    const authErrorEl = document.getElementById("authError");

    firebase.auth().onAuthStateChanged((user) => {
      this.unlocked = !!user;
      if (authPillEl) {
        authPillEl.textContent = this.unlocked ? "🔓 Bewerken aan · vergrendelen" : "🔒 Alleen-lezen · ontgrendelen";
        authPillEl.classList.toggle("unlocked", this.unlocked);
      }
      if (this.unlocked && unlockFormEl) unlockFormEl.classList.remove("open");
      this._notify();
    });

    if (authPillEl) {
      authPillEl.addEventListener("click", () => {
        if (this.unlocked) {
          firebase.auth().signOut();
          return;
        }
        unlockFormEl.classList.toggle("open");
        if (unlockFormEl.classList.contains("open")) pwInputEl.focus();
      });
    }

    if (unlockFormEl) {
      unlockFormEl.addEventListener("submit", async (ev) => {
        ev.preventDefault();
        authErrorEl.textContent = "";
        const pw = pwInputEl.value;
        if (!pw) return;
        try {
          await firebase.auth().signInWithEmailAndPassword(SHARED_LOGIN_EMAIL, pw);
          pwInputEl.value = "";
          unlockFormEl.classList.remove("open");
        } catch (e) {
          authErrorEl.textContent = "Wachtwoord onjuist.";
        }
      });
    }
  },
};

document.addEventListener("DOMContentLoaded", () => TE.init());
