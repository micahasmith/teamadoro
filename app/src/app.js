var APP = {};
APP.POMODORO_TIME = 3;
//APP.POMODORO_TIME = 1500;

// current timer/countdown
APP.timerBus = new Bacon.Bus();

// "domain events" like a new pomodoro being added
APP.eventBus = new Bacon.Bus();

// function to kick off a count down stream
APP.startTimer = function () {

    // this is like a "data stream factory"
    // the variable push is a function we can push values into the stream with
    var countdownStream = Bacon.fromBinder(function (push) {
        var current = APP.POMODORO_TIME;
        var int = setInterval(function () {
            var mm='24',
                ss='00';

            current--;
            if (current >= 0){
                mm=Math.floor(current/60);
                ss=current % 60;
                if(ss<10)
                    ss="0"+ss;
                return push(mm+":"+ss);
            }
            else{
                return push(new Bacon.End());
            }
        }, 1000);
        return function () {
            clearInterval(int);
        };
    });

    // have the timerbus publish the countdownStream events
    APP.timerBus.plug(countdownStream);
};

// subscribe to event bus to create audio functionality
APP.eventBus.onValue(function(val){
    if(val.type=="pomodoro-add"){
        (new Audio("sounds/small-bell.mp3")).play();
    };
});

// subscribe to timer bus to create new poms when we get through a pomodoro
APP.timerBus.onValue(function (val) {
    if(val==="0:00"){
        APP.eventBus.push({
            type:'pomodoro-add',
            val:{dateTime:new Date()}
        })
    }
});

// subscribe to event bus to create notifications
if(chrome && chrome.notifications){
    APP.eventBus.onValue(function(val){
        chrome.notifications.create((new Date()).toISOString(),{
            type: "basic",
            title: "Done!",
            message: "You completed a pomodoro!",
            iconUrl: "/imgs/td64.png"

        },function(){});
    });
}

