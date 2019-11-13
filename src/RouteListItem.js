import React, { Component } from "react";
import { TableRow, TableCell } from "@material-ui/core";
import HttpsIcon from "@material-ui/icons/Https";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

class RouteListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      routeName: ""
    };
  }
  handleChange = (name, parsers = []) => e => {
    let value = e.target.value;
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

  onRowClicked = (row) => () => {
      if (typeof this.props.onRowClicked === 'function') {
        this.props.onRowClicked(row)
      }
  }
  render = () => {
    return (
      <TableRow hover key={this.props.index} onClick={this.onRowClicked(this.props.index)}>
        <TableCell component="th" scope="row">
          {this.props.route.name}
        </TableCell>
        <TableCell align="left">{this.props.route.host}</TableCell>
        <TableCell align="left">{this.props.route.port}</TableCell>
        <TableCell align="left">
          {this.props.route.certificateResolver && (
            <div>
              {this.props.route.autoRedirectHttpToHttps && <LockOpenIcon />}
              {this.props.route.autoRedirectHttpToHttps && <ArrowForwardIcon />}
              <HttpsIcon />
            </div>
          )}
          {!this.props.route.certificateResolver && <LockOpenIcon />}
        </TableCell>
      </TableRow>
    );
  };
}

export default RouteListItem;
