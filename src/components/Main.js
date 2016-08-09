require('normalize.css/normalize.css');
let $ = require('jquery');
let host = 'http://115.28.72.26:3000/';

import React from 'react';
import TechnologyBackground from './js/TechnologyBackground';
import Title from './js/Title';

class AppComponent extends React.Component {
  render() {
    return (
	    <div className="index full">
            <TechnologyBackground/>
            <Title/>
        </div>
    );
  }
  addVisit(){
    $.ajax({
      url: host+'visit',
      type: 'GET'
    });
  }
  componentDidMount(){
  	this.addVisit();
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
