import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import Messages from './Messages';
import Typeahead from '../Form/Typeahead';
import { Highlighter } from 'react-bootstrap-typeahead';

const commands = [
    { label: '/ace ', desc: 'Ace a card' },
    { label: '/add-keyword ', syntax: '/add-keyword k', desc: 'Add keyword k to a card' },
    { label: '/add-card ', syntax: '/add-card [code | title]', desc: 'Add card to the top of the Draw deck' },
    { label: '/attach ', desc: 'Attach card to another card' },
    { label: '/bullets ', syntax: '/bullets [x | +/-mod]', desc: 'Sets bullets to x or modifies it by +/-mod' },
    { label: '/blank ', desc: 'Blanks a card' },
    { label: '/bounty ', syntax: '/bounty [x | +/-mod]', desc: 'Sets bounty to x or modifies it by +/-mod' },
    { label: '/cancel-prompt ', desc: 'Clears the current prompt and resume' },
    { label: '/cancel-shootout ', desc: 'Cancels the current shootout' },
    { label: '/clear-shooter ', desc: 'Clears the shooter type set by the chat command' },
    { label: '/clear-suit ', desc: 'Clears the suit effects' },
    { label: '/clear-effects ', desc: 'Clears any effects on a card' },
    { label: '/control ', syntax: '/control [x | +/-mod]', desc: 'Sets control to x or modifies it by +/-mod' },
    { label: '/done', desc: 'Changes active player to next player' },
    { label: '/discard-deck ', syntax: '/discard-deck x', desc: 'Discards top x cards from your deck' },
    { label: '/discard-deck-solo ', syntax: '/discard-deck-solo x', desc: 'Discards top x cards from Solo deck' },
    { label: '/discard-random ', syntax: '/discard-random x', desc: 'Discards random x cards from your hand' },
    { label: '/discard-random-solo ', syntax: '/discard-random-solo x', desc: 'Discards random x cards from Solo hand' },
    { label: '/draw ', syntax: '/draw x', desc: 'Draws x cards from your deck' },
    { label: '/draw-solo ', syntax: '/draw-solo x', desc: 'Draws x cards from Solo deck' },
    { label: '/give-control ', desc: 'Gives control of a card to your opponent' },
    { label: '/hand-rank ', syntax: '/hand-rank x', desc: 'Sets your hand rank to x' },
    { label: '/hand-rank-solo ', syntax: '/hand-rank-solo x', desc: 'Sets Solo hand rank to x' },
    { label: '/inf ', syntax: '/inf [x | +/-mod]', desc: 'Sets influence to x or modifies it by +/-mod' },
    { label: '/join-posse ', desc: 'Moves and joins dude to current shootout' },
    { label: '/join-without-move ', desc: 'Joins dude to current shootout w/o moving' },
    { label: '/kung-fu ', syntax: '/kung-fu [x | +/-mod]', desc: 'Sets Kung Fu to x or modifies it by +/-mod' },
    { label: '/look-deck ', syntax: '/look-deck x', desc: 'Looks at top x cards of your deck' },
    { label: '/look-deck-solo ', syntax: '/look-deck-solo x', desc: 'Looks at top x cards of Solo deck' },
    { label: '/move ', desc: 'Moves a dude' },
    { label: '/pass ', desc: 'Passes current play' },
    { label: '/prod ', syntax: '/prod [x | +/-mod]', desc: 'Sets prod to x or modifies it by +/-mod' },
    { label: '/pull ', syntax: '/pull [x]', desc: 'Pulls with optional difficulty x' },
    { label: '/pull kf', desc: 'Pulls for technique' },
    { label: '/rematch ', desc: 'Start a new game with current opponent' },
    { label: '/remove-from-game ', desc: 'Removes a card from the game' },
    { label: '/remove-from-posse ', desc: 'Removes a dude from the current shootout' },
    { label: '/remove-keyword ', syntax: '/remove-keyword k', desc: 'Remove keyword k from a card' },
    { label: '/reset-abilities ', desc: 'Reset abilities usage of a card' },
    { label: '/reset-stats ', syntax: '/reset-stats [stat]', desc: 'Resets stat to printed (all if stat is omitted)' },
    { label: '/reveal-deck ', syntax: '/reveal-deck x', desc: 'Reveals top x cards from your deck' },
    { label: '/reveal-deck-solo ', syntax: '/reveal-deck-solo x', desc: 'Reveals top x cards from Solo deck' },
    { label: '/reveal-hand ', desc: 'Reveals your hand to the opponent' },
    { label: '/reveal-hand-solo ', desc: 'Reveals Solo hand' },
    { label: '/shooter stud', desc: 'Sets shooter type of a dude to stud' },
    { label: '/shooter draw', desc: 'Sets shooter type of a dude to draw' },
    { label: '/shuffle-discard ', desc: 'Shuffles discard pile to draw deck' },
    { label: '/shuffle-discard-solo ', desc: 'Shuffles Solo discard pile to draw deck' },
    { label: '/skill blessed ', syntax: '/skill blessed [x | +/-mod]', desc: 'Sets skill to x or modifies it by +/-mod' },
    { label: '/skill huckster ', syntax: '/skill huckster [x | +/-mod]', desc: 'Sets skill to x or modifies it by +/-mod' },
    { label: '/skill shaman ', syntax: '/skill shaman [x | +/-mod]', desc: 'Sets skill to x or modifies it by +/-mod' },
    { label: '/skill mad ', syntax: '/skill mad [x | +/-mod]', desc: 'Sets skill to x or modifies it by +/-mod' },
    { label: '/suit ', syntax: '/suit [hearts | clubs | diams | spades]', desc: 'Sets the suit of a card' },
    { label: '/token ', syntax: '/token t x', desc: 'Sets the count of a token type t to x' },
    { label: '/unblank ', desc: 'Unblanks a card' },
    { label: '/use ', desc: 'Announces use of unscripted card' },
    { label: '/value ', syntax: '/value [x | +/-mod]', desc: 'Sets value to x or modifies it by +/-mod' }
];

class GameChat extends React.Component {
    constructor() {
        super();

        this.onInputChange = this.onInputChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.renderMenuItemChildren = this.renderMenuItemChildren.bind(this);

        this.state = {
            canScroll: true,
            minLength: 20
        };
    }

    componentDidMount() {
        if(this.state.canScroll) {
            $(this.refs.messagePanel).scrollTop(999999);
        }
    }

    componentDidUpdate() {
        if(this.state.canScroll) {
            $(this.refs.messagePanel).scrollTop(999999);
        }
    }

    renderMenuItemChildren(option, { text }) {
        return (<Fragment>
            <div className='chat-command-syntax'>
                <Highlighter search={ text }>
                    { option.syntax || option.label }
                </Highlighter>
            </div>
            <div>
                <small>
                    { option.desc }
                </small>
            </div>
        </Fragment>);
    }

    onScroll() {
        let messages = this.refs.messagePanel;

        setTimeout(() => {
            if(messages.scrollTop >= messages.scrollHeight - messages.offsetHeight - 20) {
                this.setState({ canScroll: true });
            } else {
                this.setState({ canScroll: false });
            }
        }, 500);
    }

    onInputChange(event) {
        if(event[0] === '/') {
            this.setState({ minLength: 1 });
        } else {
            this.setState({ minLength: 20 });
        }
    }

    onKeyPress(event) {
        if(event.key === 'Enter') {
            this.sendMessage(event.target.value);
            this.refs.message.clear();
            event.preventDefault();
        }
    }

    sendMessage(message) {
        if(!message) {
            return;
        }

        this.props.onSendChat(message);
    }

    render() {
        return (
            <div className='chat'>
                <div className='messages panel' ref='messagePanel' onScroll={ this.onScroll }>
                    <Messages messages={ this.props.messages } onCardMouseOver={ this.props.onCardMouseOver } onCardMouseOut={ this.props.onCardMouseOut } />
                </div>
                <form className='form chat-form'>
                    <Typeahead id='game-chat' ref='message' options={ commands } labelKey={ option => option.label } emptyLabel={ '' } minLength={ this.state.minLength } dropup
                        placeholder='Chat...' onKeyDown={ this.onKeyPress } onInputChange={ this.onInputChange } renderMenuItemChildren={ this.renderMenuItemChildren } />
                </form>
            </div>);
    }
}

GameChat.displayName = 'GameChat';
GameChat.propTypes = {
    messages: PropTypes.array,
    onCardMouseOut: PropTypes.func,
    onCardMouseOver: PropTypes.func,
    onSendChat: PropTypes.func
};

export default GameChat;
