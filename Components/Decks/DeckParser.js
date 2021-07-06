const plainPattern = /^(.+)\s?\(((?:.(?!.*\())+)$/;
const bbPattern = /^\[.*?\](.*)\[.+(?:\[i\]\()(.+)\[\/i\]$/;
const mdPattern = /^\[(.*)\].+_\((.+)_$/;

export function lookupCardByName({ cardTitle, cards, packs, options }) {
    let pattern = plainPattern;
    if(options.bbCode) {
        pattern = bbPattern;
    }
    if(options.markdown) {
        pattern = mdPattern;
    }
    const match = cardTitle.trim().match(pattern);
    if(!match) {
        return;
    }

    const shortName = match[1].trim().toLowerCase();
    let packName = match[2] && match[2].trim().toLowerCase();
    // remove last ")"
    packName = packName.slice(0, -1);
    let pack = packName && packs.find(pack => pack.code.toLowerCase() === packName || pack.name.toLowerCase() === packName);

    let matchingCards = cards.filter(card => {
        if(pack) {
            return pack.code === card.pack_code && card.title.toLowerCase() === shortName;
        }

        return card.title.toLowerCase() === shortName;
    });

    matchingCards.sort((a, b) => compareCardByAvailableDate(a, b, packs));

    return { card: matchingCards[0], pack };
}

function compareCardByAvailableDate(a, b, packs) {
    let packA = packs.find(pack => pack.code === a.pack_code);
    let packB = packs.find(pack => pack.code === b.pack_code);

    if(!packA.available && packB.available) {
        return 1;
    }

    if(!packB.available && packA.available) {
        return -1;
    }

    return new Date(packA.available) < new Date(packB.available) ? -1 : 1;
}
