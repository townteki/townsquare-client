import React from 'react';
import PropTypes from 'prop-types';
import SquishableCardPanel from './SquishableCardPanel';

class DrawHandPanel extends React.Component {
    constructor() {
        super();

        this.handleResizeClick = this.handleResizeClick.bind(this);
        this.handleDiscardClick = this.handleDiscardClick.bind(this);
    }

    getOrderedCards() {
        return this.props.cards.sort((a, b) => {
            if(a.value !== b.value) {
                return a.value - b.value;
            }
            return a.suit - b.suit;
        });
    }

    handleResizeClick() {

    }

    handleDiscardClick() {
        if(this.props.onDiscardSelectedClick) {
            this.props.onDiscardSelectedClick();
        }
    }

    render() {
        let drawHandPopupMenu = [];

        if(this.props.isMe) {
            drawHandPopupMenu.push({ text: 'Change size', icon: 'resize-full', handler: this.handleResizeClick });
            drawHandPopupMenu.push({ text: 'Discard Selected', icon: 'share', handler: this.handleDiscardClick });
        }

        return (
            <SquishableCardPanel
                cards={ this.getOrderedCards() }
                className='panel hand'
                groupVisibleCards
                username={ this.props.username }
                maxCards={ 5 }
                onCardClick={ this.props.onCardClick }
                onDragDrop={ this.props.onCardClick }
                onMenuItemClick={ this.props.onMenuItemClick }
                onMouseOut={ this.props.onMouseOut }
                onMouseOver={ this.props.onMouseOver }
                onPopupChange={ this.handlePopupChange }
                popupLocation={ this.props.popupLocation }
                popupMenu={ drawHandPopupMenu }
                size={ this.props.size }
                source='draw hand'
                title='Draw Hand'
                cardSize={ this.props.cardSize } />
        );
    }
}

DrawHandPanel.displayName = 'DrawHandPanel';
DrawHandPanel.propTypes = {
    cardSize: PropTypes.string,
    cards: PropTypes.array,
    className: PropTypes.string,
    groupVisibleCards: PropTypes.bool,
    isMe: PropTypes.bool,
    maxCards: PropTypes.number,
    onCardClick: PropTypes.func,
    onDiscardSelectedClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onPopupChange: PropTypes.func,
    popupLocation: PropTypes.oneOf(['top', 'bottom']),
    size: PropTypes.number,
    source: PropTypes.string,
    title: PropTypes.string,
    username: PropTypes.string
};

export default DrawHandPanel;
