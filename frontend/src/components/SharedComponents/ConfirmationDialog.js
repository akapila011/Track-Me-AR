import React, {Component} from 'react';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress,} from "@material-ui/core";
import Button from '@material-ui/core/Button';

export class ConfirmDialog extends Component {
    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.close} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{this.props.title || "Confirm Action"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {this.props.contentText || "Are you sure you want to proceed?"}
                    </DialogContentText>
                </DialogContent>
                {
                    this.props.isLoading &&
                    <LinearProgress />
                }
                <DialogActions>
                    <Button onClick={this.props.negativeAction} color="secondary" disabled={this.props.isLoading}>
                        {this.props.negativeText || "Cancel"}
                    </Button>
                    <Button onClick={this.props.positiveAction} color="primary" disabled={this.props.isLoading}>
                        {this.props.positiveText || "Proceed"}
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}