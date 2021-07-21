export function deckStatusLabel(status) {
    if(!status.basicRules) {
        return 'Invalid';
    }
    if(!status.noBannedCards) {
        return 'Banned';
    }
    if(!status.restrictedRules || !status.noUnreleasedCards) {
        return 'Casual';
    }

    return 'Legal';
}

export function cardSetLabel(cardSet) {
    switch(cardSet) {
        case 'new':
            return 'New Cards';
        case 'original':
            return 'Original Cards';
    }

    return 'Unknown';
}
