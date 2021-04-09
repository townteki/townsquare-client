import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Avatar from '../Site/Avatar';

function GamePlayer(props) {
    let classes = classNames('game-player-row', {
        'first-player': props.firstPlayer,
        'other-player': !props.firstPlayer
    });

    let playerAndOutfitLegend;

    if(props.firstPlayer) {
        playerAndOutfitLegend = (<div className='game-outfit-row first-player'>
            <div className='game-player-name'>
                <span className='gamelist-avatar'><Avatar username={ props.player.name } /></span>
                <span className='bold'>{ props.player.name }</span>
            </div>
            <div className='legend-mini'>{ <img className='img-responsive' src={ `/img/cards/${props.player.legend || 'cardback'}.jpg` } /> }</div>
            <div className='outfit-mini'>{ <img className='img-responsive' src={ `/img/cards/${props.player.outfit || 'cardback'}.jpg` } /> }</div>
        </div >);
    } else {
        playerAndOutfitLegend = (<div className='game-outfit-row other-player'>
            <div className='outfit-mini'>{ <img className='img-responsive' src={ `/img/cards/${props.player.outfit || 'cardback'}.jpg` } /> }</div>
            <div className='legend-mini'>{ <img className='img-responsive' src={ `/img/cards/${props.player.legend || 'cardback'}.jpg` } /> }</div>
            <div className='game-player-name'>
                <span className='bold'>{ props.player.name }</span>
                <span className='gamelist-avatar'><Avatar username={ props.player.name } /></span>
            </div>
        </div>);
    }

    return (<div key={ props.player.name } className={ classes }>
        <div>
            { playerAndOutfitLegend }
        </div>
    </div>);
}

GamePlayer.displayName = 'GamePlayer';
GamePlayer.propTypes = {
    firstPlayer: PropTypes.bool,
    player: PropTypes.object
};

export default GamePlayer;
