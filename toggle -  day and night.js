document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('darkmode-toggle');
    const body = document.body;

    // Récupérer le thème sauvegardé
    const savedTheme = localStorage.getItem('theme') || 'light';

    if (savedTheme === 'dark') {
        toggle.checked = true;
        body.classList.add('dark');
    } else {
        toggle.checked = false;
        body.classList.remove('dark');
    }

    // Écouter le changement
    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    });
});
