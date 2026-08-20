export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export interface PwaInstallState {
  installed: boolean
  standalone: boolean
  ios: boolean
  promptAvailable: boolean
}

export type PwaInstallResult = 'accepted' | 'dismissed' | 'unavailable'

type InstallSubscriber = () => void

let deferredPrompt: BeforeInstallPromptEvent | null = null
let installedDuringSession = false
let captureStarted = false
const subscribers = new Set<InstallSubscriber>()

export function isIosDevice(
  userAgent = typeof navigator === 'undefined' ? '' : navigator.userAgent,
  platform = typeof navigator === 'undefined' ? '' : navigator.platform,
  maxTouchPoints = typeof navigator === 'undefined' ? 0 : navigator.maxTouchPoints,
) {
  return /iPad|iPhone|iPod/i.test(userAgent) || (platform === 'MacIntel' && maxTouchPoints > 1)
}

export function isStandaloneApp() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false
  const navigatorStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true
  return navigatorStandalone || window.matchMedia('(display-mode: standalone)').matches
}

export function getPwaInstallState(): PwaInstallState {
  const standalone = isStandaloneApp()
  return {
    installed: installedDuringSession || standalone,
    standalone,
    ios: isIosDevice(),
    promptAvailable: deferredPrompt !== null,
  }
}

function notifySubscribers() {
  subscribers.forEach((subscriber) => subscriber())
}

export function startPwaInstallCapture() {
  if (captureStarted || typeof window === 'undefined') return
  captureStarted = true

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredPrompt = event as BeforeInstallPromptEvent
    notifySubscribers()
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    installedDuringSession = true
    notifySubscribers()
  })

  window.matchMedia('(display-mode: standalone)').addEventListener('change', notifySubscribers)
}

export function subscribeToPwaInstallState(subscriber: InstallSubscriber) {
  subscribers.add(subscriber)
  return () => {
    subscribers.delete(subscriber)
  }
}

export async function requestPwaInstall(): Promise<PwaInstallResult> {
  const prompt = deferredPrompt
  if (!prompt) return 'unavailable'

  deferredPrompt = null
  notifySubscribers()
  await prompt.prompt()
  const choice = await prompt.userChoice
  return choice.outcome
}
