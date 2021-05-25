import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import Messages from './Messages';
import Typeahead from '../Form/Typeahead';

const commands = [ 
    '/ace ',
    '/add-keyword ',
    '/add-card ',
    '/attach ',
    '/bullets ',
    '/blank ',
    '/bounty ',
    '/cancel-prompt ',
    '/cancel-shootout ',
    '/clear-shooter ',
    '/clear-suit ',
    '/clear-effects ',
    '/control ',
    '/discard-deck ',
    '/discard-random ',
    '/disconnectme ',
    '/draw ',
    '/give-control ',
    '/hand-rank ',
    '/inf ',
    '/join-posse ',
    '/join-without-move ',
    '/kung-fu ',
    '/look-deck ',
    '/move ',
    '/pass ',
    '/pull ',
    '/pull kf',
    '/rematch ',
    '/remove-from-game ',
    '/remove-from-posse ',
    '/remove-keyword ',
    '/reset-abilities ',
    '/reset-stats ',
    '/reveal-deck ',
    '/reveal-hand ',
    '/shooter stud',
    '/shooter draw',
    '/shuffle-discard ',
    '/skill blessed ',
    '/skill huckster ',
    '/skill shaman ',
    '/skill mad ',
    '/suit ',
    '/token ',
    '/unblank ',
    '/use ',
    '/value '
];

class GameChat extends React.Component {
    constructor() {
        super();

        this.onInputChange = this.onInputChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onScroll = this.onScroll.bind(this);

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
                    <Typeahead ref='message' options={ commands } emptyLabel={ '' } minLength={ this.state.minLength } dropup
                        placeholder='Chat...' onKeyDown={ this.onKeyPress } onInputChange={ this.onInputChange } />
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
