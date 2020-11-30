import React from 'react';
import PropTypes from 'prop-types';

import CardPile from './CardPile';
import Droppable from './Droppable';

class DrawDeck extends React.Component {
    constructor() {
        super();

        this.handlePullClick = this.handlePullClick.bind(this);
        this.handleShowDeckClick = this.handleShowDeckClick.bind(this);
        this.handleShuffleClick = this.handleShuffleClick.bind(this);
        this.handleDrawToDrawHandClick = this.handleDrawToDrawHandClick.bind(this);
        this.handlePopupChange = this.handlePopupChange.bind(this);
    }

    handlePullClick() {
        if(this.props.onPullClick) {
            this.props.onPullClick();
        }
    }    

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

    handleDrawToDrawHandClick() {
        if(this.props.onDrawToDrawHandClick) {
            this.props.onDrawToDrawHandClick();
        }
    }    

    handlePopupChange(event) {
        if(this.props.onPopupChange && !event.visible) {
            this.props.onPopupChange({ visible: false });
        }
    }

    renderDroppablePile(source, child) {
        return this.props.isMe ? <Droppable onDragDrop={ this.props.onDragDrop } source={ source }>{ child }</Droppable> : child;
    }

    render() {
        let drawDeckPopupMenu = [];

        if(this.props.isMe) {
            if(!this.props.showDeck) {
                drawDeckPopupMenu.push({ text: 'View Hidden', icon: 'eye-open', handler: this.handleShowDeckClick });
            }
            drawDeckPopupMenu.push({ text: 'Close and Shuffle', icon: 'random', handler: this.handleShuffleClick, close: true });
        }

        var drawDeckMenu = [
            { text: 'Draw to Draw Hand', handler: this.handleDrawToDrawHandClick},
            { text: 'Show', handler: this.handleShowDeckClick, showPopup: true },
            { text: 'Shuffle', handler: this.handleShuffleClick}
        ];        

        let hasVisibleCards = !!this.props.cards && this.props.cards.some(card => !card.facedown);

        let drawDeck = (<CardPile className='draw'
            cardCount={ this.props.cardCount }
            cards={ this.props.cards }
            disablePopup={ !hasVisibleCards && (this.props.spectating || !this.props.isMe) }
            hiddenTopCard={ !this.props.revealTopCard }
            onCardClick={ this.props.onCardClick }
            onDragDrop={ this.props.onDragDrop }
            onMouseOut={ this.props.onMouseOut }
            onMouseOver={ this.props.onMouseOver }
            onPopupChange={ this.handlePopupChange }
            popupLocation={ this.props.popupLocation }
            popupMenu={ drawDeckPopupMenu }
            menu={ drawDeckMenu }
            size={ this.props.size }
            source='draw deck'
            title='Draw' />);

        return this.renderDroppablePile('draw deck', drawDeck);
    }
}

DrawDeck.propTypes = {
    cardCount: PropTypes.number,
    cards: PropTypes.array,
    isMe: PropTypes.bool,
    onCardClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onPullClick: PropTypes.func,
    onPopupChange: PropTypes.func,
    onShuffleClick: PropTypes.func,
    onDrawToDrawHandClick: PropTypes.func,
    popupLocation: PropTypes.oneOf(['top', 'bottom']),
    revealTopCard: PropTypes.bool,
    showDeck: PropTypes.bool,
    size: PropTypes.string,
    spectating: PropTypes.bool
};

export default DrawDeck;
