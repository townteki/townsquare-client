import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Checkbox extends React.Component {
    render() {
        let labelClassName = classNames(this.props.labelClass, this.props.disabled ? 'disabled' : '');
        var checkBox = (<div className={ 'checkbox ' + this.props.fieldClass }>
            <label htmlFor={ this.props.name } className={ labelClassName } >
                <input type='checkbox'
                    ref={ this.props.name }
                    id={ this.props.name }
                    disabled={ this.props.disabled }
                    checked={ this.props.checked }
                    onChange={ this.props.onChange } />
                { this.props.label }
            </label>
            { this.props.children }
        </div>);

        if(this.props.noGroup) {
            return checkBox;
        }

        return (
            <div className='form-group'>
                { checkBox }
            </div>
        );
    }
}

Checkbox.displayName = 'Checkbox';
Checkbox.propTypes = {
    checked: PropTypes.bool,
    children: PropTypes.object,
    disabled: PropTypes.bool,
    fieldClass: PropTypes.string,
    label: PropTypes.string,
    labelClass: PropTypes.string,
    name: PropTypes.string,
    noGroup: PropTypes.bool,
    onChange: PropTypes.func
};

export default Checkbox;
