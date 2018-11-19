import React, {Component} from 'react';

export default class Home extends Component{
    render(){
        return(
            <React.Fragment>
                <div className="header">
                    <h1>Bem-vindo ao sistema</h1>
                </div>
                <div className="content" id="content">   
                </div>
            </React.Fragment>
        );
    }
}