import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles1 = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

function NotificationContent(props) {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

NotificationContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

const NotificationContentWrapper = withStyles(styles1)(NotificationContent);

const styles2 = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  progress: {
    top: `calc(50% - 40px)`,
    position: 'absolute',
    left: `calc(50% - 40px)`
  },
  paper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'transparent',
    padding: theme.spacing.unit * 4,
    outline: 'none'
  },
});

function getModalStyle() {
  return {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
  };
}

const styleProgressModal = {
  width: '90%',
  height: '90%',
  left: '5%',
  top: '5%',
}

class Notifications extends React.Component {
  state = {
    open: false,
    type: '',
    message: '',
    duration: 5000
  };

  componentWillMount() {
    const { open, type, message } = this.props;
    this.setState({open, type, message});
  }

  componentWillReceiveProps(nextProps) {
    const { open, type, message } = nextProps;
    this.setState({open, type, message, duration: 5000});
  }

  handleClick = () => {
    this.setState({open: true});
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({open: false, message: ''}, () => {
      const { onClose } = this.props;
      if(onClose) onClose();
    });
  };

  render() {
    const { classes } = this.props;
    const { open, type, message, duration } = this.state;
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={open}
          autoHideDuration={duration}
          onClose={this.handleClose}
          disableWindowBlurListener={true}
          key={new Date().getTime()}
        >
          <NotificationContentWrapper
            onClose={this.handleClose}
            variant={type === 'progress' ? 'info' : type}
            message={message}
          />
        </Snackbar>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open && (type === 'progress')}
          onClose={this.handleClose}
          style={styleProgressModal}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <CircularProgress className={classes.progress} size={80} />
          </div>
        </Modal>
      </div>
    );
  }
}

Notifications.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles2)(Notifications);