const hostUrl = process.env.KOA_BASE_HOST_URL || 'https://spravno.herokuapp.com/';

module.exports = {
  hostUrl,
  mongoConnectionStrings: {
    // write: '',
    // read: '',
    // static: ''
  },
  facebook: {
    clientID: '1679771432332193',
    clientSecret: 'ac577f059f1569bd436fa3de00a52404',
    callbackURL: `${hostUrl}auth/facebookWeb/callback`,
    callbackUserURL: `${hostUrl}auth/facebookUserWeb/callback`,
    callbackProfessionalURL: `${hostUrl}auth/facebookProfessionalWeb/callback`,
  },
  mailgun: {
    api_key: 'key-9815e55d5cc3e713ec6bf8777601cb0c',
    domain: 'sandboxf78e170a7ea143d387548f435166a7d3.mailgun.org',
    mailFrom: 'shcbrdaiz@gmail.com',
  },
  cloudinary: {
    cloud_name: 'diu5kwhe7',
    api_key: '964722286552611',
    api_secret: '83jSdsPpnDwe4qlf13TlHYDP7Pg',
  },
  clientMainFile: '/apidoc/index.html',
  serverMainFile: '/dist/Tasks.jsx',
  staticMaxAge: 31104000000, // 1000*60*60*24*30*12,
  notification: {
    serverKey: 'AAAA81gJKgA:APA91bGEvRXL28V9ClnPW3lbRtHUcKVWjumNT6YgUQfaOvVM8F1_h5bTDtxhlHhvYVBEItbCrm5e3UpRE19ARTw3tdw_BUHyr6AWFSj0DDHqNk6ffwCYXdSYwYMfn7HQpDNtC6mdpPLwiKEVm1X893iLkKFcY2kbOg',
  },
};
