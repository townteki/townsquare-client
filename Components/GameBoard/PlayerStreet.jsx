import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import GameLocation from './GameLocation.jsx';
import 'jquery-nearest';

class PlayerStreet extends React.Component {
    componentDidUpdate() {
        this.props.handleTownsquareWidth();
    }

    buildStreet(player) {
        let onStreet = [];

        let className = this.props.className;
        let outfitIndex = -1;

        className = 'in-town ' + className;

        if(player) {
            let filteredLocations = _.filter(player.locations, (location) => location.order !== null);
            let sortedLocations = _.sortBy(filteredLocations, 'order');
            let index = 0;
            _.each(sortedLocations, (location) => {
                _.map(player.cardPiles.cardsInPlay, (card) => {
                    if(card.uuid === location.uuid) {
                        if(location.order === 0) {
                            outfitIndex = index;
                            onStreet.push({ location, card });
                        } else {
                            onStreet.push(
                                <GameLocation key={ location.uuid }
                                    location={ card }
                                    handleMenuChange={ this.props.handleMenuChange }
                                    onClick={ this.props.onClick }
                                    onMenuItemClick={ this.props.onMenuItemClick }
                                    onMouseOver={ this.props.onMouseOver }
                                    onMouseOut={ this.props.onMouseOut }
                                    otherPlayer={ this.props.otherPlayer }
                                    thisPlayer={ this.props.thisPlayer }
                                    side={ this.props.className }
                                    order={ location.order }/>
                            );
                        }
                        index++;
                    }
                });
            });      
        }

        if(outfitIndex !== -1) {
            onStreet[outfitIndex] = (
                <GameLocation key={ onStreet[outfitIndex].location.uuid }
                    location={ onStreet[outfitIndex].card }
                    handleMenuChange={ this.props.handleMenuChange }
                    onClick={ this.props.onClick }
                    onMenuItemClick={ this.props.onMenuItemClick }
                    onMouseOver={ this.props.onMouseOver }
                    onMouseOut={ this.props.onMouseOut }
                    otherPlayer={ this.props.otherPlayer }
                    thisPlayer={ this.props.thisPlayer }
                    side={ this.props.className }
                    order={ onStreet[outfitIndex].location.order }
                    hasLeftDeed={ player.id === this.props.thisPlayer.id && outfitIndex > 0 }
                    hasRightDeed={ player.id === this.props.thisPlayer.id && outfitIndex < onStreet.length - 1 }/>
            );
        }

        if(onStreet.length === 0) {
            onStreet.push(<GameLocation 
                key='empty' 
                side={ this.props.className } 
                location={ {facedown:true} } 
                thisPlayer={ this.props.thisPlayer }
            />);
        } else {
            onStreet.unshift(<GameLocation 
                source='street-left' 
                key='empty-left' 
                location={ {} } 
                thisPlayer={ this.props.thisPlayer }/>
            );
            onStreet.push(<GameLocation 
                source='street-right' 
                key='empty-right' 
                location={ {} } 
                thisPlayer={ this.props.thisPlayer }/>
            );
        }

        return <div className={ className }>{ onStreet }</div>;
    }

    render() {
        return (
            <div style={ this.props.style } >
                { this.buildStreet(this.props.owner) }
            </div>
        );

    }
}

PlayerStreet.displayName = 'PlayerStreet';
PlayerStreet.propTypes = {
    className: PropTypes.string,
    handleMenuChange: PropTypes.func,
    handleTownsquareWidth: PropTypes.func,
    onClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    otherPlayer: PropTypes.object,
    owner: PropTypes.object,
    style: PropTypes.object,
    thisPlayer: PropTypes.object
};

export default PlayerStreet;
