import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navigation from './components/Navigation';
import NotFound from './components/NotFound';
import CurrentSeason from './components/CurrentSeason';
import FinishResults from './components/FinishResults';
import RaceResults from './components/RaceResults';
import Drivers from './components/Drivers';
import Status from "./components/Status";
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.scss';

class App extends Component {
  render() {
    return (
        <div>
          <BrowserRouter>
              <div>
                <Navigation />
                <Switch>
                    <Route path='/home' component={Home} exact />
                    <Route path='/season' component={FinishResults} />
                    <Route path='/race' component={RaceResults} />
                    <Route path='/drivers' component={Drivers} />
                    <Route path='/current' component={CurrentSeason} />
                    <Route path='/status' component={Status} />
                    <Route path='/about' component={About} />
                    <Route path='/contact' component={Contact} />
                    <Route component={NotFound} exact />
                </Switch>
              </div>
          </BrowserRouter>
          <Footer />
        </div>
    );
  }
}

export default App;
