declare global {
    interface Window {
        toggleIdea?: (descId: string, btn: HTMLButtonElement) => void;
    }
}

export function toggleIdea(descId: string, btn: HTMLButtonElement): void {
    const fullEl = document.getElementById(`${descId}-full`);
    const shortEl = document.getElementById(`${descId}-short`);

    if (!fullEl || !shortEl || !btn) return;

    const expandText = btn.getAttribute('data-expand-text') || 'Expand';
    const collapseText = btn.getAttribute('data-collapse-text') || 'Collapse';

    const isHidden = fullEl.style.display === 'none' || fullEl.style.display === '';

    if (isHidden) {
        fullEl.style.display = 'inline';
        shortEl.style.display = 'none';
        btn.innerText = collapseText;
    } else {
        fullEl.style.display = 'none';
        shortEl.style.display = 'inline';
        btn.innerText = expandText;
    }
}

export function initIdeaToggle(): void {
    if (typeof window !== 'undefined') {
        window.toggleIdea = toggleIdea;

        document.addEventListener('click', (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            if (!target) return;

            const btn = target.closest<HTMLButtonElement>('[data-toggle-btn]');
            if (!btn) return;

            const descId = btn.getAttribute('data-desc-id');
            if (descId) {
                toggleIdea(descId, btn);
            }
        });
    }
}

if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initIdeaToggle());
    } else {
        initIdeaToggle();
    }
}
