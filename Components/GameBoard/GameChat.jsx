import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import Messages from './Messages';
import Typeahead from '../Form/Typeahead';
import { Highlighter } from 'react-bootstrap-typeahead';

const commands = [
    { label: '/ace ', desc: 'Ace a card' },
    { label: '/add-keyword ', desc: 'Add keyword to a card' },
    { label: '/add-card ', syntax: '/add-card [code | title]', desc: 'Add card to the top of the Draw deck' },
    { label: '/attach ', desc: '' },
    { label: '/bullets ', desc: '' },
    { label: '/blank ', desc: '' },
    { label: '/bounty ', desc: '' },
    { label: '/cancel-prompt ', desc: '' },
    { label: '/cancel-shootout ', desc: '' },
    { label: '/clear-shooter ', desc: '' },
    { label: '/clear-suit ', desc: '' },
    { label: '/clear-effects ', desc: '' },
    { label: '/control ', desc: '' },
    { label: '/discard-deck ', desc: '' },
    { label: '/discard-random ', desc: '' },
    { label: '/disconnectme ', desc: '' },
    { label: '/draw ', desc: '' },
    { label: '/give-control ', desc: '' },
    { label: '/hand-rank ', desc: '' },
    { label: '/inf ', desc: '' },
    { label: '/join-posse ', desc: '' },
    { label: '/join-without-move ', desc: '' },
    { label: '/kung-fu ', desc: '' },
    { label: '/look-deck ', desc: '' },
    { label: '/move ', desc: '' },
    { label: '/pass ', desc: '' },
    { label: '/pull ', desc: '' },
    { label: '/pull kf', desc: '' },
    { label: '/rematch ', desc: '' },
    { label: '/remove-from-game ', desc: '' },
    { label: '/remove-from-posse ', desc: '' },
    { label: '/remove-keyword ', desc: '' },
    { label: '/reset-abilities ', desc: '' },
    { label: '/reset-stats ', desc: '' },
    { label: '/reveal-deck ', desc: '' },
    { label: '/reveal-hand ', desc: '' },
    { label: '/shooter stud', desc: '' },
    { label: '/shooter draw', desc: '' },
    { label: '/shuffle-discard ', desc: '' },
    { label: '/skill blessed ', desc: '' },
    { label: '/skill huckster ', desc: '' },
    { label: '/skill shaman ', desc: '' },
    { label: '/skill mad ', desc: '' },
    { label: '/suit ', desc: '' },
    { label: '/token ', desc: '' },
    { label: '/unblank ', desc: '' },
    { label: '/use ', desc: '' },
    { label: '/value ', desc: '' }
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
            <Highlighter search={ text }>
                { option.syntax || option.label }
            </Highlighter>
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
                    <Typeahead ref='message' options={ commands } labelKey={ option => option.label } emptyLabel={ '' } minLength={ this.state.minLength } dropup
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
