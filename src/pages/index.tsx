import appCss from 'CONTAINERS/Main/App.css'
import TechnologyBackground from 'CONTAINERS/Main/TechnologyBackground'
import Title from 'CONTAINERS/Main/Title'
import React from 'react'
import { connect } from 'react-redux'
import styled, { createGlobalStyle } from 'styled-components'

const Root = styled.div`
  height: 100%;
`

const GlobalStyle = createGlobalStyle`
  ${appCss}
`

class App extends React.Component {
  render () {
    return (
      <Root>
        <GlobalStyle />
        <TechnologyBackground />
        <Title />
      </Root>
    )
  }
}

const mapStateToProps = (state: any) => {
  return { level1: state.app.level1 }
}

export default connect(mapStateToProps)(App)
