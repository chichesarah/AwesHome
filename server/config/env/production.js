const hostUrl = process.env.KOA_BASE_HOST_URL || 'https://aweshome.herokuapp.com/';

module.exports = {
  hostUrl,
  mongoConnectionStrings: {
    write: 'mongodb://heroku_xdxqdgjg:tt9tr8p0h7qp4pptd5c3rs64vr@ds135003.mlab.com:35003/heroku_xdxqdgjg',
  },
  facebook: {
    clientID: '204949240140758',
    clientSecret: 'e93d1bfb49b478b7cafe8796a650bcf6',
    callbackURL: `${hostUrl}auth/facebookWeb/callback`,
    callbackUserURL: `${hostUrl}auth/facebookUserWeb/callback`,
    callbackProfessionalURL: `${hostUrl}auth/facebookProfessionalWeb/callback`,
  },
  sendgrid: {
    mailFrom: 'info@aweshomeapp.com',
  },
  cloudinary: {
    cloud_name: 'dfg2nreqs',
    api_key: '266377671439361',
    api_secret: 'pVR2NMN8ywOPwJJKBV55GLsc10o',
  },
  clientMainFile: '/apidoc/index.html',
  serverMainFile: '/dist/Tasks.jsx',
  staticMaxAge: 31104000000, // 1000*60*60*24*30*12,
  google: {
    api_key: 'AIzaSyClRiWMywb9BoMq5bujYVMsceRs5EIqF4c',
  },
  links: {
    facebook: 'https://graph.facebook.com/v3.0/me?fields=email,birthday,name,first_name,last_name,id,picture&access_token=',
  },
  notification: {
    serverKey: 'AAAADLVmsEM:APA91bGBIayuVpjJEv3OaaWJV8yUn9AtFToTdLmtb2qz02EKXoIqizMpzaUgDGGR-CkSr9SrwYjal1dffY5lpyVoFobayl72cKh0M_JudxkJ8tJY9c9ngONpmXHRm13sHg_m-mR0Z-XpQ8NQRw1a3Tdx_zo46BKkLw',
    key: './AuthKey_9422G984TN.p8',
    keyId: '9422G984TN',
    teamId: '8839GL2MC8',
    topic: 'com.aweshomeapp.aweshome',
    production: true,
  },
};
