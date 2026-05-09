declare module '*.sass'
declare module '*.scss'
declare module '*.css'
declare module '*.svg' {
  const content: string
  export default content
}
declare module '*.png' {
  const content: string
  export default content
}
declare module '*.txt' {
  const content: string
  export default content
}
declare module 'chartkick/chart.js'
declare module '@fontsource/*'
declare module 'sortablejs/modular/sortable.core.esm.js' {
  export const Sortable: { mount: (...plugins: unknown[]) => void }
  export const MultiDrag: new () => unknown
  export const AutoScroll: new () => unknown
}

declare const process: {
  env: {
    NODE_ENV: string
    LAMBDEE_HOST: string
    LAMBDEE_PROTOCOL: string
    SCRIPT_SERVICE_EXTERNAL_HOST: string
    SCRIPT_SERVICE_WS_PROTOCOL: string
    LAMBDEE_VERSION: string
  }
}
