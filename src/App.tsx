import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import AddMeeting from "./views/addmeeting";
import Main from "./views/main";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Main />
          </Route>
          <Route path="/add-meeting">
            <AddMeeting />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
