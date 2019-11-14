import React, { Component } from "react";
import { DialogContent, Grid, Typography, IconButton } from "@material-ui/core";
import "./OutputView.css";
import CloseIcon from "@material-ui/icons/Close";

class OutputView extends Component {
    onClose= () => {
        if (typeof this.props.onClose === 'function') {
            this.props.onClose();
        }
    }

  render() {
    const labels = [];
    labels.push("traefik.enable=true");
    this.props.routes.forEach(route => {
      const {
        name,
        host,
        certificateResolver,
        port,
        entrypoint,
        httpEntrypoint,
        autoRedirectHttpToHttps
      } = route;
      labels.push(`traefik.http.routers.${name}.entrypoints=${entrypoint}`);
      labels.push(`traefik.http.routers.${name}.rule=Host(\`${host}\`)`);
      labels.push(
        `traefik.http.services.${name}.loadbalancer.server.port=${port}`
      );
      // HTTPS Stuff
      if (certificateResolver) {
        labels.push(
          `traefik.http.routers.${name}.tls.certresolver=${certificateResolver}`
        );
        if (autoRedirectHttpToHttps) {
          labels.push(`traefik.http.routers.${name}.service=${name}`);
          // Auto redirect stuff
          labels.push(
            `traefik.http.routers.${name}-redirect.entrypoints=${httpEntrypoint}`
          );
          labels.push(
            `traefik.http.routers.${name}-redirect.rule=Host(\`${host}\`)`
          );
          labels.push(
            `traefik.http.services.${name}-redirect.loadbalancer.server.port=${port}`
          );
          labels.push(
            `traefik.http.middlewares.${name}.redirectscheme.permanent=true`
          );
          labels.push(
            `traefik.http.middlewares.${name}.redirectscheme.scheme=https`
          );
        }
      }
    });
    const code = labels.map(line => `  - "${line}"`).join("\n");
    return (
      <DialogContent>
        <Grid 
            container 
            direction="row"
            justify="space-between"
            alignItems="center" 
            spacing={2} >
          <Grid item>
              <Typography variant="h5">Labels for Docker Compose</Typography>
          </Grid>
          <Grid item>
              <IconButton onClick={this.onClose}>
                <CloseIcon />
              </IconButton>
          </Grid>
          <Grid item xs={12}>
            <code>{code}</code>
          </Grid>
        </Grid>
      </DialogContent>
    );
  }
}

export default OutputView;
