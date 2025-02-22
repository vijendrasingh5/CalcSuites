function filterCalculators(query) {
    query = query.toLowerCase();
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    let hasResults = false;

    dropdownItems.forEach(item => {
        const calculatorName = item.textContent.toLowerCase();
        const calculatorType = item.getAttribute('data-calculator')?.toLowerCase() || '';
        
        if (calculatorName.includes(query) || calculatorType.includes(query)) {
            item.style.display = '';
            item.closest('.nav-item.dropdown').style.display = '';
            hasResults = true;
        } else {
            item.style.display = 'none';
        }
    });

    // Show/hide dropdown menus based on whether they have visible items
    document.querySelectorAll('.nav-item.dropdown').forEach(dropdown => {
        const hasVisibleItems = Array.from(dropdown.querySelectorAll('.dropdown-item'))
            .some(item => item.style.display !== 'none');
        dropdown.style.display = hasVisibleItems ? '' : 'none';
    });

    // If search is empty, show all items
    if (!query) {
        dropdownItems.forEach(item => {
            item.style.display = '';
            item.closest('.nav-item.dropdown').style.display = '';
        });
    }

    return hasResults;
}