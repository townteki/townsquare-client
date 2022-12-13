import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import 'jquery-migrate';
import { DragSource } from 'react-dnd';

import CardMenu from './CardMenu';
import CardCounters from './CardCounters';
import { ItemTypes } from '../../constants';

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
        this.handleExpand = this.handleExpand.bind(this);

        this.state = {
            showMenu: false,
            isExpanded: false
        };

        this.shortNames = {
            ghostrock: 'G',
            bounty: 'B'
        };
    }

    handleExpand(event) {
        if(event) {
            event.stopPropagation();
        }
        if(this.props.handleExpand) {
            this.props.handleExpand();
            return;
        }
        this.setState({
            isExpanded: !this.state.isExpanded
        });
    }

    onMouseOver(card) {
        if(this.props.onMouseOver) {
            this.props.onMouseOver(card);
        }
        this.setState({ 
            isHovered: true
        });
    }

    onMouseOut() {
        if(this.props.onMouseOut) {
            this.props.onMouseOut();
        }
        this.setState({ 
            isHovered: false
        });
    }

    isAllowedMenuSource() {
        if(this.props.card.selectable) {
            return false;
        }

        return this.props.source === 'play area' || this.props.source === 'legend' || this.props.source === 'hand';
    }

    onClick(event, card) {
        event.preventDefault();
        event.stopPropagation();

        if(this.isAllowedMenuSource() && this.props.card.menu && this.props.card.menu.length !== 0) {
            const currentShowMenu = !this.state.showMenu;
            this.setState({ showMenu: currentShowMenu });
            if(this.props.handleMenuChange) {
                this.props.handleMenuChange(this, currentShowMenu);
            }
            return;
        }

        if(this.props.onClick) {
            this.props.onClick(card);
        }
    }

    onMenuItemClick(menuItem) {
        if(this.props.onMenuItemClick) {
            this.props.onMenuItemClick(this.props.card, menuItem);
            const currentShowMenu = !this.state.showMenu;
            this.setState({ showMenu: currentShowMenu });
            if(this.props.handleMenuChange) {
                this.props.handleMenuChange(this, currentShowMenu);
            }
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

        if(card.control !== null && card.control !== (card.printedStats.control || 0)) {
            counters.push({ name: 'card-control', count: card.control, fade: true, shortName: 'C' });
        }
        if(card.influence !== null && card.influence !== (card.printedStats.influence || 0)) {
            counters.push({ name: 'card-influence', count: card.influence, fade: true, shortName: 'I' });        
        }
        if(card.value !== null && card.value !== (card.printedStats.value || 0)) {
            counters.push({ name: 'card-value', count: card.value, fade: true, shortName: 'V' });        
        }
        if(card.upkeep !== null && card.upkeep !== (card.printedStats.upkeep || 0)) {
            counters.push({ name: 'card-upkeep', count: card.upkeep, fade: true, shortName: 'U' });        
        }
        if(card.production !== null && card.production !== (card.printedStats.production || 0)) {
            counters.push({ name: 'card-production', count: card.production, fade: true, shortName: 'P' });        
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
        if(this.props.source !== 'play area' || !this.props.card.attachments) {
            return null;
        }

        if(this.props.card.attachments.length <= 2 || this.state.isExpanded) {
            var index = 1;
            return this.props.card.attachments.map(attachment => {
                var returnedAttachment = (<Card key={ attachment.uuid } source={ this.props.source } card={ attachment }
                    className={ classNames('attachment', `attachment-${index}`, { 'opponent': this.props.isOpponent, 'hovered': this.state.isHovered }) } 
                    wrapped={ false }
                    hideTokens
                    handleMenuChange={ this.props.handleMenuChange }
                    attIndex={ index }
                    attPanelNumber={ this.state.isExpanded ? this.props.card.attachments.length : 0 }
                    handleExpand={ this.handleExpand.bind(this) }
                    onMouseOver={ this.props.disableMouseOver ? null : this.onMouseOver.bind(this, attachment) }
                    onMouseOut={ this.props.disableMouseOver ? null : this.onMouseOut }
                    onClick={ this.props.onClick }
                    onMenuItemClick={ this.props.onMenuItemClick }
                    size={ this.props.size } />);
    
                index += 1;
    
                return returnedAttachment;
            });
        }

        var attachment = this.props.card.attachments[0];

        return (
            <Card key={ attachment.uuid } source={ this.props.source } card={ attachment }
                className={ classNames('attachment', 'attachment-1', { 'opponent': this.props.isOpponent, 'hovered': this.state.isHovered }) } wrapped={ false }
                hideTokens
                handleMenuChange={ this.props.handleMenuChange }
                attIndex={ 1 }
                attPanelNumber={ this.props.card.attachments.length }
                handleExpand={ this.handleExpand.bind(this) }
                onMouseOver={ this.props.disableMouseOver ? null : this.onMouseOver.bind(this, attachment) }
                onMouseOut={ this.props.disableMouseOver ? null : this.onMouseOut }
                onClick={ this.props.onClick }
                onMenuItemClick={ this.props.onMenuItemClick }
                size={ this.props.size } />
        );

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

        if(this.props.card.facedown || this.props.card.type_code === 'goods' || this.props.card.type_code === 'spell') {
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
        return this.props.card.facedown || !this.props.card.code || this.isFiltered();
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

    showUnscripted(classOrientation) {
        if(this.props.card.scripted || this.isFacedown()) {
            return null;
        }

        let unscriptImageClass = classNames('unscripted-image', this.sizeClass, classOrientation);

        return (<div className='card-unscripted'>
            <img className={ unscriptImageClass } src='/img/tokens/scripted_skull.png' />;
        </div>);        
    }

    showEffects(card, classOrientation) {
        if(!card.effects || !card.effects.length || this.isFacedown()) {
            return null;
        }
        const gameActionsWithIcons = ['increaseBullets', 'decreaseBullets', 'increaseInfluence', 'decreaseInfluence',
            'increaseControl', 'decreaseControl', 'increaseValue', 'decreaseValue', 'increaseProduction', 'decreaseProduction',
            'increaseUpkeep', 'decreaseUpkeep', 'setAsDraw', 'setAsStud'];
        let effects = card.effects.filter(effect => {
            if(!effect.fromTrait && effect.duration === 'persistent') {
                return false;
            }
            if(!effect.gameAction || effect.gameAction === '') {
                return true;
            }
            if(gameActionsWithIcons.includes(effect.gameAction)) {
                return false;
            }
            return true;
        });
        if(!effects.length) {
            return null;
        }

        let effectsImageClass = classNames('effects-image', this.sizeClass, classOrientation);

        return (<div className='card-effects'>
            <img className={ effectsImageClass } src='/img/tokens/effects.png' />;
        </div>);        
    }

    isFiltered() {
        if(!this.props.filter) {
            return false;
        }
        if(this.props.filter.suit && this.props.card.suit !== this.props.filter.suit) {
            return true;
        }
        if(!this.getCardKeywords().length && this.props.filter.keywords && this.props.filter.keywords.length) {
            return true;
        }
        return this.props.filter.keywords && !this.props.filter.keywords.every(keyword => 
            this.getCardKeywords().includes(keyword));
    }

    getCardKeywords() {
        if(!this.props.card.printedStats || !this.props.card.printedStats.keywords) {
            return [];
        }
        return this.props.card.printedStats.keywords;
    }

    getCard() {
        if(!this.props.card) {
            return <div />;
        }

        var className = this.props.className ? this.props.className : '';
        var classOrientation = {
            'horizontal': this.props.orientation === 'horizontal',
            'vertical': this.props.orientation !== 'horizontal' && this.props.orientation !== 'booted' && !this.props.card.booted,
            'booted': this.props.orientation === 'booted' || this.props.card.booted || this.props.orientation === 'horizontal'
        };

        let cardClass = classNames('card', `card-type-${this.props.card.type_code}`, className, this.sizeClass, this.statusClass, {
            'custom-card': this.props.card.code && this.props.card.code.startsWith('custom'),
            'horizontal': this.props.orientation !== 'vertical' || this.props.card.booted,
            'vertical': this.props.orientation === 'vertical' && !this.props.card.booted,
            'unselectable': this.props.card.unselectable,
            'dragging': this.props.isDragging,
            'opponent': this.props.isOpponent,
            'play-area': this.props.source === 'play area', 
            'hovered': this.state.isHovered,
            'booted': this.props.orientation === 'booted' || this.props.card.booted || this.props.orientation === 'horizontal'
        });
        let imageClass = classNames('card-image', this.sizeClass, classOrientation);

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
                        { this.props.attPanelNumber && this.props.attIndex === 1 &&
                            <div className='att-header' onClick={ this.handleExpand.bind() }>
                                <span className='glyphicon glyphicon-th-list'/>
                                { ` (${this.props.attPanelNumber})` }
                            </div>
                        }
                        { image }
                    </div>
                    { this.showCounters() ? <CardCounters counters={ this.getCountersForCard(this.props.card) } /> : null }
                    { this.showUnscripted(classOrientation) }
                    { this.showEffects(this.props.card, classOrientation) }
                </div>
                { this.showMenu() ? 
                    <CardMenu menu={ this.props.card.menu } isBottom={ !this.props.isOpponent && this.props.side === 'our-side' }
                        isBooted={ this.props.card.booted } onMenuItemClick={ this.onMenuItemClick } /> 
                    : null }
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
        var sizeName = this.props.size ? this.props.size : 'normal';
        return {
            [sizeName]: sizeName !== 'normal'
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
        } else if(this.props.card.shootoutStatus === 'calling out' || this.props.card.shootoutStatus === 'called out') {
            if(this.props.card.controlled) {
                return 'callout controlled';
            }
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
        }

        return '';
    }

    render() {
        let className = 'card-wrapper';
        let isOppInOtherSide = this.props.isOpponent && this.props.side === 'other-side';
        let attNumber = this.props.card.attachments ? this.props.card.attachments.length : 0;
        if((this.state.isExpanded || attNumber === 2) && isOppInOtherSide) {
            if(attNumber > 2) {
                className += ' expanded-' + (this.props.card.attachments.length - 1);
            } else {
                className += ' expanded';
            }
        }
        if(this.props.wrapped) {
            return (
                <div className={ className } style={ this.props.style }>
                    { this.getCard() }
                    { this.getAttachments() }
                </div>);
        }

        return this.getCard();
    }
}

InnerCard.displayName = 'Card';
InnerCard.propTypes = {
    attIndex: PropTypes.number,
    attPanelNumber: PropTypes.number,
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
        location: PropTypes.string,
        menu: PropTypes.array,
        name: PropTypes.string,
        new: PropTypes.bool,
        order: PropTypes.number,
        printedStats: PropTypes.object,
        production: PropTypes.number,
        selectable: PropTypes.bool,
        selected: PropTypes.bool,
        scripted: PropTypes.bool,
        suit: PropTypes.string,
        tokens: PropTypes.object,
        type_code: PropTypes.string,
        unselectable: PropTypes.bool,
        uuid: PropTypes.string
    }).isRequired,
    className: PropTypes.string,
    connectDragPreview: PropTypes.func,
    connectDragSource: PropTypes.func,
    disableMouseOver: PropTypes.bool,
    dragOffset: PropTypes.object,
    filter: PropTypes.object,
    handleExpand: PropTypes.func,
    handleMenuChange: PropTypes.func,
    hideTokens: PropTypes.bool,
    isDragging: PropTypes.bool,
    isOpponent: PropTypes.bool,
    onClick: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    orientation: PropTypes.oneOf(['horizontal', 'booted', 'vertical']),
    side: PropTypes.string,
    size: PropTypes.string,
    source: PropTypes.oneOf(['hand', 'discard pile', 'play area', 'dead pile', 'draw deck', 'draw hand', 'attachment', 'legend', 'outfit', 'additional']).isRequired,
    style: PropTypes.object,
    wrapped: PropTypes.bool
};
InnerCard.defaultProps = {
    orientation: 'vertical',
    wrapped: true
};

const Card = DragSource(ItemTypes.CARD, cardSource, collect)(InnerCard);

export default Card;

