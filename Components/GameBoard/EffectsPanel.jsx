import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Avatar from '../Site/Avatar';

const gameActionTokens = {
    increaseBullets: { className: 'icon-bullet', imageSrc: '/img/icons/bullet_draw.png', changeType: 'positive' },
    decreaseBullets: { className: 'icon-bullet', imageSrc: '/img/icons/bullet_draw.png', changeType: 'negative' },
    increaseInfluence: { className: 'icon-token', imageSrc: '/img/icons/influence.png', changeType: 'positive' },
    decreaseInfluence: { className: 'icon-token', imageSrc: '/img/icons/influence.png', changeType: 'negative' },
    increaseControl: { className: 'icon-token', imageSrc: '/img/icons/control.png', changeType: 'positive' },
    decreaseControl: { className: 'icon-token', imageSrc: '/img/icons/control.png', changeType: 'negative' },
    increaseProduction: { className: 'icon-token', imageSrc: '/img/icons/ghostrock.png', changeType: 'positive' },
    decreaseProduction: { className: 'icon-token', imageSrc: '/img/icons/ghostrock.png', changeType: 'negative' },
    increaseUpkeep: { className: 'icon-token', imageSrc: '/img/icons/ghostrock.png', changeType: 'negative' },
    decreaseUpkeep: { className: 'icon-token', imageSrc: '/img/icons/ghostrock.png', changeType: 'positive' },
    increaseValue: { className: 'icon-token', imageSrc: '/img/icons/ace_value.png', changeType: 'positive' },
    decreaseValue: { className: 'icon-token', imageSrc: '/img/icons/ace_value.png', changeType: 'negative' },
    setAsStud: { className: 'icon-bullet', imageSrc: '/img/icons/bullet_stud.png', changeType: 'positive' },
    setAsDraw: { className: 'icon-bullet', imageSrc: '/img/icons/bullet_draw.png', changeType: 'negative' }    
};

class EffectsPanel extends React.Component {
    getEffects() {
        if(!this.props.effectsObject || !this.props.effectsObject.effects) {
            return null;
        } 
        return this.props.effectsObject.effects
            .filter(effect => effect.fromTrait || effect.duration !== 'persistent')
            .map(effect => {
                const token = gameActionTokens[effect.gameAction];
                let iconTag = <span className='glyphicon glyphicon-flash'/>;
                if(token) {
                    iconTag = <img className={ token.className } src={ token.imageSrc }/>;
                }
                const source = effect.source ? 
                    this.props.updateEffectsObject({ uuid: effect.source, classType: 'card' }) : null;
                return (
                    <div className={ 'effect-item' + (token ? ' ' + token.changeType : '') }>
                        { iconTag }
                        <span className='text-left'>{ effect.title }</span>
                        { source && <span className='effect-source'>{ source.title }</span> }
                    </div>
                );
            });
    }

    render() {
        const panelClass = classNames('panel', 'effects-panel', {
            extended: this.props.show
        });

        return (
            <div className={ panelClass }>
                <div className='text-center' onClick={ this.props.onEffectsClick }>
                    <span className='glyphicon glyphicon-flash'/><span>Effects</span>
                </div>
                { this.props.show && 
                    <div className='effects-title'>
                        { this.props.effectsObject && this.props.effectsObject.classType === 'player' &&
                            <div>
                                <Avatar username={ this.props.effectsObject.name } float />
                                <span className='username'>{ this.props.effectsObject.name }</span>
                            </div>
                        }
                        { this.props.effectsObject && this.props.effectsObject.classType === 'shootout' &&
                                <span>SHOOTOUT</span>
                        }
                    </div>
                }
                { this.props.show && this.props.effectsObject &&
                    <div className='effects-list'>
                        { this.getEffects() }
                    </div> 
                }
            </div>
        );
    }
}

EffectsPanel.displayName = 'EffectsPanel';
EffectsPanel.propTypes = {
    effectsObject: PropTypes.object,
    onEffectsClick: PropTypes.func,
    show: PropTypes.bool,
    updateEffectsObject: PropTypes.func
};

export default EffectsPanel;
