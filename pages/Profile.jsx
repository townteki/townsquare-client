import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from 'react-bootstrap-slider';

import AlertPanel from '../Components/Site/AlertPanel';
import ApiStatus from '../Components/Site/ApiStatus';
import Panel from '../Components/Site/Panel';
import Form from '../Components/Form/Form';
import Checkbox from '../Components/Form/Checkbox';
import CardSizeOption from '../Components/Profile/CardSizeOption';
import GameBackgroundOption from '../Components/Profile/GameBackgroundOption';
import * as actions from '../actions';
import Avatar from '../Components/Site/Avatar';

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.handleSelectBackground = this.handleSelectBackground.bind(this);
        this.handleSelectCardSize = this.handleSelectCardSize.bind(this);
        this.onUpdateAvatarClick = this.onUpdateAvatarClick.bind(this);
        this.onBGTextureToggle = this.onBGTextureToggle.bind(this);
        this.onSaveClick = this.onSaveClick.bind(this);

        this.state = {
            newPassword: '',
            newPasswordAgain: '',
            successMessage: '',
            windowTimer: 10,
            timerSettings: {
                actions: false,
                shootoutAbilities: false
            },
            showBgTexture: true
        };

        this.backgrounds = [
            { name: 'none', label: 'None', imageUrl: 'img/blank.png' },
            { name: 'BG1', label: 'Standard', imageUrl: 'img/background.jpg' },
            { name: 'BG2', label: 'Winter', imageUrl: 'img/background2.png' }
        ];

        this.cardSizes = [
            { name: 'small', label: 'Small' },
            { name: 'normal', label: 'Normal' },
            { name: 'large', label: 'Large' },
            { name: 'x-large', label: 'Extra-Large' }
        ];

        if(!this.props.user) {
            return;
        }
    }

    componentDidMount() {
        this.updateProfile(this.props);
    }

    componentWillReceiveProps(props) {
        if(!props.user) {
            return;
        }

        // If we haven't previously got any user details, then the api probably just returned now, so set the initial user details
        if(!this.state.timerSettings) {
            this.updateProfile(props);
        }

        if(props.profileSaved) {
            this.setState({
                successMessage: 'Profile saved successfully.  Please note settings changed here may only apply at the start of your next game.'
            });

            this.updateProfile(props);

            setTimeout(() => {
                this.setState({ successMessage: undefined });
            }, 5000);
        }
    }

    updateProfile(props) {
        if(!props.user) {
            return;
        }

        this.setState({
            email: props.user.email,
            enableGravatar: props.user.enableGravatar,
            windowTimer: props.user.settings.windowTimer,
            timerSettings: props.user.settings.timerSettings,
            showBgTexture: props.user.settings.showBgTexture,
            selectedBackground: props.user.settings.background,
            selectedCardSize: props.user.settings.cardSize
        });
    }

    onChange(field, event) {
        var newState = {};

        newState[field] = event.target.value;
        this.setState(newState);
    }

    onTimerSettingToggle(field, event) {
        var newState = {};
        newState.timerSettings = this.state.timerSettings;

        newState.timerSettings[field] = event.target.checked;
        if(!field === 'actions' && event.target.checked) {
            newState.timerSettings.shootoutAbilities = false;
        }
        this.setState(newState);
    }

    onBGTextureToggle() {
        this.setState({ showBgTexture: !this.state.showBgTexture });
    }    

    onSaveClick(state) {
        this.setState({ 
            newPassword: state.newPassword, 
            email: state.email,
            successMessage: undefined
        });

        document.getElementsByClassName('wrapper')[0].scrollTop = 0;

        this.props.saveProfile(this.props.user.username, {
            email: state.email,
            password: state.newPassword,
            enableGravatar: this.state.enableGravatar,
            settings: {
                windowTimer: this.state.windowTimer,
                timerSettings: this.state.timerSettings,
                background: this.state.selectedBackground,
                showBgTexture: this.state.showBgTexture,
                cardSize: this.state.selectedCardSize
            }
        });
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

    handleSelectBackground(background) {
        this.setState({ selectedBackground: background });
    }

    handleSelectCardSize(size) {
        this.setState({ selectedCardSize: size });
    }

    onUpdateAvatarClick(event) {
        event.preventDefault();

        this.props.updateAvatar(this.props.user.username);
    }

    render() {
        if(!this.props.user) {
            return <AlertPanel type='error' message='You must be logged in to update your profile' />;
        }

        if(this.props.profileSaved) {
            setTimeout(() => {
                this.props.clearProfileStatus();
            }, 5000);
        }

        let initialValues = { email: this.props.user.email };

        return (
            <div className='col-sm-8 col-sm-offset-2 profile full-height'>
                <div className='about-container'>
                    <ApiStatus apiState={ this.props.apiState } successMessage={ this.state.successMessage } />

                    <Form panelTitle='Profile' name='profile' initialValues={ initialValues } apiLoading={ this.props.apiState && this.props.apiState.loading } buttonClass='col-sm-offset-10 col-sm-2' buttonText='Save' onSubmit={ this.onSaveClick }>
                        <span className='col-sm-3 text-center'><Avatar username={ this.props.user.username } /></span>
                        <Checkbox name='enableGravatar' label='Enable Gravatar integration' fieldClass='col-sm-offset-1 col-sm-7'
                            onChange={ e => this.setState({ enableGravatar: e.target.checked }) } checked={ this.state.enableGravatar } />
                        <div className='col-sm-3 text-center'>Current profile picture</div>
                        <button type='button' className='btn btn-default col-sm-offset-1 col-sm-3' onClick={ this.onUpdateAvatarClick }>Update avatar</button>
                        <div className='col-sm-12 profile-inner'>
                            <Panel title='Timed Reaction Window'>
                                <p className='help-block small'>Every time a game event occurs that you could react to with a action card, a timer will count down.  At the end of that timer, the window will automatically pass.
                                This option controls the duration of the timer.</p>
                                <p className='help-block small'>The timer can be configured to show when you have any actions with React in your deck, or to show every time shootout or resolution abilities are played by opponent (useful if you play cards like A Slight Modification).</p>
                                <div className='form-group'>
                                    <label className='col-xs-3 control-label'>Reaction timeout</label>
                                    <div className='col-xs-5 control-label'>
                                        <Slider value={ this.state.windowTimer }
                                            slideStop={ this.onSlideStop.bind(this) }
                                            step={ 1 }
                                            max={ 10 }
                                            min={ 0 } />
                                    </div>
                                    <div className='col-xs-2'>
                                        <input className='form-control text-center' name='timer' value={ this.state.windowTimer } onChange={ this.onSlideStop.bind(this) } />
                                    </div>
                                    <label className='col-xs-2 control-label text-left no-padding'>seconds</label>
                                </div>
                                <div className='form-group'>
                                    <Checkbox name='timerSettings.actions' noGroup label={ 'Show timer if actions with React in deck' } fieldClass='col-sm-6'
                                        onChange={ this.onTimerSettingToggle.bind(this, 'actions') } checked={ this.state.timerSettings.actions } />
                                    <Checkbox name='timerSettings.shootoutAbilities' noGroup label={ 'Show timer for shootout and resolution abilitites' } fieldClass='col-sm-6'
                                        onChange={ this.onTimerSettingToggle.bind(this, 'shootoutAbilities') } checked={ this.state.timerSettings.shootoutAbilities } />
                                </div>
                            </Panel>
                        </div>
                        <div className='col-sm-12'>
                            <Panel title='Game Board Background'>
                                <div className='row'>
                                    {
                                        this.backgrounds.map(background => (
                                            <GameBackgroundOption
                                                imageUrl={ background.imageUrl }
                                                key={ background.name }
                                                label={ background.label }
                                                name={ background.name }
                                                onSelect={ this.handleSelectBackground }
                                                selected={ this.state.selectedBackground === background.name } />
                                        ))
                                    }
                                    <Checkbox name='showGameBoardTexture' noGroup label={ 'Show Game Board background texture' } fieldClass='col-sm-6'
                                        onChange={ this.onBGTextureToggle } checked={ this.state.showBgTexture } />
                                </div>
                            </Panel>
                        </div>
                        <div className='col-sm-12'>
                            <Panel title='Card Image Size'>
                                <div className='row'>
                                    <div className='col-xs-12'>
                                        {
                                            this.cardSizes.map(cardSize => (
                                                <CardSizeOption
                                                    key={ cardSize.name }
                                                    label={ cardSize.label }
                                                    name={ cardSize.name }
                                                    onSelect={ this.handleSelectCardSize }
                                                    selected={ this.state.selectedCardSize === cardSize.name } />
                                            ))
                                        }
                                    </div>
                                </div>
                            </Panel>
                        </div>
                    </Form>
                </div>
            </div>);
    }
}

Profile.displayName = 'Profile';
Profile.propTypes = {
    apiState: PropTypes.object,
    clearProfileStatus: PropTypes.func,
    profileSaved: PropTypes.bool,
    refreshUser: PropTypes.func,
    saveProfile: PropTypes.func,
    socket: PropTypes.object,
    updateAvatar: PropTypes.func,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        apiState: state.api.SAVE_PROFILE,
        profileSaved: state.user.profileSaved,
        socket: state.lobby.socket,
        user: state.account.user
    };
}

export default connect(mapStateToProps, actions)(Profile);
