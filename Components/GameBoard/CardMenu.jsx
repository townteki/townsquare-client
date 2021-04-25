import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

class CardMenu extends React.Component {
    onMenuItemClick(menuItem) {
        if(this.props.onMenuItemClick) {
            this.props.onMenuItemClick(menuItem);
        }
    }

    render() {
        var menuIndex = 0;
        var menuItems = this.props.menu.map(menuItem => {
            let className = classNames('menu-item', {
                'disabled': !!menuItem.disabled
            });
            let spanClass = 'card-menu';
            if(menuItem.menuIcon) {
                spanClass += ` glyphicon glyphicon-${menuItem.menuIcon}`;
            }
            return (<div key={ menuIndex++ } className={ className } onClick={ this.onMenuItemClick.bind(this, menuItem) }>
                <span className={ spanClass }/>
                { ' ' + menuItem.text }
            </div>);
        });

        return (
            <div className='panel menu'>
                { menuItems }
            </div>
        );
    }
}

CardMenu.displayName = 'CardMenu';
CardMenu.propTypes = {
    menu: PropTypes.array.isRequired,
    onMenuItemClick: PropTypes.func
};

export default CardMenu;
