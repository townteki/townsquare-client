import React from 'react';
import { render } from 'react-dom';
import Application from './Application';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import { navigate } from './actions';
import 'bootstrap/dist/js/bootstrap';
import ReduxToastr from 'react-redux-toastr';
import { DragDropContext } from 'react-dnd';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import ErrorBoundary from './Components/Site/ErrorBoundary';

const store = configureStore();

store.dispatch(navigate(window.location.pathname, window.location.search));

window.onpopstate = function(e) {
    store.dispatch(navigate(e.target.location.pathname));
};

const DnDContainer = DragDropContext(TouchBackend({ enableMouseEvents: true }))(Application);

render(
    <Provider store={ store }>
        <div className='body'>
            <ReduxToastr
                timeOut={ 4000 }
                newestOnTop
                preventDuplicates
                position='top-right'
                transitionIn='fadeIn'
                transitionOut='fadeOut' />
            <ErrorBoundary message={ 'We\'re sorry, a critical error has occured in the client and we\'re unable to show you anything.  Please try refreshing your browser after filling out a report.' }>
                <DnDContainer />
            </ErrorBoundary>
        </div>
    </Provider>, document.getElementById('component'));
