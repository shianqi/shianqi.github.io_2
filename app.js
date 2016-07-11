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
                <Tabs promise={this.state.value}/>
            </div>
        )
    }
});

var Tabs = React.createClass({
    render: function () {
        return(
            <div className="pageMain" id="pageMain">
                <div className="page">
                    <PageOne promise={this.props.promise}/>
                </div>
                <div className="page">
                    <MessageBox/>
                </div>
                <div className="page">
                    <PageThree/>
                </div>
            </div>
        )
    }
});

var PageOne = React.createClass({
    componentDidMount:function () {
        var scene = document.getElementById('scene');
        var parallax = new Parallax(scene);
    },
    homeTitleStyle: function () {
        if(this.props.promise==1){
            return{
                left:'0'
            }
        }else{
            return{
                left:'-150%'
            }
        }
    },
    homeTitleChineseStyle: function () {
        if(this.props.promise==1){
            return{
                left:'20px'
            }
        }else{
            return{
                left:'-150%'
            }
        }
    },
    homeBodyStyle: function () {
        if(this.props.promise==1){
            return{
                right:'0'
            }
        }else{
            return{
                right:'-150%'
            }
        }
    },
    render: function(){
        return(
            <div className="homeBox">
                <ul id="scene" className="scene">
                    <li className="layer" data-depth="0.20"><p className="homeTitle" style={this.homeTitleStyle()}>Archie Shi</p></li>
                    <li className="layer" data-depth="0.30">
                        <p className="homeTitleChinese" style={this.homeTitleChineseStyle()}>史安琪 / 1995.08 · 全栈ing</p>
                    </li>
                    <li className="layer layer1" data-depth="0.35">
                        <p className="homeBody" style={this.homeBodyStyle()}>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; " The sun rises higher and higher,
                            <br/>
                            it is on the roof of the light is dark. "
                        </p>
                    </li>
                </ul>
            </div>
        )
    }
});

var PageThree = React.createClass({
    render: function(){
        return(
            <div>

            </div>
        )
    }
});

var MessageBox = React.createClass({
    getInitialState: function() {
        return {
            author: '',
            text: '',
            color: 1,
            data: [
                {
                    text:'hello',
                    color: 2
                },{
                    text:'nice',
                    color: 3
                }
            ]
        };
    },
    componentDidMount: function(){
        this.getNewMessage();
    },
    getNewMessage: function(){
        $.ajax({
            url: 'http://localhost:3000/getMessage',
            type: 'POST',
            data: this.state,
            success: function(data) {
                this.setState({
                    data:data
                });
            }.bind(this),
            dataType: 'json'
        });
    },
    handleAuthorChange: function(e) {
        this.setState({
            author: e.target.value
        });
    },
    handleTextChange: function(e) {
        this.setState({
            text: e.target.value
        });
    },
    handleButtonClick: function () {
        if (!this.state.text || !this.state.author) {
            return;
        }

        $.ajax({
            url: 'http://localhost:3000/addMessage',
            type: 'POST',
            data: this.state,
            error: function(){

            },
            success: function() {
                this.getNewMessage();
                this.setState({
                    text:'',
                    author: ''
                });
            }.bind(this),
            dataType: 'json'
        });
    },

    handleColorChange1: function() {
        this.setState({
            color: 1
        });
    },
    handleColorChange2: function() {
        this.setState({
            color: 2
        });
    },
    handleColorChange3: function() {
        this.setState({
            color: 3
        });
    },
    handleColorChange4: function() {
        this.setState({
            color: 4
        });
    },
    handleColorChange5: function() {
        this.setState({
            color: 5
        });
    },
    handleColorChange6: function() {
        this.setState({
            color: 6
        });
    },
    render: function(){
        var commentNodes = this.state.data.map(function(comment) {
            var colorString;
            if(comment.color==1){
                colorString="blue";
            }
            if(comment.color==2){
                colorString="orange";
            }
            if(comment.color==3){
                colorString="pink";
            }
            if(comment.color==4){
                colorString="red";
            }
            if(comment.color==5){
                colorString="yellow";
            }
            if(comment.color==6){
                colorString="black";
            }
            return (
                <button className={"message "+colorString}>{comment.text}</button>
            );
        });
        return (
            <div className="messageBox">
                <div className="messageBoxLeft">
                    <div className="messageBoxMain">
                        {commentNodes}
                    </div>
                </div>
                <div className="messageBoxRight">
                    <div className="messageBoxRightTitle">

                    </div>
                    <div className="messageBoxRightInput">
                        <div className="messageBoxRightInputInput">
                            <input
                                type="text"
                                placeholder="Your Nickname"
                                value={this.state.author}
                                onChange={this.handleAuthorChange}
                            />
                        </div>
                        <div className="messageBoxRightInputTextarea">
                            <textarea
                                placeholder="In a message here..."
                                value={this.state.text}
                                onChange={this.handleTextChange}
                            />
                        </div>
                    </div>
                    <div className="messageBoxRightSubmit">
                        <div className="messageBoxRightColorPicker">
                            <input onClick={this.handleColorChange1} type="radio" id="check-blue" data-set="radio-color-set" name="colorPicker" defaultChecked/>
                            <label className="messageBoxRightColorPickerLabel blue" htmlFor="check-blue"><span></span></label>

                            <input onClick={this.handleColorChange2} type="radio" id="check-orange" data-set="radio-color-set" name="colorPicker"/>
                            <label className="messageBoxRightColorPickerLabel orange" htmlFor="check-orange" ><span></span></label>

                            <input onClick={this.handleColorChange3} type="radio" id="check-pink" data-set="radio-color-set" name="colorPicker"/>
                            <label className="messageBoxRightColorPickerLabel pink" htmlFor="check-pink"><span></span></label>

                            <input onClick={this.handleColorChange4} type="radio" id="check-red" data-set="radio-color-set" name="colorPicker"/>
                            <label className="messageBoxRightColorPickerLabel red" htmlFor="check-red"><span></span></label>

                            <input onClick={this.handleColorChange5} type="radio" id="check-yellow" data-set="radio-color-set" name="colorPicker"/>
                            <label className="messageBoxRightColorPickerLabel yellow" htmlFor="check-yellow"><span></span></label>

                            <input onClick={this.handleColorChange6} type="radio" id="check-black" data-set="radio-color-set" name="colorPicker"/>
                            <label className="messageBoxRightColorPickerLabel black" htmlFor="check-black"><span></span></label>

                            <button
                                onClick={this.handleButtonClick}
                                className="messageBoxRightSubmitButton">SUBMIT</button>
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