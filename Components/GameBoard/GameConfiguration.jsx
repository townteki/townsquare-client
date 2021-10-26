import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from '../Form/Checkbox';
import Panel from '../Site/Panel';

class GameConfiguration extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            windowTimer: this.props.timerSettings.windowTimer
        };
    }

    onSlideStop(event) {
        let value = parseInt(event.target.value);

        if(isNaN(value)) {
            return;
        }

        if(value < 0) {
            value = 0;
        }

        if(value > 10) {
            value = 10;
        }

        this.setState({ windowTimer: value });
    }

    onTimerSettingToggle(option, event) {
        if(this.props.onTimerSettingToggle) {
            this.props.onTimerSettingToggle(option, event.target.checked);
        }
    }

    render() {
        return (
            <div>
                <form className='form form-horizontal'>
                    <Panel title='Timed Interrupt Window'>
                        <div className='form-group'>
                            <Checkbox name='timerSettings.actions' noGroup label={ 'Show timer for actions' } fieldClass='col-sm-6'
                                onChange={ this.onTimerSettingToggle.bind(this, 'actions') } checked={ this.props.timerSettings.actions } />
                            <Checkbox name='timerSettings.abilities' noGroup label={ 'Show timer for card abilities' } fieldClass='col-sm-6'
                                onChange={ this.onTimerSettingToggle.bind(this, 'abilities') } checked={ this.props.timerSettings.abilities } />
                        </div>
                    </Panel>
                </form>
            </div>
        );
    }
}

GameConfiguration.displayName = 'GameConfiguration';
GameConfiguration.propTypes = {
    onTimerSettingToggle: PropTypes.func,
    timerSettings: PropTypes.object
};

export default GameConfiguration;
