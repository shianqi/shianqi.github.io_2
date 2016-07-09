/**
 * Created by killer on 2016/7/3.
 * 程序主入口
 */

var App = React.createClass({
    getInitialState: function () {
        return {
            loadingState:true
        };
    },
    render: function () {
        if(this.state.loadingState){
            return(
                <Main/>
            );
        }else{
            return(
                <Loading/>
            );
        }
    },
    componentDidMount: function () {
        this.props.promise.then(
            value => this.setState({loadingState: true}),
            error => this.setState({loadingState: true})
        );
    }
});

//加载界面
var Loading = React.createClass({
    getInitialState:function(){
        return{
            loadingString:'Loading'
        };
    },
    componentDidMount: function () {
        this.timer = setInterval(function () {
            this.setState({
                loadingString:this.state.loadingString+'.'
            });
            if(this.state.loadingString.length>10){
                this.setState({
                    loadingString:'Loading'
                });
            }
        }.bind(this),300);
    },
    render: function () {
        return(
            <div className="loading">
                <h3>{this.state.loadingString}</h3>
            </div>

        )
    },
    componentWillUnmount: function () {
        clearInterval(this.timer);
    }
});

var Main = React.createClass({
    render: function () {
        return(
            <div className="full">
                <BackGround/>
                <Title/>
            </div>
        )
    }
});

//背景
var BackGround = React.createClass({
    render: function () {
        return(
            <canvas id="canvas">不支持Canvas</canvas>
        )
    },
    componentDidMount: function () {
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        onresize = function () {
            canvas.width = window.innerWidth ;
            canvas.height = window.innerHeight;
        };
        //document.documentElement.style.overflowY = 'hidden';
        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

        var rand = function( min, max ){
            return Math.random() * ( max - min) + min;
        };

        //点
        var Point = function () {
            this.x = 0;
            this.y = 0;
            this.dx = 0;
            this.dy = 0;
            this.r = 0;     //点的半径
            this.init();
        };

        Point.prototype.draw = function () {
            context.beginPath();
            context.fillStyle="#70C1B7";
            if(this.x>canvas.width){
                this.dx=-1*Math.abs(this.dx);
            }
            if(this.y>canvas.height){
                this.dy=-1*Math.abs(this.dy);
            }
            if(this.x<0){
                this.dx=Math.abs(this.dx);
            }
            if(this.y<0){
                this.dy=Math.abs(this.dy);
            }
            this.x+=this.dx;
            this.y+=this.dy;
            context.arc(this.x,this.y,this.r,0,2*Math.PI,false);
            context.fill();
            context.closePath();
        };

        Point.prototype.init = function () {
            this.x = rand(0,canvas.width);
            this.y = rand(0,canvas.height);
            this.dx = rand(-1.4,1.4);
            this.dy = rand(-1.4,1.4);
            this.r = rand(0.8,2.1);
        };

        //线
        var Line = function(point1,point2,dist2,minDist){
            this.x1 = point1.x;
            this.y1 = point1.y;
            this.x2 = point2.x;
            this.y2 = point2.y;
            this.alphe = 0;
            this.lineWidth = 0;
            this.dist = Math.sqrt(dist2);
            this.minDist = minDist;
            this.init();
        };

        Line.prototype.init = function () {
            this.getAlphe();
            this.getLineWeight();
        };

        Line.prototype.draw = function () {
            context.beginPath();
            context.lineWidth = this.lineWidth;
            context.strokeStyle='rgba(112,194,184,'+this.alphe+')';
            context.moveTo(this.x1,this.y1);
            context.lineTo(this.x2,this.y2);
            context.stroke();
            context.closePath();
        };

        Line.prototype.getLineWeight = function () {
            this.lineWidth = 1-this.dist/this.minDist;
        };

        Line.prototype.getAlphe = function () {
            this.alphe = 1-this.dist/this.minDist;
        };

        //整体画布
        var Net = function () {
            this.points = [];
            this.lines = [];
            this.pointSize = 100;
            this.minDist = 150;
        };

        Net.prototype.update = function () {
            for(var i=0;i<this.pointSize;i++){
                this.points[i].draw();
            }
            for(var i=0;i<this.lines.length;i++){
                this.lines[i].draw();
            }
        };

        Net.prototype.getDist = function (point1, point2) {
            var dx = point1.x - point2.x;
            var dy = point1.y - point2.y;
            return dx*dx+dy*dy;
        };

        Net.prototype.loadingLine = function () {
            this.lines = [];
            for(var i=0;i<this.pointSize;i++){
                for(var j = 0;j<this.pointSize;j++){
                    var dist2 = this.getDist(this.points[i],this.points[j]);
                    if(dist2<this.minDist*this.minDist){
                        this.lines.push(new Line(this.points[i],this.points[j],dist2,this.minDist))
                    }
                }
            }
        };

        Net.prototype.drawPage = function () {
            context.beginPath();
            context.fillStyle="#10181B";
            context.fillRect(0,0,canvas.width,canvas.height);
            context.fill();
            context.closePath();
            this.loadingLine();
            this.update();
            /**
             unction webkitRequestAnimationFrame(callback)
             {
                 // stuff...
                 callback();
                 // other stuff...
             }
             */
            requestAnimationFrame( this.drawPage.bind(this));
        };

        Net.prototype.start = function () {
            for(var i=0;i<this.pointSize;i++){
                this.points.push(new Point());
            }
            this.drawPage();
        };

        var myNet = new Net();
        myNet.start();
    }
});


var Title = React.createClass({
    getInitialState: function () {
        return {
            value:0
        };
    },
    componentDidMount: function () {
        this.setState({
            value:1
        });
        if(navigator.userAgent.indexOf("Firefox")>0){
            if(document.addEventListener){
                document.addEventListener('DOMMouseScroll',this.scrollFunc,false);
            }
        }else{
            document.onmousewheel = this.scrollFunc;
        }
    },

    scrollFunc: function (e) {
        var isFinish = true;
        if(isFinish){
            e = e || window.event;
            if((e.wheelDelta<0|| e.detail>0)){
                var $this = $(this),
                    timeoutId = $this.data('timeoutId');
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                $this.data('timeoutId', setTimeout(function() {
                    this.setCheckedState(1);
                    $this.removeData('timeoutId');
                    $this = null
                }.bind(this), 100));
                return false;
            }else if((e.wheelDelta>0 || e.detail<0)){
                var $this = $(this),
                    timeoutId = $this.data('timeoutId');
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                $this.data('timeoutId', setTimeout(function() {
                    this.setCheckedState(-1);
                    $this.removeData('timeoutId');
                    $this = null
                }.bind(this), 100));
                return false;
            }
        }
    },

    setCheckedState: function (flag) {
        var maxNumber = 3;
        var nowNumber = this.state.value;
        if(flag==1){
            if(nowNumber<maxNumber){
                nowNumber++;
                this.setState({
                    value:nowNumber
                });
            }
        }else{
            if(nowNumber>1){
                this.setState({
                    value:(nowNumber-1)
                });
            }
        }
    },

    onclick1: function () {
        this.setState({
            value:1
        });
    },
    onclick2: function () {
        this.setState({
            value:2
        });
    },
    onclick3: function () {
        this.setState({
            value:3
        });
    },
    getCheckedState: function (number) {
        if(number==this.state.value){
            return true;
        }
        else{
            return false;
        }
    },
    render: function () {
        return(
            <div className="full" id="title">
                <input data-number="3" id="inputAbout" type="checkbox" name="title" defaultChecked={this.getCheckedState(3)}/>
                <label className="titleLabel" onClick={this.onclick3}><span>ABOUT</span></label>
                <input data-number="2" id="inputMessage" type="checkbox" name="title" defaultChecked={this.getCheckedState(2)}/>
                <label className="titleLabel" onClick={this.onclick2}><span>MESSAGE</span></label>
                <input data-number="1" id="inputHome" type="checkbox" name="title" defaultChecked={this.getCheckedState(1)}/>
                <label className="titleLabel" onClick={this.onclick1}><span>HOME</span></label>
                <Tabs/>
            </div>
        )
    }
});

var Tabs = React.createClass({
    render: function () {
        return(
            <div className="pageMain" id="pageMain">
                <div className="page">
                    页面一
                    <h1>sdfafasdfasdfasdfasdfasdfs</h1>
                </div>
                <div className="page">
                    <MessageBox/>
                </div>
                <div className="page">
                    CONTACT ME
                </div>
            </div>
        )
    }
});

var MessageBox = React.createClass({
    render: function(){
        return (
            <div className="messageBox">
                <div className="messageBoxLeft">
                    <div className="messageBoxMain">
                        <button className="message">SUBMIT</button>
                        <button className="message">NICE</button>
                        <button className="message">SUBMIT</button>
                        <button className="message">SUBMIT</button>
                        <button className="message">SUBMIT</button>
                        <button className="message">不错，很好看</button>
                        <button className="message">SUBMIT</button>
                        <button className="message">SUBMIT</button>
                        <button className="message">SUBMIT</button>
                        <button className="message">SUBMIT</button>
                        <button className="message">SUBMIT</button>
                        <button className="message">SUBMIT</button>
                        <button className="message">SUBMIT</button>
                        <button className="message">SUBMIT</button>
                        <button className="message">SUBMIT</button>
                    </div>
                </div>
                <div className="messageBoxRight">
                    <div className="messageBoxRightTitle">

                    </div>
                    <div className="messageBoxRightInput">
                        <div className="messageBoxRightInputInput">
                            <input type="text" placeholder="Your Nickname"/>
                        </div>
                        <div className="messageBoxRightInputTextarea">
                            <textarea placeholder="In a message here..."/>
                        </div>
                    </div>
                    <div className="messageBoxRightSubmit">
                        <div className="messageBoxRightColorPicker">
                            <input type="radio" id="check-black" className="black" data-set="radio-color-set" name="colorPicker" defaultChecked/>
                            <label id="label1" className="messageBoxRightColorPickerLabel" htmlFor="check-black"><span></span></label>

                            <input type="radio" id="check-blue" className="blue" data-set="radio-color-set" name="colorPicker"/>
                            <label id="label2" className="messageBoxRightColorPickerLabel" htmlFor="check-blue" ><span></span></label>

                            <input type="radio" id="check-orange" className="orange" data-set="radio-color-set" name="colorPicker"/>
                            <label id="label3" className="messageBoxRightColorPickerLabel" htmlFor="check-orange"><span></span></label>

                            <input type="radio" id="check-pink" className="pink" data-set="radio-color-set" name="colorPicker"/>
                            <label id="label4" className="messageBoxRightColorPickerLabel" htmlFor="check-pink"><span></span></label>

                            <input type="radio" id="check-red" className="red" data-set="radio-color-set" name="colorPicker"/>
                            <label id="label5" className="messageBoxRightColorPickerLabel" htmlFor="check-red"><span></span></label>

                            <input type="radio" id="check-yellow" className="yellow" data-set="radio-color-set" name="colorPicker"/>
                            <label id="label6" className="messageBoxRightColorPickerLabel" htmlFor="check-yellow"><span></span></label>

                            <button className="messageBoxRightSubmitButton">SUBMIT</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

ReactDOM.render(
    <App promise={$.getJSON('https://api.github.com/search/repositories?q=javascript&sort=stars22')}/>,
    document.getElementById('app')
);