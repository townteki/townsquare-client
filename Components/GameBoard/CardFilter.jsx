import React from 'react';

const suits = ['Clubs', 'Spades', 'Hearts', 'Diams'];
class CardFilter extends React.Component {
    constructor() {
        super();

        this.handleFilterSuitClick = this.handleFilterSuitClick.bind(this);
        this.handleFilterKeywordClick = this.handleFilterKeywordClick.bind(this);
        this.handleFilterClearClick = this.handleFilterClearClick.bind(this);
        this.handleSelectedKeywords = this.handleSelectedKeywords.bind(this);

        this.state = {
            filter: { 
                suit: null,
                keywords: null
            },
            isKeywordFilter: false
        };
    }

    handleFilterSuitClick() {
        const newFilter = this.state.filter;
        const index = suits.indexOf(this.state.filter.suit);
        newFilter.suit = null;
        if(index < 0) {
            newFilter.suit = suits[0];
        } else if(index < suits.length - 1) {
            newFilter.suit = suits[index + 1];
        }
        this.setState({ filter: newFilter });
    }

    handleFilterKeywordClick() {
        this.setState({ isKeywordFilter: !this.state.isKeywordFilter });
    }

    handleFilterClearClick() {
        this.setState({ filter: { suit: null, keywords: null },
            isKeywordFilter: false });
    }

    handleSelectedKeywords(values) {
        if(!this.state) {
            return;
        }
        const newFilter = this.state.filter;
        newFilter.keywords = values;
        this.setState({ filter: newFilter, isKeywordFilter: false });
    }

    addFilterButtons(popupMenu) {
        if(this.state.isKeywordFilter) {
            popupMenu.push({ 
                text: this.state.keywordText, 
                isKeywordFilter: true, 
                keywordHandler: this.handleSelectedKeywords,
                handler: this.handleFilterKeywordClick
            });
        }
        popupMenu.push({ 
            text: this.state.filter.suit ? this.state.filter.suit : 'All suits', 
            icon: 'filter', 
            handler: this.handleFilterSuitClick,
            filterProperty: 'suit'
        });
        popupMenu.push({ 
            text: 'Keywords', 
            icon: 'filter', 
            handler: this.handleFilterKeywordClick,
            filterProperty: 'keywords'
        });
        popupMenu.push({ 
            text: 'Clear', 
            icon: 'filter', 
            handler: this.handleFilterClearClick
        });
    }
}

export default CardFilter;
