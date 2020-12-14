import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import 'jquery-migrate';
import { DragSource } from 'react-dnd';

import CardMenu from './CardMenu';
import CardCounters from './CardCounters';
import { ItemTypes } from '../../constants';

import SquishableCardPanel from './SquishableCardPanel';

const cardSource = {
    beginDrag(props) {
        return {
            card: props.card,
            source: props.source
        };
    }
};

function collect(connect, monitor) {
    return {
        connectDragPreview: connect.dragPreview(),
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
        dragOffset: monitor.getSourceClientOffset()
    };
}

class InnerCard extends React.Component {
    constructor() {
        super();

        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);

        this.state = {
            showMenu: false
        };

        this.shortNames = {
            ghostrock: 'G',
            bounty: 'B'
        };
    }

    onMouseOver(card) {
        if(this.props.onMouseOver) {
            this.props.onMouseOver(card);
        }
    }

    onMouseOut() {
        if(this.props.onMouseOut) {
            this.props.onMouseOut();
        }
    }

    isAllowedMenuSource() {
        if(this.props.card.selectable) {
            return false;
        }

        return this.props.source === 'play area' || this.props.source === 'legend' || this.props.source === 'draw hand' || this.props.source === 'hand';
    }

    onClick(event, card) {
        event.preventDefault();
        event.stopPropagation();

        if(this.isAllowedMenuSource() && this.props.card.menu && this.props.card.menu.length !== 0) {
            this.setState({ showMenu: !this.state.showMenu });

            return;
        }

        if(this.props.onClick) {
            this.props.onClick(card);
        }
    }

    onMenuItemClick(menuItem) {
        if(this.props.onMenuItemClick) {
            this.props.onMenuItemClick(this.props.card, menuItem);
            this.setState({ showMenu: !this.state.showMenu });
        }
    }

    getCountersForCard(card) {
        let counters = [];

        if(card.shooter !== card.printedStats.shooter || card.bullets !== card.printedStats.bullets) {
            if(card.shooter === 'Draw' && card.bullets !== null) {
                counters.push({ name: 'bullets-draw', count: card.bullets, fade: true, shortName: 'D' });
            } else if(card.shooter === 'Stud' && card.bullets !== null) {
                counters.push({ name: 'bullets-stud', count: card.bullets, fade: true, shortName: 'S' });
            }
        }

        if(card.control && card.control !== card.printedStats.control) {
             counters.push({ name: 'card-control', count: card.control, fade: true, shortName: 'C' });
        }
        if (card.influence && card.influence !== card.printedStats.influence) {
            counters.push({ name: 'card-influence', count: card.influence, fade: true, shortName: 'I' });        
        }

        for(const [key, token] of Object.entries(card.tokens || {})) {
            counters.push({ name: key, count: token, shortName: this.shortNames[key] });
        }

        for(const attachment of card.attachments || []) {
            let attachmentCounters = this.getCountersForCard(attachment).map(counter => Object.assign({ fade: true }, counter));
            counters = counters.concat(attachmentCounters);
        }

        return counters.filter(counter => counter.count >= 0);
    }

    getAttachments() {
        if(!['rookery', 'full deck', 'play area'].includes(this.props.source)) {
            return null;
        }

        var index = 1;
        var attachments = this.props.card.attachments.map(attachment => {
            var returnedAttachment = (<Card key={ attachment.uuid } source={ this.props.source } card={ attachment }
                className={ classNames('attachment', `attachment-${index}`) } wrapped={ false }
                hideTokens
                onMouseOver={ this.props.disableMouseOver ? null : this.onMouseOver.bind(this, attachment) }
                onMouseOut={ this.props.disableMouseOver ? null : this.onMouseOut }
                onClick={ this.props.onClick }
                onMenuItemClick={ this.props.onMenuItemClick }
                size={ this.props.size } />);

            index += 1;

            return returnedAttachment;
        });

        return attachments;
    }

    renderUnderneathCards() {
        // TODO: Right now it is assumed that all cards in the childCards array
        // are being placed underneath the current card. In the future there may
        // be other types of cards in this array and it should be filtered.
        let underneathCards = this.props.card.childCards;
        if(!underneathCards || underneathCards.length === 0) {
            return;
        }

        let maxCards = 1 + (underneathCards.length - 1) / 6;

        return (
            <SquishableCardPanel
                cardSize={ this.props.size }
                cards={ underneathCards }
                className='underneath'
                maxCards={ maxCards }
                onCardClick={ this.props.onClick }
                onMouseOut={ this.props.onMouseOut }
                onMouseOver={ this.props.onMouseOver }
                source='underneath' />);
    }

    getCardOrder() {
        if(!this.props.card.order) {
            return null;
        }

        return (<div className='card-order'>{ this.props.card.order }</div>);
    }

    showCounters() {
        if(this.props.source !== 'play area') {
            return false;
        }

        if(this.props.card.facedown || this.props.card.type === 'attachment') {
            return false;
        }

        return true;
    }    

    showMenu() {
        if(!this.isAllowedMenuSource()) {
            return false;
        }

        if(!this.props.card.menu || !this.state.showMenu) {
            return false;
        }

        return true;
    }

    isFacedown() {
        return this.props.card.facedown || !this.props.card.code;
    }

    getDragFrame(image) {
        if(!this.props.isDragging) {
            return null;
        }

        let style = {};

        if(this.props.dragOffset && this.props.isDragging) {
            let x = this.props.dragOffset.x;
            let y = this.props.dragOffset.y;

            style = {
                left: x,
                top: y
            };
        }

        return (
            <div className='drag-preview' style={ style }>
                { image }
            </div>);
    }

    getCard() {
        if(!this.props.card) {
            return <div />;
        }

        let cardClass = classNames('card', `card-type-${this.props.card.type_code}`, this.props.className, this.statusClass, {
            'custom-card': this.props.card.code && this.props.card.code.startsWith('custom'),
            'horizontal': this.props.orientation !== 'vertical' || this.props.card.booted,
            'vertical': this.props.orientation === 'vertical' && !this.props.card.booted,
            'unselectable': this.props.card.unselectable,
            'dragging': this.props.isDragging
        });
        let imageClass = classNames('card-image', {
            'horizontal': this.props.orientation === 'horizontal',
            'vertical': this.props.orientation !== 'horizontal',
            'booted': this.props.orientation === 'booted' || this.props.card.booted || this.props.orientation === 'horizontal'
        });

        let image = <img className={ imageClass } src={ this.imageUrl } />;

        let content = this.props.connectDragSource(
            <div className='card-frame'>
                { this.getDragFrame(image) }
                { this.getCardOrder() }
                <div className={ cardClass }
                    onMouseOver={ this.props.disableMouseOver ? null : this.onMouseOver.bind(this, this.props.card) }
                    onMouseOut={ this.props.disableMouseOver ? null : this.onMouseOut }
                    onClick={ ev => this.onClick(ev, this.props.card) }>
                    <div>
                        <span className='card-name'>{ this.props.card.name }</span>
                        { image }
                    </div>
                    { this.showCounters() ? <CardCounters counters={ this.getCountersForCard(this.props.card) } /> : null }
                </div>
                { this.showMenu() ? <CardMenu menu={ this.props.card.menu } onMenuItemClick={ this.onMenuItemClick } /> : null }
            </div>);

        return this.props.connectDragPreview(content);
    }

    get imageUrl() {
        let image = 'cardback.jpg';

        if(!this.isFacedown()) {
            image = `${this.props.card.code}.jpg`;
        }

        return '/img/cards/' + image;
    }

    get sizeClass() {
        return {
            [this.props.size]: this.props.size !== 'normal'
        };
    }

    get statusClass() {
        if(!this.props.card) {
            return;
        }

        if(this.props.card.selected) {
            return 'selected';
        } else if(this.props.card.selectable) {
            return 'selectable';
        } else if(this.props.card.saved) {
            return 'saved';
        } else if(this.props.card.shootoutStatus === 'calling out' || this.props.card.shootoutStatus === 'called out') {
            return 'callout';
        } else if(this.props.card.shootoutStatus === 'leader shooter') {
            return 'shooter-attack';
        } else if(this.props.card.shootoutStatus === 'mark shooter') {
            return 'shooter-defend';
        } else if(this.props.card.shootoutStatus === 'leader posse') {
            return 'attacking';
        } else if(this.props.card.shootoutStatus === 'mark posse') {
            return 'defending';
        } else if(this.props.card.controlled) {
            return 'controlled';
        } else if(this.props.card.new) {
            return 'new';
        }
    }

    render() {
        if(this.props.wrapped) {
            return (
                <div className='card-wrapper' style={ this.props.style }>
                    { this.getCard() }
                    { this.getAttachments() }
                    { this.renderUnderneathCards() }
                </div>);
        }

        return this.getCard();
    }
}

InnerCard.displayName = 'Card';
InnerCard.propTypes = {
    card: PropTypes.shape({
        attached: PropTypes.bool,
        attachments: PropTypes.array,
        booted: PropTypes.bool,
        bullets: PropTypes.number,
        code: PropTypes.string,
        cost: PropTypes.number,
        controlled: PropTypes.bool,
        facedown: PropTypes.bool,
        gamelocation: PropTypes.string,
        shootoutStatus: PropTypes.string,
        iconsAdded: PropTypes.array,
        iconsRemoved: PropTypes.array,
        inChallenge: PropTypes.bool,
        inDanger: PropTypes.bool,
        menu: PropTypes.array,
        name: PropTypes.string,
        new: PropTypes.bool,
        order: PropTypes.number,
        power: PropTypes.number,
        production: PropTypes.number,
        saved: PropTypes.bool,
        selectable: PropTypes.bool,
        selected: PropTypes.bool,
        stealth: PropTypes.bool,
        strength: PropTypes.number,
        tokens: PropTypes.object,
        type: PropTypes.string,
        unselectable: PropTypes.bool
    }).isRequired,
    className: PropTypes.string,
    connectDragPreview: PropTypes.func,
    connectDragSource: PropTypes.func,
    disableMouseOver: PropTypes.bool,
    dragOffset: PropTypes.object,
    hideTokens: PropTypes.bool,
    isDragging: PropTypes.bool,
    onClick: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    orientation: PropTypes.oneOf(['horizontal', 'booted', 'vertical']),
    size: PropTypes.string,
    source: PropTypes.oneOf(['hand', 'discard pile', 'play area', 'boothill pile', 'draw deck', 'draw hand', 'attachment', 'legend', 'outfit', 'additional']).isRequired,
    style: PropTypes.object,
    wrapped: PropTypes.bool
};
InnerCard.defaultProps = {
    orientation: 'vertical',
    wrapped: true
};

const Card = DragSource(ItemTypes.CARD, cardSource, collect)(InnerCard);

export default Card;

