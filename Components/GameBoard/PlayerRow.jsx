import React from 'react';
import PropTypes from 'prop-types';

import CardPile from './CardPile';
import SquishableCardPanel from './SquishableCardPanel';
import DrawDeck from './DrawDeck';
import Droppable from './Droppable';
import DrawHandPanel from './DrawHandPanel';
import DiscardPile from './DiscardPile';

class PlayerRow extends React.Component {
    getOutOfGamePile() {
        let pile = this.props.outOfGamePile;

        if(pile.length === 0) {
            return;
        }

        let outOfGamePile = (<CardPile
            cards={ pile }
            className='additional-cards'
            handleMenuChange={ this.props.handleMenuChange }
            onCardClick={ this.props.onCardClick }
            onDragDrop={ this.props.onDragDrop }
            onMenuItemClick={ this.props.onMenuItemClick }
            onMouseOut={ this.props.onMouseOut }
            onMouseOver={ this.props.onMouseOver }
            popupLocation={ this.props.side }
            source='out of game'
            title='Out of Game'
            size={ this.props.cardSize } />);

        if(this.props.isMe) {
            return (<Droppable onDragDrop={ this.props.onDragDrop } source='out of game'>
                { outOfGamePile }
            </Droppable>);
        }

        return outOfGamePile;
    }

    renderDroppablePile(source, child) {
        if(!this.props.isMe && !this.props.isSolo) {
            return <div style={ { display: 'inline-block', position: 'relative' } }>{ child }</div>;
        } 
        return <Droppable onDragDrop={ this.props.onDragDrop } source={ source } playerName={ this.props.playerName }>{ child }</Droppable>;
    }

    render() {
        let defaultProps = {
            onCardClick: this.props.onCardClick,
            onMouseOut: this.props.onMouseOut,
            onMouseOver: this.props.onMouseOver,
            playerName: this.props.playerName
        };
        let popupProps = {
            onDragDrop: this.props.onDragDrop,
            popupLocation: this.props.side,
            popupStayOpen: this.props.popupStayOpen,
            size: this.props.cardSize
        };
        let cardPileProps = Object.assign(popupProps, defaultProps);

        let hand = (<SquishableCardPanel
            cards={ this.props.hand }
            className='panel hand'
            groupVisibleCards
            maxCards={ 5 }
            handleMenuChange={ this.props.handleMenuChange }
            onMenuItemClick={ this.props.onMenuItemClick }
            disablePopup
            source='hand'
            title='Hand'
            cardSize={ this.props.cardSize } 
            { ...defaultProps } />);
        let drawHand = (<DrawHandPanel
            cards={ this.props.drawHand }
            className='panel hand'
            groupVisibleCards
            isMe={ this.props.isMe }
            maxCards={ 5 }
            onDiscardSelectedClick={ this.props.onDiscardSelectedClick }
            onMenuItemClick={ this.props.onMenuItemClick }
            onPopupClose={ this.props.onDrawPopupClose }
            source='draw hand'
            title='Draw Hand'
            cardSize={ this.props.cardSize }
            { ...cardPileProps } />);		
        let drawDeck = (<DrawDeck
            cardCount={ this.props.numDrawCards }
            cards={ this.props.drawDeck }
            isMe={ this.props.isMe }
            handleMenuChange={ this.props.handleMenuChange }
            numDrawCards={ this.props.numDrawCards }
            onPopupChange={ this.props.onDrawPopupChange }
            onShuffleClick={ this.props.onShuffleClick }
            showDeck={ this.props.showDeck }
            spectating={ this.props.spectating }
            { ...cardPileProps } />);
        let discardPile = <DiscardPile cards={ this.props.discardPile } { ...cardPileProps } />;
        let deadPile = (<CardPile className='dead' title='Boot Hill' source='dead pile' cards={ this.props.deadPile }
            orientation='booted'
            { ...cardPileProps } />);
        let beingPlayed = (<CardPile className='beingPlayed' title='Played/ Pulled' source='being played' cards={ this.props.beingPlayed }
            { ...cardPileProps } />);
        // <HandRank onMouseOver={this.props.onMouseOver} onMouseOut={this.props.onMouseOut} handrank={this.props.handrank} />
        return (
            <div className='player-home-row-container'>
                { this.renderDroppablePile('hand', hand) }
                { this.renderDroppablePile('draw deck', drawDeck) }
                { this.renderDroppablePile('discard pile', discardPile) }
                { this.renderDroppablePile('dead pile', deadPile) }
                { this.renderDroppablePile('being played', beingPlayed) }
                { this.renderDroppablePile('draw hand', drawHand) }	                

                { this.getOutOfGamePile() }
            </div>
        );
    }
}

PlayerRow.displayName = 'PlayerRow';
PlayerRow.propTypes = {
    beingPlayed: PropTypes.array,
    cardSize: PropTypes.string,
    deadPile: PropTypes.array,
    discardPile: PropTypes.array,
    drawDeck: PropTypes.array,
    drawHand: PropTypes.array,
    hand: PropTypes.array,	
    handleMenuChange: PropTypes.func,
    isMe: PropTypes.bool,
    isSolo: PropTypes.bool,    
    numDrawCards: PropTypes.number,
    onCardClick: PropTypes.func,
    onDiscardSelectedClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onDrawPopupChange: PropTypes.func,
    onDrawPopupClose: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onShuffleClick: PropTypes.func,
    outOfGamePile: PropTypes.array,
    playerName: PropTypes.string,
    popupStayOpen: PropTypes.bool, 
    showDeck: PropTypes.bool,
    side: PropTypes.oneOf(['top', 'bottom']),
    spectating: PropTypes.bool
};

export default PlayerRow;
