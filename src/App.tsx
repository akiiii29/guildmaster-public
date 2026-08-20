import { useEffect, useState, type FormEvent } from 'react'
import { hasTestAccess, verifyTestAccess } from './accessGate'
import { getPwaInstallState, requestPwaInstall, subscribeToPwaInstallState, type PwaInstallState } from './pwa/install'
import './styles.css'

const PUBLIC_REPOSITORY = 'https://github.com/akiiii29/guildmaster-public'

function usePwaInstallState() {
  const [state, setState] = useState<PwaInstallState>(() => getPwaInstallState())
  useEffect(() => {
    const update = () => setState(getPwaInstallState())
    const unsubscribe = subscribeToPwaInstallState(update)
    update()
    return unsubscribe
  }, [])
  return state
}

function Header() {
  return <header className="brand-header">
    <span className="brand-mark" aria-hidden="true">◇</span>
    <div><strong>Guild Master</strong><small>Public frontend snapshot</small></div>
  </header>
}

function AccessGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState('')
  const [checking, setChecking] = useState(false)
  const [invalid, setInvalid] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setChecking(true)
    setInvalid(false)
    try {
      if (await verifyTestAccess(code)) onUnlock()
      else setInvalid(true)
    } finally {
      setChecking(false)
    }
  }

  return <main className="gate-screen">
    <section className="gate-card" aria-labelledby="access-title">
      <Header />
      <div className="gate-copy">
        <h1 id="access-title">Private test access</h1>
        <p>Enter a demo invite code to inspect the frontend snapshot.</p>
      </div>
      <form className="gate-form" onSubmit={(event) => void submit(event)}>
        <label htmlFor="access-code">Invite code</label>
        <input id="access-code" value={code} onChange={(event) => { setCode(event.target.value); setInvalid(false) }} autoComplete="one-time-code" autoCapitalize="characters" spellCheck={false} placeholder="DEMO-••••-••••" aria-invalid={invalid} />
        <button type="submit" disabled={checking || code.trim().length === 0}>{checking ? 'Checking…' : 'Unlock snapshot'}</button>
      </form>
      {invalid && <p className="error" role="alert">That code is not configured for this snapshot.</p>}
      <a href={PUBLIC_REPOSITORY} target="_blank" rel="noreferrer">↗ View the public source</a>
      <small className="note">Production invite codes and game content are not included here.</small>
    </section>
  </main>
}

function InstallGate({ state }: { state: PwaInstallState }) {
  const [working, setWorking] = useState(false)
  const [feedback, setFeedback] = useState<'accepted' | 'dismissed' | null>(null)

  const install = async () => {
    setWorking(true)
    setFeedback(null)
    try {
      const result = await requestPwaInstall()
      if (result === 'accepted' || result === 'dismissed') setFeedback(result)
    } finally {
      setWorking(false)
    }
  }

  return <main className="gate-screen">
    <section className="gate-card" aria-labelledby="install-title">
      <Header />
      <div className="gate-copy">
        <h1 id="install-title">Install the app to continue</h1>
        <p>This public shell demonstrates the same standalone-PWA boundary used by the production client.</p>
      </div>
      {state.installed
        ? <p className="success">Installation accepted. Close this tab and open the app icon.</p>
        : state.promptAvailable
          ? <button type="button" onClick={() => void install()} disabled={working}>{working ? 'Opening install…' : 'Install on this device'}</button>
          : <ol className="instructions"><li>Open your browser menu or install icon.</li><li>Choose “Install app” or “Add to Home Screen”.</li><li>Reopen the app from its installed icon.</li></ol>}
      {feedback && <p className={feedback === 'accepted' ? 'success' : 'note'}>{feedback === 'accepted' ? 'Installation accepted.' : 'Installation cancelled.'}</p>}
      <a href={PUBLIC_REPOSITORY} target="_blank" rel="noreferrer">↗ View the public source</a>
    </section>
  </main>
}

function FrontendShell() {
  return <main className="shell-screen">
    <section className="shell-card">
      <Header />
      <span className="eyebrow">Frontend boundary</span>
      <h1>Production game UI omitted</h1>
      <p>This public snapshot contains the access/PWA flow and safe API interfaces. Production game screens, content tables, images and backend adapters stay private.</p>
      <div className="boundary-grid"><article><strong>Included</strong><span>React shell, PWA checks and access flow.</span></article><article><strong>Not included</strong><span>Assets, game data, API endpoints and server code.</span></article></div>
      <a href={PUBLIC_REPOSITORY} target="_blank" rel="noreferrer">↗ Browse this repository</a>
    </section>
  </main>
}

export default function App() {
  const [accessGranted, setAccessGranted] = useState(() => hasTestAccess())
  const installState = usePwaInstallState()
  if (!accessGranted) return <AccessGate onUnlock={() => setAccessGranted(true)} />
  if (!installState.standalone) return <InstallGate state={installState} />
  return <FrontendShell />
}
