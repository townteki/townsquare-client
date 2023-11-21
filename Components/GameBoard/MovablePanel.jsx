import React from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import $ from 'jquery';

import { ItemTypes } from '../../constants';
import PopupDefaults from './PopupDefaults';
import classNames from 'classnames';

function getPopupStyle(popup, offsetX, offsetY) {
    let style = {
        position: 'fixed',
        left: Math.max(offsetX, 0),
        top: Math.max(offsetY, 50)
    };

    if(!popup) {
        return style;
    }

    if(style.left + popup.width() > window.innerWidth) {
        style.left = window.innerWidth - popup.width();
    }

    if(style.top + popup.height() > window.innerHeight) {
        style.top = window.innerHeight - popup.height();
    }    
    return style;
}

const panelSource = {
    beginDrag(props) {
        return {
            name: `${props.name}-${props.side}`
        };
    },
    endDrag(props, monitor, component) {
        const offset = monitor.getSourceClientOffset();
        const style = getPopupStyle($(component.refs.popup), offset.x, offset.y);
        localStorage.setItem(`${props.name}-${props.side}`, JSON.stringify(style));
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

class MovablePanel extends React.Component {
    constructor(props) {
        super(props);

        const key = `${props.name}-${props.side}`;
        const savedStyle = localStorage.getItem(key);
        const style = (savedStyle && JSON.parse(savedStyle)) || PopupDefaults[key];

        this.state = {
            position: Object.assign({}, style)
        };
    }

    componentWillReceiveProps(props) {
        if(props.isDragging) {
            const popup = $(this.refs.popup);          
            let style = getPopupStyle(popup, props.dragOffset.x, props.dragOffset.y);
            this.setState({
                position: style
            });
        }
    }

    render() {
        let style = this.state.position;
        let panelClass = classNames('panel-title', {
            'other-side': this.props.side === 'top'
        });

        let content = (<div ref='popup' className='popup' style={ style }>
            {
                this.props.connectDragSource(
                    <div className={ panelClass } onClick={ event => event.stopPropagation() }>
                        <span className='text-center'>{ this.props.title }</span>
                        <span className='pull-right'>
                            <a className='close-button glyphicon glyphicon-remove' onClick={ this.props.onCloseClick } />
                        </span>
                    </div>)
            }
            { this.props.children }
        </div >);

        return content;
    }
}

MovablePanel.displayName = 'MovablePanel';
MovablePanel.propTypes = {
    children: PropTypes.node,
    connectDragPreview: PropTypes.func,
    connectDragSource: PropTypes.func,
    dragOffset: PropTypes.object,
    isDragging: PropTypes.bool,
    name: PropTypes.string.isRequired,
    onCloseClick: PropTypes.func,
    side: PropTypes.oneOf(['top', 'bottom']),
    title: PropTypes.string
};

export default DragSource(ItemTypes.PANEL, panelSource, collect)(MovablePanel);
