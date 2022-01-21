import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class TimeLimitClock extends React.Component {
    constructor(props) {
        super(props);

        this.onPauseClick = this.onPauseClick.bind(this);

        this.state = {
            timer: undefined,
            timeDisplay: undefined,
            timeLimit: props.timeLimit,
            isTimer: false,
            isPaused: false,
            flash: false
        };
    }

    componentDidMount() {
        this.updateProps(this.props);
    }

    componentWillReceiveProps(props) {
        this.updateProps(props);
    }

    updateProps(props) {
        if(!this.state.timer) {
            if(props.timeLimitStarted && this.state.timeLimit) {
                let timer = setInterval(() => {
                    let diffBetweenStartOfTimerAndNow = moment.duration(moment().diff(this.props.timeLimitStartedAt));
                    if(!this.state.timeLimit || diffBetweenStartOfTimerAndNow.asSeconds() >= this.state.timeLimit) {
                        clearInterval(timer);
                        this.setState({ timer: undefined, isTimer: false, timeLimit: undefined });
                    } else {
                        let timeLimit = this.state.timeLimit;
                        if(this.state.isPaused) {
                            timeLimit += 1;
                        }
                        let endTime = moment(this.props.timeLimitStartedAt).add(timeLimit, 'seconds');
                        let time = moment.utc(endTime.diff(moment()));
                        let timeDisplay = undefined;
                        if(time.hours() > 0) {
                            timeDisplay = time.format('HH:mm:ss');
                        } else {
                            timeDisplay = time.format('mm:ss');
                        }
                        this.setState({ timeDisplay: timeDisplay, timeLimit: timeLimit, flash: !this.state.flash });
                    }
                }, 1000);
    
                this.setState({ timer: timer, isTimer: true });
            } else if(!this.state.timeLimit) {
                let timer = setInterval(() => {
                    let timeDifference = moment().diff(moment(this.props.createdAt));
                    if(timeDifference < 0) {
                        timeDifference = 0;
                    }
                
                    let formattedTime = moment.utc(timeDifference).format('HH:mm:ss');
                    this.setState({ timeDisplay: formattedTime });
                }, 1000);
    
                this.setState({ timer: timer, isTimer: false });
            }
        }
    }

    onPauseClick() {
        this.props.onPauseClick();
        this.setState({ isPaused: !this.state.isPaused });
    }

    render() {
        let className = 'glyphicon';
        return (
            <div className={ 'panel time-clock' + (this.state.isPaused && this.state.flash ? ' paused' : '') }>
                <div>
                    <span className={ className + ' glyphicon-calendar' } />
                    { this.props.currentRound + 1 }
                </div>
                <div>
                    <span className={ className + ' glyphicon-time' + (this.state.isTimer ? ' is-timer' : '') } />
                    { this.state.timeDisplay }
                </div>
                { this.state.isTimer && this.props.displayButton &&
                    <div onClick={ this.onPauseClick }>
                        <button className='btn btn-transparent'>
                            <span className={ 'glyphicon ' + (this.state.isPaused ? 'glyphicon-play' : 'glyphicon-pause') }/>
                        </button>
                    </div>
                }
            </div>);
    }
}

TimeLimitClock.displayName = 'TimeLimitClock';
TimeLimitClock.propTypes = {
    createdAt: PropTypes.instanceOf(Date),
    currentRound: PropTypes.number,
    displayButton: PropTypes.bool,
    onPauseClick: PropTypes.func,
    timeLimit: PropTypes.number,
    timeLimitStarted: PropTypes.bool,
    timeLimitStartedAt: PropTypes.instanceOf(Date)
};

export default TimeLimitClock;
