import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";


export default class BiboRouter extends Component {
    constructor(props){
        super(props);
        history.listen((location, action) => {
            // clear alert on location change
            // this.props.clearAlerts();
            });
    }
    render() {
        return (
            <Router history={history}>
            <Switch>
            <PrivateRoute exact path="/layout" component={Layout} />
            {/* <Route path="/login"  /> */}
            <Route path="/signup" component={SignUp} />
            {/* <Route path="/layout" component={Layout} /> */}
            <Redirect from="*" to="/login" component={Login}/>
            </Switch>
        </Router>
    )
}
}
