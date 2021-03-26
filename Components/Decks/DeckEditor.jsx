import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { validateDeck } from 'townsquare-deck-helper';

import Input from '../Form/Input';
import Select from '../Form/Select';
import Typeahead from '../Form/Typeahead';
import TextArea from '../Form/TextArea';
import ApiStatus from '../Site/ApiStatus';
import * as actions from '../../actions';

class DeckEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cardList: '',
            deckName: 'New Deck',
            drawCards: [],
            legends: [],
            outfit: props.outfits && props.outfits['lawdogs'],
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
        if(props.outfits && !this.state.outfit) {
            this.setState({ outfit: props.outfits['lawdogs'] }, this.triggerDeckUpdated);
        }
    }

    getDeckFromState() {
        let deck = {
            _id: this.state._id,
            name: this.state.deckName,
            outfit: this.state.outfit,
            legend: this.state.legend,
            drawCards: this.state.drawCards
        };

        //if(!this.props.restrictedList) {
        deck.status = {status: 'Valid', drawCount: 52, isValid: true};
        //} else {
        //    deck.status = validateDeck(deck, { packs: this.props.packs });
        //}

        return deck;
    }

    triggerDeckUpdated() {
        const deck = this.getDeckFromState();

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

        return card.count + ' ' + card.card.title;
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

        /*
        let headerMark = split.findIndex(line => line.match(/^Packs:/));
        if(headerMark >= 0) {
            // ThronesDB-style deck header found
            // extract deck title, faction, agenda, and banners
            let header = split.slice(0, headerMark).filter(line => line !== '');
            split = split.slice(headerMark);

            if(header.length >= 2) {
                deckName = header[0];

                let newFaction = Object.values(this.props.factions).find(faction => faction.name === header[1].trim());
                if(newFaction) {
                    faction = newFaction;
                }

                header = header.slice(2);
                if(header.length >= 1) {
                    let rawAgenda, rawBanners;

                    if(header.some(line => {
                        return line.trim() === 'Alliance';
                    })) {
                        rawAgenda = 'Alliance';
                        rawBanners = header.filter(line => line.trim() !== 'Alliance');
                    } else {
                        rawAgenda = header[0].trim();
                    }

                    let newAgenda = Object.values(this.props.agendas).find(agenda => agenda.name === rawAgenda);
                    if(newAgenda) {
                        agenda = newAgenda;
                    }

                    if(rawBanners) {
                        let banners = [];
                        for(let rawBanner of rawBanners) {
                            let banner = this.props.banners.find(banner => {
                                return rawBanner.trim() === banner.label;
                            });

                            if(banner) {
                                banners.push(banner);
                            }
                        }

                        bannerCards = banners;
                    }
                }
            }
        }

        plotCards = [];
        drawCards = [];

        for(const line of split) {
            let { card, count } = this.parseCardLine(line);
            if(card) {
                this.addCard(card.type === 'plot' ? plotCards : drawCards, card, count);
            }
        }
        */

        this.setState({
            cardList: event.target.value,
            deckName: deckName,
            outfit: outfit,
            legend: legend,
            drawCards: drawCards
        }, this.triggerDeckUpdated);
    }

    parseCardLine(line) {
        const pattern = /^(\d+)x?\s+([^()]+)(\s+\((.+)\))?$/;

        let match = line.trim().match(pattern);
        if(!match) {
            return { count: 0 };
        }

        let count = parseInt(match[1]);
        let cardName = match[2].trim().toLowerCase();
        //remove [J] and [M] restricted list, and [B] banned list indicators in a card name when the list is copied from thronesdb, trim at the end to remove the space between cardname and []
        cardName = cardName.replace(/\[(b|j|m)\]/g,'').trim();
        let packName = match[4] && match[4].trim().toLowerCase();
        let pack = packName && this.props.packs.find(pack => pack.code.toLowerCase() === packName || pack.name.toLowerCase() === packName);

        if(cardName.startsWith('Custom ')) {
            return { count: count, card: this.createCustomCard(cardName) };
        }

        let cards = Object.values(this.props.cards);

        let matchingCards = cards.filter(card => {
            if(this.props.agendas[card.code]) {
                return false;
            }

            if(pack) {
                return pack.code === card.packCode && card.name.toLowerCase() === cardName;
            }

            return card.name.toLowerCase() === cardName;
        });

        matchingCards.sort((a, b) => this.compareCardByAvailableDate(a, b));

        return { count: count, card: matchingCards[0] };
    }

    createCustomCard(cardName) {
        let match = /Custom (.*) - (.*)/.exec(cardName);
        if(!match) {
            return null;
        }

        let type = match[1].toLowerCase();
        let name = match[2];

        return {
            code: 'custom_' + type,
            cost: 0,
            custom: true,
            faction: 'neutral',
            icons: {
                military: true,
                intrigue: true,
                power: true
            },
            label: name + ' (Custom)',
            loyal: false,
            name: name,
            packCode: 'Custom',
            plotStats: {
                claim: 0,
                income: 0,
                initiative: 0,
                reserve: 0
            },
            strength: 0,
            text: 'Custom',
            traits: [],
            type: type,
            unique: name.includes('*')
        };
    }

    compareCardByAvailableDate(a, b) {
        let packA = this.props.packs.find(pack => pack.code === a.pack_code);
        let packB = this.props.packs.find(pack => pack.code === b.pack_code);

        if(!packA.available && packB.available) {
            return 1;
        }

        if(!packB.available && packA.available) {
            return -1;
        }

        return new Date(packA.available) < new Date(packB.available) ? -1 : 1;
    }

    addCard(list, card, number) {
        if(list[card.code]) {
            list[card.code].count += number;
        } else {
            list.push({ count: number, card: card });
        }
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

                <h4>Either type the cards manually into the box below, add the cards one by one using the card box and autocomplete or for best results, copy and paste a decklist from <a href='http://dtdb.co' target='_blank'>DTDB</a> into the box below.</h4>

                <form className='form form-horizontal'>
                    <Input name='deckName' label='Deck Name' labelClass='col-sm-3' fieldClass='col-sm-9' placeholder='Deck Name'
                        type='text' onChange={ this.onChange.bind(this, 'deckName') } value={ this.state.deckName } />
                    <Select name='outfit' label='Outfit' labelClass='col-sm-3' fieldClass='col-sm-9' options={ Object.values(this.props.outfits) }
                        onChange={ this.onOutfitChange.bind(this) } value={ this.state.outfit ? this.state.outfit.title : undefined }
                        valueKey='code' nameKey='title' blankOption={ { label: '- Select -', code: '' } } />
                    <Select name='legend' label='Legend' labelClass='col-sm-3' fieldClass='col-sm-9' options={ Object.values(this.props.legends) }
                        onChange={ this.onLegendChange.bind(this) } value={ this.state.legend ? this.state.legend.title : undefined }
                        valueKey='code' nameKey='title' blankOption={ { label: '- Select -', code: '' } } />

                    <Typeahead label='Card' labelClass={ 'col-sm-3 col-xs-2' } fieldClass='col-sm-4 col-xs-5' labelKey={ 'label' } options={ Object.values(this.props.cards) }
                        onChange={ this.addCardChange.bind(this) }>
                        <Input name='numcards' type='text' label='Num' labelClass='col-xs-1 no-x-padding' fieldClass='col-xs-2'
                            value={ this.state.numberToAdd.toString() } onChange={ this.onNumberToAddChange.bind(this) } noGroup>
                            <div className='col-xs-1 no-x-padding'>
                                <div className='btn-group'>
                                    <button className='btn btn-default' onClick={ this.onAddCard.bind(this) }>Add</button>
                                </div>
                            </div>
                        </Input>
                    </Typeahead>
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
    deck: PropTypes.object,
    legends: PropTypes.object,
    navigate: PropTypes.func,
    onDeckSave: PropTypes.func,
    onDeckUpdated: PropTypes.func,
    outfits: PropTypes.object,
    packs: PropTypes.array,
    updateDeck: PropTypes.func
};

function mapStateToProps(state) {
    return {
        apiState: state.api.SAVE_DECK,
        cards: state.cards.cards,
        decks: state.cards.decks,
        legends: state.cards.legends,
        loading: state.api.loading,
        outfits: state.cards.outfits,
        packs: state.cards.packs
    };
}

export default connect(mapStateToProps, actions)(DeckEditor);
