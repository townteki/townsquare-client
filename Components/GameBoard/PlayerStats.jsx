import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '../Site/Avatar';

export class PlayerStats extends React.Component {
    constructor() {
        super();

        this.sendUpdate = this.sendUpdate.bind(this);
    }

    sendUpdate(type, direction) {
        this.props.sendGameMessage('changeStat', type, direction === 'up' ? 1 : -1, 
            this.props.player.user ? !!this.props.player.user.isAutomaton : undefined);
    }

    getStatValueOrDefault(stat) {
        if(!this.props.player.stats) {
            return 0;
        }

        return this.props.player.stats[stat] || 0;
    }

    getButton(stat, name, showControls = true) {
        return (
            <div className={ 'state ' + stat }>
                <span><img src={ '/img/icons/' + name + '.png' } title={ name } alt={ name } /></span>
                { showControls ? <button className='btn btn-stat' onClick={ this.sendUpdate.bind(this, stat, 'down') }>
                    <img src='/img/icons/minus.png' title='-' alt='-' />
                </button> : null }

                <span>{ this.getStatValueOrDefault(stat) }</span>
                { showControls ? <button className='btn btn-stat' onClick={ this.sendUpdate.bind(this, stat, 'up') }>
                    <img src='/img/icons/plus.png' title='+' alt='+' />
                </button> : null }
            </div>
        );
    }

    onSettingsClick(event) {
        event.preventDefault();

        if(this.props.onSettingsClick) {
            this.props.onSettingsClick();
        }
    }

    onEffectsClick(event) {
        event.preventDefault();

        if(this.props.onEffectsClick) {
            this.props.onEffectsClick();
        }
    }

    render() {
        var playerAvatar = (
            <div className='player-avatar'>
                <Avatar username={ this.props.player.user ? this.props.player.user.username : undefined } />
                <b>{ this.props.player.user ? this.props.player.user.username : 'Noone' }</b>
            </div>);

        return (
            <div className='panel player-stats' onMouseOver={ this.props.onMouseOver.bind(this, this.props.player) } onMouseOut={ this.props.onMouseOut }>
                { playerAvatar }
                { this.props.player.firstPlayer || this.props.player.inCheck ? <div className='state badges'>
                    { this.props.player.firstPlayer ? <div className='single-badge'>
                        <img src='/img/icons/dealer.png'/>
                    </div> : null }
                    { this.props.player.inCheck ? <div className='single-badge'>
                        <img src='/img/icons/noose.png'/>
                    </div> : null }
                </div> : null }           

                { this.getButton('ghostrock', 'ghostrock', !!this.props.showControls || (this.props.player.user && !!this.props.player.user.isAutomaton)) }
                { this.getButton('control', 'control', false) }
                { this.getButton('influence', 'influence', false) }

                { this.props.showControls ? <div className='state settings'>
                    <button className='btn btn-transparent' onClick={ this.onSettingsClick.bind(this) }><span className='glyphicon glyphicon-cog' />Settings</button>
                    <button className='btn btn-transparent' onClick={ this.onEffectsClick.bind(this) }>
                        <span className='glyphicon glyphicon-flash' />
                        Effects{ '(' + (this.props.player.effects ? this.props.player.effects.length : '0') + ')' }
                    </button>
                </div> : null }

            </div>
        );
    }
}

PlayerStats.displayName = 'PlayerStats';
PlayerStats.propTypes = {
    onEffectsClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onSettingsClick: PropTypes.func,
    player: PropTypes.object,
    sendGameMessage: PropTypes.func,
    showControls: PropTypes.bool
};

export default PlayerStats;
