import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import $ from 'jquery';
import { toastr } from 'react-redux-toastr';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';

import PlayerStats from './PlayerStats';
import PlayerRow from './PlayerRow';
import GameLocation from './GameLocation';
import PlayerStreet from './PlayerStreet';
import OutOfTown from './OutOfTown.jsx';
import ActivePlayerPrompt from './ActivePlayerPrompt';
import CardZoom from './CardZoom';
import GameChat from './GameChat';
import GameConfigurationModal from './GameConfigurationModal';
import * as actions from '../../actions';
import StatusPanel from './StatusPanel';
import EffectsPanel from './EffectsPanel';

const placeholderPlayer = {
    legend: null,
    cardPiles: {
        cardsInPlay: [],
        deadPile: [],
        discardPile: [],
        hand: [],
        drawHand: [],		
        outOfGamePile: []
    },
    ghostrock: 0,
    handRank: 0,
    locations: [],
    totalControl: 0,    
    outfit: null,
    inCheck: false,
    firstPlayer: false,
    numDrawCards: 0,
    stats: null,
    user: null
};

export class GameBoard extends React.Component {
    constructor() {
        super();

        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
        this.handleDrawPopupChange = this.handleDrawPopupChange.bind(this);
        this.handleMenuChange = this.handleMenuChange.bind(this);
        this.handleTownsquareWidth = this.handleTownsquareWidth.bind(this);
        this.onDragDrop = this.onDragDrop.bind(this);
        this.onCommand = this.onCommand.bind(this);
        this.onConcedeClick = this.onConcedeClick.bind(this);
        this.onLeaveClick = this.onLeaveClick.bind(this);
        this.onShuffleClick = this.onShuffleClick.bind(this);
        this.onDiscardFromDrawHandClick = this.onDiscardFromDrawHandClick.bind(this);
        this.onDrawPopupClose = this.onDrawPopupClose.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);
        this.onOotExpandClick = this.onOotExpandClick.bind(this);
        this.sendChatMessage = this.sendChatMessage.bind(this);
        this.onSettingsClick = this.onSettingsClick.bind(this);
        this.onEffectsClick = this.onEffectsClick.bind(this);
        this.onMessagesClick = this.onMessagesClick.bind(this);
        this.onOutfitCardClick = this.onOutfitCardClick.bind(this);	
        this.onPauseClick = this.onPauseClick.bind(this);	
        this.setTownsquareComponent = this.setTownsquareComponent.bind(this);
        this.getUpdatedEffectsObject = this.getUpdatedEffectsObject.bind(this);		

        this.state = {
            cardToZoom: undefined,
            spectating: true,
            showEffectsWindows: false,
            effectsObject: {},
            showMessages: true,
            lastMessageCount: 0,
            newMessages: 0,
            ootExpanded: false
        };
    }

    componentDidMount() {
        this.updateContextMenu(this.props);
        $('.modal-backdrop').remove();
    }

    componentWillReceiveProps(props) {
        this.updateContextMenu(props);

        let lastMessageCount = this.state.lastMessageCount;
        let currentMessageCount = props.currentGame ? props.currentGame.messages.length : 0;

        if(this.state.showMessages) {
            this.setState({ lastMessageCount: currentMessageCount, newMessages: 0 });
        } else {
            this.setState({ newMessages: currentMessageCount - lastMessageCount });
        }
    }

    getUpdatedEffectsObject(effectsObject) {
        if(!this.props || !effectsObject || effectsObject.classType === 'shootout') {
            return effectsObject;
        }
        for(let playerName in this.props.currentGame.players) {
            const player = this.props.currentGame.players[playerName];
            if(effectsObject.classType === 'player' && player.id === effectsObject.id) {
                return player;
            }
            let allCards = [];
            for(let cardPile in player.cardPiles) {
                allCards = allCards.concat(player.cardPiles[cardPile]);
            }
            let foundEffectsObject = allCards.find(card => card.uuid === effectsObject.uuid);
            if(foundEffectsObject) {
                return foundEffectsObject;
            }
        }
        return effectsObject;
    }

    updateContextMenu(props) {
        if(!props.currentGame || !props.user) {
            return;
        }

        let thisPlayer = props.currentGame.players[props.user.username];

        if(thisPlayer) {
            this.setState({ spectating: false });
        } else {
            this.setState({ spectating: true });
        }

        let menuOptions = [
            { text: 'Leave Game', onClick: this.onLeaveClick }
        ];

        if(props.currentGame && props.currentGame.started) {
            if(props.currentGame.players[props.user.username]) {
                menuOptions.unshift({ text: 'Concede', onClick: this.onConcedeClick });
            }

            let spectators = props.currentGame.spectators.map(spectator => {
                return <li key={ spectator.id }>{ spectator.name }</li>;
            });

            let spectatorPopup = (
                <ul className='spectators-popup absolute-panel'>
                    { spectators }
                </ul>
            );

            menuOptions.unshift({ text: 'Spectators: ' + props.currentGame.spectators.length, popup: spectatorPopup });

            this.setContextMenu(menuOptions);
        } else {
            this.setContextMenu([]);
        }
    }

    setContextMenu(menu) {
        if(this.props.setContextMenu) {
            this.props.setContextMenu(menu);
        }
    }

    setTownsquareComponent(tsComponent) {
        this.townsquare = tsComponent;
    }

    onConcedeClick() {
        this.props.sendGameMessage('concede');
    }

    isGameActive() {
        if(!this.props.currentGame || !this.props.user) {
            return false;
        }

        if(this.props.currentGame.winner) {
            return false;
        }

        let thisPlayer = this.props.currentGame.players[this.props.user.username];
        if(!thisPlayer) {
            thisPlayer = Object.values(this.props.currentGame.players)[0];
        }

        let otherPlayer = Object.values(this.props.currentGame.players).find(player => {
            return player.name !== thisPlayer.name;
        });

        if(!otherPlayer) {
            return false;
        }

        if(otherPlayer.disconnected || otherPlayer.left) {
            return false;
        }

        return true;
    }

    onLeaveClick() {
        if(!this.state.spectating && this.isGameActive()) {
            toastr.confirm('Your game is not finished, are you sure you want to leave?', {
                onOk: () => {
                    this.props.sendGameMessage('leavegame');
                    this.props.closeGameSocket();
                }
            });

            return;
        }

        this.props.sendGameMessage('leavegame');
        this.props.closeGameSocket();
    }

    onMouseOver(object) {
        let newState = {};
        if(object) {
            newState.effectsObject = object;
        }
        if(object && (object.classType === 'card' || object.argType === 'card')) {
            newState.cardToZoom = object;
        }
        this.setState(newState);
    }

    onMouseOut() {
        this.setState({ cardToZoom: undefined, effectsObject: undefined });
    }

    onCardClick(card) {
        this.props.stopAbilityTimer();
        this.props.sendGameMessage('cardClicked', card.uuid);
    }
	
    onOutfitCardClick() {
        this.props.sendGameMessage('outfitCardClicked');
    }

    handleMenuChange(component, showMenuState) {
        if(this.componentWithMenu) {
            this.componentWithMenu.setState({ showMenu: false });
        }
        if(showMenuState) {
            this.componentWithMenu = component;
        } else {
            this.componentWithMenu = null;
        }
    }

    handleTownsquareWidth() {
        if(this.townsquare) {
            const widthMy = document.getElementById('mystreet').clientWidth;
            const widthOther = document.getElementById('otherstreet').clientWidth;
            this.townsquare.setState({ width: Math.max(widthMy, widthOther) - 20 });
        }
    }

    handleDrawPopupChange(event) {
        this.props.sendGameMessage('showDrawDeck', event.visible);
    }

    sendChatMessage(message) {
        this.props.sendGameMessage('chat', message);
    }

    onDiscardFromDrawHandClick(discardType) {
        this.props.sendGameMessage('discardFromDrawHand', discardType);
    }

    onDrawPopupClose() {
        this.props.sendGameMessage('clearDrawHandSelection');
    }

    onShuffleClick() {
        this.props.sendGameMessage('shuffleDeck');
    }

    onDragDrop(card, source, target, gameLocation, targetPlayerName) {
        this.props.sendGameMessage('drop', card.uuid, target, gameLocation, targetPlayerName);
    }

    onCommand(button) {
        this.props.sendGameMessage(button.command, button.arg, button.method, button.promptId);
    }

    onMenuItemClick(card, menuItem) {
        this.props.stopAbilityTimer();
        this.props.sendGameMessage('menuItemClick', card.uuid, menuItem);
    }

    onTimerSettingToggle(option, value) {
        this.props.sendGameMessage('toggleTimerSetting', option, value);
    }

    onSettingsClick() {
        $('#settings-modal').modal('show');
    }

    onEffectsClick() {
        this.setState({ showEffectsWindows: !this.state.showEffectsWindows });
    }

    onPauseClick() {
        this.props.sendGameMessage('togglePauseTimer');
    }

    onMessagesClick() {
        const showState = !this.state.showMessages;

        let newState = {
            showMessages: showState
        };

        if(showState) {
            newState.newMessages = 0;
            newState.lastMessageCount = this.props.currentGame.messages.length;
        }

        this.setState(newState);
    }

    onOotExpandClick() {
        this.setState({ ootExpanded: !this.state.ootExpanded });
    }

    defaultPlayerInfo(source) {
        let player = Object.assign({}, placeholderPlayer, source);
        player.cardPiles = Object.assign({}, placeholderPlayer.cardPiles, player.cardPiles);
        return player;
    }

    renderBoard(thisPlayer, otherPlayer) {
        let boundActionCreators = bindActionCreators(actions, this.props.dispatch);
        let boardClassName = classNames('board-middle', { 'oot-expanded': this.state.ootExpanded });
        return [
            <div key='board-middle' className={ boardClassName }>
                <div className='player-home-row'>
                    <div className='player-stats-row other-side'>
                        <PlayerStats player={ otherPlayer } sendGameMessage={ this.props.sendGameMessage } 
                            onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut }/>
                    </div>
                    <PlayerRow
                        hand={ otherPlayer.cardPiles.hand } isMe={ false }
                        drawHand={ otherPlayer.cardPiles.drawHand }					
                        numDrawCards={ otherPlayer.numDrawCards }
                        discardPile={ otherPlayer.cardPiles.discardPile }
                        deadPile={ otherPlayer.cardPiles.deadPile }
                        drawDeck={ otherPlayer.cardPiles.drawDeck }
                        beingPlayed={ otherPlayer.cardPiles.beingPlayed }
                        onCardClick={ this.onCardClick }
                        onMouseOver={ this.onMouseOver }
                        onMouseOut={ this.onMouseOut }
                        onDragDrop={ this.onDragDrop }
                        outOfGamePile={ otherPlayer.cardPiles.outOfGamePile }
                        username={ this.props.user.username }
                        revealTopCard={ otherPlayer.revealTopCard }
                        spectating={ this.state.spectating }
                        playerName={ otherPlayer.name }
                        side='top'
                        isSolo={ this.props.currentGame.gameType === 'solo' }
                        cardSize={ this.props.user.settings.cardSize } />
                </div>
                <StatusPanel 
                    otherPlayer={ otherPlayer } 
                    thisPlayer={ thisPlayer } 
                    currentGame={ this.props.currentGame }
                    spectating={ this.state.spectating }
                    onEffectsClick={ this.onEffectsClick }
                    onMouseOver={ this.onMouseOver }
                    onMouseOut={ this.onMouseOut }
                    onPauseClick={ this.onPauseClick }/>
                <div id='play-area' className='play-area' onDragOver={ this.onDragOver }>
                    <div id='otherstreet' className='player-street other-side'>
                        <PlayerStreet onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } onClick={ this.onCardClick } onDragDrop={ this.onDragDrop }
                            onMenuItemClick={ this.onMenuItemClick } className='other-side' owner={ otherPlayer } otherPlayer={ otherPlayer } 
                            handleMenuChange={ this.handleMenuChange } handleTownsquareWidth={ this.handleTownsquareWidth } thisPlayer={ thisPlayer }/>
                    </div>					

                    <div className='townsquare-container'>
                        <GameLocation location={ {uuid:'townsquare', name:'Town Square'} }
                            cardLocation='townsquare' className='townsquare'
                            handleMenuChange={ this.handleMenuChange }
                            onMouseOver={ this.onMouseOver }
                            onMouseOut={ this.onMouseOut }
                            onDragDrop={ this.onDragDrop }
                            onMenuItemClick={ this.onMenuItemClick }
                            onClick={ this.onCardClick }
                            setTownsquareComponent = { this.setTownsquareComponent }
                            otherPlayer={ otherPlayer }
                            thisPlayer={ thisPlayer }/>
                    </div>
								
                    <div id='mystreet' className='player-street'>
                        <PlayerStreet onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } onClick={ this.onCardClick } onDragDrop={ this.onDragDrop } className='our-side'
                            handleMenuChange={ this.handleMenuChange } onMenuItemClick={ this.onMenuItemClick } owner={ thisPlayer } otherPlayer={ otherPlayer } 
                            handleTownsquareWidth={ this.handleTownsquareWidth } thisPlayer={ thisPlayer }/>
                    </div>								

                </div>
                <div className='cliff'>
                    <div className='panel' onClick={ this.onOotExpandClick }>
                        <span className={ 'glyphicon ' + (this.state.ootExpanded ? 'glyphicon-arrow-right' : 'glyphicon-arrow-left') }/>
                    </div>
                </div>
                <div className='out-of-town-area'>
                    <div className='out-of-town' onDragOver={ this.onDragOver }>
                        <OutOfTown onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } onClick={ this.onCardClick } onMenuItemClick={ this.onMenuItemClick }
                            handleMenuChange={ this.handleMenuChange } className={ 'other-side' } owner={ otherPlayer } otherPlayer={ otherPlayer } thisPlayer={ thisPlayer }/>
                    </div>

                    <div className='out-of-town' onDragOver={ this.onDragOver }>
                        <OutOfTown onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } onClick={ this.onCardClick } onMenuItemClick={ this.onMenuItemClick }
                            handleMenuChange={ this.handleMenuChange } className={ 'our-side' } owner={ thisPlayer } otherPlayer={ otherPlayer } thisPlayer={ thisPlayer }/>
                    </div>
                </div>
                <div className='player-home-row our-side'>
                    <div className='player-stats-row'>
                        <PlayerStats { ...boundActionCreators } player={ thisPlayer } showControls={ !this.state.spectating } onSettingsClick={ this.onSettingsClick }
                            onEffectsClick={ this.onEffectsClick } onMessagesClick={ this.onMessagesClick } numMessages={ this.state.newMessages } showMessages
                            onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut }/>
                    </div>
                    <PlayerRow isMe={ !this.state.spectating }
                        hand={ thisPlayer.cardPiles.hand }
                        drawHand={ thisPlayer.cardPiles.drawHand }						
                        onCardClick={ this.onCardClick }
                        onMouseOver={ this.onMouseOver }
                        onMouseOut={ this.onMouseOut }
                        numDrawCards={ thisPlayer.numDrawCards }
                        onDiscardSelectedClick={ this.onDiscardFromDrawHandClick }
                        onDrawPopupChange={ this.handleDrawPopupChange }
                        onShuffleClick={ this.onShuffleClick }
                        onDrawPopupClose={ this.onDrawPopupClose }
                        outOfGamePile={ thisPlayer.cardPiles.outOfGamePile }
                        drawDeck={ thisPlayer.cardPiles.drawDeck }
                        onDragDrop={ this.onDragDrop }
                        discardPile={ thisPlayer.cardPiles.discardPile }
                        deadPile={ thisPlayer.cardPiles.deadPile }
                        beingPlayed={ thisPlayer.cardPiles.beingPlayed }
                        revealTopCard={ thisPlayer.revealTopCard }
                        showDeck={ thisPlayer.showDeck }
                        spectating={ this.state.spectating }
                        title={ thisPlayer.title }
                        handleMenuChange={ this.handleMenuChange }
                        onMenuItemClick={ this.onMenuItemClick }
                        cardSize={ this.props.user.settings.cardSize }
                        popupStayOpen={ thisPlayer.popupStayOpen }
                        playerName={ thisPlayer.name }
                        isSolo={ this.props.currentGame.gameType === 'solo' }
                        side='bottom' />
                </div>
            </div>
        ];
    }

    render() {
        if(!this.props.currentGame || !this.props.cards || !this.props.currentGame.started) {
            return <div>Waiting for server...</div>;
        }

        if(!this.props.user) {
            this.props.navigate('/');
            return <div>You are not logged in, redirecting...</div>;
        }

        let thisPlayer = this.props.currentGame.players[this.props.user.username];
        if(!thisPlayer) {
            thisPlayer = Object.values(this.props.currentGame.players)[0];
        }

        if(!thisPlayer) {
            return <div>Waiting for game to have players or close...</div>;
        }

        let otherPlayer = Object.values(this.props.currentGame.players).find(player => {
            return player.name !== thisPlayer.name;
        });

        // Default any missing information
        thisPlayer = this.defaultPlayerInfo(thisPlayer);
        otherPlayer = this.defaultPlayerInfo(otherPlayer);
        // Additional settings for the player
        thisPlayer.showBgTexture = this.props.user.settings.showBgTexture;

        let effectsObject = this.state.effectsObject;
        if(effectsObject && !effectsObject.effects) {
            effectsObject = this.getUpdatedEffectsObject(this.state.effectsObject);
        }

        let boardClass = classNames('game-board', {
            'select-cursor': thisPlayer && thisPlayer.selectCard
        });

        return (
            <div className={ boardClass }>
                <GameConfigurationModal
                    id='settings-modal'
                    onTimerSettingToggle={ this.onTimerSettingToggle.bind(this) }
                    timerSettings={ thisPlayer.timerSettings } 
                    user={ this.props.user }
                />
                <div className='main-window'>
                    { this.renderBoard(thisPlayer, otherPlayer) }
                    <div className='inset-pane'>
                        <ActivePlayerPrompt
                            cards={ this.props.cards }
                            buttons={ thisPlayer.buttons }
                            controls={ thisPlayer.controls }
                            promptText={ thisPlayer.menuTitle }
                            promptTitle={ thisPlayer.promptTitle }
                            promptInfo={ thisPlayer.promptInfo }
                            onButtonClick={ this.onCommand }
                            onMouseOver={ this.onMouseOver }
                            onMouseOut={ this.onMouseOut }
                            user={ this.props.user }
                            phase={ thisPlayer.phase }
                            timerLimit={ this.props.timerLimit }
                            timerStartTime={ this.props.timerStartTime }
                            stopAbilityTimer={ this.props.stopAbilityTimer } />
                    </div>
                    <CardZoom imageUrl={ this.state.cardToZoom ? '/img/cards/' + this.state.cardToZoom.code + '.jpg' : '' }
                        orientation='vertical'
                        show={ !!this.state.cardToZoom } cardName={ this.state.cardToZoom ? this.state.cardToZoom.title : null }
                        card={ this.state.cardToZoom ? this.props.cards[this.state.cardToZoom.code] : null } />
                    { this.state.showMessages && <div className='right-side'>
                        <div className='effects'>
                            <EffectsPanel show={ this.state.showEffectsWindows } onEffectsClick={ this.onEffectsClick } 
                                effectsObject={ effectsObject } updateEffectsObject={ this.getUpdatedEffectsObject }/>
                        </div>
                        <div className='gamechat'>
                            <GameChat key='gamechat'
                                messages={ this.props.currentGame.messages }
                                onCardMouseOut={ this.onMouseOut }
                                onCardMouseOver={ this.onMouseOver }
                                onSendChat={ this.sendChatMessage } showMessages
                                onMessagesClick={ this.onMessagesClick } numMessages={ this.state.newMessages } />
                        </div>
                    </div>
                    }
                    <div className='chat-status' onClick={ this.onMessagesClick }>
                        <button className='btn btn-transparent'>
                            <span className='glyphicon glyphicon-envelope' />
                            <span className='chat-badge badge progress-bar-danger'>{ this.state.newMessages || null }</span>
                        </button>
                    </div>
                </div>
            </div >);
    }
}

GameBoard.displayName = 'GameBoard';
GameBoard.propTypes = {
    cards: PropTypes.object,
    clearZoom: PropTypes.func,
    closeGameSocket: PropTypes.func,
    currentGame: PropTypes.object,
    dispatch: PropTypes.func,
    navigate: PropTypes.func,
    packs: PropTypes.array,
    restrictedList: PropTypes.array,
    sendGameMessage: PropTypes.func,
    setContextMenu: PropTypes.func,
    socket: PropTypes.object,
    stopAbilityTimer: PropTypes.func,
    timerLimit: PropTypes.number,
    timerStartTime: PropTypes.instanceOf(Date),
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        cards: state.cards.cards,
        currentGame: state.lobby.currentGame,
        packs: state.cards.packs,
        restrictedList: state.cards.restrictedList,
        socket: state.lobby.socket,
        timerLimit: state.prompt.timerLimit,
        timerStartTime: state.prompt.timerStartTime,
        user: state.account.user
    };
}

function mapDispatchToProps(dispatch) {
    let boundActions = bindActionCreators(actions, dispatch);
    boundActions.dispatch = dispatch;

    return boundActions;
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(GameBoard);

