import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route,Switch } from 'react-router-dom';
import AutorBox from './Autor';
import Home from './Home';
import LivrosBox from './Livro';
import ImgDropzone from './ImgDropzone';
import Cropp from './Cropp';

ReactDOM.render(
    (<Router>
        <App>
            
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/autor" component={AutorBox}/>
                <Route  path="/livro" component={LivrosBox}/>
                <Route  path="/dropzone" component={ImgDropzone}/>
                <Route  path="/cropper" component={Cropp}/>
            </Switch>
        </App>
    </Router>),
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
