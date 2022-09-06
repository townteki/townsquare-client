import React from 'react';
import PropTypes from 'prop-types';

import DeckRow from './DeckRow';

class DeckList extends React.Component {
    render() {
        let { activeDeck, className, decks, onSelectDeck } = this.props;
        let availableDecks = decks || [];
        availableDecks = availableDecks.filter(deck => {
            const isSoloDeck = deck.standaloneDeckId && deck.standaloneDeckId.endsWith('Solo');
            if(this.props.isSolo) {
                return isSoloDeck;
            }
            return !isSoloDeck;
        });

        return (
            <div className={ className }>
                {
                    !availableDecks || availableDecks.length === 0
                        ? 'You have no decks, try adding one'
                        : availableDecks.map((deck, index) => <DeckRow active={ activeDeck && activeDeck._id === deck._id } deck={ deck } key={ index } onSelect={ onSelectDeck } />)
                }
            </div>);
    }
}

DeckList.propTypes = {
    activeDeck: PropTypes.object,
    className: PropTypes.string,
    decks: PropTypes.array,
    isSolo: PropTypes.bool,
    onSelectDeck: PropTypes.func,
    standaloneDecks: PropTypes.bool
};

export default DeckList;
