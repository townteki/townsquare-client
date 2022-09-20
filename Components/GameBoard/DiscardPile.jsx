import React from 'react';
import PropTypes from 'prop-types';

import CardPile from './CardPile';
import Droppable from './Droppable';
import CardFilter from './CardFilter';
class DiscardPile extends CardFilter {

    handleShowDeckClick() {
        if(this.props.onPopupChange) {
            this.props.onPopupChange({ visible: true });
        }
    }

    handleShuffleClick() {
        if(this.props.onShuffleClick) {
            this.props.onShuffleClick();
        }
    }  

    renderDroppablePile(source, child) {
        return this.props.isMe ? <Droppable onDragDrop={ this.props.onDragDrop } source={ source } playerName={ this.props.playerName }>{ child }</Droppable> : child;
    }

    render() {
        let drawDeckPopupMenu = [];
        this.addFilterButtons(drawDeckPopupMenu);

        return (<CardPile className='discard'
            cards={ this.props.cards }
            filter={ this.state.filter }
            isKeywordFilter={ this.state.isKeywordFilter }
            playerName={ this.props.playerName }
            onCardClick={ this.props.onCardClick }
            onDragDrop={ this.props.onDragDrop }
            onMouseOut={ this.props.onMouseOut }
            onMouseOver={ this.props.onMouseOver }
            popupLocation={ this.props.popupLocation }
            popupMenu={ drawDeckPopupMenu }
            size={ this.props.size }
            source='discard pile'
            title='Discard' />);
    }
}

DiscardPile.propTypes = {
    cardCount: PropTypes.number,
    cards: PropTypes.array,
    handleMenuChange: PropTypes.func,
    isMe: PropTypes.bool,
    onCardClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onPopupChange: PropTypes.func,
    onShuffleClick: PropTypes.func,
    playerName: PropTypes.string,
    popupLocation: PropTypes.oneOf(['top', 'bottom']),
    revealTopCard: PropTypes.bool,
    showDeck: PropTypes.bool,
    size: PropTypes.string,
    spectating: PropTypes.bool
};

export default DiscardPile;
