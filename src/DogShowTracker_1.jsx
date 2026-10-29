import React, { useState, useEffect } from 'react';
import { Plus, X, Check, Trophy, Pencil, Trash2, MapPin, House, CalendarDays, Target, PawPrint, ChevronRight } from 'lucide-react';

const STORAGE_KEYS = {
  dogs: 'dogshow_dogs',
  shows: 'dogshow_shows',
  goals: 'dogshow_goals',
};

const CERT_TYPES = [
  { code: 'CERT', short: 'CERT', full: 'CERT (Certificate)' },
  { code: 'STORCERT', short: 'STOR', full: 'Storcert (CERT på stor utstilling)' },
  { code: 'RCERT', short: 'RES', full: 'Reserve Certificate (R-CERT)' },
  { code: 'JUNCERT', short: 'JUN', full: 'Junior/Veteran Certificate (JUN/VET CERT)' },
  { code: 'CACIB', short: 'CACIB', full: 'CACIB' },
  { code: 'CACIBJ', short: 'C-J', full: 'Junior CACIB (CACIB-J)' },
  { code: 'CACIT', short: 'CACIT', full: 'CACIT' },
  { code: 'BIR', short: 'BIR', full: 'Best of Breed (BIR)' },
  { code: 'BIM', short: 'BIM', full: 'Best of Breed, opposite sex (BIM)' },
  { code: 'BIS', short: 'BIS', full: 'Best in Show (BIS)' },
];

const DEFAULT_CERTS = { CERT: false, STORCERT: false, RCERT: false, JUNCERT: false, CACIB: false, CACIBJ: false, CACIT: false, BIR: false, BIM: false, BIS: false };

const CLASSES = ['Baby (4-6 mnd)', 'Valp (6-9 mnd)', 'Junior (9-18 mnd)', 'Unghund (15-24 mnd)', 'Åpen', 'Bruk', 'Champion', 'Veteran', 'Annet'];

const QUALITY_GRADES = ['Excellent', 'Very Good', 'Good', 'Sufficient', 'Disqualified', 'Absent'];

const PLACEMENTS = ['1', '2', '3', '4', '-'];

const GOAL_TEMPLATES = [
  {
    key: 'nuch',
    title: 'Norsk Utstillingschampion (N UCH)',
    trackedCert: 'CERT',
    targetCount: 3,
    trackDistinctJudges: true,
    minDistinctJudges: 3,
    trackDistinctCountries: false,
    minDistinctCountries: 1,
    requiredStorcerts: 1,
    minAgeMonthsForOne: 24,
    onlyCountry: 'Norway',
    description:
      'Tre CERT på utstilling i Norge under tre ulike dommere. Minst ett må være storcert, og minst ett må være vunnet ved fylte 24 måneder.',
  },
  {
    key: 'cib',
    title: 'International Champion (C.I.B.)',
    trackedCert: 'CACIB',
    targetCount: 4,
    trackDistinctJudges: true,
    minDistinctJudges: 3,
    trackDistinctCountries: true,
    minDistinctCountries: 3,
    description:
      "Needs 4 CACIBs from at least 3 countries under at least 3 different judges, with at least 1 year and 1 day between the first and last CACIB. The dog must be at least 3 years old when the title is confirmed.",
  },
  {
    key: 'custom',
    title: '',
    trackedCert: 'CERT',
    targetCount: 3,
    trackDistinctJudges: false,
    minDistinctJudges: 1,
    trackDistinctCountries: false,
    minDistinctCountries: 1,
    description: '',
  },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

.dst-app * { box-sizing: border-box; }
.dst-app {
  --ink-bg:#16241D; --ink-bg-2:#1F3328; --surface:#FBF7EC; --surface-2:#F2ECDC;
  --ink:#2B2B26; --ink-soft:#6E6B5C; --cream:#F2ECDD; --cream-soft:#C9C4B2;
  --brass:#C9A227; --brass-ink:#8A6A14; --brass-soft:rgba(201,162,39,0.16);
  --rust:#C0684A; --sage:#6E9C76; --line:rgba(242,236,221,0.16); --line-dark:rgba(43,43,38,0.12);
  background:var(--ink-bg); color:var(--cream); min-height:100vh;
  font-family:'Work Sans',sans-serif;
}
.dst-display{ font-family:'Fraunces',serif; }
.dst-mono{ font-family:'IBM Plex Mono',monospace; }
.dst-card{ background:var(--surface); color:var(--ink); box-shadow:0 1px 2px rgba(0,0,0,0.18); }
.dst-tabbar{ display:flex; gap:0.5rem; overflow-x:auto; padding-bottom:0.35rem; margin-bottom:1.25rem; -webkit-overflow-scrolling:touch; }
.dst-tab{ font-weight:600; font-size:0.85rem; padding:0.5rem 1.1rem; border-radius:999px; border:1px solid var(--line); background:transparent; color:var(--cream-soft); cursor:pointer; white-space:nowrap; transition:all 0.15s; }
.dst-tab.active{ background:var(--brass); color:#2B2200; border-color:var(--brass); }
.dst-tab:hover:not(.active){ border-color:var(--brass); color:var(--cream); }
.dst-seg{ display:flex; gap:0.4rem; margin-bottom:1rem; }
.dst-seg-btn{ font-weight:600; font-size:0.8rem; padding:0.4rem 0.95rem; border-radius:999px; border:1px solid var(--line); background:transparent; color:var(--cream-soft); cursor:pointer; }
.dst-seg-btn.active{ background:var(--surface); color:var(--ink); border-color:var(--surface); }
.dst-input,.dst-select,.dst-textarea{ width:100%; padding:0.6rem 0.75rem; border-radius:10px; border:1px solid var(--line); background:rgba(242,236,221,0.06); color:var(--cream); font-family:'Work Sans',sans-serif; font-size:1rem; color-scheme:dark; }
.dst-app input[type=checkbox]{ accent-color:var(--brass); }
.dst-select option{ background:var(--ink-bg-2); color:var(--cream); }
.dst-textarea{ resize:vertical; }
.dst-input:focus,.dst-select:focus,.dst-textarea:focus{ outline:2px solid var(--brass); outline-offset:1px; border-color:var(--brass); }
.dst-label{ font-size:0.72rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--cream-soft); margin-bottom:0.3rem; display:block; font-weight:700; }
.dst-btn-primary{ background:var(--brass); color:#2B2200; border:none; border-radius:12px; padding:0.6rem 1.2rem; font-weight:700; font-size:0.875rem; cursor:pointer; font-family:'Work Sans',sans-serif; }
.dst-btn-primary[disabled]{ opacity:0.5; cursor:default; }
.dst-btn-secondary{ background:transparent; color:var(--cream); border:1px solid var(--line); border-radius:12px; padding:0.55rem 1rem; font-weight:600; font-size:0.85rem; cursor:pointer; display:inline-flex; align-items:center; gap:0.4rem; font-family:'Work Sans',sans-serif; }
.dst-btn-secondary:hover{ border-color:var(--brass); color:var(--brass); }
.dst-btn-light{ background:transparent; border:1px solid var(--line); color:var(--cream-soft); border-radius:10px; padding:0.4rem 0.85rem; font-size:0.8rem; cursor:pointer; font-weight:600; display:inline-flex; align-items:center; gap:0.35rem; font-family:'Work Sans',sans-serif; }
.dst-btn-light:hover{ background:rgba(242,236,221,0.08); }
.dst-btn-light.danger{ color:#E39A80; border-color:rgba(227,154,128,0.5); }
.dst-chip{ display:inline-flex; align-items:center; gap:0.35rem; padding:0.4rem 0.75rem; border-radius:999px; border:1px solid var(--line); font-size:0.8rem; cursor:pointer; background:transparent; color:var(--cream); font-weight:600; font-family:'Work Sans',sans-serif; text-align:left; }
.dst-chip.checked{ background:rgba(201,162,39,0.18); border-color:var(--brass); color:#E3C45A; }
.dst-select-dark{ background:var(--ink-bg-2); color:var(--cream); border:1px solid var(--line); border-radius:10px; padding:0.45rem 0.6rem; font-family:'Work Sans',sans-serif; font-size:0.85rem; }
.dst-sheet{ background:var(--ink-bg-2); color:var(--cream); border:1px solid var(--line); box-shadow:0 12px 32px rgba(0,0,0,0.45); --ink:var(--cream); --ink-soft:var(--cream-soft); --line-dark:var(--line); --brass-ink:#E3C45A; --surface-2:rgba(242,236,221,0.08); }
.dst-panel{ background:var(--ink-bg-2); border-radius:16px; padding:1rem; }
.dst-panel-label{ font-size:0.75rem; color:var(--cream-soft); }
.dst-avatar{ width:64px; height:64px; border-radius:50%; overflow:hidden; background:var(--brass); color:var(--ink-bg); display:flex; align-items:center; justify-content:center; flex-shrink:0; border:2px solid var(--brass); }
.dst-avatar img{ width:100%; height:100%; object-fit:cover; display:block; }
.dst-badge{ display:inline-block; font-size:0.72rem; font-weight:600; padding:0.2rem 0.6rem; border-radius:8px; background:rgba(242,236,221,0.12); color:var(--cream); }
.dst-badge.brass{ background:rgba(201,162,39,0.22); color:#E3C45A; }
.dst-bar{ height:6px; background:rgba(242,236,221,0.16); border-radius:3px; overflow:hidden; }
.dst-bar > div{ height:100%; background:var(--brass); border-radius:3px; transition:width 0.3s; }
.dst-link{ background:none; border:none; color:var(--brass); font-weight:600; font-size:0.85rem; cursor:pointer; display:inline-flex; align-items:center; gap:0.2rem; padding:0; font-family:'Work Sans',sans-serif; }
.dst-btn-brass,.dst-btn-ghost{ background:transparent; border-radius:10px; padding:0.45rem 0.6rem; font-weight:600; font-size:0.78rem; display:inline-flex; align-items:center; gap:0.3rem; white-space:nowrap; cursor:pointer; font-family:'Work Sans',sans-serif; }
.dst-btn-brass{ border:1px solid var(--brass); color:var(--brass); }
.dst-btn-ghost{ border:1px solid var(--line); color:var(--cream-soft); }
.dst-btn-ghost:hover{ color:var(--cream); border-color:var(--cream-soft); }
.dst-btn-ghost.danger{ color:#E39A80; }
.dst-notes{ color:var(--cream-soft); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; white-space:pre-wrap; }
.dst-notes.open{ display:block; -webkit-line-clamp:unset; }
.dst-panel .dst-stamp.earned{ color:var(--brass); background:rgba(201,162,39,0.14); }
.dst-panel .dst-stamp.empty{ border-color:var(--line); color:var(--cream-soft); opacity:0.7; }
.dst-check{ width:18px; height:18px; border-radius:50%; border:1.5px solid var(--cream-soft); display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; opacity:0.7; }
.dst-check.ok{ background:var(--brass); border-color:var(--brass); color:var(--ink-bg); opacity:1; }
.dst-stat{ background:rgba(242,236,221,0.06); border-radius:12px; padding:0.6rem 0.4rem; text-align:center; }
.dst-nav{ position:fixed; left:0; right:0; bottom:0; background:var(--ink-bg); border-top:1px solid var(--line); z-index:20; padding-bottom:env(safe-area-inset-bottom); }
.dst-nav-inner{ max-width:640px; margin:0 auto; display:flex; justify-content:space-around; padding:0.4rem 0.5rem; }
.dst-nav button{ background:none; border:none; color:var(--cream-soft); display:flex; flex-direction:column; align-items:center; gap:2px; font-size:0.7rem; font-weight:600; padding:0.35rem 0.9rem; cursor:pointer; font-family:'Work Sans',sans-serif; }
.dst-nav button.active{ color:var(--brass); }
.dst-stamp{ border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'IBM Plex Mono',monospace; font-weight:700; letter-spacing:0.01em; flex-shrink:0; }
.dst-stamp.earned{ background:var(--brass-soft); border:2px solid var(--brass); color:var(--brass-ink); transform:rotate(-6deg); }
.dst-stamp.empty{ border:2px dashed var(--line-dark); color:var(--ink-soft); opacity:0.5; }
`;

function uid() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' });
}

function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + 'T00:00:00');
  return Math.round((d - today) / 86400000);
}

function ordinal(n) {
  const num = parseInt(n, 10);
  if (isNaN(num)) return '';
  if (num % 100 >= 11 && num % 100 <= 13) return 'th';
  switch (num % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

function gradeColor(q) {
  if (q === 'Excellent') return 'var(--sage)';
  if (q === 'Disqualified' || q === 'Absent') return 'var(--rust)';
  return 'var(--ink)';
}

function monthsAt(birthStr, dateStr) {
  const b = new Date(birthStr + 'T00:00:00');
  const d = new Date(dateStr + 'T00:00:00');
  let months = (d.getFullYear() - b.getFullYear()) * 12 + (d.getMonth() - b.getMonth());
  if (d.getDate() < b.getDate()) months -= 1;
  return months;
}

function computeGoalProgress(goal, dogShows, dog) {
  const inCountry = (s) => !goal.onlyCountry || (s.country || 'Norway') === goal.onlyCountry;
  const counts = (s) => s.certs && (s.certs[goal.trackedCert] || (goal.trackedCert === 'CERT' && (s.certs.STORCERT || s.certs.CACIB)));
  const qualifying = dogShows.filter((s) => s.status === 'done' && counts(s) && inCountry(s));
  const count = qualifying.length;
  const judgeSet = new Set(qualifying.map((s) => (s.judge || '').trim()).filter(Boolean));
  const countrySet = new Set(qualifying.map((s) => (s.country || '').trim()).filter(Boolean));
  const storcertCount = qualifying.filter((s) => s.certs.STORCERT || s.certs.CACIB).length;
  const needStorcert = goal.requiredStorcerts || 0;
  const needAge = goal.minAgeMonthsForOne || 0;
  const birth = dog && dog.birthDate;
  const ageOk = !needAge || !birth || qualifying.some((s) => monthsAt(birth, s.date) >= needAge);

  const missing = [];
  if (count < goal.targetCount) missing.push(`${goal.targetCount - count} ${goal.trackedCert} til`);
  if (needStorcert && storcertCount < needStorcert) missing.push('storcert');
  if (goal.trackDistinctJudges && judgeSet.size < goal.minDistinctJudges) missing.push('flere ulike dommere');
  if (goal.trackDistinctCountries && countrySet.size < goal.minDistinctCountries) missing.push('flere ulike land');
  if (!ageOk) missing.push(`cert etter ${needAge} mnd`);

  return {
    count,
    judgeCount: judgeSet.size,
    countryCount: countrySet.size,
    storcertCount,
    ageOk,
    missing,
    complete: missing.length === 0,
  };
}

function CertStamp({ code, earned, size = 'md' }) {
  const dim = size === 'sm' ? 30 : 40;
  const cert = CERT_TYPES.find((c) => c.code === code) || {};
  const display = cert.short || code;
  return (
    <div
      className={`dst-stamp ${earned ? 'earned' : 'empty'}`}
      style={{ width: dim, height: dim, fontSize: size === 'sm' ? '9px' : '10px' }}
      title={cert.full || code}
    >
      {display}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(22,36,29,0.6)', zIndex: 50 }}
      onClick={onClose}
    >
      <div
        className="dst-sheet w-full"
        style={{ width: '100%', maxWidth: '480px', maxHeight: '88dvh', overflowY: 'auto', borderRadius: '1rem', padding: '1.25rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div className="dst-display text-xl font-semibold">{title}</div>
          <button onClick={onClose} className="dst-btn-light" style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function WelcomeCard({ onAdd }) {
  return (
    <div className="dst-panel text-center" style={{ padding: '1.5rem' }}>
      <div className="dst-display text-xl font-semibold mb-2">Velkommen til kennelboken</div>
      <div className="text-sm mb-4" style={{ color: 'var(--cream-soft)' }}>
        Legg til hunden din for å begynne å spore kommende utstillinger, resultater og mål som å bli champion.
      </div>
      <button className="dst-btn-primary" onClick={onAdd}>Legg til hunden</button>
    </div>
  );
}

function EmptyHint({ text }) {
  return (
    <div className="dst-panel text-sm" style={{ color: 'var(--cream-soft)' }}>
      {text}
    </div>
  );
}

const COUNTRY_NO = { Sweden: 'Sverige', Denmark: 'Danmark', Finland: 'Finland', Germany: 'Tyskland', Netherlands: 'Nederland' };

function placeLine(show) {
  const country = show.country && show.country !== 'Norway' ? (COUNTRY_NO[show.country] || show.country) : '';
  return [show.location, country, show.dogClass].filter(Boolean).join(' · ');
}

function ShowActions({ onEdit, onDelete, onLogResult }) {
  return (
    <div className="flex gap-2 mt-3 pt-3 flex-wrap" style={{ borderTop: '1px solid var(--line)' }}>
      {onLogResult && (
        <button onClick={onLogResult} className="dst-btn-brass"><Trophy size={14} />Logg resultat</button>
      )}
      <button onClick={onEdit} className="dst-btn-ghost"><Pencil size={14} />Rediger</button>
      <button onClick={onDelete} className="dst-btn-ghost danger"><Trash2 size={14} />Slett</button>
    </div>
  );
}

function ResultCard({ show, dog, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const longNotes = show.notes && show.notes.length > 120;
  return (
    <div className="dst-panel">
      <div className="dst-panel-label">{formatDate(show.date)}</div>
      <div className="font-semibold mt-0.5">{show.showName}</div>
      {placeLine(show) && (
        <div className="text-sm flex items-center gap-1 mt-0.5" style={{ color: 'var(--cream-soft)' }}>
          <MapPin size={13} className="flex-shrink-0" />
          <span>{placeLine(show)}</span>
        </div>
      )}
      {show.judge && (
        <div className="text-xs mt-1" style={{ color: 'var(--cream-soft)' }}>Dommer: {show.judge}</div>
      )}
      <ResultBadges show={show} dog={dog} className="mt-3" />
      {show.points !== '' && show.points !== undefined && show.points !== null && (
        <div className="dst-mono text-xs mt-2" style={{ color: 'var(--cream-soft)' }}>{show.points} poeng</div>
      )}
      {show.notes && (
        <div className="mt-3">
          <div className={`dst-notes text-sm ${open ? 'open' : ''}`}>{show.notes}</div>
          {longNotes && (
            <button className="dst-link mt-1" onClick={() => setOpen(!open)}>{open ? 'Vis mindre' : 'Les mer'}</button>
          )}
        </div>
      )}
      <ShowActions onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

function UpcomingCard({ show, onEdit, onDelete, onLogResult }) {
  const days = daysUntil(show.date);
  return (
    <div className="dst-panel">
      <div className="flex items-start justify-between gap-3">
        <div style={{ minWidth: 0 }}>
          <div className="dst-panel-label">{formatDate(show.date)}</div>
          <div className="font-semibold mt-0.5">{show.showName}</div>
          {placeLine(show) && (
            <div className="text-sm flex items-center gap-1 mt-0.5" style={{ color: 'var(--cream-soft)' }}>
              <MapPin size={13} className="flex-shrink-0" />
              <span>{placeLine(show)}</span>
            </div>
          )}
        </div>
        <div className="text-center flex-shrink-0">
          {days < 0 ? (
            <span className="dst-badge brass">Mangler resultat</span>
          ) : days === 0 ? (
            <div className="dst-display font-semibold" style={{ fontSize: '1.3rem', color: 'var(--brass)' }}>I dag</div>
          ) : (
            <>
              <div className="dst-display font-semibold" style={{ fontSize: '2rem', lineHeight: 1, color: 'var(--brass)' }}>{days}</div>
              <div className="dst-panel-label">{days === 1 ? 'dag' : 'dager'}</div>
            </>
          )}
        </div>
      </div>
      {show.notes && <div className="text-sm mt-2" style={{ color: 'var(--cream-soft)' }}>{show.notes}</div>}
      <ShowActions onEdit={onEdit} onDelete={onDelete} onLogResult={onLogResult} />
    </div>
  );
}

function GoalCard({ goal, progress, onEdit, onDelete }) {
  const items = [
    { ok: progress.count >= goal.targetCount, text: `${goal.targetCount} ${goal.trackedCert}`, detail: `${progress.count} av ${goal.targetCount}` },
  ];
  if (goal.requiredStorcerts) {
    items.push({
      ok: progress.storcertCount >= goal.requiredStorcerts,
      text: goal.requiredStorcerts === 1 ? 'Minst ett storcert' : `Minst ${goal.requiredStorcerts} storcert`,
      detail: `${progress.storcertCount} av ${goal.requiredStorcerts}`,
    });
  }
  if (goal.trackDistinctJudges) {
    items.push({ ok: progress.judgeCount >= goal.minDistinctJudges, text: `${goal.minDistinctJudges} ulike dommere`, detail: `${progress.judgeCount} av ${goal.minDistinctJudges}` });
  }
  if (goal.trackDistinctCountries) {
    items.push({ ok: progress.countryCount >= goal.minDistinctCountries, text: `${goal.minDistinctCountries} ulike land`, detail: `${progress.countryCount} av ${goal.minDistinctCountries}` });
  }
  if (goal.minAgeMonthsForOne) {
    items.push({ ok: progress.ageOk, text: `Ett ${goal.trackedCert} ved fylte ${goal.minAgeMonthsForOne} mnd`, detail: progress.ageOk ? 'Ja' : 'Ikke ennå' });
  }
  return (
    <div className="dst-panel">
      <div className="flex items-start justify-between gap-3">
        <div className="dst-display text-lg font-semibold" style={{ minWidth: 0 }}>{goal.title}</div>
        {progress.complete && <span className="dst-badge brass flex-shrink-0">Oppnådd</span>}
      </div>
      {goal.description && (
        <div className="text-sm mt-1" style={{ color: 'var(--cream-soft)' }}>{goal.description}</div>
      )}
      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
        {Array.from({ length: goal.targetCount }).map((_, i) => (
          <CertStamp key={i} code={goal.trackedCert} earned={i < progress.count} size="sm" />
        ))}
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item.text} className="flex items-center gap-2 text-sm">
            <span className={`dst-check ${item.ok ? 'ok' : ''}`}>{item.ok && <Check size={12} strokeWidth={3} />}</span>
            <span className="flex-1" style={{ color: item.ok ? 'var(--cream)' : 'var(--cream-soft)' }}>{item.text}</span>
            <span className="dst-panel-label">{item.detail}</span>
          </div>
        ))}
        {goal.onlyCountry === 'Norway' && (
          <div className="dst-panel-label">Teller bare utstillinger i Norge</div>
        )}
      </div>
      <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--line)' }}>
        <button onClick={onEdit} className="dst-btn-ghost"><Pencil size={14} />Rediger</button>
        <button onClick={onDelete} className="dst-btn-ghost danger"><Trash2 size={14} />Slett</button>
      </div>
    </div>
  );
}

function DogForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial || { name: '', regName: '', breed: '', sex: '', birthDate: '', regNumber: '', notes: '' }
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div className="space-y-3">
      <div>
        <label className="dst-label">Kallenavn *</label>
        <input className="dst-input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="f.eks. Bella" />
      </div>
      <div>
        <label className="dst-label">Registrert navn</label>
        <input className="dst-input" value={form.regName} onChange={(e) => set('regName', e.target.value)} placeholder="Fullt stamtavlenavn" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="dst-label">Rase</label>
          <input className="dst-input" value={form.breed} onChange={(e) => set('breed', e.target.value)} />
        </div>
        <div>
          <label className="dst-label">Kjønn</label>
          <select className="dst-select" value={form.sex} onChange={(e) => set('sex', e.target.value)}>
            <option value="">—</option>
            <option value="Male">Hann</option>
            <option value="Female">Tispe</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="dst-label">Fødselsdato</label>
          <input type="date" className="dst-input" value={form.birthDate} onChange={(e) => set('birthDate', e.target.value)} />
        </div>
        <div>
          <label className="dst-label">Reg.nummer</label>
          <input className="dst-input" value={form.regNumber} onChange={(e) => set('regNumber', e.target.value)} />
        </div>
      </div>
      <div>
        <label className="dst-label">Notater</label>
        <textarea className="dst-textarea" rows={2} value={form.notes} onChange={(e) => set('notes', e.target.value)} />
      </div>
      <div className="flex gap-2 pt-2">
        <button className="dst-btn-primary" disabled={!form.name.trim()} onClick={() => onSave(form)}>Lagre</button>
        <button className="dst-btn-light" onClick={onCancel}>Avbryt</button>
      </div>
    </div>
  );
}

function defaultClassFor(dog) {
  if (!dog || !dog.birthDate) return 'Åpen';
  const today = new Date().toLocaleDateString('sv-SE');
  const months = monthsAt(dog.birthDate, today);
  if (months < 6) return CLASSES[0];
  if (months < 9) return CLASSES[1];
  if (months < 15) return CLASSES[2];
  if (months < 24) return CLASSES[3];
  return CLASSES[4];
}

function ShowForm({ dog, initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial || {
      date: '', showName: '', location: '', country: 'Norway', dogClass: defaultClassFor(dog),
      status: 'upcoming', judge: '', placement: '-', breedPlacement: '-', bigPlacement: '-', quality: '', ckQuality: false, hederspris: false, points: '',
      certs: { ...DEFAULT_CERTS }, notes: '',
    }
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleCert = (code) => setForm((f) => ({ ...f, certs: { ...f.certs, [code]: !f.certs[code] } }));
  const isDone = form.status === 'done';

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="dst-label">Dato *</label>
          <input type="date" className="dst-input" value={form.date} onChange={(e) => set('date', e.target.value)} />
        </div>
        <div>
          <label className="dst-label">Status</label>
          <select className="dst-select" value={form.status} onChange={(e) => set('status', e.target.value)}>
            <option value="upcoming">Kommende</option>
            <option value="done">Gjennomført</option>
          </select>
        </div>
      </div>
      <div>
        <label className="dst-label">Utstillingsnavn *</label>
        <input className="dst-input" value={form.showName} onChange={(e) => set('showName', e.target.value)} placeholder="f.eks. Oslo International Dog Show" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="dst-label">Sted</label>
          <input className="dst-input" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="By" />
        </div>
        <div>
          <label className="dst-label">Land</label>
          <input className="dst-input" value={form.country} onChange={(e) => set('country', e.target.value)} />
        </div>
      </div>
      <div>
        <label className="dst-label">Klasse</label>
        <select className="dst-select" value={form.dogClass} onChange={(e) => set('dogClass', e.target.value)}>
          {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {isDone && (
        <>
          <div style={{ borderTop: '1px dashed var(--line-dark)', margin: '0.75rem 0 0.25rem' }} />
          <div className="dst-label">Resultat</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="dst-label">Dommer</label>
              <input className="dst-input" value={form.judge} onChange={(e) => set('judge', e.target.value)} />
            </div>
            <div>
              <label className="dst-label">Plassering</label>
              <select className="dst-select" value={form.placement} onChange={(e) => set('placement', e.target.value)}>
                {PLACEMENTS.map((p) => (
                  <option key={p} value={p}>{p === '-' ? 'Ikke plassert' : `${p}${ordinal(p)}`}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="dst-label">Kvalitetsgrad</label>
              <select className="dst-select" value={form.quality} onChange={(e) => set('quality', e.target.value)}>
                <option value="">—</option>
                {QUALITY_GRADES.map((q) => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
            <div>
              <label className="dst-label">Beste av rasen (BHK/BTK)</label>
              <select className="dst-select" value={form.breedPlacement || '-'} onChange={(e) => set('breedPlacement', e.target.value)}>
                {PLACEMENTS.map((p) => (
                  <option key={p} value={p}>{p === '-' ? 'Ikke plassert' : `${p}${ordinal(p)}`}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="dst-label">BIG (Beste i Gruppe)</label>
              <select className="dst-select" value={form.bigPlacement || '-'} onChange={(e) => set('bigPlacement', e.target.value)}>
                {PLACEMENTS.map((p) => (
                  <option key={p} value={p}>{p === '-' ? 'Ikke plassert' : `BIG ${p}${ordinal(p)}`}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="dst-label">Poeng</label>
              <input type="number" className="dst-input" value={form.points} onChange={(e) => set('points', e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <label className="dst-chip" style={{ display: 'flex', width: 'fit-content' }}>
              <input type="checkbox" checked={!!form.ckQuality} onChange={(e) => set('ckQuality', e.target.checked)} style={{ marginRight: '0.4rem' }} />
              CK-kvalitet (Certifikatkvalitet)
            </label>
            <label className="dst-chip" style={{ display: 'flex', width: 'fit-content' }}>
              <input type="checkbox" checked={!!form.hederspris} onChange={(e) => set('hederspris', e.target.checked)} style={{ marginRight: '0.4rem' }} />
              Hederspris (HP)
            </label>
          </div>
          <div>
            <label className="dst-label">Sertifikater &amp; titler tildelt</label>
            <div className="flex gap-2 flex-wrap mt-1">
              {CERT_TYPES.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  className={`dst-chip ${form.certs[c.code] ? 'checked' : ''}`}
                  onClick={() => toggleCert(c.code)}
                >
                  {form.certs[c.code] && <Check size={12} />}{c.code}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div>
        <label className="dst-label">Notater</label>
        <textarea
          className="dst-textarea" rows={2} value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Kritikk, ringnummer, notater"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button className="dst-btn-primary" disabled={!form.date || !form.showName.trim()} onClick={() => onSave(form)}>Lagre</button>
        <button className="dst-btn-light" onClick={onCancel}>Avbryt</button>
      </div>
    </div>
  );
}

function GoalForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || null);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  if (!form) {
    return (
      <div className="space-y-2">
        <div className="text-sm mb-2" style={{ color: 'var(--ink-soft)' }}>
          Velg en vanlig tittel, eller sett opp ditt eget mål.
        </div>
        {GOAL_TEMPLATES.map((t) => (
          <button
            key={t.key}
            className="dst-chip"
            style={{ display: 'block', width: '100%', textAlign: 'left', borderRadius: '12px', padding: '0.75rem', marginBottom: '0.5rem' }}
            onClick={() => setForm({ ...t, certs: undefined })}
          >
            <div className="font-bold">{t.title || 'Eget mål'}</div>
            {t.description && (
              <div className="text-xs mt-1 font-normal" style={{ color: 'var(--ink-soft)' }}>{t.description}</div>
            )}
          </button>
        ))}
        <button className="dst-btn-light" onClick={onCancel}>Avbryt</button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="dst-label">Mål *</label>
        <input className="dst-input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="f.eks. Norsk Utstillingschampion" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="dst-label">Teller mot</label>
          <select className="dst-select" value={form.trackedCert} onChange={(e) => set('trackedCert', e.target.value)}>
            {CERT_TYPES.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
          </select>
        </div>
        <div>
          <label className="dst-label">Mål antall</label>
          <input
            type="number" min="1" className="dst-input" value={form.targetCount}
            onChange={(e) => set('targetCount', Math.max(1, parseInt(e.target.value, 10) || 1))}
          />
        </div>
      </div>
      <label className="dst-chip" style={{ display: 'flex', width: 'fit-content' }}>
        <input type="checkbox" checked={form.trackDistinctJudges} onChange={(e) => set('trackDistinctJudges', e.target.checked)} style={{ marginRight: '0.4rem' }} />
        Krev ulike dommere
      </label>
      {form.trackDistinctJudges && (
        <div>
          <label className="dst-label">Minimum ulike dommere</label>
          <input
            type="number" min="1" className="dst-input" value={form.minDistinctJudges}
            onChange={(e) => set('minDistinctJudges', Math.max(1, parseInt(e.target.value, 10) || 1))}
          />
        </div>
      )}
      <label className="dst-chip" style={{ display: 'flex', width: 'fit-content' }}>
        <input type="checkbox" checked={form.trackDistinctCountries} onChange={(e) => set('trackDistinctCountries', e.target.checked)} style={{ marginRight: '0.4rem' }} />
        Krev ulike land
      </label>
      {form.trackDistinctCountries && (
        <div>
          <label className="dst-label">Minimum ulike land</label>
          <input
            type="number" min="1" className="dst-input" value={form.minDistinctCountries}
            onChange={(e) => set('minDistinctCountries', Math.max(1, parseInt(e.target.value, 10) || 1))}
          />
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="dst-label">Antall storcert</label>
          <input
            type="number" min="0" className="dst-input" value={form.requiredStorcerts || 0}
            onChange={(e) => set('requiredStorcerts', Math.max(0, parseInt(e.target.value, 10) || 0))}
          />
        </div>
        <div>
          <label className="dst-label">Ett cert ved alder (mnd)</label>
          <input
            type="number" min="0" className="dst-input" value={form.minAgeMonthsForOne || 0}
            onChange={(e) => set('minAgeMonthsForOne', Math.max(0, parseInt(e.target.value, 10) || 0))}
          />
        </div>
      </div>
      <label className="dst-chip" style={{ display: 'flex', width: 'fit-content' }}>
        <input type="checkbox" checked={form.onlyCountry === 'Norway'} onChange={(e) => set('onlyCountry', e.target.checked ? 'Norway' : '')} style={{ marginRight: '0.4rem' }} />
        Teller bare utstillinger i Norge
      </label>
      <div>
        <label className="dst-label">Notater / krav</label>
        <textarea className="dst-textarea" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
      </div>
      <div className="flex gap-2 pt-2">
        <button className="dst-btn-primary" disabled={!form.title.trim()} onClick={() => onSave(form)}>Lagre</button>
        <button className="dst-btn-light" onClick={onCancel}>Avbryt</button>
      </div>
    </div>
  );
}

// Parse the legacy backup format: "EXC JK 2JKK CK 4BHK" etc.
function parseLegacyResult(result = '', location = '', showName = '') {
  const r = result.toUpperCase();
  const quality =
    r.includes('EXC') ? 'Excellent' :
    r.includes('VG') ? 'Very Good' :
    r.includes('GOOD') ? 'Good' :
    r.includes('SUFF') ? 'Sufficient' : '';

  // placement in class: look for digit before JKK/UKK/KK/ÅPK etc.
  const classPlacementMatch = r.match(/(\d)\s*(?:JKK|UKK|ÅPK|KK|KLASS)/);
  const placement = classPlacementMatch ? classPlacementMatch[1] : '-';

  // breed placement: digit before BHK/BTK
  const breedMatch = r.match(/(\d)\s*B[HT]K/);
  const breedPlacement = breedMatch ? breedMatch[1] : '-';

  const ckQuality = r.includes('CK');
  const certs = { ...DEFAULT_CERTS };
  if (r.includes(' CERT') || r.includes('UCERT') || r.includes('1CERT')) certs.CERT = true;
  if (r.includes('RCERT') || r.includes('RES CERT') || r.includes('RESCERT')) certs.RCERT = true;
  if (r.includes('CACIB-J') || r.includes('CACIBJ')) certs.CACIBJ = true;
  if (/\bCACIB\b/.test(r) && !r.includes('CACIB-J')) certs.CACIB = true;
  if (r.includes('BIR')) certs.BIR = true;
  if (r.includes('BIM')) certs.BIM = true;
  if (r.includes('BIS')) certs.BIS = true;
  if (r.includes('JUN/VET') || r.includes('JUNCERT')) certs.JUNCERT = true;

  const dogClass =
    r.includes('JK') || r.includes('JUNIOR') ? 'Junior' :
    r.includes('UK') || r.includes('UNGHUND') ? 'Other' :
    r.includes('ÅP') || r.includes('OPEN') ? 'Open' :
    r.includes('VETERAN') ? 'Veteran' :
    r.includes('CHAMPION') ? 'Champion' : 'Other';

  return { quality, placement, breedPlacement, ckQuality, certs, dogClass };
}

function convertLegacyBackup(data) {
  // Detect format: legacy has shows[].result as string, our format has shows[].showName
  const shows = data.shows || [];
  return shows.map((item) => {
    if (item.showName) {
      // Already our format
      return {
        date: item.date || '',
        showName: item.showName || '',
        location: item.location || '',
        country: item.country || 'Norway',
        dogClass: CLASSES.includes(item.dogClass) ? item.dogClass : 'Other',
        status: 'done',
        judge: item.judge || '',
        placement: item.placement || '-',
        breedPlacement: item.breedPlacement || '-',
        bigPlacement: item.bigPlacement || '-',
        quality: item.quality || '',
        ckQuality: !!item.ckQuality,
        hederspris: !!item.hederspris,
        points: item.points === undefined ? '' : item.points,
        certs: { ...DEFAULT_CERTS, ...(item.certs || {}) },
        notes: item.notes || item.comment || '',
      };
    }
    // Legacy format
    const parsed = parseLegacyResult(item.result, item.location, '');
    return {
      date: item.date || '',
      showName: item.location || '',
      location: '',
      country: 'Norway',
      dogClass: parsed.dogClass,
      status: 'done',
      judge: item.judge || '',
      placement: parsed.placement,
      breedPlacement: parsed.breedPlacement,
      bigPlacement: '-',
      quality: parsed.quality,
      ckQuality: parsed.ckQuality,
      hederspris: false,
      points: '',
      certs: parsed.certs,
      notes: item.comment || '',
    };
  });
}

const IMPORT_PLACEHOLDER = `[
  {
    "date": "2026-06-13",
    "showName": "Norsk Vinner 2026",
    "location": "Sandefjord",
    "country": "Norway",
    "dogClass": "Junior",
    "judge": "Gorjão-Henriques, Luís",
    "placement": "2",
    "breedPlacement": "4",
    "quality": "Excellent",
    "ckQuality": true,
    "certs": { "CERT": false, "BIR": false },
    "notes": "Nice type, nice head..."
  }
]`;

function ImportForm({ onImport, onCancel }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const fileRef = React.useRef();

  function processData(raw) {
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      setError('Ugyldig JSON. Sjekk at filen ikke er korrupt.');
      return;
    }

    let items;
    // Full backup file with { version, shows, ... }
    if (parsed && (parsed.shows || parsed.version)) {
      items = convertLegacyBackup(parsed);
    } else {
      // Plain array (our format)
      if (!Array.isArray(parsed)) parsed = [parsed];
      items = parsed.map((item) => ({
        date: item.date || '',
        showName: item.showName || item.location || '',
        location: item.location || '',
        country: item.country || 'Norway',
        dogClass: CLASSES.includes(item.dogClass) ? item.dogClass : 'Other',
        status: 'done',
        judge: item.judge || '',
        placement: item.placement || '-',
        breedPlacement: item.breedPlacement || '-',
        bigPlacement: item.bigPlacement || '-',
        quality: item.quality || '',
        ckQuality: !!item.ckQuality,
        hederspris: !!item.hederspris,
        points: item.points === undefined ? '' : item.points,
        certs: { ...DEFAULT_CERTS, ...(item.certs || {}) },
        notes: item.notes || '',
      }));
    }

    if (items.length === 0) {
      setError('Ingen resultater funnet i filen.');
      return;
    }
    setError('');
    onImport(items);
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { if (ev.target) processData(ev.target.result); };
    reader.readAsText(file);
  }

  function handleImport() {
    if (!text.trim()) return;
    processData(text);
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold">Last opp backup-fil</div>
      <div
        className="dst-panel text-center cursor-pointer"
        style={{ border: '2px dashed var(--line-dark)' }}
        onClick={() => fileRef.current.click()}
      >
        <div className="text-sm" style={{ color: 'var(--ink-soft)' }}>
          Klikk for å velge JSON-fil (backup fra annen enhet)
        </div>
        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileUpload} />
      </div>
      <div className="text-sm font-semibold" style={{ color: 'var(--ink-soft)' }}>— eller lim inn JSON direkte —</div>
      <textarea
        className="dst-textarea dst-mono"
        rows={8}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={IMPORT_PLACEHOLDER}
        style={{ fontSize: '0.75rem' }}
      />
      {error && <div className="text-sm" style={{ color: 'var(--rust)' }}>{error}</div>}
      <div className="flex gap-2 pt-2">
        <button className="dst-btn-primary" disabled={!text.trim()} onClick={handleImport}>Importer</button>
        <button className="dst-btn-light" onClick={onCancel}>Avbryt</button>
      </div>
    </div>
  );
}


function ageLabel(birthDate) {
  if (!birthDate) return '';
  const b = new Date(birthDate + 'T00:00:00');
  const now = new Date();
  let months = (now.getFullYear() - b.getFullYear()) * 12 + (now.getMonth() - b.getMonth());
  if (now.getDate() < b.getDate()) months -= 1;
  if (months < 0) return '';
  if (months < 24) return `${months} mnd`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return rest ? `${years} år ${rest} mnd` : `${years} år`;
}

const GRADE_SHORT = { Excellent: 'EXC', 'Very Good': 'VG', Good: 'G', Sufficient: 'SUFF', Disqualified: 'DISK', Absent: 'Fraværende' };

function ResultBadges({ show, dog, className = '' }) {
  const earned = CERT_TYPES.filter((c) => show.certs && show.certs[c.code]);
  const sex = (dog && dog.sex) || '';
  const breedLabel = /^(f|female|tik|tispe)/i.test(sex) ? 'BTK' : /^(m|male|hann)/i.test(sex) ? 'BHK' : 'BHK/BTK';
  const grade = GRADE_SHORT[show.quality] || show.quality;
  const placement = show.placement && show.placement !== '-' ? ` ${show.placement}.` : '';
  const hasBreed = show.breedPlacement && show.breedPlacement !== '-';
  const hasBig = show.bigPlacement && show.bigPlacement !== '-';
  if (!grade && !show.ckQuality && !hasBreed && !hasBig && earned.length === 0 && !show.hederspris) return null;
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {grade && <span className="dst-badge">{grade}{placement}</span>}
      {show.ckQuality && <span className="dst-badge">CK</span>}
      {show.breedPlacement && show.breedPlacement !== '-' && (
        <span className="dst-badge">{show.breedPlacement}. {breedLabel}</span>
      )}
      {show.bigPlacement && show.bigPlacement !== '-' && (
        <span className="dst-badge">{show.bigPlacement}. BIG</span>
      )}
      {earned.map((c) => <span key={c.code} className="dst-badge brass">{c.short}</span>)}
      {show.hederspris && <span className="dst-badge brass">HP</span>}
    </div>
  );
}

function Dashboard({ dog, dogShows, dogGoals, onGoToShows, onGoToGoals }) {
  const upcoming = dogShows.filter((s) => s.status === 'upcoming').sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = dogShows.filter((s) => s.status === 'done').sort((a, b) => new Date(b.date) - new Date(a.date));
  const nextShow = upcoming[0];
  const latest = past[0];
  const older = past.slice(1, 3);
  const days = nextShow ? daysUntil(nextShow.date) : null;
  const photo = dogPhoto(dog);
  const details = [dog.breed, ageLabel(dog.birthDate)].filter(Boolean).join(' · ');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="dst-avatar">
          {photo ? <img src={photo} alt={dog.name} /> : <PawPrint size={30} />}
        </div>
        <div>
          <div className="dst-display font-semibold" style={{ fontSize: '1.75rem', lineHeight: 1.15 }}>{dog.name}</div>
          {details && <div className="text-sm" style={{ color: 'var(--cream-soft)' }}>{details}</div>}
        </div>
      </div>

      <div className="dst-panel flex items-center justify-between gap-4">
        {nextShow ? (
          <>
            <div style={{ minWidth: 0 }}>
              <div className="dst-panel-label">Neste utstilling</div>
              <div className="font-semibold mt-1">{nextShow.showName}</div>
              <div className="text-sm" style={{ color: 'var(--cream-soft)' }}>
                {formatDate(nextShow.date)}{nextShow.location ? ` · ${nextShow.location}` : ''}
              </div>
            </div>
            <div className="text-center flex-shrink-0">
              {days <= 0 ? (
                <div className="dst-display font-semibold" style={{ fontSize: '1.4rem', color: 'var(--brass)' }}>I dag</div>
              ) : (
                <>
                  <div className="dst-display font-semibold" style={{ fontSize: '2.2rem', lineHeight: 1, color: 'var(--brass)' }}>{days}</div>
                  <div className="dst-panel-label">{days === 1 ? 'dag' : 'dager'}</div>
                </>
              )}
            </div>
          </>
        ) : (
          <div>
            <div className="dst-panel-label">Neste utstilling</div>
            <div className="font-semibold mt-1">Ingen kommende utstillinger</div>
            <button className="dst-link mt-2" onClick={onGoToShows}>Legg til utstilling <ChevronRight size={15} /></button>
          </div>
        )}
      </div>

      {dogGoals.slice(0, 2).map((goal) => {
        const progress = computeGoalProgress(goal, dogShows, dog);
        const pct = Math.min(100, Math.round((progress.count / Math.max(1, goal.targetCount)) * 100));
        return (
          <button
            key={goal.id}
            className="dst-panel w-full text-left"
            style={{ border: 'none', color: 'inherit', cursor: 'pointer', display: 'block', font: 'inherit' }}
            onClick={onGoToGoals}
          >
            <div className="flex justify-between gap-3 mb-2">
              <span className="dst-panel-label" style={{ minWidth: 0 }}>Mål: {goal.title}</span>
              <span className="dst-panel-label flex-shrink-0">
                {progress.complete ? 'Oppnådd' : progress.count >= goal.targetCount ? `Mangler ${progress.missing[0]}` : `${progress.count} av ${goal.targetCount} ${goal.trackedCert}`}
              </span>
            </div>
            <div className="dst-bar"><div style={{ width: `${pct}%` }} /></div>
          </button>
        );
      })}

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="dst-display text-lg font-semibold">Siste resultater</div>
          {past.length > 0 && <button className="dst-link" onClick={onGoToShows}>Se alle <ChevronRight size={15} /></button>}
        </div>
        {!latest ? (
          <EmptyHint text="Ingen resultater ennå. Resultater vises her når en utstilling er markert som gjennomført." />
        ) : (
          <div className="space-y-3">
            <div className="dst-panel">
              <div className="dst-panel-label">{formatDate(latest.date)}</div>
              <div className="font-semibold mt-0.5">{latest.showName}</div>
              {(latest.location || latest.dogClass) && (
                <div className="text-sm mb-3" style={{ color: 'var(--cream-soft)' }}>
                  {[latest.location, latest.dogClass].filter(Boolean).join(' · ')}
                </div>
              )}
              <ResultBadges show={latest} dog={dog} />
            </div>
            {older.map((s) => (
              <div key={s.id} className="dst-panel">
                <div className="font-semibold text-sm">{s.showName}</div>
                <div className="dst-panel-label mb-2">{formatDate(s.date)}</div>
                <ResultBadges show={s} dog={dog} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ShowsTab({ dog, dogShows, onAdd, onEdit, onDelete, onLogResult, onImport }) {
  const [view, setView] = useState('upcoming');
  const upcoming = dogShows.filter((s) => s.status === 'upcoming').sort((a, b) => new Date(a.date) - new Date(b.date));
  const results = dogShows.filter((s) => s.status === 'done').sort((a, b) => new Date(b.date) - new Date(a.date));
  const years = [...new Set(results.map((s) => (s.date || '').slice(0, 4)))];

  return (
    <div>
      <div className="dst-seg">
        <button className={`dst-seg-btn ${view === 'upcoming' ? 'active' : ''}`} onClick={() => setView('upcoming')}>
          Kommende ({upcoming.length})
        </button>
        <button className={`dst-seg-btn ${view === 'results' ? 'active' : ''}`} onClick={() => setView('results')}>
          Resultater ({results.length})
        </button>
      </div>
      <div className="flex gap-2 mb-4">
        <button className="dst-btn-primary flex-1 flex items-center justify-center gap-1.5" onClick={onAdd}>
          <Plus size={16} />Legg til utstilling
        </button>
        <button className="dst-btn-secondary" onClick={onImport}>Importer</button>
      </div>
      {view === 'upcoming' ? (
        upcoming.length === 0 ? (
          <EmptyHint text="Ingen kommende utstillinger. Legg til den neste i kalenderen." />
        ) : (
          <div className="space-y-3">
            {upcoming.map((s) => (
              <UpcomingCard key={s.id} show={s} onEdit={() => onEdit(s)} onDelete={() => onDelete(s)} onLogResult={() => onLogResult(s)} />
            ))}
          </div>
        )
      ) : results.length === 0 ? (
        <EmptyHint text="Ingen resultater ennå. Logg et resultat fra Kommende-fanen etter en utstilling, eller legg til et tidligere resultat direkte." />
      ) : (
        <div className="space-y-5">
          {years.map((year) => (
            <div key={year}>
              <div className="dst-display text-lg font-semibold mb-2">{year}</div>
              <div className="space-y-3">
                {results.filter((s) => (s.date || '').slice(0, 4) === year).map((s) => (
                  <ResultCard key={s.id} show={s} dog={dog} onEdit={() => onEdit(s)} onDelete={() => onDelete(s)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GoalsTab({ dog, dogShows, dogGoals, onAdd, onEdit, onDelete }) {
  return (
    <div>
      <button className="dst-btn-primary w-full flex items-center justify-center gap-1.5 mb-4" onClick={onAdd}>
        <Plus size={16} />Legg til mål
      </button>
      {dogGoals.length === 0 ? (
        <EmptyHint text="Ingen mål ennå. Sett et mål, som å bli champion, for å spore fremgangen." />
      ) : (
        <div className="space-y-3">
          {dogGoals.map((g) => (
            <GoalCard key={g.id} goal={g} progress={computeGoalProgress(g, dogShows, dog)} onEdit={() => onEdit(g)} onDelete={() => onDelete(g)} />
          ))}
        </div>
      )}
    </div>
  );
}

const SEX_NO = { Male: 'Hann', Female: 'Tispe' };

function dogPhoto(dog) {
  return /laban/i.test(dog.name || '') ? `${import.meta.env.BASE_URL}laban.jpg` : null;
}

function DogsTab({ dogs, shows, goals, activeDogId, onSelect, onAdd, onEdit, onDelete }) {
  return (
    <div>
      <button className="dst-btn-primary w-full flex items-center justify-center gap-1.5 mb-4" onClick={onAdd}>
        <Plus size={16} />Legg til hund
      </button>
      <div className="space-y-3">
        {dogs.map((dog) => {
          const dogShows = shows.filter((s) => s.dogId === dog.id);
          const doneShows = dogShows.filter((s) => s.status === 'done');
          const certCount = doneShows.filter((s) => s.certs && (s.certs.CERT || s.certs.STORCERT || s.certs.CACIB)).length;
          const dogGoals = goals.filter((g) => g.dogId === dog.id);
          const goalsCompleted = dogGoals.filter((g) => computeGoalProgress(g, dogShows, dog).complete).length;
          const isActive = dog.id === activeDogId;
          const photo = dogPhoto(dog);
          const details = [dog.breed, SEX_NO[dog.sex] || dog.sex, ageLabel(dog.birthDate)].filter(Boolean).join(' · ');
          return (
            <div
              key={dog.id}
              className="dst-panel"
              style={{ border: isActive ? '1.5px solid var(--brass)' : '1.5px solid transparent' }}
            >
              <div className="flex items-center gap-3">
                <div className="dst-avatar" style={{ width: 56, height: 56 }}>
                  {photo ? <img src={photo} alt={dog.name} /> : <PawPrint size={26} />}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="dst-display text-lg font-semibold">{dog.name}</div>
                  {details && <div className="text-sm" style={{ color: 'var(--cream-soft)' }}>{details}</div>}
                </div>
                {isActive ? (
                  <span className="dst-badge brass flex-shrink-0">Valgt</span>
                ) : (
                  <button className="dst-btn-brass flex-shrink-0" onClick={() => onSelect(dog.id)}>Velg</button>
                )}
              </div>
              {(dog.regName || dog.regNumber || dog.birthDate) && (
                <div className="mt-3 text-xs space-y-0.5" style={{ color: 'var(--cream-soft)' }}>
                  {dog.regName && <div>{dog.regName}</div>}
                  {dog.regNumber && <div className="dst-mono">{dog.regNumber}</div>}
                  {dog.birthDate && <div>Født {formatDate(dog.birthDate)}</div>}
                </div>
              )}
              {dog.notes && <div className="text-sm mt-2" style={{ color: 'var(--cream-soft)' }}>{dog.notes}</div>}
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="dst-stat"><div className="dst-display font-semibold" style={{ fontSize: '1.3rem' }}>{doneShows.length}</div><div className="dst-panel-label">Utstillinger</div></div>
                <div className="dst-stat"><div className="dst-display font-semibold" style={{ fontSize: '1.3rem' }}>{certCount}</div><div className="dst-panel-label">CERT</div></div>
                <div className="dst-stat"><div className="dst-display font-semibold" style={{ fontSize: '1.3rem' }}>{goalsCompleted}/{dogGoals.length}</div><div className="dst-panel-label">Mål nådd</div></div>
              </div>
              <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--line)' }}>
                <button onClick={() => onEdit(dog)} className="dst-btn-ghost"><Pencil size={14} />Rediger</button>
                <button onClick={() => onDelete(dog)} className="dst-btn-ghost danger"><Trash2 size={14} />Slett</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const TABS = [
  { key: 'dashboard', label: 'Oversikt', Icon: House },
  { key: 'shows', label: 'Utstillinger', Icon: CalendarDays },
  { key: 'goals', label: 'Mål', Icon: Target },
  { key: 'dogs', label: 'Hunder', Icon: PawPrint },
];

const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : '';
const PASSWORD_KEY = 'laban-password';

async function apiRequest(options = {}) {
  const send = () =>
    fetch(`${API_BASE}/api/data`, {
      ...options,
      headers: { ...(options.headers || {}), 'x-app-password': localStorage.getItem(PASSWORD_KEY) || '' },
    });
  let res = await send();
  if (res.status === 401) {
    const pw = window.prompt('Passord for Laban Tracker:');
    if (pw === null) throw new Error('Mangler passord');
    localStorage.setItem(PASSWORD_KEY, pw);
    res = await send();
    if (res.status === 401) {
      localStorage.removeItem(PASSWORD_KEY);
      window.alert('Feil passord. Last siden på nytt for å prøve igjen.');
      throw new Error('Feil passord');
    }
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function App() {
  const [dogs, setDogs] = useState([]);
  const [shows, setShows] = useState([]);
  const [goals, setGoals] = useState([]);
  const [activeDogId, setActiveDogId] = useState(null);
  const [tab, setTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const importFileRef = React.useRef(null);

  useEffect(() => {
    apiRequest()
      .then((data) => {
        const d = data.dogs || [];
        const s = data.shows || [];
        const g = data.goals || [];
        setDogs(d); setShows(s); setGoals(g);
        if (d.length > 0) setActiveDogId(d[0].id);
        setLoading(false);
      })
      .catch(() => {
        const d = JSON.parse(localStorage.getItem(STORAGE_KEYS.dogs) || '[]');
        const s = JSON.parse(localStorage.getItem(STORAGE_KEYS.shows) || '[]');
        const g = JSON.parse(localStorage.getItem(STORAGE_KEYS.goals) || '[]');
        setDogs(d); setShows(s); setGoals(g);
        if (d.length > 0) setActiveDogId(d[0].id);
        setLoading(false);
      });
  }, []);

  function persist(dogs, shows, goals) {
    apiRequest({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dogs, shows, goals }),
    }).catch(() => {
      localStorage.setItem(STORAGE_KEYS.dogs, JSON.stringify(dogs));
      localStorage.setItem(STORAGE_KEYS.shows, JSON.stringify(shows));
      localStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(goals));
    });
  }

  function closeModal() { setModal(null); }

  function saveDog(data) {
    let nextDogs;
    if (data.id) {
      nextDogs = dogs.map((d) => (d.id === data.id ? { ...d, ...data } : d));
    } else {
      const newDog = { ...data, id: uid() };
      nextDogs = [...dogs, newDog];
      setActiveDogId(newDog.id);
    }
    setDogs(nextDogs);
    persist(nextDogs, shows, goals);
    closeModal();
  }

  function deleteDog(dog) {
    
    const nextDogs = dogs.filter((d) => d.id !== dog.id);
    const nextShows = shows.filter((s) => s.dogId !== dog.id);
    const nextGoals = goals.filter((g) => g.dogId !== dog.id);
    setDogs(nextDogs); setShows(nextShows); setGoals(nextGoals);
    persist(nextDogs, nextShows, nextGoals);
    if (activeDogId === dog.id) setActiveDogId(nextDogs[0] ? nextDogs[0].id : null);
  }

  function saveShow(data) {
    let nextShows;
    if (data.id) {
      nextShows = shows.map((s) => (s.id === data.id ? { ...data } : s));
    } else {
      nextShows = [...shows, { ...data, id: uid(), dogId: activeDogId }];
    }
    setShows(nextShows);
    persist(dogs, nextShows, goals);
    closeModal();
  }

  function deleteShow(show) {
    
    const nextShows = shows.filter((s) => s.id !== show.id);
    setShows(nextShows);
    persist(dogs, nextShows, goals);
  }

  function saveGoal(data) {
    let nextGoals;
    if (data.id) {
      nextGoals = goals.map((g) => (g.id === data.id ? { ...data } : g));
    } else {
      nextGoals = [...goals, { ...data, id: uid(), dogId: activeDogId }];
    }
    setGoals(nextGoals);
    persist(dogs, shows, nextGoals);
    closeModal();
  }

  function deleteGoal(goal) {
    
    const nextGoals = goals.filter((g) => g.id !== goal.id);
    setGoals(nextGoals);
    persist(dogs, shows, nextGoals);
  }

  function saveImportedShows(items) {
    const withIds = items.map((item) => ({ ...item, id: uid(), dogId: activeDogId }));
    const nextShows = [...shows, ...withIds];
    setShows(nextShows);
    persist(dogs, nextShows, goals);
    closeModal();
  }

  function openAddShow() { setModal({ type: 'show', title: 'Legg til utstilling', data: null }); }
  function openEditShow(show) { setModal({ type: 'show', title: show.status === 'done' ? 'Rediger resultat' : 'Rediger utstilling', data: show }); }
  function openLogResult(show) {
    setModal({
      type: 'show',
      title: 'Logg resultat',
      data: {
        ...show,
        status: 'done',
        certs: show.certs || { ...DEFAULT_CERTS },
        judge: show.judge || '',
        placement: show.placement || '-',
        breedPlacement: show.breedPlacement || '-',
        bigPlacement: show.bigPlacement || '-',
        quality: show.quality || '',
        ckQuality: !!show.ckQuality,
        hederspris: !!show.hederspris,
        points: show.points === undefined ? '' : show.points,
      },
    });
  }
  function openAddDog() { setModal({ type: 'dog', title: 'Legg til hund', data: null }); }
  function openEditDog(dog) { setModal({ type: 'dog', title: 'Rediger hund', data: dog }); }
  function openAddGoal() { setModal({ type: 'goal', title: 'Legg til mål', data: null }); }
  function openEditGoal(goal) { setModal({ type: 'goal', title: 'Rediger mål', data: goal }); }
  function openImport() { setModal({ type: 'import', title: 'Importer resultater', data: null }); }

  if (loading) {
    return (
      <div className="dst-app flex items-center justify-center" style={{ minHeight: '100vh' }}>
        <style>{CSS}</style>
        <div className="dst-mono text-sm" style={{ color: 'var(--cream-soft)' }}>Loading your kennel ledger&hellip;</div>
      </div>
    );
  }

  function exportData() {
    const data = { version: 2, exportedAt: new Date().toISOString(), dogs, shows, goals };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laban-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (!ev.target) return;
      try {
        const data = JSON.parse(ev.target.result);
        const d = data.dogs || [];
        const s = data.shows || [];
        const g = data.goals || [];
        setDogs(d); setShows(s); setGoals(g);
        if (d.length > 0) setActiveDogId(d[0].id);
        persist(d, s, g);
        alert(`Importert! ${d.length} hund(er), ${s.length} utstilling(er), ${g.length} mål.`);
      } catch (err) {
        alert('Kunne ikke lese filen. Sjekk at det er en gyldig backup-fil.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  const activeDog = dogs.find((d) => d.id === activeDogId) || dogs[0] || null;
  const dogShows = activeDog ? shows.filter((s) => s.dogId === activeDog.id) : [];
  const dogGoals = activeDog ? goals.filter((g) => g.dogId === activeDog.id) : [];

  return (
    <div className="dst-app">
      <style>{CSS}</style>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.25rem 1rem 6.5rem' }}>
        <div className="flex items-center justify-between mb-5 gap-3">
          <div>
            <div className="dst-mono text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--brass)' }}>Kennel Ledger</div>
            {(!activeDog || tab !== 'dashboard') && (
              <div className="dst-display font-semibold" style={{ fontSize: '1.4rem', color: 'var(--cream)' }}>
                {activeDog ? activeDog.name : 'Dog Show Tracker'}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {dogs.length > 1 && (
              <select
                className="dst-select-dark"
                value={activeDog ? activeDog.id : ''}
                onChange={(e) => setActiveDogId(e.target.value)}
              >
                {dogs.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            )}
            <button onClick={exportData} className="dst-btn-secondary" style={{ padding: '0.55rem', fontSize: '0.75rem' }} title="Eksporter data">
              ↓
            </button>
            <button onClick={() => importFileRef.current?.click()} className="dst-btn-secondary" style={{ padding: '0.55rem', fontSize: '0.75rem' }} title="Importer data">
              ↑
            </button>
            <input ref={importFileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImportFile} />
            <button onClick={openAddDog} className="dst-btn-secondary" style={{ padding: '0.55rem' }} title="Legg til hund">
              <Plus size={18} />
            </button>
          </div>
        </div>

        {!activeDog ? (
          <WelcomeCard onAdd={openAddDog} />
        ) : (
          <>
            {tab === 'dashboard' && (
              <Dashboard
                dog={activeDog}
                dogShows={dogShows}
                dogGoals={dogGoals}
                onGoToShows={() => setTab('shows')}
                onGoToGoals={() => setTab('goals')}
              />
            )}
            {tab === 'shows' && (
              <ShowsTab
                dog={activeDog}
                dogShows={dogShows}
                onAdd={openAddShow}
                onEdit={openEditShow}
                onDelete={deleteShow}
                onLogResult={openLogResult}
                onImport={openImport}
              />
            )}
            {tab === 'goals' && (
              <GoalsTab dog={activeDog} dogShows={dogShows} dogGoals={dogGoals} onAdd={openAddGoal} onEdit={openEditGoal} onDelete={deleteGoal} />
            )}
            {tab === 'dogs' && (
              <DogsTab
                dogs={dogs} shows={shows} goals={goals} activeDogId={activeDog.id}
                onSelect={setActiveDogId} onAdd={openAddDog} onEdit={openEditDog} onDelete={deleteDog}
              />
            )}
          </>
        )}
      </div>

      {activeDog && (
        <nav className="dst-nav" aria-label="Hovedmeny">
          <div className="dst-nav-inner">
            {TABS.map(({ key, label, Icon }) => (
              <button key={key} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>
                <Icon size={22} />
                {label}
              </button>
            ))}
          </div>
        </nav>
      )}

      {modal && modal.type === 'dog' && (
        <Modal title={modal.title} onClose={closeModal}>
          <DogForm initial={modal.data} onSave={saveDog} onCancel={closeModal} />
        </Modal>
      )}
      {modal && modal.type === 'show' && (
        <Modal title={modal.title} onClose={closeModal}>
          <ShowForm dog={activeDog} initial={modal.data} onSave={saveShow} onCancel={closeModal} />
        </Modal>
      )}
      {modal && modal.type === 'goal' && (
        <Modal title={modal.title} onClose={closeModal}>
          <GoalForm initial={modal.data} onSave={saveGoal} onCancel={closeModal} />
        </Modal>
      )}
      {modal && modal.type === 'import' && (
        <Modal title={modal.title} onClose={closeModal}>
          <ImportForm onImport={saveImportedShows} onCancel={closeModal} />
        </Modal>
      )}
    </div>
  );
}
