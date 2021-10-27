import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from '../Form/Checkbox';
import Panel from '../Site/Panel';
import Slider from 'react-bootstrap-slider';

class GameConfiguration extends React.Component {
    constructor(props) {
        super(props);

        this.onLoadFromProfile = this.onLoadFromProfile.bind(this);
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
        if(this.props.onTimerSettingToggle) {
            this.props.onTimerSettingToggle('windowTimer', value);
        }
    }

    onTimerSettingToggle(option, event) {
        if(this.props.onTimerSettingToggle) {
            this.props.onTimerSettingToggle(option, event.target.checked);
        }
    }

    onLoadFromProfile(event) {
        event.preventDefault();
        this.props.onTimerSettingToggle('windowTimer', this.props.user.settings.windowTimer);
        this.props.onTimerSettingToggle('actions', this.props.user.settings.timerSettings.actions);
        this.props.onTimerSettingToggle('actionsInHand', this.props.user.settings.timerSettings.actionsInHand);
    }

    render() {
        return (
            <div>
                <form className='form form-horizontal'>
                    <Panel title='Timed Reaction Window'>
                        <div className='form-group'>
                            <label className='col-xs-3 control-label'>Reaction timeout</label>
                            <div className='col-xs-5 control-label'>
                                <Slider value={ this.props.timerSettings.windowTimer }
                                    slideStop={ this.onSlideStop.bind(this) }
                                    step={ 1 }
                                    max={ 10 }
                                    min={ 0 } />
                            </div>
                            <div className='col-xs-2'>
                                <input className='form-control text-center' name='timer' value={ this.props.timerSettings.windowTimer } onChange={ this.onSlideStop.bind(this) } />
                            </div>
                            <label className='col-xs-2 control-label text-left no-padding'>seconds</label>
                        </div>
                        <div className='form-group'>
                            <Checkbox name='timerSettings.actions' noGroup label={ 'Show timer if actions with React in deck' } fieldClass='col-sm-6'
                                onChange={ this.onTimerSettingToggle.bind(this, 'actions') } checked={ this.props.timerSettings.actions } />
                            <Checkbox name='timerSettings.actionsInHand' noGroup label={ 'Show timer only for actions in hand' } fieldClass='col-sm-6'
                                onChange={ this.onTimerSettingToggle.bind(this, 'actionsInHand') } checked={ this.props.timerSettings.actionsInHand } 
                                disabled={ !this.props.timerSettings.actions } />
                        </div>
                    </Panel>
                    <button type='button' className='btn btn-default col-sm-offset-4' onClick={ this.onLoadFromProfile }>Load from Profile</button>
                </form>
            </div>
        );
    }
}

GameConfiguration.displayName = 'GameConfiguration';
GameConfiguration.propTypes = {
    onTimerSettingToggle: PropTypes.func,
    timerSettings: PropTypes.object,
    user: PropTypes.object
};

export default GameConfiguration;
