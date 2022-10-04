import React from 'react';
import PropTypes from 'prop-types';

class CardPrompt extends React.Component {
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

    renderSimpleCard(card) {
        return (
            <div className='target-card vertical'
                onMouseOut={ event => this.onMouseOut(event, card) }
                onMouseOver={ event => this.onMouseOver(event, card) }>
                <img className='target-card-image vertical'
                    alt={ card.name }
                    src={ '/img/cards/' + (!card.facedown ? (card.code + '.jpg') : 'cardback.jpg') } />
            </div>);
    }

    renderTargerCards() {
        if(!this.props.targets || !this.props.targets.length) {
            return;
        }
        return this.props.targets.map(target => this.renderSimpleCard(target));       
    }    

    render() {
        return (
            <div className='prompt-control-targeting'>
                { this.renderSimpleCard(this.props.source) }
                { this.props.targets && this.props.targets.length && <span className='glyphicon glyphicon-arrow-right targeting-arrow' /> }
                { this.renderTargerCards() }
            </div>);
    }
}

CardPrompt.displayName = 'CardPrompt';
CardPrompt.propTypes = {
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    source: PropTypes.object,
    targets: PropTypes.array
};

export default CardPrompt;
