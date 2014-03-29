/** @jsx React.DOM */
var StartButton = React.createClass({
    handleClick: function () {
        APP.startTimer();
    },
    render: function () {
        return <button onClick={this.handleClick}>start</button>;
    }
});


var TimerComponent = React.createClass({
    getInitialState: function () {
        return {
            timeLeft: 0,
            isRunning: false
        };
    },
    componentWillMount: function () {
        var self = this;

        // what to do on each time tick
        APP.timerBus.onValue(function (val) {
            self.setState({time: val, isRunning: true});
            if(val==="0:00"){
                self.setState({isRunning: false});
            }
        });
    },
    render: function () {
        var className = 'time-left'
        if (this.state.isRunning)
            return <p className={className}>{this.state.time}</p>;
        return <StartButton />;
    }
});

var Pomodoro = React.createClass({
    render:function(){
        var className = 'block purple';
        var d = this.props.dateTime;
        var dateString = d.getMonth() +"/"+ d.getDate() +" @ "+d.getHours()%12+":"+d.getMinutes()+(d.getHours()/12>1?"PM":"AM");
        return (
            <section className={className}>
                <section className={'pomodoro'}>{dateString}</section>
            </section>
            );
    }
});

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var PomodoroList = React.createClass({
    getInitialState: function(){
        return {
            pomodoros:[]
        };
    },
    componentWillMount:function(){
        var self = this;

        // subscribe to "domain-level" events
        APP.eventBus.onValue(function(val){
            if(!val.type) return;

            // when a pomodoro gets added do what?
            if(val.type==="pomodoro-add"){
                var poms = self.state.pomodoros;
                poms.push(val.val);
                self.setState({pomodoros:poms});
            }
        });
    },
    render:function(){
        var className = 'block purple';
        var poms = this.state.pomodoros;
        if(poms.length){
            var items = poms.map(function(item){
                    return ( <Pomodoro key={item.dateTime} dateTime={item.dateTime} /> );
                }.bind(this));
            return (
                <ReactCSSTransitionGroup transitionName="pomtrans">
                    {items}
                </ReactCSSTransitionGroup>
            );
        }
        return <div />
    }
});

React.renderComponent(
    <TimerComponent />,
    document.getElementById("timer")
);

React.renderComponent(
    <PomodoroList />,
    document.getElementById('pomodorolist')
);