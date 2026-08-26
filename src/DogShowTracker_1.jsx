import React, { useState, useEffect } from 'react';
import { Plus, X, Check, Trophy, Pencil, Trash2, MapPin } from 'lucide-react';

const STORAGE_KEYS = {
  dogs: 'dogshow_dogs',
  shows: 'dogshow_shows',
  goals: 'dogshow_goals',
};

const CERT_TYPES = [
  { code: 'CERT', short: 'CERT', full: 'CERT (Certificate)' },
  { code: 'RCERT', short: 'RES', full: 'Reserve Certificate (R-CERT)' },
  { code: 'JUNCERT', short: 'JUN', full: 'Junior/Veteran Certificate (JUN/VET CERT)' },
  { code: 'CACIB', short: 'CACIB', full: 'CACIB' },
  { code: 'CACIBJ', short: 'C-J', full: 'Junior CACIB (CACIB-J)' },
  { code: 'CACIT', short: 'CACIT', full: 'CACIT' },
  { code: 'BIR', short: 'BIR', full: 'Best of Breed (BIR)' },
  { code: 'BIM', short: 'BIM', full: 'Best of Breed, opposite sex (BIM)' },
  { code: 'BIS', short: 'BIS', full: 'Best in Show (BIS)' },
];

const DEFAULT_CERTS = { CERT: false, RCERT: false, JUNCERT: false, CACIB: false, CACIBJ: false, CACIT: false, BIR: false, BIM: false, BIS: false };

const CLASSES = ['Baby (4-6 mnd)', 'Valp (6-9 mnd)', 'Junior (9-18 mnd)', 'Unghund (15-24 mnd)', 'Åpen', 'Bruk', 'Champion', 'Veteran', 'Annet'];

const QUALITY_GRADES = ['Excellent', 'Very Good', 'Good', 'Sufficient', 'Disqualified', 'Absent'];

const PLACEMENTS = ['1', '2', '3', '4', '-'];

const GOAL_TEMPLATES = [
  {
    key: 'nuch',
    title: 'Norwegian Champion (N UCH)',
    trackedCert: 'CERT',
    targetCount: 3,
    trackDistinctJudges: true,
    minDistinctJudges: 2,
    trackDistinctCountries: false,
    minDistinctCountries: 1,
    description:
      "Needs 3 CKs under at least 2 different judges, with at least 1 year and 1 day between the first and last CK. The dog must be at least 24 months old when the final CK is awarded. Check the exact requirements for this breed with NKK.",
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
.dst-input,.dst-select,.dst-textarea{ width:100%; padding:0.55rem 0.75rem; border-radius:10px; border:1px solid var(--line-dark); background:#fff; color:var(--ink); font-family:'Work Sans',sans-serif; font-size:0.9rem; }
.dst-textarea{ resize:vertical; }
.dst-input:focus,.dst-select:focus,.dst-textarea:focus{ outline:2px solid var(--brass); outline-offset:1px; border-color:var(--brass); }
.dst-label{ font-size:0.72rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--ink-soft); margin-bottom:0.3rem; display:block; font-weight:700; }
.dst-btn-primary{ background:var(--brass); color:#2B2200; border:none; border-radius:12px; padding:0.6rem 1.2rem; font-weight:700; font-size:0.875rem; cursor:pointer; font-family:'Work Sans',sans-serif; }
.dst-btn-primary[disabled]{ opacity:0.5; cursor:default; }
.dst-btn-secondary{ background:transparent; color:var(--cream); border:1px solid var(--line); border-radius:12px; padding:0.55rem 1rem; font-weight:600; font-size:0.85rem; cursor:pointer; display:inline-flex; align-items:center; gap:0.4rem; font-family:'Work Sans',sans-serif; }
.dst-btn-secondary:hover{ border-color:var(--brass); color:var(--brass); }
.dst-btn-light{ background:transparent; border:1px solid var(--line-dark); color:var(--ink-soft); border-radius:10px; padding:0.4rem 0.85rem; font-size:0.8rem; cursor:pointer; font-weight:600; display:inline-flex; align-items:center; gap:0.35rem; font-family:'Work Sans',sans-serif; }
.dst-btn-light:hover{ background:var(--surface-2); }
.dst-btn-light.danger{ color:var(--rust); border-color:var(--rust); }
.dst-chip{ display:inline-flex; align-items:center; gap:0.35rem; padding:0.4rem 0.75rem; border-radius:999px; border:1px solid var(--line-dark); font-size:0.8rem; cursor:pointer; background:#fff; color:var(--ink); font-weight:600; font-family:'Work Sans',sans-serif; text-align:left; }
.dst-chip.checked{ background:var(--brass-soft); border-color:var(--brass); color:var(--brass-ink); }
.dst-select-dark{ background:var(--ink-bg-2); color:var(--cream); border:1px solid var(--line); border-radius:10px; padding:0.45rem 0.6rem; font-family:'Work Sans',sans-serif; font-size:0.85rem; }
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
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
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

function computeGoalProgress(goal, dogShows) {
  const qualifying = dogShows.filter(
    (s) => s.status === 'done' && s.certs && s.certs[goal.trackedCert]
  );
  const count = qualifying.length;
  const judgeSet = new Set(qualifying.map((s) => (s.judge || '').trim()).filter(Boolean));
  const countrySet = new Set(qualifying.map((s) => (s.country || '').trim()).filter(Boolean));
  const meetsCount = count >= goal.targetCount;
  const meetsJudges = !goal.trackDistinctJudges || judgeSet.size >= goal.minDistinctJudges;
  const meetsCountries = !goal.trackDistinctCountries || countrySet.size >= goal.minDistinctCountries;
  return {
    count,
    judgeCount: judgeSet.size,
    countryCount: countrySet.size,
    complete: meetsCount && meetsJudges && meetsCountries,
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
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: 'rgba(22,36,29,0.6)', zIndex: 50 }}
      onClick={onClose}
    >
      <div
        className="dst-card w-full rounded-2xl p-5"
        style={{ maxWidth: '480px', maxHeight: '85vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
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
    <div className="dst-card p-6 rounded-2xl text-center">
      <div className="dst-display text-xl font-semibold mb-2">Velkommen til kennelboken</div>
      <div className="text-sm mb-4" style={{ color: 'var(--ink-soft)' }}>
        Legg til hunden din for å begynne å spore kommende utstillinger, resultater og mål som å bli champion.
      </div>
      <button className="dst-btn-primary" onClick={onAdd}>Legg til hunden</button>
    </div>
  );
}

function EmptyHint({ text }) {
  return (
    <div className="dst-card p-4 rounded-2xl text-sm" style={{ color: 'var(--ink-soft)' }}>
      {text}
    </div>
  );
}

function ResultCard({ show, onEdit, onDelete }) {
  const earned = CERT_TYPES.filter((c) => show.certs && show.certs[c.code]);
  return (
    <div className="dst-card p-4 rounded-2xl mb-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="dst-mono text-xs" style={{ color: 'var(--ink-soft)' }}>{formatDate(show.date)}</div>
          <div className="font-semibold mt-0.5">{show.showName}</div>
          <div className="text-sm flex items-center gap-1 mt-0.5" style={{ color: 'var(--ink-soft)' }}>
            {show.location && <MapPin size={12} />}
            {show.location}{show.dogClass ? ` \u00B7 ${show.dogClass} class` : ''}
          </div>
          {show.judge && (
            <div className="text-xs mt-1" style={{ color: 'var(--ink-soft)' }}>Dommer: {show.judge}</div>
          )}
        </div>
        {show.quality && (
          <div className="text-right">
            <div className="text-sm font-semibold" style={{ color: gradeColor(show.quality) }}>
              {show.quality}
              {show.placement && show.placement !== '-' ? ` ${show.placement}${ordinal(show.placement)}` : ''}
            </div>
            {show.breedPlacement && show.breedPlacement !== '-' && (
              <div className="dst-mono text-xs mt-0.5" style={{ color: 'var(--ink-soft)' }}>
                BHK/BTK {show.breedPlacement}{ordinal(show.breedPlacement)}
              </div>
            )}
            {show.bigPlacement && show.bigPlacement !== '-' && (
              <div className="dst-mono text-xs mt-0.5 font-bold" style={{ color: 'var(--brass-ink)' }}>
                BIG {show.bigPlacement}{ordinal(show.bigPlacement)}
              </div>
            )}
          </div>
        )}
      </div>
      {(earned.length > 0 || show.ckQuality || show.hederspris) && (
        <div className="flex gap-2 mt-3 flex-wrap items-center">
          {earned.map((c) => <CertStamp key={c.code} code={c.code} earned size="sm" />)}
          {show.ckQuality && (
            <span className="dst-mono" style={{ fontSize: '0.7rem', color: 'var(--sage)', border: '1px solid var(--sage)', borderRadius: '999px', padding: '0.2rem 0.55rem' }}>
              CK quality
            </span>
          )}
          {show.hederspris && (
            <span className="dst-mono" style={{ fontSize: '0.7rem', color: 'var(--brass-ink)', border: '1px solid var(--brass)', borderRadius: '999px', padding: '0.2rem 0.55rem' }}>
              Hederspris
            </span>
          )}
        </div>
      )}
      {show.points !== '' && show.points !== undefined && show.points !== null && (
        <div className="dst-mono text-xs mt-2" style={{ color: 'var(--ink-soft)' }}>{show.points} points</div>
      )}
      {show.notes && <div className="text-sm mt-2">{show.notes}</div>}
      <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--line-dark)' }}>
        <button onClick={onEdit} className="dst-btn-light"><Pencil size={13} />Rediger</button>
        <button onClick={onDelete} className="dst-btn-light danger"><Trash2 size={13} />Slett</button>
      </div>
    </div>
  );
}

function UpcomingCard({ show, onEdit, onDelete, onLogResult }) {
  return (
    <div className="dst-card p-4 rounded-2xl mb-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="dst-mono text-xs" style={{ color: 'var(--ink-soft)' }}>{formatDate(show.date)}</div>
          <div className="font-semibold mt-0.5">{show.showName}</div>
          <div className="text-sm flex items-center gap-1 mt-0.5" style={{ color: 'var(--ink-soft)' }}>
            {show.location && <MapPin size={12} />}
            {show.location}{show.dogClass ? ` \u00B7 ${show.dogClass} class` : ''}
          </div>
        </div>
        <div className="dst-display text-2xl font-bold text-right" style={{ color: 'var(--rust)' }}>
          {daysUntil(show.date)}
          <div className="text-xs font-normal dst-mono" style={{ color: 'var(--ink-soft)' }}>dager</div>
        </div>
      </div>
      {show.notes && <div className="text-sm mt-2">{show.notes}</div>}
      <div className="flex gap-2 mt-3 pt-3 flex-wrap" style={{ borderTop: '1px solid var(--line-dark)' }}>
        <button onClick={onLogResult} className="dst-btn-light" style={{ borderColor: 'var(--brass)', color: 'var(--brass-ink)' }}>
          <Trophy size={13} />Log result
        </button>
        <button onClick={onEdit} className="dst-btn-light"><Pencil size={13} />Rediger</button>
        <button onClick={onDelete} className="dst-btn-light danger"><Trash2 size={13} />Slett</button>
      </div>
    </div>
  );
}

function GoalCard({ goal, progress, onEdit, onDelete }) {
  return (
    <div className="dst-card p-4 rounded-2xl mb-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="dst-display text-lg font-semibold">{goal.title}</div>
          {goal.description && (
            <div className="text-sm mt-1" style={{ color: 'var(--ink-soft)' }}>{goal.description}</div>
          )}
        </div>
        {progress.complete && (
          <div className="dst-mono text-xs font-bold flex items-center gap-1 flex-shrink-0" style={{ color: 'var(--sage)' }}>
            <Trophy size={15} />Achieved
          </div>
        )}
      </div>
      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
        {Array.from({ length: goal.targetCount }).map((_, i) => (
          <CertStamp key={i} code={goal.trackedCert} earned={i < progress.count} size="sm" />
        ))}
        <span className="dst-mono text-xs ml-1" style={{ color: 'var(--ink-soft)' }}>
          {progress.count} / {goal.targetCount} {goal.trackedCert}
        </span>
      </div>
      {(goal.trackDistinctJudges || goal.trackDistinctCountries) && (
        <div className="dst-mono text-xs mt-2 flex gap-3" style={{ color: 'var(--ink-soft)' }}>
          {goal.trackDistinctJudges && <span>Dommere {progress.judgeCount}/{goal.minDistinctJudges}</span>}
          {goal.trackDistinctCountries && <span>Land {progress.countryCount}/{goal.minDistinctCountries}</span>}
        </div>
      )}
      <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--line-dark)' }}>
        <button onClick={onEdit} className="dst-btn-light"><Pencil size={13} />Rediger</button>
        <button onClick={onDelete} className="dst-btn-light danger"><Trash2 size={13} />Slett</button>
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

function ShowForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial || {
      date: '', showName: '', location: '', country: 'Norway', dogClass: 'Open',
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
              CK quality (Certifikatkvalitet)
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
            <div className="font-bold">{t.title || 'Custom goal'}</div>
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
        Require different judges
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
        Require different countries
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
        className="dst-card p-4 rounded-xl text-center cursor-pointer"
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


function Dashboard({ dog, dogShows, dogGoals }) {
  const upcoming = dogShows.filter((s) => s.status === 'upcoming').sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = dogShows.filter((s) => s.status === 'done').sort((a, b) => new Date(b.date) - new Date(a.date));
  const nextShow = upcoming[0];
  const recent = past.slice(0, 3);

  return (
    <div className="space-y-5">
      {nextShow ? (
        <div className="dst-card p-5 rounded-2xl flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wide font-bold" style={{ color: 'var(--ink-soft)' }}>Neste utstilling</div>
            <div className="dst-display text-xl font-semibold mt-1">{nextShow.showName}</div>
            <div className="text-sm mt-1" style={{ color: 'var(--ink-soft)' }}>{formatDate(nextShow.date)} &middot; {nextShow.location}</div>
          </div>
          <div className="text-center flex-shrink-0">
            <div className="dst-display text-4xl font-bold" style={{ color: 'var(--rust)' }}>{daysUntil(nextShow.date)}</div>
            <div className="text-xs uppercase dst-mono" style={{ color: 'var(--ink-soft)' }}>dager</div>
          </div>
        </div>
      ) : (
        <div className="dst-card p-5 rounded-2xl">
          <div className="dst-display text-lg font-semibold">Ingen kommende utstillinger ennå</div>
          <div className="text-sm mt-1" style={{ color: 'var(--ink-soft)' }}>Add the next show on {dog.name}'s calendar from the Shows tab.</div>
        </div>
      )}

      {dogGoals.length > 0 && (
        <div className="dst-card p-5 rounded-2xl">
          <div className="dst-display text-lg font-semibold mb-3">Mål</div>
          <div className="space-y-3">
            {dogGoals.map((goal) => {
              const progress = computeGoalProgress(goal, dogShows);
              return (
                <div key={goal.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">{goal.title}</span>
                    {progress.complete && <Trophy size={15} style={{ color: 'var(--sage)' }} />}
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {Array.from({ length: goal.targetCount }).map((_, i) => (
                      <CertStamp key={i} code={goal.trackedCert} earned={i < progress.count} size="sm" />
                    ))}
                    <span className="dst-mono text-xs ml-1" style={{ color: 'var(--ink-soft)' }}>
                      {progress.count}/{goal.targetCount}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <div className="dst-display text-lg font-semibold mb-3">Siste resultater</div>
        {recent.length === 0 ? (
          <EmptyHint text="Ingen resultater ennå. Resultater vises her når en utstilling er markert som gjennomført." />
        ) : (
          recent.map((s) => <ResultCard key={s.id} show={s} onEdit={() => {}} onDelete={() => {}} />)
        )}
      </div>
    </div>
  );
}

function ShowsTab({ dogShows, onAdd, onEdit, onDelete, onLogResult, onImport }) {
  const [view, setView] = useState('upcoming');
  const upcoming = dogShows.filter((s) => s.status === 'upcoming').sort((a, b) => new Date(a.date) - new Date(b.date));
  const results = dogShows.filter((s) => s.status === 'done').sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="dst-seg">
          <button className={`dst-seg-btn ${view === 'upcoming' ? 'active' : ''}`} onClick={() => setView('upcoming')}>
            Kommende ({upcoming.length})
          </button>
          <button className={`dst-seg-btn ${view === 'results' ? 'active' : ''}`} onClick={() => setView('results')}>
            Resultater ({results.length})
          </button>
        </div>
        <div className="flex gap-2">
          <button className="dst-btn-secondary" onClick={onImport}>Importer resultater</button>
          <button className="dst-btn-secondary" onClick={onAdd}><Plus size={15} />Legg til utstilling</button>
        </div>
      </div>
      {view === 'upcoming' ? (
        upcoming.length === 0 ? (
          <EmptyHint text="Ingen kommende utstillinger. Legg til den neste i kalenderen." />
        ) : (
          upcoming.map((s) => (
            <UpcomingCard key={s.id} show={s} onEdit={() => onEdit(s)} onDelete={() => onDelete(s)} onLogResult={() => onLogResult(s)} />
          ))
        )
      ) : results.length === 0 ? (
        <EmptyHint text="Ingen resultater ennå. Logg et resultat fra Kommende-fanen etter en utstilling, eller legg til et tidligere resultat direkte." />
      ) : (
        results.map((s) => <ResultCard key={s.id} show={s} onEdit={() => onEdit(s)} onDelete={() => onDelete(s)} />)
      )}
    </div>
  );
}

function GoalsTab({ dogShows, dogGoals, onAdd, onEdit, onDelete }) {
  return (
    <div>
      <div className="flex justify-end mb-3">
        <button className="dst-btn-secondary" onClick={onAdd}><Plus size={15} />Legg til mål</button>
      </div>
      {dogGoals.length === 0 ? (
        <EmptyHint text="Ingen mål ennå. Sett et mål, som å bli champion, for å spore fremgangen." />
      ) : (
        dogGoals.map((g) => (
          <GoalCard key={g.id} goal={g} progress={computeGoalProgress(g, dogShows)} onEdit={() => onEdit(g)} onDelete={() => onDelete(g)} />
        ))
      )}
    </div>
  );
}

function DogsTab({ dogs, shows, goals, activeDogId, onSelect, onAdd, onEdit, onDelete }) {
  return (
    <div>
      <div className="flex justify-end mb-3">
        <button className="dst-btn-secondary" onClick={onAdd}><Plus size={15} />Legg til hund</button>
      </div>
      {dogs.map((dog) => {
        const dogShows = shows.filter((s) => s.dogId === dog.id);
        const certCount = dogShows.filter((s) => s.status === 'done' && s.certs && s.certs.CERT).length;
        const dogGoals = goals.filter((g) => g.dogId === dog.id);
        const goalsCompleted = dogGoals.filter((g) => computeGoalProgress(g, dogShows).complete).length;
        const isActive = dog.id === activeDogId;
        return (
          <div
            key={dog.id}
            className="dst-card p-4 rounded-2xl mb-3"
            style={{ outline: isActive ? '2px solid var(--brass)' : 'none', outlineOffset: '2px' }}
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <div className="dst-display text-lg font-semibold">{dog.name}</div>
                <div className="text-sm" style={{ color: 'var(--ink-soft)' }}>
                  {dog.breed}{dog.sex ? ` \u00B7 ${dog.sex}` : ''}
                </div>
                {dog.regName && <div className="dst-mono text-xs mt-1" style={{ color: 'var(--ink-soft)' }}>{dog.regName}</div>}
              </div>
              {!isActive && <button className="dst-btn-light" onClick={() => onSelect(dog.id)}>Velg</button>}
            </div>
            <div className="flex gap-4 mt-3 dst-mono text-xs" style={{ color: 'var(--ink-soft)' }}>
              <div>{dogShows.length} utstillinger</div>
              <div>{certCount} CERT</div>
              <div>{goalsCompleted}/{dogGoals.length} mål nådd</div>
            </div>
            <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--line-dark)' }}>
              <button onClick={() => onEdit(dog)} className="dst-btn-light"><Pencil size={13} />Rediger</button>
              <button onClick={() => onDelete(dog)} className="dst-btn-light danger"><Trash2 size={13} />Slett</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const TABS = [
  { key: 'dashboard', label: 'Oversikt' },
  { key: 'shows', label: 'Utstillinger' },
  { key: 'goals', label: 'Mål' },
  { key: 'dogs', label: 'Hunder' },
];

export default function App() {
  const [dogs, setDogs] = useState([]);
  const [shows, setShows] = useState([]);
  const [goals, setGoals] = useState([]);
  const [activeDogId, setActiveDogId] = useState(null);
  const [tab, setTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const SERVER = 'http://localhost:3001';

  useEffect(() => {
    fetch(`${SERVER}/api/data`)
      .then((r) => r.json())
      .then((data) => {
        const d = data.dogs || [];
        const s = data.shows || [];
        const g = data.goals || [];
        setDogs(d);
        setShows(s);
        setGoals(g);
        if (d.length > 0) setActiveDogId(d[0].id);
        setLoading(false);
      })
      .catch(() => {
        // Server ikke tilgjengelig — fall tilbake til localStorage
        const d = JSON.parse(localStorage.getItem(STORAGE_KEYS.dogs) || '[]');
        const s = JSON.parse(localStorage.getItem(STORAGE_KEYS.shows) || '[]');
        const g = JSON.parse(localStorage.getItem(STORAGE_KEYS.goals) || '[]');
        setDogs(d); setShows(s); setGoals(g);
        if (d.length > 0) setActiveDogId(d[0].id);
        setLoading(false);
      });
  }, []);

  function persist(dogs, shows, goals) {
    fetch(`${SERVER}/api/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dogs, shows, goals }),
    }).catch(() => {
      // Fall tilbake til localStorage hvis server er nede
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
    if (!window.confirm(`Slette ${dog.name} og alle tilknyttede utstillinger og mål? Dette kan ikke angres.`)) return;
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
    if (!window.confirm('Slette denne utstillingen?')) return;
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
    if (!window.confirm('Slette dette målet?')) return;
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

  const activeDog = dogs.find((d) => d.id === activeDogId) || dogs[0] || null;
  const dogShows = activeDog ? shows.filter((s) => s.dogId === activeDog.id) : [];
  const dogGoals = activeDog ? goals.filter((g) => g.dogId === activeDog.id) : [];

  return (
    <div className="dst-app">
      <style>{CSS}</style>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <div>
            <div className="dst-mono text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--brass)' }}>Kennel Ledger</div>
            <div className="dst-display font-semibold" style={{ fontSize: '1.6rem', color: 'var(--cream)' }}>
              {activeDog ? activeDog.name : 'Dog Show Tracker'}
            </div>
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
            <button onClick={openAddDog} className="dst-btn-secondary" style={{ padding: '0.55rem' }} title="Legg til hund">
              <Plus size={18} />
            </button>
          </div>
        </div>

        {!activeDog ? (
          <WelcomeCard onAdd={openAddDog} />
        ) : (
          <>
            <div className="dst-tabbar">
              {TABS.map((t) => (
                <button key={t.key} className={`dst-tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
                  {t.label}
                </button>
              ))}
            </div>
            {tab === 'dashboard' && <Dashboard dog={activeDog} dogShows={dogShows} dogGoals={dogGoals} />}
            {tab === 'shows' && (
              <ShowsTab
                dogShows={dogShows}
                onAdd={openAddShow}
                onEdit={openEditShow}
                onDelete={deleteShow}
                onLogResult={openLogResult}
                onImport={openImport}
              />
            )}
            {tab === 'goals' && (
              <GoalsTab dogShows={dogShows} dogGoals={dogGoals} onAdd={openAddGoal} onEdit={openEditGoal} onDelete={deleteGoal} />
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

      {modal && modal.type === 'dog' && (
        <Modal title={modal.title} onClose={closeModal}>
          <DogForm initial={modal.data} onSave={saveDog} onCancel={closeModal} />
        </Modal>
      )}
      {modal && modal.type === 'show' && (
        <Modal title={modal.title} onClose={closeModal}>
          <ShowForm initial={modal.data} onSave={saveShow} onCancel={closeModal} />
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
