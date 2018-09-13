const hostUrl = process.env.KOA_BASE_HOST_URL || 'http://localhost:3000/';

module.exports = {
  hostUrl,
  mongoConnectionStrings: {
    write: 'mongodb://localhost:27017/awesomeHome',
  },
  facebook: {
    clientID: '1679771432332193',
    clientSecret: 'ac577f059f1569bd436fa3de00a52404',
    callbackURL: `${hostUrl}auth/facebookWeb/callback`,
    callbackUserURL: `${hostUrl}auth/facebookUserWeb/callback`,
  },
  sendgrid: {
    mailFrom: 'info@aweshomeapp.com',
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
  notification: {
    serverKey: 'AAAADLVmsEM:APA91bGBIayuVpjJEv3OaaWJV8yUn9AtFToTdLmtb2qz02EKXoIqizMpzaUgDGGR-CkSr9SrwYjal1dffY5lpyVoFobayl72cKh0M_JudxkJ8tJY9c9ngONpmXHRm13sHg_m-mR0Z-XpQ8NQRw1a3Tdx_zo46BKkLw',
    key: './AuthKey_NJT42RC3U4.p8',
    keyId: 'NJT42RC3U4',
    teamId: '37MJCDC27Q',
    topic: 'com.aweshomeapp.aweshom',
    production: false,
  },
  links: {
    facebook: 'https://graph.facebook.com/v3.0/me?fields=email,birthday,name,first_name,last_name,id,picture&access_token=',
  },
};
