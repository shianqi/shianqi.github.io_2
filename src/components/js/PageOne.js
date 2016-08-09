require('../parallax.min.js');
import React from 'react';

class PageOne extends React.Component{
    componentDidMount() {
        var scene = document.getElementById('scene');
        var parallax = new Parallax(scene);
    }
    homeTitleStyle() {
        if(this.props.promise==1){
            return{
                left:'0'
            }
        }else{
            return{
                left:'-150%'
            }
        }
    }
    homeTitleChineseStyle() {
        if(this.props.promise==1){
            return{
                left:'20px'
            }
        }else{
            return{
                left:'-150%'
            }
        }
    }
    homeBodyStyle() {
        if(this.props.promise==1){
            return{
                right:'0'
            }
        }else{
            return{
                right:'-150%'
            }
        }
    }
    render(){
        return(
            <div className="homeBox">
                <ul id="scene" className="scene">
                    <li className="layer" data-depth="0.20"><p className="homeTitle" style={this.homeTitleStyle()}>Archie Shi</p></li>
                    <li className="layer" data-depth="0.30">
                        <p className="homeTitleChinese" style={this.homeTitleChineseStyle()}>史安琪 / 1995.08 · 全栈ing</p>
                    </li>
                    <li className="layer layer1" data-depth="0.35">
                        <p className="homeBody" style={this.homeBodyStyle()}>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; The sun rises higher and higher,
                            <br/>
                            it is on the roof of the light is dark. 
                        </p>
                    </li>
                </ul>
            </div>
        )
    }
}

module.exports = PageOne;