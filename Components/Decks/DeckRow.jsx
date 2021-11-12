import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DeckStatusLabel from './DeckStatusLabel';

class DeckRow extends React.Component {
    constructor() {
        super();

        this.handleDeckClick = this.handleDeckClick.bind(this);
    }

    handleDeckClick() {
        if(this.props.onSelect) {
            this.props.onSelect(this.props.deck);
        }
    }

    render() {
        const { deck } = this.props;
        const numColumns = deck.legend ? 9 : 10;

        return (
            <div className={ this.props.active ? 'deck-row active' : 'deck-row' } key={ this.props.deck.name } onClick={ this.handleDeckClick }>
                <div className='col-xs-1 deck-image'><img className='card-small' src={ '/img/cards/' + this.props.deck.outfit.code + '.jpg' } /></div>
                { deck.legend && (<div className='col-xs-1 deck-image'><img className='card-small' src={ '/img/cards/' + this.props.deck.legend.code + '.jpg' } /></div>) }
                <span className={ 'col-xs-' + numColumns + ' col-md-' + numColumns + ' col-lg-' + (numColumns + 1) + ' deck-name' }>
                    <span>{ this.props.deck.name }</span>
                    <DeckStatusLabel className='pull-right text-shadow' status={ this.props.deck.status } />
                </span>
                <div className='row small'>
                    <span className='col-xs-6 col-md-6 deck-factionagenda'>{ this.props.deck.outfit.name }{ this.props.deck.legend && this.props.deck.legend.title ? <span>/{ this.props.deck.legend.title }</span> : null }</span>
                    <span className='col-xs-4 col-md-3 deck-date text-right pull-right'>{ moment(this.props.deck.lastUpdated).format('Do MMM YYYY') }</span>
                </div>
            </div>);
    }
}

DeckRow.displayName = 'DeckRow';
DeckRow.propTypes = {
    active: PropTypes.bool,
    deck: PropTypes.object.isRequired,
    onSelect: PropTypes.func
};

export default DeckRow;
