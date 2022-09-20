import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { validateDeck } from 'townsquare-deck-helper';

import Input from '../Form/Input';
import Select from '../Form/Select';
import Typeahead from '../Form/Typeahead';
import TextArea from '../Form/TextArea';
import ApiStatus from '../Site/ApiStatus';
import RestrictedListDropdown from './RestrictedListDropdown';
import * as actions from '../../actions';
import { lookupCardByName } from './DeckParser';
import RestrictedList from 'townsquare-deck-helper/lib/RestrictedList';

const plainHeader = /^([^()]+)\((.+)??\)$/;
const bbHeader = /^\[.*?\](.*?)\[.*\]/;
const mdHeader = /^\[(.*)\].*$/;

const lawdogsCode = '01002';

class DeckEditor extends React.Component {
    constructor(props) {
        super(props);
        this.onOnlyUnrestrictedClick = this.onOnlyUnrestrictedClick.bind(this);

        this.state = {
            cardList: '',
            deckName: 'New Deck',
            drawCards: [],
            legends: [],
            outfit: props.outfits && props.outfits[lawdogsCode],
            numberToAdd: 1,
            validation: {
                deckname: '',
                cardToAdd: ''
            }
        };

        if(props.deck) {
            this.state.deckId = props.deck._id;
            this.state.deckName = props.deck.name;
            this.state.drawCards = props.deck.drawCards;
            this.state.outfit = props.deck.outfit;
            this.state.legend = props.deck.legend;
            this.state.status = props.deck.status;

            let cardList = '';
            for(const card of props.deck.drawCards) {
                cardList += this.formatCardListItem(card) + '\n';
            }
            this.state.cardList = cardList;
        }
    }

    componentDidMount() {
        this.triggerDeckUpdated();
    }

    componentWillReceiveProps(props) {
        if(props.user) {
            this.isPtUser = props.user.permissions.isContributor;
        }
        if(props.outfits && !this.state.outfit) {
            this.setState({ outfit: props.outfits[lawdogsCode] }, this.triggerDeckUpdated);
        }
    }

    onOnlyUnrestrictedClick(event) {
        this.setState({ onlyUnrestricted: event.target.checked });
    }

    getDeckFromState(restrictedList) {
        let deck = {
            _id: this.state._id,
            name: this.state.deckName,
            outfit: this.state.outfit,
            legend: this.state.legend,
            drawCards: this.state.drawCards
        };

        if(!this.props.restrictedList && !this.props.currentRestrictedList) {
            deck.status = {};
        } else {
            const selectedRestrictedList = restrictedList || this.props.currentRestrictedList;
            const restrictedLists = selectedRestrictedList ? [selectedRestrictedList] : this.props.restrictedList;
            deck.status = validateDeck(deck, { packs: this.props.packs, restrictedLists });
        }

        return deck;
    }

    triggerDeckUpdated(restrictedList) {
        const deck = this.getDeckFromState(restrictedList);

        if(this.props.onDeckUpdated) {
            this.props.onDeckUpdated(deck);
        }
    }

    formatCardListItem(card) {
        if(card.card.custom) {
            let typeCode = card.card.type_code;
            let typeName = typeCode[0].toUpperCase() + typeCode.slice(1);
            return card.count + ' Custom ' + typeName + ' - ' + card.card.title;
        }

        return card.count + ' ' + card.card.title + (card.starting ? '*' : '') + ' (' + card.card.pack_code + ')';
    }

    onChange(field, event) {
        let state = this.state;

        state[field] = event.target.value;

        this.setState({ state }, this.triggerDeckUpdated);
    }

    onNumberToAddChange(event) {
        this.setState({ numberToAdd: event.target.value });
    }

    onOutfitChange(selectedOutfit) {
        this.setState({ outfit: selectedOutfit }, this.triggerDeckUpdated);
    }

    onLegendChange(selectedLegend) {
        this.setState({ legend: selectedLegend }, this.triggerDeckUpdated);
    }

    addCardChange(selectedCards) {
        this.setState({ cardToAdd: selectedCards[0] });
    }

    onAddCard(event) {
        event.preventDefault();

        if(!this.state.cardToAdd || !this.state.cardToAdd.title) {
            return;
        }

        let cardList = this.state.cardList;
        cardList += `${this.state.numberToAdd}  ${this.state.cardToAdd.title}\n`;

        let cards = this.state.drawCards;
        this.addCard(cards, this.state.cardToAdd, parseInt(this.state.numberToAdd));
        this.setState({ cardList: cardList, drawCards: cards }, this.triggerDeckUpdated);
    }

    onCardListChange(event) {
        
        let split = event.target.value.split('\n');
        let { deckName, outfit, legend, drawCards } = this.state;
        let options = { 
            imported: false,
            bbCode: false,
            markdown: false
        };
        if(event.target.value.startsWith('[b]')) {
            options.bbCode = true;
        }
        if(event.target.value.startsWith('# ')) {
            options.markdown = true;
        }        
        let headerMark = split.findIndex(line => line.match(/^(#+\s+|(\[.+\]))?Dude/));
        if(headerMark >= 0) {
            options.imported = true;
            // Beginning of the card data found,
            // extract deck title and outfit
            let header = split.slice(0, headerMark).filter(line => line !== '');
            split = split.slice(headerMark);

            if(header.length >= 2) {
                deckName = header[0];
                if(options.bbCode) {
                    deckName = header[0].trim().match(bbHeader)[1];
                }
                if(options.markdown) {
                    deckName = header[0].trim().match(/^#+\s+(.*)$/)[1];
                }

                let headerMatch = header[1].trim().match(plainHeader);
                if(options.bbCode) {
                    headerMatch = header[1].trim().match(bbHeader);
                }
                if(options.markdown) {
                    headerMatch = header[1].trim().match(mdHeader);
                }
                let outfitPack;
                let newOutfit = Object.values(this.props.outfits).find(outfit => {
                    outfitPack = this.props.packs.find(pack => pack.code === outfit.pack_code);
                    return outfit.title === headerMatch[1].trim() && outfitPack.name === headerMatch[2].trim();
                });
                if(newOutfit && headerMatch[1] && (!outfitPack.isPt || this.isPtUser)) {
                    outfit = newOutfit;
                }
            }
        }

        drawCards = [];
        let parsingLegend = false;

        for(const line of split) {
            if(line.trim().match(/^(#+\s+|(\[.+\]))?Legend/)) {
                parsingLegend = true;
                continue;
            }
            let { card, count, starting, pack } = this.parseCardLine(line, options);
            if(card) {
                if(pack.isPt && !this.isPtUser) {
                    parsingLegend = false;
                } else {
                    if(parsingLegend) {
                        let newLegend = Object.values(this.props.legends).find(legend => legend.title === card.title);
                        let legendPack = this.props.packs.find(pack => pack.code === newLegend.pack_code);
                        if(newLegend && (!legendPack.isPt || this.isPtUser)) {
                            legend = newLegend;
                        }
                        parsingLegend = false;
                        continue;
                    }
                    this.addCard(drawCards, card, count, starting);
                }
            }
        }

        this.setState({
            cardList: event.target.value,
            deckName: deckName,
            outfit: outfit,
            legend: legend,
            drawCards: drawCards
        }, this.triggerDeckUpdated);
    }

    parseCardLine(line, options) {
        const pattern = /^\*?\s?(\d+)x?\s+(.+)$/;

        let match = line.trim().match(pattern);
        if(!match) {
            return { count: 0 };
        }

        let count = parseInt(match[1]);
        let cardTitle = match[2];
        let starting = 0;
        if(cardTitle.indexOf('*') > -1) {
            starting = cardTitle.split('*').length - 1;
            cardTitle = cardTitle.replaceAll('*', '');
        }
        let { card, pack } = lookupCardByName({ 
            cardTitle: cardTitle, 
            cards: Object.values(this.props.cards), 
            packs: this.props.packs,
            options
        });

        return { count, starting, card, pack };
    }

    addCard(list, card, number, starting) {
        if(list[card.code]) {
            list[card.code].count += number;
        } else {
            list.push({ count: number, card: card, starting: starting });
        }
    }

    cardOptionLabel(option) {
        const cardPack = this.props.packs.find(pack => pack.code === option.pack_code);
        return `${option.title} (${cardPack.name})`;
    }

    getCardOptions(cardList) {
        const restrList = new RestrictedList(this.props.currentRestrictedList);
        return Object.values(cardList).filter(card => {
            let cardPack = this.props.packs.find(pack => pack.code === card.pack_code);
            if(cardPack.isPt && !this.isPtUser) {
                return false;
            }
            return !this.state.onlyUnrestricted || !restrList.isCardRestricted(card);
        });
    }

    onSaveClick(event) {
        event.preventDefault();

        if(this.props.onDeckSave) {
            this.props.onDeckSave(this.getDeckFromState());
        }
    }

    onCancelClick() {
        this.props.navigate('/decks');
    }

    render() {
        if(!this.props.outfits || !this.props.legends || !this.props.cards) {
            return <div>Please wait while loading from the server...</div>;
        }

        return (
            <div>
                <ApiStatus apiState={ this.props.apiState } successMessage='Deck saved successfully.' />

                <div className='form-group'>
                    <div className='col-xs-12 deck-buttons'>
                        <span className='col-xs-2'>
                            <button ref='submit' type='submit' className='btn btn-primary' onClick={ this.onSaveClick.bind(this) }>Save { this.props.apiState && this.props.apiState.loading && <span className='spinner button-spinner' /> }</button>
                        </span>
                        <button ref='submit' type='button' className='btn btn-primary' onClick={ this.onCancelClick.bind(this) }>Cancel</button>
                    </div>
                </div>

                <div className='form-group'>
                    <RestrictedListDropdown
                        currentRestrictedList={ this.props.currentRestrictedList }
                        onChange={ (restrictedList) => this.triggerDeckUpdated(restrictedList) }
                        restrictedLists={ this.props.restrictedList }
                        setCurrentRestrictedList={ this.props.setCurrentRestrictedList }
                        user={ this.props.user } />
                </div>

                <h4>Either type the cards manually into the box below, add the cards one by one using the card box and autocomplete or for best results, copy and paste a decklist from <a href='http://dtdb.co' target='_blank'>DTDB</a> into the box below.</h4>
                <form className='form form-horizontal'>
                    <Input name='deckName' label='Deck Name' labelClass='col-sm-3' fieldClass='col-sm-9' placeholder='Deck Name'
                        type='text' onChange={ this.onChange.bind(this, 'deckName') } value={ this.state.deckName } />
                    <Select name='outfit' label='Outfit' labelClass='col-sm-3' fieldClass='col-sm-9' options={ this.getCardOptions(this.props.outfits) }
                        onChange={ this.onOutfitChange.bind(this) } value={ this.state.outfit ? this.state.outfit.code : undefined }
                        valueKey='code' nameKey='title' blankOption={ { title: '- Select -', code: '' } } />
                    <Select name='legend' label='Legend' labelClass='col-sm-3' fieldClass='col-sm-9' options={ this.getCardOptions(this.props.legends) }
                        onChange={ this.onLegendChange.bind(this) } value={ this.state.legend ? this.state.legend.code : undefined }
                        valueKey='code' nameKey='title' blankOption={ { title: '- Select -', code: '' } } />

                    <Typeahead id='deck-editor' label='Card' labelClass={ 'col-sm-3' } fieldClass='col-sm-9' labelKey={ option => this.cardOptionLabel(option) } 
                        options={ this.getCardOptions(this.props.cards) } onChange={ this.addCardChange.bind(this) }/>
                    <Input name='numcards' type='text' label='Num' labelClass='col-sm-offset-3 col-sm-1' fieldClass='col-sm-2'
                        value={ this.state.numberToAdd.toString() } onChange={ this.onNumberToAddChange.bind(this) } >
                        <div className='col-sm-1 no-x-padding'>
                            <div className='btn-group'>
                                <button className='btn btn-default' onClick={ this.onAddCard.bind(this) }>
                                    <span className='glyphicon glyphicon-menu-down'/>
                                </button>
                            </div>
                        </div>
                        <div className='checkbox col-sm-4'>
                            <label>
                                <input type='checkbox' onChange={ this.onOnlyUnrestrictedClick } checked={ this.state.onlyUnrestricted } />
                                Only Unrestricted
                            </label>
                        </div>
                    </Input>

                    <TextArea label='Cards' labelClass='col-sm-3' fieldClass='col-sm-9' rows='10' value={ this.state.cardList }
                        onChange={ this.onCardListChange.bind(this) } />

                    <div className='form-group'>
                        <div className='col-sm-offset-3 col-sm-8'>
                            <button ref='submit' type='submit' className='btn btn-primary' onClick={ this.onSaveClick.bind(this) }>Save { this.props.apiState && this.props.apiState.loading && <span className='spinner button-spinner' /> }</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

DeckEditor.displayName = 'DeckEditor';
DeckEditor.propTypes = {
    apiState: PropTypes.object,
    cards: PropTypes.object,
    currentRestrictedList: PropTypes.object,
    deck: PropTypes.object,
    legends: PropTypes.object,
    navigate: PropTypes.func,
    onDeckSave: PropTypes.func,
    onDeckUpdated: PropTypes.func,
    outfits: PropTypes.object,
    packs: PropTypes.array,
    restrictedList: PropTypes.array,
    setCurrentRestrictedList: PropTypes.func,
    updateDeck: PropTypes.func,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        apiState: state.api.SAVE_DECK,
        cards: state.cards.cards,
        currentRestrictedList: state.cards.currentRestrictedList,
        decks: state.cards.decks,
        legends: state.cards.legends,
        loading: state.api.loading,
        outfits: state.cards.outfits,
        packs: state.cards.packs,
        restrictedList: state.cards.restrictedList,
        user: state.account.user
    };
}

export default connect(mapStateToProps, actions)(DeckEditor);
