import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import classNames from 'classnames';

import { ItemTypes } from '../../constants';

const validTargets = {
    'hand': [
        'play area',
        'discard pile',
        'draw deck',
        'dead pile',
        'out of game',
        'draw hand',
        'townsquare',
        'being played'
    ],
    'play area': [
        'play area',
        'discard pile',
        'hand',
        'draw deck',
        'dead pile',
        'out of game'
    ],
    'discard pile': [
        'dead pile',
        'hand',
        'draw deck',
        'play area',
        'draw hand',
        'out of game'
    ],
    'dead pile': [
        'hand',
        'draw deck',
        'play area',
        'discard pile',
        'out of game'
    ],
    'draw deck': [
        'hand',
        'discard pile',
        'dead pile',
        'play area',
        'draw hand',
        'out of game',
        'being played'
    ],
    'draw hand': [
        'hand',
        'discard pile',
        'dead pile'
    ],
    'being played': [
        'hand',
        'play area',
        'discard pile',
        'dead pile'
    ],
    'out of game': [
        'draw deck',
        'play area',
        'discard pile',
        'hand',
        'dead pile'
    ]
};

const dropTarget = {
    canDrop(props, monitor) {
        let item = monitor.getItem();

        return validTargets[item.source] && validTargets[item.source].some(target => target === props.source);
    },
    drop(props, monitor) {
        let item = monitor.getItem();

        if(props.onDragDrop) {
            props.onDragDrop(item.card, item.source, props.source, props.location, props.playerName);
        }
    }
};

function collect(connect, monitor) {
    let item = monitor.getItem();

    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        item: item
    };
}

class Droppable extends React.Component {
    isValidLocation() {
        // if there is no location, it is a pile (hand, draw deck and so on)
        if(!this.props.location || !this.props.source === 'play area') {
            return true;
        }
        let emptyLocation = this.props.location && !this.props.location.uuid;
        if(this.props.item && this.props.item.card) {
            if(this.props.item.card.type_code === 'dude') {
                let sameLocation = this.props.location && this.props.item.card.gamelocation === this.props.location.uuid;
                if(emptyLocation) {
                    return false;
                }
                if(sameLocation) {
                    return false;
                }
                return true;
            }
            if(this.props.item.card.type_code === 'deed') {
                if(!emptyLocation) {
                    return false;
                }
                return true;
            }
            if(this.props.item.card.type_code === 'goods') {
                // TODO M2 can add more retrictions
                if(emptyLocation) {
                    return false;
                }
                return true;
            }
            if(this.props.item.card.type_code === 'spell') {
                // TODO can add more restrictions
                if(emptyLocation) {
                    return false;
                }
                return true;
            }
        }

        return true;
    }

    render() {
        let className = 'overlay';
        if(this.isValidLocation()) {
            className = classNames('overlay', {
                'drop-ok': this.props.isOver && this.props.canDrop,
                'no-drop': this.props.isOver && !this.props.canDrop && this.props.item && this.props.source !== this.props.item.source,
                'can-drop': !this.props.isOver && this.props.canDrop
            });
        }

        return this.props.connectDropTarget(
            <div className='drop-target'>
                <div className={ className } />
                { this.props.children }
            </div>);
    }
}

Droppable.propTypes = {
    canDrop: PropTypes.bool,
    children: PropTypes.node,
    connectDropTarget: PropTypes.func,
    isOver: PropTypes.bool,
    item: PropTypes.object,
    location: PropTypes.object,
    onDragDrop: PropTypes.func,
    source: PropTypes.string.isRequired
};

export default DropTarget(ItemTypes.CARD, dropTarget, collect)(Droppable);
