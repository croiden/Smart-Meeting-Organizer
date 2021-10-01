import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from "styled-components";

import AddMeeting from "./views/addmeeting";
import Main from "./views/main";

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: center;
`;
const MainSection = styled.div`
  padding: 20px;
  margin: auto;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: rgb(43 46 207 / 50%) 0px 5px 19px;
  display: inline-flex;
  justify-content: center;
  min-width: 30%;
`;

const NavBar = styled.div`
  position: absolute;
  width: 100vw;
  background-color: #333;
  margin-bottom: 20px;
  overflow: hidden;
`;

const StyledAnchor = styled.a`
  float: left;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
  &:hover {
    background-color: #ddd;
    color: black;
  }
`;

function App() {
  return (
    <Container>
      <NavBar>
        <StyledAnchor href="/">{"Home"}</StyledAnchor>
      </NavBar>
      <MainSection>
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
      </MainSection>
    </Container>
  );
}

export default App;
