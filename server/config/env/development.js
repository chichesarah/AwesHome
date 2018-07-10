var hostUrl = process.env.KOA_BASE_HOST_URL || 'http://localhost:3000/';

module.exports  =  {
	hostUrl: hostUrl,
  mongoConnectionStrings : {
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
    api_key:"key-9815e55d5cc3e713ec6bf8777601cb0c",
    domain: "sandboxf78e170a7ea143d387548f435166a7d3.mailgun.org",
    mailFrom: 'shcbrdaiz@gmail.com'
  },
  cloudinary: {
    cloud_name: 'diu5kwhe7',
    api_key: '964722286552611',
    api_secret: '83jSdsPpnDwe4qlf13TlHYDP7Pg'
  },
  clientMainFile: '/apidoc/index.html',
  serverMainFile: '/server/Tasks.jsx',
  staticMaxAge: 0
};
