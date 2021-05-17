import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'underscore';
import 'jquery-nearest';

import Card from './Card.jsx';
import Droppable from './Droppable';

import * as actions from '../../actions';

export class InnerGameLocation extends React.Component {
    constructor() {
        super();

        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
        this.onDragDrop = this.onDragDrop.bind(this);

        this.state = {
            width: '100%'
        };
    }

    componentDidMount() {
        if(this.props.className === 'townsquare') {
            this.props.setTownsquareComponent(this);
        }
    }

    onCardClick(card) {
        this.props.sendGameMessage('cardClicked', card.uuid);
    }

    onMouseOut() {
        this.props.clearZoom();
    }

    onMouseOver(card) {
        this.props.zoomCard(card);
    }

    onDragDrop(card, source, target) {
        var gameLocation = this.props.location.uuid;
        if(this.isStreetSide()) {
            gameLocation = this.props.source;
        }
        this.props.sendGameMessage('drop', card.uuid, target, gameLocation);
    }

    isStreetSide() {
        return this.props.source === 'street-right' || this.props.source === 'street-left';
    }

    cardsHereByPlayer(player) {
        if(!player || this.isStreetSide()) {
            return <div className='card-row'/>;
        }

        var cardRow = _.map(player.cardPiles.cardsInPlay, (card) => {
            if(card.gamelocation === this.props.location.uuid && card.type_code === 'dude') {
                return (<Card 
                    key={ card.uuid } 
                    source='play area' 
                    card={ card } 
                    disableMouseOver={ card.facedown && !card.code } 
                    handleMenuChange={ this.props.handleMenuChange }
                    onMenuItemClick={ this.props.onMenuItemClick }
                    onMouseOver={ this.onMouseOver } 
                    onMouseOut={ this.onMouseOut } 
                    onClick={ this.onCardClick } 
                    onDragDrop={ this.onDragDrop } 
                    isOpponent={ this.props.otherPlayer === player }
                />);
            }
        });

        return <div className='card-row'>{ cardRow }</div>;
    }

    getImageLocation(imageClass) {
        return (<img className={ imageClass } src={ '/img/' + (this.props.location.uuid + '.jpg') } />);
    }

    getCardLocation(card) {
        return (
            <Card key={ card.uuid } source='play area' card={ card } disableMouseOver={ card.facedown && !card.code } onMenuItemClick={ this.props.onMenuItemClick }
                handleMenuChange={ this.props.handleMenuChange } onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } onClick={ this.onCardClick } onDragDrop={ this.onDragDrop } />
        );
    }

    getLocation() {
        var locationClass = 'location';
        var imageClass = 'location-image';
        var frameClass = 'location-frame';

        var cardRegEx = /\d{5}/;
        var isCard = cardRegEx.test(this.props.location.code);

        if(!this.props.location || this.isStreetSide()) {
            return <div />;
        }

        if(this.props.className) {
            locationClass += ' ' + this.props.className;
        }

        if(isCard) {
            frameClass += ' ' + this.props.location.type_code;
        }

        return (
            <div className={ frameClass } ref='locationFrame'>
                <div className={ locationClass } >
                    { isCard ? this.getCardLocation(this.props.location) : this.getImageLocation(imageClass) }
                </div>
            </div>);
    }

    render() {

        let className = '';

        if(this.props.className === 'townsquare') {
            className = 'townsquare-wrapper';
        } else {
            className = 'location-wrapper';
        }
        const style = this.props.style || {};
        style.width = this.state.width;

        return (
            <Droppable onDragDrop={ this.onDragDrop } source='play area' location={ this.props.location }>
                <div className={ className } style={ style }>
                    { this.cardsHereByPlayer(this.props.otherPlayer) }
                    { this.getLocation() }
                    { this.cardsHereByPlayer(this.props.thisPlayer) }
                </div>
            </Droppable>
        );

    }
}

InnerGameLocation.displayName = 'GameLocation';
InnerGameLocation.propTypes = {
    cards: PropTypes.array,
    className: PropTypes.string,
    clearZoom: PropTypes.func,
    handleMenuChange: PropTypes.func,
    location: PropTypes.object.isRequired,
    name: PropTypes.string,
    onClick: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    order: PropTypes.number,
    otherPlayer: PropTypes.object,
    sendGameMessage: PropTypes.func,
    setTownsquareComponent: PropTypes.func,
    source: PropTypes.string,
    style: PropTypes.object,
    thisPlayer: PropTypes.object,
    zoomCard: PropTypes.func
};

function mapStateToProps(state) {
    return {
        cardToZoom: state.cards.zoomCard
    };
}

const GameLocation = connect(mapStateToProps, actions, null, {withRef: true})(InnerGameLocation);

export default GameLocation;
