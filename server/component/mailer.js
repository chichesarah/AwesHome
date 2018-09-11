import config from '../config';

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(config.sendgrid.api_key);

export default sgMail;
