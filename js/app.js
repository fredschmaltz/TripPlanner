/* Modified version of Trip Planner JS */

// Ensure displayMode is switchable between 'Horizon' and 'Journal'
function setCardStyle(mode) {
    const validModes = ['horizon', 'journal'];
    if (!validModes.includes(mode)) {
        console.error(`Invalid mode: ${mode}`);
        return;
    }

    currentDisplayMode = mode;
    localStorage.setItem('tp-display-mode', mode);

    // Update the UI for the selected styling mode
    document.documentElement.setAttribute('data-display-mode', mode);
    document.querySelectorAll('.tp-style-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.style === mode);
    });

    // Trigger re-render if needed (e.g., if cards layout depends on mode)
    if (TRIP_CONFIG) {
        renderHeader();
        renderTimeline();
    }
}

// Prevent card clicking from closing the overlay
const overlay = document.getElementById('card-overlay');
overlay.addEventListener('click', function (e) {
    // Check if we clicked directly on the overlay and not on any interactable card content
    if (!overlay.contains(e.target.closest('.hz-card, .journal-entry'))) {
        if (!expandedCard) return;

        // Restore layout from expanded card state
        const wrap = expandedCard.parentElement;
        if (wrap && wrap._origGridCol) {
            wrap.style.gridColumn = wrap._origGridCol;
            wrap.style.gridRow = wrap._origGridRow;
        }

        expandedCard.classList.remove('expanded');
        expandedCard = null;

        overlay.classList.remove('active');
    }
});

// Safeguard future references corresponding UI \n