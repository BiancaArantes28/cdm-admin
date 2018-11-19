import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route,Switch, Link } from 'react-router-dom';
import AutorBox from './Autor';

ReactDOM.render(
    (<BrowserRouter>
        <React.Fragment>
            <a href="#menu" id="menuLink" className="menu-link">

                <span></span>
            </a>
            <div id="menu">
                <div className="pure-menu">
                    <a className="pure-menu-heading" href="#">Company</a>

                    <ul className="pure-menu-list">
                        <li className="pure-menu-item"><Link to="/" className="pure-menu-link">Home</Link></li>
                        <li className="pure-menu-item"><Link to="/autor" className="pure-menu-link">Autor</Link></li>
                        <li className="pure-menu-item"><Link to="/livro" className="pure-menu-link">livro</Link></li>


                    </ul>

            
                </div>
            </div>
            <Switch>
                <Route exact path="/" component={App}/>
                <Route path="/autor" component={AutorBox}/>
                <Route path="/livro"/>
            </Switch>
        </React.Fragment>
    </BrowserRouter>),
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
