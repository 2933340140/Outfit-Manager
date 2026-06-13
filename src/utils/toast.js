// ── Toast 通知 ───────────────────────────────────────

export function toast(msg, isErr) {
    var el = document.createElement('div');
    el.textContent = msg;
    Object.assign(el.style, {
        position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
        background: isErr ? '#e74c3c' : '#2ecc71', color: '#fff',
        padding: '8px 18px', borderRadius: '8px', fontSize: '14px',
        zIndex: '100002', opacity: '0', transition: 'opacity .3s',
        pointerEvents: 'none', maxWidth: '80vw', textAlign: 'center',
    });
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.style.opacity = '1'; });
    setTimeout(function () {
        el.style.opacity = '0';
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 400);
    }, 2500);
}
