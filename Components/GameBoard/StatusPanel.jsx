import React from 'react';
import PropTypes from 'prop-types';
import TimeLimitClock from './TimeLimitClock';

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

    getShootoutStatus(player) {
        if(!player) {
            return (<div/>);
        }
        return (<div>
            Player: { player.player } <br/>
            Shooter: { player.shooter } <br/>
            Stud/Draw: { player.studBonus + '/' + player.drawBonus } <br/>
            Hand Rank: { player.handRank } <br/>
            Casualties: { player.casualties }
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
        return (
            <div className={ 'prompt-area' + (showPanel ? '' : ' hiddenStatus') }>
                { this.getTimer() }
                <div className='shootout-status'>
                    <div className={ 'shootout-player panel' + (showPanel ? '' : ' hiddenStatus') }
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
                    <div className={ 'shootout-player panel' + (showPanel ? '' : ' hiddenStatus') }
                        onMouseOver={ this.props.onMouseOver.bind(this, this.props.currentGame.shootout) } onMouseOut={ this.props.onMouseOut }>
                        <div className={ this.state.showShootoutStatus ? '' : ' hidden' }>
                            { this.getShootoutStatus(thisPlayerStats) }
                        </div>
                    </div>
                </div>
            </div>);
    }
}

StatusPanel.displayName = 'StatusPanel';
StatusPanel.propTypes = {
    currentGame: PropTypes.object,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onPauseClick: PropTypes.func,
    otherPlayer: PropTypes.object,
    spectating: PropTypes.bool,
    thisPlayer: PropTypes.object
};

export default StatusPanel;
