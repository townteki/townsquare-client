import React from 'react';
import PropTypes from 'prop-types';

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

    render() {
        let showPanel = !!this.state.showShootoutStatus;
        if(!this.props.shootout && this.state.showShootoutStatus === 1) {
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
        if(this.props.shootout) {
            this.props.shootout.playerStats.forEach(playerStat => {
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
                <div className='shootout-status'>
                    <div className={ 'shootout-player panel' + (showPanel ? '' : ' hiddenStatus') }>
                        <div className={ showPanel ? '' : ' hidden' }>
                            { this.getShootoutStatus(otherPlayerStats) }
                        </div>
                    </div>
                    <div className={ 'shootout-main panel' + (showPanel ? '' : ' hiddenStatus') }>
                        <div className='shootout-status-icon' onClick={ this.onShootoutStatusClick }>
                            <button className='btn btn-transparent'>
                                <span className='glyphicon glyphicon-screenshot' style={ { color: buttonColor } }/>
                            </button>
                        </div>
                        <div className={ 'shootout-caption' + (showPanel ? '' : ' hiddenStatus') }>
                            { 'SHOOTOUT' + (this.props.shootout ? ' round ' + this.props.shootout.round : '') }
                        </div>
                    </div>
                    <div className={ 'shootout-player panel' + (showPanel ? '' : ' hiddenStatus') }>
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
    otherPlayer: PropTypes.object,
    shootout: PropTypes.object,
    thisPlayer: PropTypes.object
};

export default StatusPanel;
