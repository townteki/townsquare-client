import React from 'react';
import PropTypes from 'prop-types';

import Typeahead from '../Form/Typeahead';

class TypeaheadLookup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedValues: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleDoneClick = this.handleDoneClick.bind(this);
    }

    handleChange(values) {
        this.setState({ selectedValues: values });
    }

    handleDoneClick() {
        if(this.props.onValuesSelected) {
            this.props.onValuesSelected(this.state.selectedValues);
        }
    }

    render() {
        return (
            <div className='keyword-lookup'>
                <Typeahead 
                    id={ this.props.id }
                    clearButton
                    labelKey={ 'label' } 
                    options={ this.props.values } 
                    defaultSelected={ this.props.defaultSelected } 
                    multiple
                    onChange={ this.handleChange } 
                    autoFocus={ this.props.autoFocus }
                />
                <button type='button' onClick={ this.handleDoneClick } className='btn btn-primary'>{ this.props.buttonTitle || 'Done' }</button>
            </div>);
    }
}

TypeaheadLookup.displayName = 'TypeaheadLookup';
TypeaheadLookup.propTypes = {
    autoFocus: PropTypes.bool,
    buttonTitle: PropTypes.string,
    defaultSelected: PropTypes.array,
    id: PropTypes.string,
    onValuesSelected: PropTypes.func,
    values: PropTypes.array
};

export default TypeaheadLookup;
