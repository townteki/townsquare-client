import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'underscore';

import DeckStatus from './DeckStatus';
import AltCard from '../GameBoard/AltCard';

class DeckSummary extends React.Component {
    constructor() {
        super();

        this.onCardMouseOut = this.onCardMouseOut.bind(this);
        this.onCardMouseOver = this.onCardMouseOver.bind(this);

        this.state = {
            cardToShow: ''
        };
    }

    onCardMouseOver(event) {
        let cardToDisplay = Object.values(this.props.deck.drawCards).filter(card => {
            return event.target.innerText === card.card.title;
        });

        this.setState({ cardToShow: cardToDisplay[0].card });
    }

    onCardMouseOut() {
        this.setState({ cardToShow: undefined });
    }

    getCardsToRender() {
        let cardsToRender = [];
        let groupedCards = {};
        let combinedCards = this.props.deck.drawCards;

        _.each(combinedCards, (card) => {
            if(!groupedCards[card.card.type]) {
                groupedCards[card.card.type] = [card];
            } else {
                groupedCards[card.card.type].push(card);
            }
        });

        for(const [key, cardList] of Object.entries(groupedCards)) {
            let cards = [];
            let count = 0;
            let index = 0;

            for(const card of cardList) {
                let cardClassName = 'card-link';
                if(card.starting) {
                    cardClassName += ' starting';
                } 
                cards.push(
                    <div key={ `${card.card.code}${index++}` }>
                        <span>{ card.count + 'x ' }</span>
                        <span className={ cardClassName } onMouseOver={ this.onCardMouseOver } onMouseOut={ this.onCardMouseOut }>
                            { card.card.title }
                        </span>
                    </div>);
                count += parseInt(card.count);
            }

            cardsToRender.push(
                <div className='cards-no-break' key={ key }>
                    <div className='card-group-title'>{ key + ' (' + count.toString() + ')' }</div>
                    <div key={ key } className='card-group'>{ cards }</div>
                </div>);
        }

        return cardsToRender;
    }

    render() {
        if(!this.props.deck || !this.props.cards) {
            return <div>Waiting for selected deck...</div>;
        }

        let cardsToRender = this.getCardsToRender();

        return (
            <div className='deck-summary col-xs-12'>
                { this.state.cardToShow ?
                    <div className={ classNames('hover-card') }>
                        <img className='hover-image' src={ '/img/cards/' + this.state.cardToShow.code + '.jpg' } />
                        <AltCard card={ this.state.cardToShow } />
                    </div> : null }
                <div className='decklist'>
                    <div className='col-xs-2 col-sm-3 no-x-padding'>{ this.props.deck.outfit ? <img className='img-responsive' src={ '/img/cards/' + this.props.deck.outfit.code + '.jpg' } /> : null }</div>
                    <div className='col-xs-8 col-sm-6'>
                        <div className='info-row row'><span>Outfit:</span>{ this.props.deck.outfit ? <span className={ 'pull-right' }>{ this.props.deck.outfit.title }</span> : null }</div>
                        <div className='info-row row' ref='legend'><span>Legend:</span> { this.props.deck.legend && this.props.deck.legend.title ? <span className='pull-right card-link' onMouseOver={ this.onCardMouseOver }
                            onMouseOut={ this.onCardMouseOut }>{ this.props.deck.legend.title }</span> : <span>None</span> }</div>
                        <div className='info-row row' ref='drawCount'><span>Draw deck:</span><span className='pull-right'>{ this.props.deck.status.drawCount } cards</span></div>
                        <div className='info-row row'><span>Validity:</span>
                            <DeckStatus className='pull-right' status={ this.props.deck.status } />
                        </div>
                    </div>
                    <div className='col-xs-2 col-sm-3 no-x-padding'>{ this.props.deck.legend && this.props.deck.legend.code ? <img className='img-responsive' src={ '/img/cards/' + this.props.deck.legend.code + '.jpg' } /> : null }</div>
                </div>
                <div className='col-xs-12 no-x-padding'>
                    <div className='cards'>
                        { cardsToRender }
                    </div>
                </div>					
            </div>);
    }
}

DeckSummary.displayName = 'DeckSummary';
DeckSummary.propTypes = {
    cards: PropTypes.object,
    deck: PropTypes.object
};

export default DeckSummary;
