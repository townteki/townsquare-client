import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Card from './Card';
import MovablePanel from './MovablePanel';
import Droppable from './Droppable';
import CardTiledList from './CardTiledList';

class SquishableCardPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showPopup: !!props.cards && props.cards.some(card => card.selectable),
            showMenu: false
        };

        this.onPanelClick = this.onPanelClick.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
        this.onCloseClick = this.onCloseClick.bind(this);
    }

    componentWillReceiveProps(props) {
        let hasNewSelectableCard = props.cards && props.cards.some(card => card.selectable);
        let didHaveSelectableCard = this.props.cards && this.props.cards.some(card => card.selectable);

        if(!didHaveSelectableCard && hasNewSelectableCard) {
            this.updatePopupVisibility(true);
        } else if(!props.popupStayOpen && didHaveSelectableCard && !hasNewSelectableCard) {
            this.updatePopupVisibility(false);
        }
    }

    onCardClick(card) {
        if(this.props.disablePopup || this.state.showPopup) {
            if(this.props.onCardClick) {
                this.props.onCardClick(card);
            }
            return;
        }

        this.togglePopup();
    }

    onCloseClick(event) {
        event.preventDefault();
        event.stopPropagation();

        this.togglePopup();
        if(this.props.onPopupClose) {
            this.props.onPopupClose();
        }
    }

    onPopupMenuItemClick(menuItem) {
        if(menuItem.handler) {
            menuItem.handler();
        }
    }

    onPanelClick(event) {
        event.preventDefault();
        this.togglePopup();
    }

    togglePopup() {
        this.updatePopupVisibility(!this.state.showPopup && this.props.cards && this.props.cards.length > 0);
    }

    updatePopupVisibility(value) {
        this.setState({ showPopup: value });
    }

    getPopup() {
        let popup = null;
        let cardList = [];

        let listProps = {
            onCardClick: this.onCardClick.bind(this),
            onCardMouseOut: this.props.onMouseOut,
            onCardMouseOver: this.props.onMouseOver,
            size: this.props.popupCardSize,
            source: this.props.source
        };

        if(this.props.cards && this.props.cards.some(card => card.group)) {
            const cardGroup = this.props.cards.reduce((grouping, card) => {
                (grouping[card.group] = grouping[card.group] || []).push(card);

                return grouping;
            }, {});
            const sortedKeys = Object.keys(cardGroup).sort();
            for(const key of sortedKeys) {
                cardList.push(
                    <CardTiledList cards={ cardGroup[key] } key={ key } title={ key } { ...listProps } />
                );
            }
        } else {
            cardList = (
                <CardTiledList cards={ this.props.cards } { ...listProps } />);
        }

        if(this.props.disablePopup || !this.state.showPopup) {
            return null;
        }

        let popupClass = classNames('panel', {
            'our-side': this.props.popupLocation === 'bottom'
        });

        let innerClass = classNames('inner', this.props.cardSize);

        let linkIndex = 0;

        let popupMenu = this.props.popupMenu && (
            <div className='card-pile-buttons'>
                { this.props.popupMenu.map(menuItem => {
                    if(!menuItem.disabled) {
                        return (
                            <a className='btn btn-default' key={ linkIndex++ } onClick={ () => this.onPopupMenuItemClick(menuItem) }>
                                { menuItem.icon && <span className={ `glyphicon glyphicon-${menuItem.icon}` }/> }
                                { ' ' }
                                { menuItem.text }
                            </a>);
                    }
                }) }
            </div>
        );

        popup = (
            <MovablePanel title={ this.props.title } name={ this.props.source } onCloseClick={ this.onCloseClick } side={ this.props.popupLocation }>
                <Droppable onDragDrop={ this.props.onDragDrop } source={ this.props.source } playerName={ this.props.playerName }>
                    <div className={ popupClass } onClick={ event => event.stopPropagation() }>
                        { popupMenu }                  
                        <div className={ innerClass }>
                            { cardList }
                        </div>
                    </div>
                </Droppable>
            </MovablePanel>
        );

        return popup;
    }

    getCards(needsSquish) {
        let overallDimensions = this.getOverallDimensions();
        let dimensions = this.getCardDimensions();

        let cards = this.props.cards;
        let cardIndex = 0;
        let handLength = cards ? cards.length : 0;
        let cardWidth = dimensions.width;

        let requiredWidth = handLength * cardWidth;
        let overflow = requiredWidth - overallDimensions.width;
        let offset = overflow / (handLength - 1);

        if(this.props.groupVisibleCards && this.hasMixOfVisibleCards()) {
            cards = [...this.props.cards].sort((a, b) => a.facedown && !b.facedown ? -1 : 1);
        }

        let hand = cards.map(card => {
            let left = (cardWidth - offset) * cardIndex++;

            let style = {};
            if(needsSquish) {
                style = {
                    left: left + 'px'
                };
            }

            return (<Card key={ card.uuid }
                card={ card }
                disableMouseOver={ !card.code }
                handleMenuChange={ this.props.handleMenuChange }
                onClick={ this.onCardClick }
                onMouseOver={ this.props.onMouseOver }
                onMouseOut={ this.props.onMouseOut }
                onMenuItemClick={ this.props.onMenuItemClick }
                size={ this.props.cardSize }
                style={ style }
                source={ this.props.source } />);
        });

        return hand;
    }

    hasMixOfVisibleCards() {
        return this.props.cards.some(card => !!card.code) && this.props.cards.some(card => !card.code);
    }

    getCardDimensions() {
        let multiplier = this.getCardSizeMultiplier();
        return {
            width: 65 * multiplier,
            height: 91 * multiplier
        };
    }

    getCardSizeMultiplier() {
        switch(this.props.cardSize) {
            case 'small':
                return 0.8;
            case 'large':
                return 1.4;
            case 'x-large':
                return 2;
        }

        return 1;
    }

    getOverallDimensions() {
        let cardDimensions = this.getCardDimensions();
        return {
            width: (cardDimensions.width + 5) * this.props.maxCards,
            height: cardDimensions.height
        };
    }

    render() {
        let dimensions = this.getOverallDimensions();
        let maxCards = this.props.maxCards;
        let needsSquish = this.props.cards && this.props.cards.length > maxCards;
        let cards = this.getCards(needsSquish, maxCards);

        let className = classNames('squishable-card-panel', this.props.className, {
            [this.props.cardSize]: this.props.cardSize !== 'normal',
            'squish': needsSquish
        });

        let style = {
            width: dimensions.width + 'px',
            height: dimensions.height + 'px'
        };

        return (
            <div className={ className } style={ style } onClick= { this.onPanelClick }>
                { this.props.title &&
                    <div className='panel-header'>
                        { `${this.props.title} (${cards.length})` }
                    </div>
                }
                { cards }
                { this.getPopup() }
            </div>
        );
    }
}

SquishableCardPanel.displayName = 'SquishableCardPanel';
SquishableCardPanel.propTypes = {
    cardSize: PropTypes.string,
    cards: PropTypes.array,
    className: PropTypes.string,
    closeOnClick: PropTypes.bool,
    disablePopup: PropTypes.bool,
    groupVisibleCards: PropTypes.bool,
    handleMenuChange: PropTypes.func,
    maxCards: PropTypes.number,
    onCardClick: PropTypes.func,
    onDragDrop: PropTypes.func,  
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onPopupClose: PropTypes.func,
    playerName: PropTypes.string,
    popupCardSize: PropTypes.string,
    popupLocation: PropTypes.string,
    popupMenu: PropTypes.array,
    popupStayOpen: PropTypes.bool,    
    source: PropTypes.string,
    title: PropTypes.string
};
SquishableCardPanel.defaultProps = {
    popupLocation: 'bottom',
    orientation: 'vertical'
};

export default SquishableCardPanel;
