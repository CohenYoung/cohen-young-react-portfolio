import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import PortfolioManager from './pages/portfolio-manager';
import NavigationContainer from './navigation/navigation-container';
import About from "./pages/about";
import Home from "./pages/home";
import Contact from "./pages/contact";
import Blog from "./pages/blog";
import BlogDetail from "./blog/blog-detail"
import Auth from "./pages/auth";
import NoMatch from "./pages/no-match";
import Icons from "../helpers/icons";
import PortfolioDetail from './pages/portfolio-detail';



export default class App extends Component {
  constructor(props) {
    super(props);

    Icons();

    this.state = {
      loggedInStatus: "NOT_LOGGED_IN"
    };

    this.handleSuccessfulLogin = this.handleSuccessfulLogin.bind(this);
    this.handleUnsuccessfulLogin = this.handleUnsuccessfulLogin.bind(this);
    this.handleSuccessfulLogout = this.handleSuccessfulLogout.bind(this);

  }

  handleSuccessfulLogin() {
    this.setState({
      loggedInStatus: "LOGGED_IN"
    })
  }
  handleUnsuccessfulLogin() {
    this.setState({
      loggedInStatus: "NOT_LOGGED_IN"
    })
  }
  handleSuccessfulLogout() {
    this.setState({
      loggedInStatus: "LOGGED_OUT"
    })
  }

  checkLoginStatus() {
    return axios.get("https://api.devcamp.space/logged_in", { withCredentials: true })
    .then(response => {
      const loggedIn = response.data.logged_in;
      const loggedInStatus = this.state.loggedInStatus;

      if(loggedIn && loggedInStatus ==="LOGGED_IN") {
        return loggedIn;
      } else if (loggedIn && loggedInStatus === "NOT_LOGGED_IN") {
        this.setState({
          loggedInStatus: "LOGGED_IN"
        });
      } else if (!loggedIn && loggedInStatus === "LOGGED_IN") {
        this.setState({
          loggedInStatus: "NOT_LOGGED_IN"
        });
      }
    }).catch(error => {
        console.log("Error", error)
    });
  }

  componentDidMount() {
    this.checkLoginStatus();
  }

  authorizedPages() {
    return [
      <Route key="portfolio-manager" path="/portfolio-manager" component={PortfolioManager}/>
    ]
  }

  render() {
    return (
      <div className='container'>
        <Router>
          <div>

            <NavigationContainer 
            loggedInStatus={this.state.loggedInStatus}
            handleSuccessfulLogout = {this.handleSuccessfulLogout}
            />

            <Switch>
              <Route exact path="/" component={Home}/>
              <Route
                path="/auth"
                render={props => (
                  <Auth
                  {...props}
                  handleSuccessfulLogin={this.handleSuccessfulLogin}
                  handleUnsuccessfulLogin={this.handleUnsuccessfulLogin}
                  />
                )
                }
              />



              <Route path="/auth" component={Auth}/>
              <Route path="/about-me" component={About}/>
              <Route path="/contact" component={Contact}/>
              <Route exact path="/portfolio/:slug" component={PortfolioDetail}/>


              <Route path="/blog" 
                render={props => (
                  <Blog {...props} loggedInStatus={this.state.loggedInStatus} />
                )}
              />
              
              <Route 
              path="/b/:slug"
              render={props => (
                <BlogDetail {...props} loggedInStatus={this.state.loggedInStatus} />
              )}
              />

              {this.state.loggedInStatus==="LOGGED_IN" ? this.authorizedPages() : null}
              <Route component={NoMatch} /> 
            </Switch>

          </div>

        </Router>
      </div>
    );
  }
}
