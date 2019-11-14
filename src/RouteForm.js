import React, { Component } from "react";
import {
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Select,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel
} from "@material-ui/core";
import { ReplaceSpacesWithDash } from "./lib/parser";

class RouteForm extends Component {
  constructor(props) {
    super(props);
    console.log('Props form', props);
    
    this.state = {
        name: this.props.route.name,
        host: this.props.route.host,
        port: this.props.route.port,
        entrypoint: this.props.route.entrypoint,
    };
    if (this.props.route.certificateResolver) {
        this.state.useHTTPS = true;
        this.state.certificateResolver = this.props.route.certificateResolver;
        this.state.autoRedirect = this.props.route.autoRedirectHttpToHttps;
        if (this.props.route.autoRedirectHttpToHttps) {
            this.state.httpEndpoint = this.props.route.httpEndpoint;
        }
    }
    this.state.index = this.props.index;
  }

  closeDialog = () => {
    if (typeof this.props.closeDialog === "function") {
      this.props.closeDialog();
    }
  };
  deleteRoute = () => {
    if (typeof this.props.deleteRoute === "function") {
      this.props.deleteRoute();
    }
  };

  saveRoute = () => {
    if (typeof this.props.saveRoute === "function") {
        const route = {
            name: this.state.name,
            host: this.state.host,
            port: this.state.port,
            entrypoint: this.state.entrypoint,
          };
        if (this.state.useHTTPS) {
            route.certificateResolver = this.state.certificateResolver;
            route.autoRedirectHttpToHttps = this.state.autoRedirect;
            if (this.state.autoRedirect) {
                route.httpEndpoint = this.state.httpEndpoint;
            }
        }
        this.props.saveRoute(route, this.state.index);
      }
  }

  handleCheckedChange = name => e => {
    this.setState({
      [name]: e.target.checked
    });
  };
  handleChange = (name, parsers = []) => e => {
    let value = e.target.value;

    if(typeof parsers === 'function') {
      parsers = [parsers];
    }
    
    parsers.forEach(parser => {
      if (typeof parser === "function") {
        value = parser(value);
      }
    });

    this.setState({
      ...this.state,
      [name]: value
    });
  };
  render = () => {
    return (
      <React.Fragment>
        <DialogTitle id="form-dialog-title">Edit Route</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Each route will refer to one router connecting to a service on a specific port.
          </DialogContentText>
          <TextField
            autoFocus
            value={this.state.name}
            onChange={this.handleChange('name', ReplaceSpacesWithDash)}
            margin="dense"
            id="name"
            label="Route Name"
            type="text"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            value={this.state.host}
            onChange={this.handleChange('host', ReplaceSpacesWithDash)}
            id="host"
            label="Host"
            type="text"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            value={this.state.port}
            onChange={this.handleChange('port')}
            id="port"
            label="Port on Service"
            type="number"
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel htmlFor="entrypoint-native">Entrypoint</InputLabel>
            <Select
            fullWidth
              native
              value={this.state.entrypoint}
              onChange={this.handleChange("entrypoint")}
              inputProps={{
                name: "entrypoint",
                id: "entrypoint-native"
              }}
            >
              <option value="" />
              <option value={"web"}>web</option>
              <option value={"websecure"}>webSecure</option>
            </Select>
          </FormControl>
          <FormControlLabel
          fullWidth
            control={
              <Switch
                checked={this.state.useHTTPS}
                onChange={this.handleCheckedChange("useHTTPS")}
                value="useHTTPS"
              />
            }
            label="Use HTTPS ?"
          />
          {this.state.useHTTPS && (
            <div>
              <FormControl fullWidth>
                <InputLabel htmlFor="cert-resolver-native">
                  Certificate Resolver
                </InputLabel>
                <Select
                fullWidth
                  native
                  value={this.state.certificateResolver}
                  onChange={this.handleChange("certificateResolver")}
                  inputProps={{
                    name: "certificateResolver",
                    id: "cert-resolver-native"
                  }}
                >
                  <option value="" />
                  <option value={"awsRoute53"}>awsRoute53</option>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.autoRedirect}
                    onChange={this.handleCheckedChange("autoRedirect")}
                    value="autoRedirect"
                  />
                }
                label="Auto redirect HTTP to HTTPS?"
              />
              {this.state.autoRedirect && (
                <FormControl fullWidth>
                  <InputLabel htmlFor="cert-resolver-native">
                    HTTP Endpoint
                  </InputLabel>
                  <Select
                    native
                    value={this.state.httpEndpoint}
                    onChange={this.handleChange("httpEndpoint")}
                    inputProps={{
                      name: "httpEndpoint",
                      id: "httpEndpoint"
                    }}
                  >
                    <option value="" />
              <option value={"web"}>web</option>
              <option value={"websecure"}>webSecure</option>
                  </Select>
                </FormControl>
              )}
            </div>
          )}
          <Button onClick={this.deleteRoute} variant="outlined" color="secondary">Delete Route</Button>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.closeDialog}>
            Cancel
          </Button>
          <Button color="primary" onClick={this.saveRoute}>Save Route</Button>
        </DialogActions>
      </React.Fragment>
    );
  };
}

export default RouteForm;
