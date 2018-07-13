const hostUrl = process.env.KOA_BASE_HOST_URL || 'http://localhost:3000/';

module.exports = {
  hostUrl,
  mongoConnectionStrings: {
    write: 'mongodb://localhost:27017/awesomeHome',
    // read: 'mongodb://localhost:27017/awesomeHome',
  },
  facebook: {
    clientID: '1679771432332193',
    clientSecret: 'ac577f059f1569bd436fa3de00a52404',
    callbackURL: hostUrl + 'auth/facebookWeb/callback',
    callbackUserURL: hostUrl + 'auth/facebookUserWeb/callback',
  },
  mailgun: {
    api_key: 'key-9815e55d5cc3e713ec6bf8777601cb0c',
    domain: 'sandboxf78e170a7ea143d387548f435166a7d3.mailgun.org',
    mailFrom: 'shcbrdaiz@gmail.com',
  },
  cloudinary: {
    cloud_name: 'opengeeksvkcloudy',
    api_key: '367132333244418',
    api_secret: 'GuH8d9Ct_OvX2K3DoDhEXg2p1mM',
  },
  clientMainFile: '/apidoc/index.html',
  serverMainFile: '/server/Tasks.jsx',
  staticMaxAge: 0,
  google: {
    api_key: 'AIzaSyClRiWMywb9BoMq5bujYVMsceRs5EIqF4c',
  },
  links: {
    facebook: 'https://graph.facebook.com/v3.0/me?fields=email,birthday,name,first_name,last_name,id,picture&access_token=',
  },
};
