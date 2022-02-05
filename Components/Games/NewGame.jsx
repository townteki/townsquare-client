import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Panel from '../Site/Panel';
import * as actions from '../../actions';
import AlertPanel from '../Site/AlertPanel';

import { cardSetLabel } from '../Decks/DeckHelper';

const GameNameMaxLength = 64;

class NewGame extends React.Component {
    constructor(props) {
        super(props);

        this.onCancelClick = this.onCancelClick.bind(this);
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onEventChange = this.onEventChange.bind(this);
        this.onSpectatorsClick = this.onSpectatorsClick.bind(this);
        this.onShowHandClick = this.onShowHandClick.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onUseGameTimeLimitClick = this.onUseGameTimeLimitClick.bind(this);
        this.onGameTimeLimitChange = this.onGameTimeLimitChange.bind(this);

        const availableRestrictedLists = this.filterAvailableRls(props.restrictedLists);
        const defaultRestrictedList = availableRestrictedLists.find(rl => rl.default) || availableRestrictedLists[0];

        this.state = {
            selectedMode: `none:${defaultRestrictedList && defaultRestrictedList._id}`,
            eventId: 'none',
            restrictedListId: defaultRestrictedList && defaultRestrictedList._id,
            spectators: true,
            showHand: false,
            selectedGameType: 'casual',
            password: '',
            useGameTimeLimit: false,
            gameTimeLimit: 55
        };
    }

    componentWillMount() {
        this.props.loadEvents();
        this.setState({ gameName: this.props.defaultGameName });
    }

    onCancelClick(event) {
        event.preventDefault();

        this.props.cancelNewGame();
    }

    onNameChange(event) {
        this.setState({ gameName: event.target.value });
    }

    onEventChange(event) {
        const selectedValues = event.target.value.split(':');
        const eventId = selectedValues[0] || 'none';
        const restrictedListId = selectedValues[1] || '';

        this.setState({ eventId, restrictedListId, selectedMode: event.target.value });
    }

    onPasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    onSpectatorsClick(event) {
        this.setState({ spectators: event.target.checked });
    }

    onShowHandClick(event) {
        this.setState({ showHand: event.target.checked });
    }

    onSubmitClick(event) {
        event.preventDefault();

        this.props.socket.emit('newgame', {
            name: this.state.gameName,
            eventId: this.state.eventId,
            restrictedListId: this.state.restrictedListId,
            spectators: this.state.spectators,
            showHand: this.state.showHand,
            gameType: this.state.selectedGameType,
            password: this.state.password,
            quickJoin: this.props.quickJoin,
            useGameTimeLimit: this.state.useGameTimeLimit,
            gameTimeLimit: this.state.gameTimeLimit
        });
    }

    onRadioChange(gameType) {
        this.setState({ selectedGameType: gameType });
    }

    onUseGameTimeLimitClick(event) {
        this.setState({ useGameTimeLimit: event.target.checked });
    }

    onGameTimeLimitChange(event) {
        this.setState({ gameTimeLimit: event.target.value });
    }

    isGameTypeSelected(gameType) {
        return this.state.selectedGameType === gameType;
    }

    getOptions() {
        return (<div className='row'>
            <div className='checkbox col-sm-8'>
                <label>
                    <input type='checkbox' onChange={ this.onSpectatorsClick } checked={ this.state.spectators } />
                    Allow spectators
                </label>
            </div>
            <div className='checkbox col-sm-8'>
                <label>
                    <input type='checkbox' onChange={ this.onShowHandClick } checked={ this.state.showHand } />
                    Show hands to spectators
                </label>
            </div>
            <div className='checkbox col-sm-12'>
                <label>
                    <input type='checkbox' onChange={ this.onUseGameTimeLimitClick } checked={ this.state.useGameTimeLimit } />
                    Use a time limit (in minutes)
                </label>
            </div>
            { this.state.useGameTimeLimit && <div className='col-sm-4'>
                <input className='form-control' type='number' onChange={ this.onGameTimeLimitChange } value={ this.state.gameTimeLimit } />
            </div> }
        </div>);
    }

    getGameTypeOptions() {
        return (
            <div className='row'>
                <div className='col-sm-12 game-type'>
                    <b>Game Type</b>
                </div>
                <div className='col-sm-10'>
                    <label className='radio-inline'>
                        <input type='radio' onChange={ this.onRadioChange.bind(this, 'beginner') } checked={ this.isGameTypeSelected('beginner') } />
                        Beginner
                    </label>
                    <label className='radio-inline'>
                        <input type='radio' onChange={ this.onRadioChange.bind(this, 'casual') } checked={ this.isGameTypeSelected('casual') } />
                        Casual
                    </label>
                    <label className='radio-inline'>
                        <input type='radio' onChange={ this.onRadioChange.bind(this, 'competitive') } checked={ this.isGameTypeSelected('competitive') } />
                        Competitive
                    </label>
                    <label className='radio-inline'>
                        <input type='radio' onChange={ this.onRadioChange.bind(this, 'solo') } checked={ this.isGameTypeSelected('solo') } />
                        Solo
                    </label>                    
                </div>
            </div>);
    }

    filterAvailableRls(restrictedLists) {
        let availRls = restrictedLists.filter(rl => rl.official);
        if(!this.props.user.permissions.isContributor) {
            availRls = restrictedLists.filter(rl => !rl.isPt);
        }
        return availRls;
    }

    getEventSelection() {
        const { events, restrictedLists } = this.props;

        return (
            <div className='row'>
                <div className='col-sm-8'>
                    <label htmlFor='gameName'>Mode</label>
                    <select className='form-control' value={ this.state.selectedMode } onChange={ this.onEventChange }>
                        { this.filterAvailableRls(restrictedLists).map(rl => 
                            (<option value={ `none:${rl._id}` }>{ `${cardSetLabel(rl.cardSet)}` }</option>)) }
                        { events.map(event => (<option value={ event._id }>{ event.name }</option>)) }
                    </select>
                </div>
            </div>
        );
    }

    render() {
        let charsLeft = GameNameMaxLength - this.state.gameName.length;
        let content = [];

        if(!this.props.events) {
            return <div>Loading...</div>;
        }

        if(this.props.quickJoin) {
            content =
                (<div>
                    <AlertPanel type='info' message="Select the type of game you'd like to play and either you'll join the next one available, or one will be created for you with default options." />
                    { this.getGameTypeOptions() }
                </div>);
        } else {
            content = (<div>
                <div className='row'>
                    <div className='col-sm-8'>
                        <label htmlFor='gameName'>Name</label>
                        <label className='game-name-char-limit'>{ charsLeft >= 0 ? charsLeft : 0 }</label>
                        <input className='form-control' placeholder='Game Name' type='text' onChange={ this.onNameChange } value={ this.state.gameName } maxLength={ GameNameMaxLength } />
                    </div>
                </div>
                <p/>
                { this.getEventSelection() }
                { this.getOptions() }
                { this.getGameTypeOptions() }
                <div className='row game-password'>
                    <div className='col-sm-8'>
                        <label>Password</label>
                        <input className='form-control' type='password' onChange={ this.onPasswordChange } value={ this.state.password } />
                    </div>
                </div>
            </div>);
        }

        return this.props.socket ? (
            <div>
                <Panel title={ this.props.quickJoin ? 'Join Existing or Start New Game' : 'New game' }>
                    <form className='form'>
                        { content }
                        <div className='button-row'>
                            <button className='btn btn-primary' onClick={ this.onSubmitClick }>Start</button>
                            <button className='btn btn-primary' onClick={ this.onCancelClick }>Cancel</button>
                        </div>
                    </form>
                </Panel >
            </div >) : (
            <div>
                <AlertPanel type='warning' message='Your connection to the lobby has been interrupted, if this message persists, refresh your browser' />
            </div>
        );
    }
}

NewGame.displayName = 'NewGame';
NewGame.propTypes = {
    cancelNewGame: PropTypes.func,
    defaultGameName: PropTypes.string,
    events: PropTypes.array,
    loadEvents: PropTypes.func,
    quickJoin: PropTypes.bool,
    restrictedLists: PropTypes.array,
    socket: PropTypes.object,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        events: state.events.events,
        restrictedLists: state.cards.restrictedList,
        socket: state.lobby.socket,
        user: state.account.user
    };
}

export default connect(mapStateToProps, actions)(NewGame);
