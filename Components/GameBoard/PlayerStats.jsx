import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '../Site/Avatar';

export class PlayerStats extends React.Component {
    constructor() {
        super();

        this.sendUpdate = this.sendUpdate.bind(this);
    }

    sendUpdate(type, direction) {
        this.props.sendGameMessage('changeStat', type, direction === 'up' ? 1 : -1, this.props.user ? !!this.props.user.isAutomaton : undefined);
    }

    getStatValueOrDefault(stat) {
        if(!this.props.stats) {
            return 0;
        }

        return this.props.stats[stat] || 0;
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

    render() {
        var playerAvatar = (
            <div className='player-avatar'>
                <Avatar username={ this.props.user ? this.props.user.username : undefined } />
                <b>{ this.props.user ? this.props.user.username : 'Noone' }</b>
            </div>);

        return (
            <div className='panel player-stats'>
                { playerAvatar }
                { this.props.firstPlayer || this.props.inCheck ? <div className='state badges'>
                    { this.props.firstPlayer ? <div className='single-badge'>
                        <img src='/img/icons/dealer.png'/>
                    </div> : null }
                    { this.props.inCheck ? <div className='single-badge'>
                        <img src='/img/icons/noose.png'/>
                    </div> : null }
                </div> : null }           

                { this.getButton('ghostrock', 'ghostrock', !!this.props.showControls || (this.props.user && !!this.props.user.isAutomaton)) }
                { this.getButton('control', 'control', false) }
                { this.getButton('influence', 'influence', false) }

                { this.props.showControls ? <div className='state settings'>
                    <button className='btn btn-transparent' onClick={ this.onSettingsClick.bind(this) }><span className='glyphicon glyphicon-cog' />Settings</button>
                </div> : null }

            </div>
        );
    }
}

PlayerStats.displayName = 'PlayerStats';
PlayerStats.propTypes = {
    firstPlayer: PropTypes.bool,
    inCheck: PropTypes.bool,
    onSettingsClick: PropTypes.func,
    playerName: PropTypes.string,
    sendGameMessage: PropTypes.func,
    showControls: PropTypes.bool,
    stats: PropTypes.object,	
    user: PropTypes.object
};

export default PlayerStats;
