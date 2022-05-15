declare module 'virtual:pwa-register/preact' {
    // @ts-ignore ignore when preact/hooks is not installed
    import type { StateUpdater } from 'preact/hooks'
  
    export interface RegisterSWOptions {
      immediate?: boolean
      onNeedRefresh?: () => void
      onOfflineReady?: () => void
      onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
      onRegisterError?: (error: any) => void
    }
  
    export function useRegisterSW(options?: RegisterSWOptions): {
      needRefresh: [boolean, StateUpdater<boolean>]
      offlineReady: [boolean, StateUpdater<boolean>]
      updateServiceWorker: (reloadPage?: boolean) => Promise<void>
    }
  }
  