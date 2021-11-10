import React from 'react';
import PropTypes from 'prop-types';

import GameConfiguration from './GameConfiguration';
import Modal from '../Site/Modal';

export class GameConfigurationModal extends React.Component {
    render() {
        return (
            <Modal id={ this.props.id } className='settings-popup row' bodyClassName='col-xs-12' title='Game Configuration'>
                <GameConfiguration
                    timerSettings={ this.props.timerSettings }
                    onTimerSettingToggle={ this.props.onTimerSettingToggle }
                    user={ this.props.user }
                />
            </Modal>);
    }
}

GameConfigurationModal.displayName = 'GameConfigurationModal';
GameConfigurationModal.propTypes = {
    id: PropTypes.string,
    onTimerSettingToggle: PropTypes.func,
    timerSettings: PropTypes.object,
    user: PropTypes.object
};

export default GameConfigurationModal;
