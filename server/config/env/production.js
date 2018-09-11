const hostUrl = process.env.KOA_BASE_HOST_URL || 'https://spravno.herokuapp.com/';

module.exports = {
  hostUrl,
  mongoConnectionStrings: {
    write: 'mongodb://heroku_b7dbwjw7:b100nln16srjnc59kqolt80jq@ds259410.mlab.com:59410/heroku_b7dbwjw7',
  },
  facebook: {
    clientID: '1679771432332193',
    clientSecret: 'ac577f059f1569bd436fa3de00a52404',
    callbackURL: `${hostUrl}auth/facebookWeb/callback`,
    callbackUserURL: `${hostUrl}auth/facebookUserWeb/callback`,
    callbackProfessionalURL: `${hostUrl}auth/facebookProfessionalWeb/callback`,
  },
  sendgrid: {
    api_key: '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',
    mailFrom: 'info@aweshomeapp.com',
  },
  cloudinary: {
    cloud_name: 'diu5kwhe7',
    api_key: '964722286552611',
    api_secret: '83jSdsPpnDwe4qlf13TlHYDP7Pg',
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
