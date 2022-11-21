import React from 'react';
import PropTypes from 'prop-types';

import TypeaheadLookup from './TypeaheadLookup';

function KeywordLookup(props) {
    let cards = Object.values(props.cards);
    let allKeywords = cards.reduce((keywords, card) => card.printedStats && keywords.concat(card.printedStats.keywords || []), []);
    let uniqueKeywords = [...new Set(allKeywords)];

    uniqueKeywords.sort();

    return (<TypeaheadLookup 
        id='keyword-lookup' values={ uniqueKeywords } 
        onValuesSelected={ props.onKeywordsSelected } 
        defaultSelected={ props.selectedKeywords || [] } 
        buttonTitle='Set'
        autoFocus
    />);
}

KeywordLookup.displayName = 'KeywordLookup';
KeywordLookup.propTypes = {
    cards: PropTypes.object,
    onKeywordsSelected: PropTypes.func,
    selectedKeywords: PropTypes.array
};

export default KeywordLookup;
