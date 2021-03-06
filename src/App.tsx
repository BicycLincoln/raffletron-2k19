import { BaseProvider, LightTheme } from "baseui";
import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { Entries } from "./Pages/Entries";
import { Home } from "./Pages/Home";
import { Countdown } from "./Pages/Countdown";

const App: React.FC = () => {
  return (
    <StyletronProvider value={new Styletron()}>
      <BaseProvider theme={LightTheme}>
        <Router>
          <Switch>
            <Route path="/entries">
              <Entries />
            </Route>
            <Route path="/countdown">
              <Countdown />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </BaseProvider>
    </StyletronProvider>
  );
};

export default App;
