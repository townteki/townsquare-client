import React from 'react';

import Link from '../Components/Site/Link';
import Panel from '../Components/Site/Panel';

class HowToPlay extends React.Component {
    render() {
        return (
            <div className='col-xs-12'>
                <Panel title='How To Play on Doomtown Online'>
                    <h3 className='htp-intro'>Introduction</h3>
                    <a className='btn btn-danger btn-lg pull-right' target='_blank' href='https://gitreports.com/issue/townteki/townsquare'>Report Problems</a>
                    <p>This guide is aimed at players familiar with Doomtown who want to start playing online using the Doomtown Online platform. If you are new to this cardgame in general, there is a <a href='https://youtu.be/vlbXgbtuFw0' target='_blank'>helpful tutorial video</a>, <a href='http://pineboxentertainment.com/wp-content/uploads/2017/09/doomtown_introductory_rules.pdf' target='_blank'>Quickstart Rules</a>, and a <a href='http://pineboxentertainment.com/wp-content/uploads/2020/11/doomtown_rules_compendium_v1.9.2.pdf' target='_blank'>Rules Compendium</a> to help you out.</p>
                    <div className='htp-topic'>
                        <h3 className='htp-title'>Topics</h3>
                        <ul className='htp-main-list'>
                            <li><a href='#decks'>Adding Decks</a></li>
                            <li><a href='#profile'>Profile Options</a></li>
                            <li><a href='#bugs'>Bugs and Automation</a></li>
                            <li><a href='#interactions'>Specific Card Interactions</a></li>
                            <ul className='htp-sub-list'>
                                <li><a href='#margesandjohnny'>Old Marge's Manor and Johnny Brocklehurst</a></li>
                            </ul>
                            <li><a href='#commands'>Manual Commands</a></li>
                            <li><a href='#conceding'>About Stats, Conceding and Leaving Games</a></li>
                        </ul>
                    </div>
                    <div className='htp-topic'>
                        <h3 className='htp-title' id='decks'>Adding Decks</h3>
                        <p>Start by making sure you have created an account and are logged in. You must be logged in to add decks and spectate or play games. Doomtown Online has a functional <Link href='/decks'>Deckbuilder</Link>, although most people use the more fully featured <a target='_blank' href='http://dtdb.co'>DoomtownDB</a> deckbuilder to build their decks. After building your deck on DoomtownDB download it as a TXT file, then copy and paste it into the deckbuilder here. You are now ready to start playing. Head over to the <Link href='/play'>Play</Link> section to create, join or watch games.</p>
                        <p>If you are new to Doomtown, you can find an introductory Law Dogs deck <a target='_blank' href='https://dtdb.co/en/decklist/3183/pbe-learn-to-play-law-dogs'>here</a>, and an introductory Sloane Gang deck <a target='_blank' href='https://dtdb.co/en/decklist/3184/pbe-learn-to-play-sloane-gang'>here</a>. Both decks only feature cards from the Core Set. If you are new and using any of these decks to play be sure to check the ‘Beginner’ category when creating your game, so you don’t necessarily get destroyed by an up to date power deck. If that happens anyway, just keep practicing and you’ll get the hang of it soon enough.</p>
                    </div>
                    <div className='htp-topic'>
                        <h3 className='htp-title' id='profile'>Profile Options</h3>
                        <p>Clicking your <Link href='/profile'>Profile</Link> at the top right of the page allows you to tailor certain aspects of gameplay to your wishes.</p>
                    </div>
                    <div className='htp-topic'>
                        <h3 className='htp-title' id='bugs'>Bugs and automation</h3>
                        <p>Doomtown Online is still a work in progress. While many cards are implemented and should be working correctly, there are quite a few still to be implemented. We keep a list up to date with unimplemented and partially implemented cards <a target='_blank' href='https://github.com/townteki/townsquare/blob/master/docs/cardpool-status.md'>here</a>. If you happen upon a card that you believe is not working as it should and it is marked complete on that list, it would help immensely if you would submit an issue on <a target='_blank' href='https://gitreports.com/issue/townteki/townsquare'>GitHub</a>. Other comments and/or feedback can be left on GitHub as well.</p>
                    </div>
                    <div className='htp-topic'>
                        <h3 className='htp-title' id='interactions'>Specific Card Interactions</h3>
                        <div className='htp-subtopic'>
                            <h4 className='htp-subtitle' id='margesandjohnny'>Old Marge's Manor and Johnny Brocklehurst</h4>
                            <p><a href='https://dtdb.co/en/card/12012' target='blank'>Old Marge's Manor</a>'s and <a href='https://dtdb.co/en/card/19017' target='blank'>Johnny Brocklehurst</a>'s React ability must be triggered as a normal Noon action instead of a React. When you want to use it, click the card and choose "Use Ability" on the card menu</p>
                        </div>
                    </div>
                    <div className='htp-topic'>
                        <h3 className='htp-title' id='commands'>Manual Commands</h3>
                        <p>Every once in a while something happens during a game that shouldn’t have happened. This can occur due to a misclick, an unimplemented card or a bug in the software. To fix the game state in such situations a variety of manual commands are implemented. Typing these commands as a chatmessage during a game will have the following effect:</p>
                        <div className='htp-subtopic'>
                            <h4 className='htp-subtitle'>Basic Card Stats Manipulation</h4>
                            <ul>
                                <li>/bullets [x | +/-mod] - Sets the bullets of a dude to x or modifies it by mod.</li>
                                <li>/clear-shooter - Clears the shooter type set by the chat command.</li>
                                <li>/clear-suit - Clears the suit effects done by chat commands.</li>
                                <li>/control [x | +/-mod] - Sets the control of a card to x or modifies it by mod.</li>
                                <li>/inf [x | +/-mod] [t] - Sets the influence of a dude to x or modifies it by mod. Optional parameter "t" can be set to 'influence:deed' if you want to set only influence for controlling deeds.</li>
                                <li>/reset-stats [suit | value | bullets | influence | control | upkeep | production] - Resets stat to printed (all if stat is omitted).</li>
                                <li>/shooter [stud | draw] - Sets shooter type of a dude to stud or draw.</li>
                                <li>/suit [hearts | clubs | diams | spades] - Sets the suit of a card.</li>
                                <li>/value [x | +/-mod] - Sets the value of a dude to x or modifies it by mod.</li>
                            </ul>
                        </div>
                        <div className='htp-subtopic'>
                            <h4 className='htp-subtitle'>Other Card Stats Manipulation</h4>
                            <ul>
                                <li>/add-keyword k - adds keyword k to a card.</li>
                                <li>/blank - Blanks a card.</li>
                                <li>/bounty [x | +/-mod] - Sets the bounty of a dude to x or modifies it by mod.</li>
                                <li>/clear-effects - Clears any effects on a card.</li>
                                <li>/kung-fu [x | +/-mod] - Sets kung fu rating of a selected dude to x or modifies it by mod.</li>
                                <li>/remove-keyword k - Removes keyword k from a card.</li>
                                <li>/reset-abilities - Resets/Refreshes ability usage on a card.</li>
                                <li>/skill-rating [blessed | shaman | huckster | mad] [x | +/-mod] - Sets specified skill rating of selected dude to x or modifies it by mod.</li>
                                <li>/token t x - Sets the token count of a card of type 't' to 'x'. Currently used token types are: 'bounty' and 'ghostrock'.<br /><strong>Note:</strong> For stud and draw use /shooter command, for bullets, control and influence use their respective commands.</li>
                                <li>/unblank - Unblanks a card.</li>
                            </ul>
                        </div>
                        <div className='htp-subtopic'>
                            <h4 className='htp-subtitle'>Game Actions</h4>
                            <ul>
                                <li>/ace - aces a card (moves it to boot hill). You can do this also by draging and droping the card to boot hill.</li>
                                <li>/discard-random x - Discards x cards randomly from your hand.</li>
                                <li>/discard-deck x - Discards top x cards from your deck.</li>
                                <li>/draw x - Draws x cards from your deck to your hand.</li>
                                <li>/join-posse - Moves a dude to the respective posse in the current shootout.</li>
                                <li>/join-without-move - Adds a dude to the respective posse in the current shootout without moving.</li>
                                <li>/move - Move dude to another location.</li>
                                <li>/pull - Performs simple pull without success check.</li>
                                <li>/pull [x | kf] - Performs pull using selected dude and does success check using difficulty x, or based on Kung Fu dude if parameter is "kf".</li>
                                <li>/remove-from-posse - Removes a dude from the posse in the current shootout.</li>
                                <li>/use - Announces that selected unscripted card will be used.</li>
                            </ul>
                        </div>
                        <div className='htp-subtopic'>
                            <h4 className='htp-subtitle'>Rest of the Commands</h4>
                            <ul>
                                <li>/add-card [name | code] - Adds a card to the draw deck. This card can be identified by name or code (can be found in dtdb)</li>
                                <li>/attach - attach card to another card.</li>
                                <li>/cancel-shootout - Cancels the current shootout.</li>
                                <li>/cancel-prompt - Clears the current prompt and resume the game flow.  Use with caution and only when the prompt is 'stuck' and you are unable to continue.</li>
                                <li>/done - Changes active player to next player.</li>
                                <li>/give-control - Gives control of a card to your opponent.  Use with caution.</li>
                                <li>/hand-rank x - Modifies hand rank of the current player by x.</li>
                                <li>/look-deck x - Looks at top x cards of your deck.</li>
                                <li>/pass - Passes current play.</li>
                                <li>/rematch - Start over a new game with the current opponent.</li>
                                <li>/remove-from-game - Removes a card from the game.</li>
                                <li>/reveal-hand - Reveals your hand to the opponent.</li>
                                <li>/reveal-deck x - Reveals top x cards from your deck.</li>
                                <li>/shuffle-discard - Shuffles discard pile to draw deck.</li>
                            </ul>
                        </div>
                    </div>
                    <div className='htp-topic'>
                        <h3 className='htp-title' id='conceding'>About Stats, Conceding, and Leaving Games</h3>
                        <p>Doomtown Online does not rank and/or match players by skill level in any way. There are three categories (beginner, casual and competitive) to be chosen when creating a game which gives an indication of what to expect, but it doesn't enforce anything. Even though personal stats are not being tracked, most players still very much appreciate a formal concede by clicking the ‘Concede’ button and typing ‘gg’ before leaving a game. The reality of quick and anonymous online games dictates this won’t always happen though, as evidenced by regular complaining in the main lobby about people leaving without conceding. Our advice is to just move on to the next game since in the end, conceding or not doesn’t really impact anything. Happy gaming!</p>
                    </div>
                </Panel>
            </div>
        );
    }
}

HowToPlay.displayName = 'How To Play';
HowToPlay.propTypes = {
};

export default HowToPlay;
