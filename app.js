/**
 * Created by killer on 2016/7/3.
 * 程序主入口
 */
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
            <div>
                <BackGround/>

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
        document.documentElement.style.overflowY = 'hidden';
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
            this.r = 0;
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
            this.dx = rand(-1,1);
            this.dy = rand(-1,1);
            this.r = rand(0.8,1.6);
        };

        //整体画布
        var Net = function () {
            this.points = [];
        };

        Net.prototype.update = function () {
            for(var i=0;i<50;i++){
                this.points[i].draw();
            }
        };

        Net.prototype.drawPage = function () {
            context.beginPath();
            context.fillStyle="#10181B";
            context.fillRect(0,0,canvas.width,canvas.height);
            context.fill();
            context.closePath();
            this.update();
            requestAnimationFrame( this.drawPage.bind(this));
        };

        Net.prototype.start = function () {
            for(var i=0;i<50;i++){
                this.points.push(new Point());
            }
            this.drawPage();
        };

        var myNet = new Net();
        myNet.start();
    }
});

var Title = React.createClass({
    render: function () {
        return(
            <div>
                <ul>
                    <li>hello</li>
                    <li>hello</li>
                </ul>
            </div>
        )
    }
});

ReactDOM.render(
    <App promise={$.getJSON('https://api.github.com/search/repositories?q=javascript&sort=stars')}/>,
    document.getElementById('app')
);