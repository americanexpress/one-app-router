/*
 * Copyright (c) 2019 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

import React, { Component } from 'react'
import { render } from 'react-dom'
import { browserHistory, Router, Route, IndexRoute, Link } from '@americanexpress/one-app-router'

import withExampleBasename from '../withExampleBasename'

const PICTURES = [
  { id: 0, src: 'http://placekitten.com/601/601' },
  { id: 1, src: 'http://placekitten.com/610/610' },
  { id: 2, src: 'http://placekitten.com/620/620' }
]

class Modal extends Component {
  styles = {
    position: 'fixed',
    top: '20%',
    right: '20%',
    bottom: '20%',
    left: '20%',
    padding: 20,
    boxShadow: '0px 0px 150px 130px rgba(0, 0, 0, 0.5)',
    overflow: 'auto',
    background: '#fff'
  }

  render() {
    return (
      <div style={this.styles}>
        <p><Link to={this.props.returnTo}>Back</Link></p>
        {this.props.children}
      </div>
    )
  }
}

class App extends Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    // if we changed routes...
    if ((
      nextProps.location.key !== this.props.location.key &&
      nextProps.location.state &&
      nextProps.location.state.modal
    )) {
      // save the old children (just like animation)
      this.previousChildren = this.props.children
    }
  }

  render() {
    let { location } = this.props

    let isModal = (
      location.state &&
      location.state.modal &&
      this.previousChildren
    )

    return (
      <div>
        <h1>Pinterest Style Routes</h1>

        <div>
          {isModal ?
            this.previousChildren :
            this.props.children
          }

          {isModal && (
            <Modal isOpen={true} returnTo={location.state.returnTo}>
              {this.props.children}
            </Modal>
          )}
        </div>
      </div>
    )
  }
}

class Index extends Component {
  render() {
    return (
      <div>
        <p>
          The url `/pictures/:id` can be rendered anywhere in the app as a modal.
          Simply put `modal: true` in the location descriptor of the `to` prop.
        </p>

        <p>
          Click on an item and see its rendered as a modal, then copy/paste the
          url into a different browser window (with a different session, like
          Chrome to Firefox), and see that the image does not render inside the
          overlay. One URL, two session dependent screens :D
        </p>

        <div>
          {PICTURES.map(picture => (
            <Link
              key={picture.id}
              to={{
                pathname: `/pictures/${picture.id}`,
                state: { modal: true, returnTo: this.props.location.pathname }
              }}
            >
              <img style={{ margin: 10 }} src={picture.src} height="100" />
            </Link>
          ))}
        </div>

        <p><Link to="/some/123/deep/456/route">Go to some deep route</Link></p>

      </div>
    )
  }
}

class Deep extends Component {
  render() {
    return (
      <div>
        <p>You can link from anywhere really deep too</p>
        <p>Params stick around: {this.props.params.one} {this.props.params.two}</p>
        <p>
          <Link to={{
            pathname: '/pictures/0',
            state: { modal: true, returnTo: this.props.location.pathname }
          }}>
            Link to picture with Modal
          </Link><br/>
          <Link to="/pictures/0">
            Without modal
          </Link>
        </p>
      </div>
    )
  }
}

class Picture extends Component {
  render() {
    return (
      <div>
        <img src={PICTURES[this.props.params.id].src} style={{ height: '80%' }} />
      </div>
    )
  }
}

render((
  <React.StrictMode>
    <Router history={withExampleBasename(browserHistory, __dirname)}>
      <Route path="/" component={App}>
        <IndexRoute component={Index}/>
        <Route path="/pictures/:id" component={Picture}/>
        <Route path="/some/:one/deep/:two/route" component={Deep}/>
      </Route>
    </Router>
  </React.StrictMode>
), document.getElementById('example'))
