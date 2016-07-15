/**
 * Created by killer on 2016/7/3.
 * 程序主入口
 */
var host = "http://115.28.72.26:3000/";

var App = React.createClass({
    getInitialState: function () {
        return {
            loadingState:false
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
        this.setState({loadingState: true});
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
             function webkitRequestAnimationFrame(callback)
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
            return "checked";
        }
        else{
            return false;
        }
    },
    render: function () {
        return(
            <div className="full" id="title">
                <input data-number="3" id="inputAbout" type="checkbox" name="title" checked={this.getCheckedState(3)}/>
                <label className="titleLabel" onClick={this.onclick3}><span>ABOUT</span></label>
                <input data-number="2" id="inputMessage" type="checkbox" name="title" checked={this.getCheckedState(2)}/>
                <label className="titleLabel" onClick={this.onclick2}><span>MESSAGE</span></label>
                <input data-number="1" id="inputHome" type="checkbox" name="title" checked={this.getCheckedState(1)}/>
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
                    <Footing/>
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
            <div className="homeBox">
                <div className="aboutMe">
                    <img className="aboutMePhoto" src="img/Archie-Shi_sm.jpg" alt="" width="160px"/>
                    <p><span className="aboutMeName">史安琪（Archie&nbsp;Shi）</span>，90后编程爱好者。<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2014年考取
                        <a href="http://baike.baidu.com/view/25317.htm">内蒙古大学</a>，
                        由于对编程的热爱，选择了软件工程专业。开始的时候是零基础，是<a href="http://www.hupeng.me/">胡鹏</a>
                        （我的舍友）带着我刷学校OJ，并在大一上半年期间取得了较高的排名。之后加入了
                        <a href="http://www.imudges.com/" target="_blank">IMUDGES</a>（内蒙古大学精英学生开发者联盟），
                        从此励志成为一名合格的
                        <a href="http://baike.baidu.com/view/12046150.htm" target="_blank">全栈工程师</a>
                        （Full Stack developer） ，并不断为之努力。
                        现如今，熟练掌握C++，Java，HTML，CSS，JavaScript，SQL，php，Python，NodeJs等多种语言，能够熟练编写复杂的
                        原生安卓应用，以及WebApp（ionic，React Native，PhoneGap）。熟练使用AngularJs，React，jQuery，ThinkPHP，
                        SSH，Express，MFC等前后端框架。以及Oracle，MySQL，Access，MongoDB等多种数据库。有很好的美术基础，能够非常好的使用
                        photoshop。
                        并且不断的学习新知识，紧追新技术，相信在不久的将来我会成为一名合格的全栈工程师。<br/>
                    </p>
                </div>
            </div>
        )
    }
});

var Footing =React.createClass({
    render: function () {
        return (
            <div className="footing">
                <div className="contactMe">
                    <h3 className="aboutWebsite">CONTACT ME&nbsp;&nbsp;&nbsp;&nbsp;</h3>
                    <p className="aboutWebsite">
                        E-mail：<a href="mailto:shianqi@imudges.com">shianqi@imudges.com</a>&nbsp;&nbsp;&nbsp;&nbsp;<br/>
                        Mobile Phone: <a href="#">15661131738</a>&nbsp;&nbsp;&nbsp;&nbsp;<br/>
                        Github: <a href="https://github.com/shianqi" target="_blank">github.com/shianqi</a>&nbsp;&nbsp;&nbsp;&nbsp;<br/>
                        Tencent QQ: <a href="tencent://message/?uin=1210219084&amp;Site=有事Q我&amp;Menu=yes">1210219084</a>&nbsp;&nbsp;&nbsp;&nbsp;<br/>
                    </p>
                </div>
                <div className="contactWebsite">
                    <h3 className="aboutWebsite">&nbsp;&nbsp;&nbsp;&nbsp;ABOUT WEBSITE</h3>
                    <p className="aboutWebsite">
                        &nbsp;&nbsp;&nbsp;&nbsp;Power By:&nbsp;&nbsp; <a href="https://github.com/facebook/react" target="_blank">React</a>
                        & <a href="https://nodejs.org/en/" target="_blank">NodeJs</a>
                        & <a href="https://www.mongodb.com/" target="_blank">MongoDB</a> <br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;Server: <a href="https://github.com/shianqi/shianqi.github.io_2_server" target="_blank">shianqi.github.io_2_server</a><br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;Website: <a href="https://github.com/shianqi/shianqi.github.io_2" target="_blank">shianqi.github.io_2</a> <br/>

                        &nbsp;&nbsp;&nbsp;&nbsp;历史访问人次： 2104
                        <br/>
                    </p>
                </div>
                <Copyright/>
            </div>
        )
    }
});

var Copyright  = React.createClass({
    render: function () {
        return (
            <div className="Copyright">
                <br/>
                Copyright ©2016 Archie Shi <br/>
                website-version:&nbsp;&nbsp;v2.0.0<br/>
            </div>
        )
    }
});

var Comment = React.createClass({
    render: function(){
        var text;
        if(this.props.text.length>20){
            text = this.props.text.substring(0,18);
            text += "...";
        }else{
            text = this.props.text;
        }

        return(
            <div>
                <button className={"message "+this.props.color.toString()}>{text}</button>
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
            data: []
        };
    },
    componentDidMount: function(){
        this.getNewMessage();
    },
    getNewMessage: function(){
        $.ajax({
            url: host+'getMessage',
            type: 'POST',
            data: this.state,
            success: function(data) {
                for(var i=0;i<data.length;i++){
                    data[i].id=data[i]._id;
                }
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
            url: host+'addMessage',
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
                <Comment key={comment.id} color={colorString} text={comment.text}/>
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
                                maxLength="20"
                                onChange={this.handleAuthorChange}
                            />
                        </div>
                        <div className="messageBoxRightInputTextarea">
                            <textarea
                                placeholder="In a message here..."
                                value={this.state.text}
                                maxLength="100"
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
    <App/>,
    document.getElementById('app')
);