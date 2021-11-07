import React from 'react';

const tokens = {
    card: { className: 'icon-card', imageSrc: '/img/cards/cardback.jpg', title: 'Card' },
    cards: { className: 'icon-card', imageSrc: '/img/cards/cardback.jpg', title: 'Cards' },
    GR: { className: 'icon-token', imageSrc: '/img/icons/ghostrock.png', title: 'Ghost Rock' },
    influence: { className: 'icon-token', imageSrc: '/img/icons/influence.png', title: 'Influence' },
    CP: { className: 'icon-token', imageSrc: '/img/icons/control.png', title: 'Control Point' },
    bullet: { className: 'icon-bullet', imageSrc: '/img/icons/bullet_draw.png', title: 'Bullet' },
    bullets: { className: 'icon-bullet', imageSrc: '/img/icons/bullet_draw.png', title: 'Bullets' },
    Hearts: { className: 'icon-token', imageSrc: '/img/icons/heart.png', title: 'Hearts' },
    Diams: { className: 'icon-token', imageSrc: '/img/icons/diam.png', title: 'Diams' },
    Clubs: { className: 'icon-token', imageSrc: '/img/icons/club.png', title: 'Clubs' },
    Spades: { className: 'icon-token', imageSrc: '/img/icons/spade.png', title: 'Spades' }
};

export function processKeywords(message) {
    let messages = [];
    let i = 0;

    for(let token of message.split(' ')) {
        if(tokens[token]) {
            let tokenEntry = tokens[token];
            messages.push(<img 
                key={ `${token}-${i++}` } 
                className={ tokenEntry.className } 
                src={ tokenEntry.imageSrc } 
                title={ tokenEntry.title }
            />);
            messages.push(' ');
        } else {
            messages.push(token + ' ');
        }
    }

    return messages;
}
