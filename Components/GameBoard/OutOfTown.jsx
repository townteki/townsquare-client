import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import GameLocation from './GameLocation.jsx';

class OutOfTown extends React.Component {
    buildOutOfTown(player) {
        let onStreet = [];

        let className = this.props.className;

        className = 'out-of-town ' + className;

        if(player) {
            let filteredLocations = _.filter(player.locations, (location) => location.order === null);
            _.each(filteredLocations, (location) => {
                _.map(player.cardsInPlay, (card) => {
                    if(card.uuid === location.uuid) {
                        onStreet.push(<GameLocation key={location.uuid}
                                    location={card}
                                    onMenuItemClick={this.props.onMenuItemClick}
                                    onMouseOver={this.props.onMouseOver}
                                    onMouseOut={this.props.onMouseOut}
                                    onDragDrop={this.props.onDragDrop}
                                    otherPlayer={this.props.otherPlayer}
                                    thisPlayer={this.props.thisPlayer}/>
                                );
                    }
                });
            });
        }

        /*
        if(onStreet.length === 0) {
            onStreet.push(<GameLocation key='empty' location={{facedown:true}}/>);
        }
        */

        return <div className={className}>{onStreet}</div>;
    }

    render() {
        return (
            <div style={this.props.style} >
                {this.buildOutOfTown(this.props.owner)}
            </div>
        );
    }
}

OutOfTown.displayName = 'OutOfTown';
OutOfTown.propTypes = {
    className: PropTypes.string,
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

export default OutOfTown;
