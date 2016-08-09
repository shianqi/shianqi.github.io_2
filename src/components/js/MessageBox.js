import React from 'react';
let $ = require('jquery');
let host = 'http://115.28.72.26:3000/';

class MessageBox extends React.Component{
    state = {
        author: '',
        text: '',
        color: 1,
        data: []
    }
    
    componentDidMount() {
        this.getNewMessage();
    }
    
    getNewMessage() {
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
    }
    handleAuthorChange(e) {
        this.setState({
            author: e.target.value
        });
    }
    handleTextChange(e) {
        this.setState({
            text: e.target.value
        });
    }
    handleButtonClick() {
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
    }

    handleColorChange1() {
        this.setState({
            color: 1
        });
    }
    handleColorChange2() {
        this.setState({
            color: 2
        });
    }
    handleColorChange3() {
        this.setState({
            color: 3
        });
    }
    handleColorChange4() {
        this.setState({
            color: 4
        });
    }
    handleColorChange5() {
        this.setState({
            color: 5
        });
    }
    handleColorChange6() {
        this.setState({
            color: 6
        });
    }
    render(){
        var commentNodes = this.state.data.map(function(comment) {
            var colorString;
            if(comment.color==1){
                colorString='blue';
            }
            if(comment.color==2){
                colorString='orange';
            }
            if(comment.color==3){
                colorString='pink';
            }
            if(comment.color==4){
                colorString='red';
            }
            if(comment.color==5){
                colorString='yellow';
            }
            if(comment.color==6){
                colorString='black';
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
                                onChange={this.handleAuthorChange.bind(this)}
                            />
                        </div>
                        <div className="messageBoxRightInputTextarea">
                            <textarea
                                placeholder="In a message here..."
                                value={this.state.text}
                                maxLength="100"
                                onChange={this.handleTextChange.bind(this)}
                            />
                        </div>
                    </div>
                    <div className="messageBoxRightSubmit">
                        <div className="messageBoxRightColorPicker">
                            <input onClick={this.handleColorChange1.bind(this)} type="radio" id="check-blue" data-set="radio-color-set" name="colorPicker" defaultChecked/>
                            <label className="messageBoxRightColorPickerLabel blue" htmlFor="check-blue"><span></span></label>

                            <input onClick={this.handleColorChange2.bind(this)} type="radio" id="check-orange" data-set="radio-color-set" name="colorPicker"/>
                            <label className="messageBoxRightColorPickerLabel orange" htmlFor="check-orange" ><span></span></label>

                            <input onClick={this.handleColorChange3.bind(this)} type="radio" id="check-pink" data-set="radio-color-set" name="colorPicker"/>
                            <label className="messageBoxRightColorPickerLabel pink" htmlFor="check-pink"><span></span></label>

                            <input onClick={this.handleColorChange4.bind(this)} type="radio" id="check-red" data-set="radio-color-set" name="colorPicker"/>
                            <label className="messageBoxRightColorPickerLabel red" htmlFor="check-red"><span></span></label>

                            <input onClick={this.handleColorChange5.bind(this)} type="radio" id="check-yellow" data-set="radio-color-set" name="colorPicker"/>
                            <label className="messageBoxRightColorPickerLabel yellow" htmlFor="check-yellow"><span></span></label>

                            <input onClick={this.handleColorChange6.bind(this)} type="radio" id="check-black" data-set="radio-color-set" name="colorPicker"/>
                            <label className="messageBoxRightColorPickerLabel black" htmlFor="check-black"><span></span></label>

                            <button
                                onClick={this.handleButtonClick.bind(this)}
                                className="messageBoxRightSubmitButton">SUBMIT</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class Comment extends React.Component{
    state = {
        flag : false,
    }

    onButtonClick(){
        if(this.state.flag==true){
            this.setState({
                flag : false
            });
            
        }else{
            this.setState({
                flag : true
            });
        }
    }

    render() {
        var text;
        if(this.props.text.length>3){
            text = this.props.text.substring(0,3);
            text += '..';
        }else{
            text = this.props.text;
        }

        if(!this.state.flag){
            return(
                <div>
                    <button onClick={this.onButtonClick.bind(this)} className={'message '+this.props.color.toString()}>{text}</button>
                </div>
            )
        }else{
            return(
                <div>
                    <button onClick={this.onButtonClick.bind(this)} className={'message '+this.props.color.toString()}>{this.props.text}</button>
                </div>
            )
        }
    }
}

module.exports = MessageBox;