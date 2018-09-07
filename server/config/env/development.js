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
  mailgun: {
    api_key: '6dc05648a3a9593f6e2b773ea4489ad7-8889127d-4b714983',
    domain: 'sandbox8214f17b1502422e9937ff0dabd9bad6.mailgun.org',
    mailFrom: 'opengeeklabvk@gmail.com',
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
  },
  links: {
    facebook: 'https://graph.facebook.com/v3.0/me?fields=email,birthday,name,first_name,last_name,id,picture&access_token=',
  },
};
