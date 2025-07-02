
export function generateSessionId() {
    return 'cbw_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

export function detectColorScheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-cbw-theme', 'dark');
    }
}

export function detectReducedMotion() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.setAttribute('data-cbw-reduced-motion', 'true');
    }
}
