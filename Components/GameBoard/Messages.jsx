import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Avatar from '../Site/Avatar';
import { ThronesIcons } from '../../constants';
import * as actions from '../../actions';

class Messages extends React.Component {
    constructor() {
        super();

        this.state = {
            message: ''
        };

        this.tokens = {
            card: { className: 'icon-card', imageSrc: '/img/cards/cardback.jpg', title: 'Card' },
            cards: { className: 'icon-card', imageSrc: '/img/cards/cardback.jpg', title: 'Cards' },
            GR: { className: 'icon-token', imageSrc: '/img/icons/ghostrock.png', title: 'Ghost Rock' },
            influence: { className: 'icon-token', imageSrc: '/img/icons/influence.png', title: 'Influence' },
            CP: { className: 'icon-token', imageSrc: '/img/icons/control.png', title: 'Control Point' },
            bullet: { className: 'icon-bullet', imageSrc: '/img/icons/bullet_draw.png', title: 'Bullet' },
            bullets: { className: 'icon-bullet', imageSrc: '/img/icons/bullet_draw.png', title: 'Bullets' },
            Hearts: { className: 'icon-token', imageSrc: '/img/icons/heart.png', title: 'Hearts' },
            Diams: { className: 'icon-token', imageSrc: '/img/icons/diam.png', title: 'Diams' },
            Clubs: { className: 'icon-token', imageSrc: '/img/icons/club.png', title: 'Clubs' },
            Spades: { className: 'icon-token', imageSrc: '/img/icons/spade.png', title: 'Spades' }
        };

        this.formatMessageText = this.formatMessageText.bind(this);
    }

    getMessage() {
        let index = 0;
        let messages = this.props.messages.map(message => {
            return <div key={ 'message' + index++ } className='message'>{ this.formatMessageText(message.message) }</div>;
        });

        return messages;
    }

    processKeywords(message) {
        let messages = [];
        let i = 0;

        for(let token of message.split(' ')) {
            if(this.tokens[token]) {
                let tokenEntry = this.tokens[token];
                messages.push(<img 
                    key={ `${token}-${i++}` } 
                    className={ tokenEntry.className } 
                    src={ tokenEntry.imageSrc } 
                    title={ tokenEntry.title }
                />);
                messages.push(' ');
            } else {
                messages.push(token + ' ');
            }
        }

        return messages;
    }

    formatMessageText(message) {
        let index = 0;

        let messages = [];

        for(const [key, fragment] of Object.entries(message)) {
            if(fragment === null || fragment === undefined) {
                messages.push('');

                continue;
            }

            if(key === 'alert') {
                let message = this.formatMessageText(fragment.message);

                switch(fragment.type) {
                    case 'endofround':
                    case 'phasestart':
                    case 'startofround':
                        messages.push(
                            <div className={ 'bold seperator ' + fragment.type } key={ index++ }>
                                <hr className={ fragment.type } />
                                { message }
                                { fragment.type === 'phasestart' && <hr /> }
                            </div>
                        );
                        break;
                    case 'success':
                        messages.push(<div className='alert alert-success' key={ index++ }>
                            <span className='glyphicon glyphicon-ok-sign' />&nbsp;
                            { message }
                        </div>);
                        break;
                    case 'info':
                        messages.push(<div className='alert alert-info' key={ index++ }>
                            <span className='glyphicon glyphicon-info-sign' />&nbsp;
                            { message }
                        </div>);
                        break;
                    case 'danger':
                        messages.push(<div className='alert alert-danger' key={ index++ }>
                            <span className='glyphicon glyphicon-exclamation-sign' />&nbsp;
                            { message }
                        </div>);
                        break;
                    case 'warning':
                        messages.push(<div className='alert alert-warning' key={ index++ }>
                            <span className='glyphicon glyphicon-warning-sign' />&nbsp;
                            { message }
                        </div>);
                        break;
                    default:
                        messages.push(message);
                        break;
                }
            } else if(fragment.message) {
                messages.push(this.formatMessageText(fragment.message));
            } else if(fragment.code && fragment.label) {
                messages.push(
                    <span key={ index++ }
                        className='card-link'
                        onMouseOver={ this.props.onCardMouseOver.bind(this, fragment) }
                        onMouseOut={ this.props.onCardMouseOut.bind(this) }>
                        { fragment.label }
                    </span>
                );
            } else if(fragment.name && fragment.argType === 'player') {
                let userClass = 'username' + (fragment.role ? ` ${fragment.role}-role` : '');

                messages.push(
                    <div key={ index++ } className='message-chat'>
                        <Avatar username={ fragment.name } float />
                        <span key={ index++ } className={ userClass }>
                            { fragment.name }
                        </span>
                    </div>
                );
            } else if(fragment.argType === 'nonAvatarPlayer') {
                let userClass = 'username' + (fragment.role ? ` ${fragment.role}-role` : '');

                messages.push(<span key={ index++ } className={ userClass }>{ fragment.name }</span>);
            } else if(ThronesIcons.includes(fragment)) {
                messages.push(
                    <span key={ index++ } className={ `thronesicon thronesicon-${fragment}` } />
                );
            } else {
                let messageFragment = this.processKeywords(fragment.toString());
                messages.push(messageFragment);
            }
        }

        return messages;
    }

    render() {
        return <div>{ this.getMessage() }</div>;
    }
}

Messages.displayName = 'Messages';
Messages.propTypes = {
    messages: PropTypes.array,
    onCardMouseOut: PropTypes.func,
    onCardMouseOver: PropTypes.func,
    socket: PropTypes.object
};

function mapStateToProps(state) {
    return {
        socket: state.lobby.socket
    };
}

export default connect(mapStateToProps, actions)(Messages);

