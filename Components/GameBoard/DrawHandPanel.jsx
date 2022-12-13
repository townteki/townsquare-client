import React from 'react';
import PropTypes from 'prop-types';
import SquishableCardPanel from './SquishableCardPanel';

class DrawHandPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            popupCardSize: props.cardSize,
            orderType: 'Value'
        };
        this.state.popupCardSize = this.getCurrentCardSize(true);
        this.handleResizeClick = this.handleResizeClick.bind(this);
        this.handleOrderClick = this.handleOrderClick.bind(this);
    }

    getOrderedCards() {
        return this.props.cards.sort((a, b) => {
            if(this.state.orderType === 'Value') {
                if(a.value !== b.value) {
                    return a.value - b.value;
                }
                return a.suit < b.suit ? -1 : 1;
            }
            if(a.suit !== b.suit) {
                return a.suit < b.suit ? -1 : 1;
            }
            return a.value - b.value;
        });
    }

    handleDiscardClick(discardType) {
        if(this.props.onDiscardSelectedClick) {
            this.props.onDiscardSelectedClick(discardType);
        }
    }

    handleResizeClick() {
        this.setState({ popupCardSize: this.getCurrentCardSize() });
    }

    handleOrderClick() {
        this.setState({ orderType: this.state.orderType === 'Value' ? 'Suit' : 'Value' });
    }

    getCurrentCardSize(init) {
        if(init && this.state.popupCardSize === 'x-large') {
            return this.state.popupCardSize;
        }
        switch(this.state.popupCardSize) {
            case 'small':
                return 'normal';
            case 'normal':
                return 'large';
            case 'large':
                return 'x-large';
            case 'x-large':
                return 'small';
        }

        return 'normal';
    }

    render() {
        let drawHandPopupMenu = [];

        if(this.props.isMe) {
            drawHandPopupMenu.push({ text: 'Discard Selected', icon: 'share', handler: this.handleDiscardClick.bind(this, 'discard'), disabled: this.props.cards.some(card => card.selectable) });
            drawHandPopupMenu.push({ text: 'Size', icon: 'resize-full', handler: this.handleResizeClick });
            drawHandPopupMenu.push({ text: ' by ' + this.state.orderType, icon: 'sort-by-attributes', handler: this.handleOrderClick });
            drawHandPopupMenu.push({ text: 'Keep Selected', icon: 'check', handler: this.handleDiscardClick.bind(this, 'keep'), disabled: this.props.cards.some(card => card.selectable) });
        }

        return (
            <SquishableCardPanel
                cards={ this.getOrderedCards() }
                className='panel draw'
                groupVisibleCards
                maxCards={ 5 }
                playerName={ this.props.playerName }
                onCardClick={ this.props.onCardClick }
                onDragDrop={ this.props.onCardClick }
                onMenuItemClick={ this.props.onMenuItemClick }
                onMouseOut={ this.props.onMouseOut }
                onMouseOver={ this.props.onMouseOver }
                onPopupClose={ this.props.onPopupClose }
                popupLocation={ this.props.popupLocation }
                popupMenu={ drawHandPopupMenu }
                popupStayOpen={ this.props.popupStayOpen }
                source='draw hand'
                title='Draw Hand'
                popupCardSize={ this.state.popupCardSize }
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
    onPopupClose: PropTypes.func,
    playerName: PropTypes.string,
    popupLocation: PropTypes.oneOf(['top', 'bottom']),
    popupStayOpen: PropTypes.bool,
    source: PropTypes.string,
    title: PropTypes.string,
    username: PropTypes.string
};

export default DrawHandPanel;
