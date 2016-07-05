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
            tabNumber:1
        };
    },
    aOnclick: function () {
        this.setState({
            tabNumber:1
        });
    },
    bOnclick: function () {
        this.setState({
            tabNumber:2
        });
    },
    cOnclick: function () {
        this.setState({
            tabNumber:3
        });
    },
    render: function () {
        return(
            <div className="full" id="title">
                <input id="inputAbout" type="radio" name="title" />
                <label htmlFor="inputAbout" onClick={this.cOnclick}><span>About</span></label>
                <input id="inputMessage" type="radio" name="title"/>
                <label htmlFor="inputMessage" onClick={this.aOnclick}><span>MESSAGE</span></label>
                <input id="inputHome" type="radio" name="title" defaultChecked/>
                <label htmlFor="inputHome" onClick={this.bOnclick}><span>HOME</span></label>
                <Tabs promise={this.state.tabNumber}/>
            </div>
        )
    }
});

var Tabs = React.createClass({
    render: function () {
        return(
            <div className="messageBox" id="messageBox">
                <div className="page">
                    页面一
                </div>
                <div className="page">
                    页面二
                </div>
                <div className="page">
                    页面三
                </div>
            </div>
        )
    }
});

ReactDOM.render(
    <App promise={$.getJSON('https://api.github.com/search/repositories?q=javascript&sort=stars22')}/>,
    document.getElementById('app')
);