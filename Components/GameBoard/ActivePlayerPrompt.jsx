import React from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';

import CardPrompt from './CardPrompt';
import AbilityTimer from './AbilityTimer';
import CardNameLookup from './CardNameLookup';
import KeywordLookup from './KeywordLookup';
import { processKeywords } from './MessagesTokens';

class ActivePlayerPrompt extends React.Component {
    onButtonClick(event, button) {
        event.preventDefault();

        this.props.stopAbilityTimer();

        if(this.props.onButtonClick) {
            this.props.onButtonClick(button);
        }
    }

    onCancelTimerClick(event, button) {
        event.preventDefault();

        this.props.stopAbilityTimer();

        if(button.method || button.arg) {
            this.props.onButtonClick(button);
        }
    }

    onMouseOver(event, card) {
        if(card && this.props.onMouseOver) {
            this.props.onMouseOver(card);
        }
    }

    onMouseOut(event, card) {
        if(card && this.props.onMouseOut) {
            this.props.onMouseOut(card);
        }
    }

    getInfoArea() {
        if(!this.props.promptInfo) {
            return;
        }
        switch(this.props.promptInfo.type) {
            case 'info':
                return (<div className='menu-pane-source'>
                    <div className='alert alert-info'>
                        <span className='glyphicon glyphicon-info-sign' />&nbsp;
                        { processKeywords(this.props.promptInfo.message) }
                    </div>
                </div>);
            case 'danger':
                return (<div className='menu-pane-source'>
                    <div className='alert alert-danger'>
                        <span className='glyphicon glyphicon-exclamation-sign' />&nbsp;
                        { processKeywords(this.props.promptInfo.message) }
                    </div>
                </div>);                
            case 'warning':
                return (<div className='menu-pane-source'>
                    <div className='alert alert-warning'>
                        <span className='glyphicon glyphicon-warning-sign' />&nbsp;
                        { processKeywords(this.props.promptInfo.message) }
                    </div>
                </div>);                 
            default:
                break;
        }      
    }

    getButtons() {
        let buttonIndex = 0;

        let buttons = [];

        if(!this.props.buttons) {
            return null;
        }

        for(const button of this.props.buttons) {
            if(button.timer) {
                continue;
            }

            let className = 'btn btn-default prompt-button';

            let clickCallback = button.timerCancel ? event => this.onCancelTimerClick(event, button) :
                event => this.onButtonClick(event, button);

            if(button.menuIcon) {
                className += ' glyphicon glyphicon-' + button.menuIcon;
            }

            let option = (
                <button key={ button.command + buttonIndex.toString() }
                    className={ className }
                    onClick={ clickCallback }
                    onMouseOver={ event => this.onMouseOver(event, button.card) }
                    onMouseOut={ event => this.onMouseOut(event, button.card) }
                    disabled={ button.disabled }> { button.icon && <div className={ `with-background thronesicon thronesicon-${button.icon}` } /> } { button.text }</button>);

            buttonIndex++;

            buttons.push(option);
        }

        return buttons;
    }

    handleLookupValueSelected(command, method, promptId, cardName) {
        if(this.props.onButtonClick) {
            this.props.onButtonClick({ command: command, arg: cardName, method: method, promptId: promptId });
        }
    }

    getControls() {
        if(!this.props.controls) {
            return null;
        }

        return this.props.controls.map(control => {
            switch(control.type) {
                case 'card-image':
                    return (
                        <CardPrompt
                            onMouseOut={ this.props.onMouseOut }
                            onMouseOver={ this.props.onMouseOver }
                            source={ control.source } />);                
                case 'targeting':
                    return (
                        <CardPrompt
                            onMouseOut={ this.props.onMouseOut }
                            onMouseOver={ this.props.onMouseOver }
                            source={ control.source }
                            targets={ control.targets } />);
                case 'card-name':
                    return <CardNameLookup cards={ this.props.cards } onValueSelected={ this.handleLookupValueSelected.bind(this, control.command, control.method, control.promptId) } />;
                case 'trait-name':
                    return <KeywordLookup cards={ this.props.cards } onKeywordsSelected={ this.handleLookupValueSelected.bind(this, control.command, control.method, control.promptId) } />;
            }
        });
    }

    render() {
        let promptTitle;

        if(this.props.promptTitle) {
            promptTitle = (<div className='menu-pane-source'>{ this.props.promptTitle }</div>);
        }

        let timer = null;

        let promptText = [];
        if(this.props.promptText && this.props.promptText.includes('\n')) {
            let split = this.props.promptText.split('\n');
            for(let token of split) {
                promptText.push(token);
                promptText.push(<br />);
            }
        } else {
            promptText.push(this.props.promptText);
        }

        if(this.props.timerStartTime) {
            timer = (
                <AbilityTimer startTime={ this.props.timerStartTime } limit={ this.props.timerLimit } />);
        }

        var activePromptBounds = {
            top: -1 * Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) + 290,
            bottom: 100,
            left: 0,
            right: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) - 210
        };

        return (<Draggable handle='grip'
            bounds={ activePromptBounds }>
            <div>
                { timer }
                <grip style={ { cursor: 'grab' } }>
                    <div className={ 'phase-indicator ' + this.props.phase } onClick={ this.props.onTitleClick }>
                        { this.props.phase } phase
                    </div>
                </grip>
                { promptTitle }
                { this.getInfoArea() }
                <div className='menu-pane'>
                    <div className='panel'>
                        <h4>{ promptText }</h4>
                        { this.getControls() }
                        { this.getButtons() }
                    </div>
                </div>
            </div>
        </Draggable>);
    }
}

ActivePlayerPrompt.displayName = 'ActivePlayerPrompt';
ActivePlayerPrompt.propTypes = {
    buttons: PropTypes.array,
    cards: PropTypes.object,
    controls: PropTypes.array,
    onButtonClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onTitleClick: PropTypes.func,
    phase: PropTypes.string,
    promptInfo: PropTypes.object,    
    promptText: PropTypes.string,
    promptTitle: PropTypes.string,
    socket: PropTypes.object,
    stopAbilityTimer: PropTypes.func,
    timerLimit: PropTypes.number,
    timerStartTime: PropTypes.instanceOf(Date),
    user: PropTypes.object
};

export default ActivePlayerPrompt;
