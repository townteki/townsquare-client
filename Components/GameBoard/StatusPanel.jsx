import React from 'react';
import PropTypes from 'prop-types';

class StatusPanel extends React.Component {
    constructor() {
        super();

        this.onShootoutStatusClick = this.onShootoutStatusClick.bind(this);

        this.state = {
            showShootoutStatus: false
        };
    }

    onShootoutStatusClick() {
        this.setState({ showShootoutStatus: !this.state.showShootoutStatus });
    }

    render() {
        return (
            <div className={ 'prompt-area' + (this.state.showShootoutStatus ? '' : ' hiddenStatus') }>
                <div className='shootout-status'>
                    <div className={ 'shootout-player panel' + (this.state.showShootoutStatus ? '' : ' hiddenStatus') }>
                        <div className={ this.state.showShootoutStatus ? '' : ' hidden' }>
                        Shootout/Lowball panel <br/> Not yet implemented
                        </div>
                    </div>
                    <div className={ 'shootout-main panel' + (this.state.showShootoutStatus ? '' : ' hiddenStatus') }>
                        <div className='shootout-status-icon' onClick={ this.onShootoutStatusClick }>
                            <button className='btn btn-transparent'>
                                <span className='glyphicon glyphicon-screenshot' />
                            </button>
                        </div>
                        <div className={ 'shootout-caption' + (this.state.showShootoutStatus ? '' : ' hiddenStatus') }>SHOOTOUT</div>
                    </div>
                    <div className={ 'shootout-player panel' + (this.state.showShootoutStatus ? '' : ' hiddenStatus') }>
                        <div className={ this.state.showShootoutStatus ? '' : ' hidden' }>
                        Shootout/Lowball panel <br/> Not yet implemented
                        </div>
                    </div>
                </div>
            </div>);
    }
}

StatusPanel.displayName = 'StatusPanel';
StatusPanel.propTypes = {
    isShootout: PropTypes.bool
};

export default StatusPanel;
