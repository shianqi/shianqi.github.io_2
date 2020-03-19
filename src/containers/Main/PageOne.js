// import canUseDom from 'UTILS/canUseDom'
// import dynamic from 'next/dynamic'
import Parallax from 'parallax-js'
import React from 'react'

// const DynamicComponent = dynamic(() =>
//   import('./parallax.min.js').then(() => {})
// )

class PageOne extends React.Component {
  componentDidMount () {
    var scene = document.getElementById('scene')
    new Parallax(scene)
  }

  homeTitleStyle () {
    if (this.props.promise == 1) {
      return {
        left: '0'
      }
    } else {
      return {
        left: '-150%'
      }
    }
  }

  homeTitleChineseStyle () {
    if (this.props.promise == 1) {
      return {
        left: '20px'
      }
    } else {
      return {
        left: '-150%'
      }
    }
  }

  homeBodyStyle () {
    if (this.props.promise == 1) {
      return {
        right: '0'
      }
    } else {
      return {
        right: '-150%'
      }
    }
  }

  render () {
    return (
      <div className='homeBox'>
        {/* <DynamicComponent /> */}
        <ul id='scene' className='scene'>
          <li className='layer' data-depth='0.20'>
            <p className='homeTitle' style={this.homeTitleStyle()}>
              惟允
            </p>
          </li>
          <li className='layer' data-depth='0.30'>
            <p
              className='homeTitleChinese'
              style={this.homeTitleChineseStyle()}
            >
              惟精惟一，允执厥中
            </p>
          </li>
          <li className='layer layer1' data-depth='0.35'>
            <p className='homeBody' style={this.homeBodyStyle()}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; The sun rises
              higher and higher,
              <br />
              it is on the roof of the light is dark.
            </p>
          </li>
        </ul>
      </div>
    )
  }
}

export default PageOne
