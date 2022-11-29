import React from 'react';
import PropTypes from 'prop-types';
import TimeLimitClock from './TimeLimitClock';
import classNames from 'classnames';

class StatusPanel extends React.Component {
    constructor() {
        super();

        this.onShootoutStatusClick = this.onShootoutStatusClick.bind(this);

        this.state = {
            showShootoutStatus: 1
        };
    }

    onShootoutStatusClick() {
        let showStatus = this.state.showShootoutStatus + 1;
        if(showStatus > 2) {
            showStatus = 0;
        }
        this.setState({ showShootoutStatus: showStatus });
    }

    onPauseClick() {
        this.props.onPauseClick();
    }

    onEffectsClick(event) {
        event.preventDefault();

        if(this.props.onEffectsClick) {
            this.props.onEffectsClick();
        }
    }    

    getShootoutStatus(player, showCheatin = false) {
        if(!player) {
            return (<div/>);
        }
        return (<div>
            <span className='bold secondary-color'>Player: </span>
            { player.player } <br/>
            <span className='bold secondary-color'>Shooter: </span>
            { player.shooter } <br/>
            <span className='bold secondary-color'>Draw Bonus: </span>
            { player.studBonus }<img className='icon-bullet' src='/img/icons/bullet_stud.png'/> / { player.drawBonus }<img className='icon-bullet' src='/img/icons/bullet_draw.png'/> <br/>
            <span className='bold secondary-color'>Hand Rank: </span>
            { player.handRank } { (player.baseHandRank !== player.handRank) && `(Base: ${player.baseHandRank})` } <br/>
            <span className='bold secondary-color'>Casualties: </span>
            { player.casualties } <br/>
            <span className={ showCheatin ? 'is-cheatin' : '' }>
                <span className='bold secondary-color'>{ showCheatin && <span className='bold secondary-color glyphicon glyphicon-exclamation-sign' /> } Cheatin' Resolutions: </span>
                <span className='stat-number'>{ player.cheatinResNum }</span>
            </span> <br/>
        </div>);
    }

    getTimer() {
        return (<TimeLimitClock
            createdAt={ this.props.currentGame.createdAt }
            currentRound={ this.props.currentGame.round }
            displayButton={ !this.props.spectating }
            onPauseClick={ this.props.onPauseClick }
            timeLimitStarted={ this.props.currentGame.gameTimeLimitStarted }
            timeLimitStartedAt={ this.props.currentGame.gameTimeLimitStartedAt }
            timeLimit={ this.props.currentGame.gameTimeLimitTime } />);
    }

    render() {
        let showPanel = !!this.state.showShootoutStatus;
        if(!this.props.currentGame.shootout && this.state.showShootoutStatus === 1) {
            showPanel = false;
        }

        let buttonColor = 'red';
        if(this.state.showShootoutStatus === 1) {
            buttonColor = 'orange';
        }
        if(this.state.showShootoutStatus === 2) {
            buttonColor = 'green';
        }
        let thisPlayerStats = null;
        let otherPlayerStats = null;
        if(this.props.currentGame.shootout) {
            this.props.currentGame.shootout.playerStats.forEach(playerStat => {
                if(playerStat.player === this.props.thisPlayer.name) {
                    thisPlayerStats = playerStat;
                }
                if(playerStat.player === this.props.otherPlayer.name) {
                    otherPlayerStats = playerStat;
                }
            });
        }
        let playerClassName = classNames('shootout-player', 'panel', {
            'hiddenStatus': !showPanel
        });
        return (
            <div className={ 'prompt-area' + (showPanel ? '' : ' hiddenStatus') }>
                { this.getTimer() }
                <div className='shootout-status'>
                    <div className={ playerClassName }
                        onMouseOver={ this.props.onMouseOver.bind(this, this.props.currentGame.shootout) } onMouseOut={ this.props.onMouseOut }>
                        <div className={ showPanel ? '' : ' hidden' }>
                            { this.getShootoutStatus(otherPlayerStats) }
                        </div>
                    </div>
                    <div className={ 'shootout-main panel' + (showPanel ? '' : ' hiddenStatus') }
                        onMouseOver={ this.props.onMouseOver.bind(this, this.props.currentGame.shootout) } onMouseOut={ this.props.onMouseOut }>
                        <div className='shootout-status-icon' onClick={ this.onShootoutStatusClick }>
                            <button className='btn btn-transparent'>
                                <span className='glyphicon glyphicon-screenshot' style={ { color: buttonColor } }/>
                            </button>
                        </div>
                        <div className={ 'shootout-caption' + (showPanel ? '' : ' hiddenStatus') }>
                            { 'SHOOTOUT' + (this.props.currentGame.shootout ? ' round ' + this.props.currentGame.shootout.round : '') }
                        </div>
                    </div>
                    <div className={ playerClassName }
                        onMouseOver={ this.props.onMouseOver.bind(this, this.props.currentGame.shootout) } onMouseOut={ this.props.onMouseOut }>
                        <div className={ showPanel ? '' : ' hidden' }>
                            { this.getShootoutStatus(thisPlayerStats, thisPlayerStats && thisPlayerStats.cheatinResNum > 0) }
                            <button className='btn btn-transparent' onClick={ this.onEffectsClick.bind(this) }>
                                <span className='glyphicon glyphicon-flash' />
                                { 'Effects(' + (this.props.currentGame.shootout && this.props.currentGame.shootout.effects ? this.props.currentGame.shootout.effects.length : '0') + ')' }
                            </button>
                        </div>
                    </div>
                </div>
            </div>);
    }
}

StatusPanel.displayName = 'StatusPanel';
StatusPanel.propTypes = {
    currentGame: PropTypes.object,
    onEffectsClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onPauseClick: PropTypes.func,
    otherPlayer: PropTypes.object,
    spectating: PropTypes.bool,
    thisPlayer: PropTypes.object
};

export default StatusPanel;
