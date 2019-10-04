import React from "react";
import { BaseProvider, LightTheme } from "baseui";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { Entries } from "./Pages/Entries"
import { Home } from "./Pages/Home"

const App: React.FC = () => {
  return (
    <StyletronProvider value={new Styletron()}>
      <BaseProvider theme={LightTheme}>
        <Router>
          <Switch>
            <Route path="/entries">
              <Entries />
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
