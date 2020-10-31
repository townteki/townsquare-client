export function deckStatusLabel(status) {
    if(!status.isValid) {
        return 'Invalid';
    }
    const category = 'Tournament';

    return `${category} (Legal)`;
}
