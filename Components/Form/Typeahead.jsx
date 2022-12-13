import { Typeahead } from 'react-bootstrap-typeahead';
import React from 'react';
import PropTypes from 'prop-types';

class Input extends React.Component {
    clear() {
        this.refs.typeahead.getInstance().clear();
    }

    render() {
        const label = this.props.label ? <label htmlFor={ this.props.name } className={ this.props.labelClass + ' control-label' }>{ this.props.label }</label> : null;
        const control = (
            <div>
                { label }
                <div className={ this.props.fieldClass }>
                    <Typeahead id={ this.props.id } ref='typeahead' options={ this.props.options } labelKey={ this.props.labelKey } emptyLabel={ this.props.emptyLabel }
                        onChange={ this.props.onChange } placeholder={ this.props.placeholder } autoFocus={ this.props.autoFocus } dropup={ this.props.dropup }
                        minLength={ this.props.minLength } onInputChange={ this.props.onInputChange } renderMenuItemChildren={ this.props.renderMenuItemChildren }
                        submitFormOnEnter={ this.props.submitFormOnEnter } onKeyDown={ this.props.onKeyDown } disabled={ this.props.disabled } defaultSelected={ this.props.defaultSelected }
                        clearButton={ this.props.clearButton } multiple={ this.props.multiple } />
                    { this.props.validationMessage ? <span className='help-block'>{ this.props.validationMessage } </span> : null }
                </div>
                { this.props.children }
            </div>
        );

        if(this.props.noGroup) {
            return control;
        }

        return (
            <div className='form-group'>
                { control }
            </div>);
    }
}

Input.displayName = 'TypeAhead';
Input.propTypes = {
    autoFocus: PropTypes.bool,
    children: PropTypes.object,
    clearButton: PropTypes.bool,
    defaultSelected: PropTypes.array,
    disabled: PropTypes.bool,
    dropup: PropTypes.bool,
    emptyLabel: PropTypes.string,
    fieldClass: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    labelClass: PropTypes.string,
    labelKey: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
    ]),
    minLength: PropTypes.number,
    multiple: PropTypes.bool,
    name: PropTypes.string,
    noGroup: PropTypes.bool,
    onChange: PropTypes.func,
    onInputChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    options: PropTypes.array,
    placeholder: PropTypes.string,
    renderMenuItemChildren: PropTypes.func,
    submitFormOnEnter: PropTypes.bool,
    validationMessage: PropTypes.string,
    value: PropTypes.string
};

export default Input;
