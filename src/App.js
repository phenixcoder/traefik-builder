import React, { Component } from "react";
import "./App.css";
import {
  Dialog,
  Container,
  Grid,
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RouteListItem from "./RouteListItem";
import RouteForm from "./RouteForm";
import OutputView from "./OutputView";

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      currentRow: -1,
      routes: [
        {
          name: "Route-0",
          host: "hostname.local",
          port: 80,
          entrypoint: "websecure",
          certificateResolver: "awsRoute53",
          autoRedirectHttpToHttps: true,
          httpEndpoint: ''
        },
        {
          name: "Route-1",
          host: "hostname.local",
          port: 80,
          entrypoint: "websecure",
          certificateResolver: "awsRoute53",
          autoRedirectHttpToHttps: false
        },
        {
          name: "Route-2",
          host: "hostname2.local",
          port: 8080,
          entrypoint: "websecure"
        }
      ],
      showOutput: false
    };
  }

  addRoute = () => {
    const routes = this.state.routes;
    const newRoute = {
      name: `Route ${routes.length}`
    };
    routes.push(newRoute);
    this.setState({
      routes: routes
    });
  };

  editRow = row => {
    this.setState({
      currentRow: row
    });
  };

  saveRoute = (route, index) => {
    const routes = this.state.routes;
    routes[index] = route;
    this.setState({routes, currentRow: -1});
  }

  closeDialog = () => {
    this.setState({ currentRow: -1 });
  };

  showOutputDialog = () => {
    this.setState({ showOutput: true });
  };

  closeOutputDialog = () => {
    this.setState({ showOutput: false });
  };

  deleteRoute = (index) => {
    let routes = this.state.routes;
    routes.splice(index, 1);
    this.setState({routes, currentRow: -1});
  }

  render() {
    return (
      <Container className="app">
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="flex-start"
          spacing={4}
        >
          <Grid item>
            <Typography variant="h4">Traefik Label Builder</Typography>
          </Grid>
          <Grid item>
            <Button onClick={this.showOutputDialog} variant="contained" color="secondary">Show Output</Button>
          </Grid>
          <Table className="table" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell component="th">Name</TableCell>
                <TableCell component="th">Host/path</TableCell>
                <TableCell component="th">Service Port</TableCell>
                <TableCell component="th">Service Security</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.routes.map((route, index) => (
                <RouteListItem
                  route={route}
                  key={index}
                  index={index}
                  onRowClicked={this.editRow}
                ></RouteListItem>
              ))}
            </TableBody>
          </Table>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={this.addRoute}>
              <AddIcon /> Add Route
            </Button>
          </Grid>
        </Grid>
        <Dialog
          open={this.state.currentRow > -1}
          aria-labelledby="form-dialog-title"
        >
          {this.state.currentRow > -1 && <RouteForm route={this.state.routes[this.state.currentRow]} index={this.state.currentRow} closeDialog={this.closeDialog} saveRoute={this.saveRoute} deleteRoute={this.deleteRoute} />}
        </Dialog>
        <Dialog
          open={this.state.showOutput}
          aria-labelledby="form-dialog-title"
          fullScreen
        >
          <OutputView routes={this.state.routes} onClose={this.closeOutputDialog} />
        </Dialog>
      </Container>
    );
  }
}

export default App;
