export function initIdeaToggle(): void {
    document.addEventListener('click', (event: MouseEvent) => {
        const target = event.target as HTMLElement | null;
        if (!target) return;

        const btn = target.closest<HTMLButtonElement>('[data-toggle-btn]');
        if (!btn) return;

        const descId = btn.getAttribute('data-desc-id');
        const expandText = btn.getAttribute('data-expand-text') || 'Expand';
        const collapseText = btn.getAttribute('data-collapse-text') || 'Collapse';

        if (!descId) return;

        const fullEl = document.getElementById(`${descId}-full`);
        const shortEl = document.getElementById(`${descId}-short`);

        if (!fullEl || !shortEl) return;

        if (fullEl.style.display === 'none' || fullEl.style.display === '') {
            fullEl.style.display = 'inline';
            shortEl.style.display = 'none';
            btn.innerText = collapseText;
        } else {
            fullEl.style.display = 'none';
            shortEl.style.display = 'inline';
            btn.innerText = expandText;
        }
    });
}

if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initIdeaToggle());
    } else {
        initIdeaToggle();
    }
}
