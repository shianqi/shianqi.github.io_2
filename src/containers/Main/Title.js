import React from 'react'
import PageOne from './PageOne'
import MessageBox from './MessageBox'
import PageThree from './PageThree'
import Footing from './Footing'

const $ = require('jquery')

class Title extends React.Component {
  state = {
    value: 0
  }

  render () {
    return (
      <div className='full' id='title'>
        <input
          data-number='3'
          id='inputAbout'
          type='checkbox'
          name='title'
          checked={this.getCheckedState(3)}
        />
        <label className='titleLabel' onClick={this.onclick3.bind(this)}>
          <span>ABOUT</span>
        </label>
        <input
          data-number='2'
          id='inputMessage'
          type='checkbox'
          name='title'
          checked={this.getCheckedState(2)}
        />
        <label className='titleLabel' onClick={this.onclick2.bind(this)}>
          <span>MESSAGE</span>
        </label>
        <input
          data-number='1'
          id='inputHome'
          type='checkbox'
          name='title'
          checked={this.getCheckedState(1)}
        />
        <label className='titleLabel' onClick={this.onclick1.bind(this)}>
          <span>HOME</span>
        </label>
        <Tabs promise={this.state.value} />
      </div>
    )
  }

  setCheckedState (flag) {
    var maxNumber = 3
    var nowNumber = this.state.value
    if (flag == 1) {
      if (nowNumber < maxNumber) {
        nowNumber++
        this.setState({
          value: nowNumber
        })
      }
    } else {
      if (nowNumber > 1) {
        this.setState({
          value: nowNumber - 1
        })
      }
    }
  }

  componentDidMount () {
    this.setState({
      value: 1
    })
    if (navigator.userAgent.indexOf('Firefox') > 0) {
      if (document.addEventListener) {
        document.addEventListener(
          'DOMMouseScroll',
          this.scrollFunc.bind(this),
          false
        )
      }
    } else {
      document.onmousewheel = this.scrollFunc.bind(this)
    }
  }

  scrollFunc (e) {
    var isFinish = true
    if (isFinish) {
      e = e || window.event
      if (e.wheelDelta < 0 || e.detail > 0) {
        var $this = $(this)
        var timeoutId = $this.data('timeoutId')
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        $this.data(
          'timeoutId',
          setTimeout(
            function () {
              this.setCheckedState(1)
              $this.removeData('timeoutId')
              $this = null
            }.bind(this),
            100
          )
        )
        return false
      } else if (e.wheelDelta > 0 || e.detail < 0) {
        var $this = $(this)
        var timeoutId = $this.data('timeoutId')
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        $this.data(
          'timeoutId',
          setTimeout(
            function () {
              this.setCheckedState(-1)
              $this.removeData('timeoutId')
              $this = null
            }.bind(this),
            100
          )
        )
        return false
      }
    }
  }

  onclick1 () {
    this.setState({
      value: 1
    })
  }

  onclick2 () {
    this.setState({
      value: 2
    })
  }

  onclick3 () {
    this.setState({
      value: 3
    })
  }

  getCheckedState (number) {
    if (number == this.state.value) {
      return 'checked'
    } else {
      return false
    }
  }
}

class Tabs extends React.Component {
  render () {
    return (
      <div className='pageMain' id='pageMain'>
        <div className='page'>
          <PageOne promise={this.props.promise} />
        </div>
        <div className='page'>
          <MessageBox />
        </div>
        <div className='page'>
          <PageThree />
          <Footing />
        </div>
      </div>
    )
  }
}

export default Title
