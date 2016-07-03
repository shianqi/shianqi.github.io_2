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
                <h3>Success</h3>
            );
        }else{
            return(
                    <Loading></Loading>
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
        }.bind(this),500);
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

ReactDOM.render(
    <App promise={$.getJSON('https://api.github.com/search/repositories?q=javascript&sort=stars')}/>,
    document.getElementById('app')
);