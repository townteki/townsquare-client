import React from 'react';
import PropTypes from 'prop-types';
import 'jquery-nearest';

class HandRank extends React.Component {
    constructor() {
        super();

        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
    }

    onMouseOut() {
        //this.props.clearZoom();
    }

    onMouseOver() {
        //this.props.zoomCard(card);
    }

    render() {

        let rank = this.props.handRank.rank;
        let rankShortName = this.props.handRank.rankShortName;

        return (
            <div className='hand-ranks' style={this.props.style} >
                <div className='rank'>{(rank > 0) ? rank : ''}{(rankShortName) ? ' - ' + rankShortName : ''}</div>
            </div>
        );

    }
}

HandRank.displayName = 'HandRank';
HandRank.propTypes = {
    //Leaving unimplemented properties for extension thoughts
    className: PropTypes.string,
    handRank: PropTypes.object,
    onClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    sendGameMessage: PropTypes.func,
    style: PropTypes.object
};

export default HandRank;
