# Team Endurance — Management

Hub met drie onderdelen:
- **Inschrijvingen** — link naar je bestaande `startlijst.teamendurance.nl` (ongewijzigd).
- **Financiën** — betaalstatus per race (leest dezelfde inschrijvingen) + een inkomsten/uitgaven-boekhouding.
- **Training** — opbouwschema met opdrachten, apart voor een droog- en een nat-scenario.

Zelfde Firebase-project als de Startlijst (je hoeft geen nieuw project aan te maken), zelfde gedeelde wachtwoord, zelfde beveiligingsprincipe: iedereen met de link kan lezen, alleen wie het wachtwoord invoert kan bewerken.

## 1. Firestore-regels bijwerken (eenmalig)

In de Firebase Console (hetzelfde project als bij de Startlijst) → **Firestore Database → Rules** → vervang de inhoud door die van `firestore.rules` in dit mapje → **Publish**.

Dit voegt twee nieuwe collecties toe (`finance` en `training`) naast de bestaande `invites` — de regel voor `invites` blijft hetzelfde als voorheen, dus de Startlijst blijft gewoon werken.

Verder hoef je in Firebase niks aan te passen: dezelfde gebruiker (e-mail + wachtwoord) bij Authentication werkt ook hier, want `auth.js` in dit mapje bevat dezelfde `firebaseConfig` en hetzelfde `SHARED_LOGIN_EMAIL` als je Startlijst.

## 2. Naar GitHub pushen

Maak een nieuwe **publieke** GitHub-repo aan, bijvoorbeeld `management`. Voer dan in dit mapje uit:

```bash
git init
git add .
git commit -m "Team Endurance management hub"
git branch -M main
git remote add origin https://github.com/sanderweg/management.git
git push -u origin main
```

## 3. GitHub Pages aanzetten

Repo → **Settings → Pages** → **Source**: Deploy from a branch → branch `main`, map `/ (root)` → **Save**. Daarna bij **Custom domain**: `management.teamendurance.nl` → **Save**.

## 4. DNS bij TransIP

mijn.transip.nl → Domeinen → `teamendurance.nl` → tabblad **DNS** → nieuwe regel:

- **Naam**: `management`
- **Type**: `CNAME`
- **Waarde**: `sanderweg.github.io.`

**DNS Opslaan.** Na een paar minuten tot een uur kun je in GitHub Pages op **Check again** klikken tot de DNS-check en **Enforce HTTPS** slagen (zelfde proces als bij de Startlijst).

## Gebruik

- `management.teamendurance.nl` toont de hub met drie tegels.
- **Financiën**: bovenaan per race wie nog moet betalen en wie al heeft betaald (gebaseerd op de status in Inschrijvingen), daaronder een overzicht met totalen en een boekhouding waar je (na ontgrendelen) inkomsten/uitgaven kunt toevoegen.
- **Training**: schakel tussen **☀️ Droog** en **🌧️ Nat** bovenaan. Voeg (na ontgrendelen) trainingsblokken toe, en per blok losse opdrachten.
- Eenmaal ontgrendeld op één pagina binnen `management.teamendurance.nl` blijf je ontgrendeld op de andere pagina's van dit domein (zelfde website, zelfde login) — alleen de aparte `startlijst.teamendurance.nl` heeft zijn eigen keer ontgrendelen nodig, want dat is een ander (sub)domein.

## Later uitbreiden

- Extra statussen, velden of pagina's: bewerk het bijbehorende `.html`-bestand, commit, push.
- Gedeelde stijl staat in `style.css`, gedeelde login-logica in `auth.js` — wijzigingen daarin werken door op alle pagina's.
