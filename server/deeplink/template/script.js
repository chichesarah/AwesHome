function deepLink(options) {
  const fallback = options.fallback || '';
  const url = options.url || '';
  const iosStoreLink = options.ios_store_link;
  const androidPackageName = options.android_package_name;
  const playStoreLink = `https://market.android.com/details?id=${androidPackageName}`;
  const ua = window.navigator.userAgent;

  // split the first :// from the url string
  const split = url.split(/:\/\/(.+)/);
  const scheme = split[0];
  const path = split[1] || '';

  const urls = {
    deepLink: url,
    iosStoreLink,
    android_intent:
      `intent://${path}#Intent;scheme=${scheme};package=${androidPackageName};end;`,
    playStoreLink,
    fallback,
  };

  console.log(urls.iosStoreLink)

  const isMobile = {
    android: () => /Android/i.test(ua),
    ios: () => /iPhone|iPad|iPod/i.test(ua),
  };

  function launchWekitApproach(url, fallback) {
    document.location = url;
    setTimeout(() => {
      document.location = fallback;
    }, 250);
  }

  function launchIframeApproach(url, fallback) {
    const iframe = document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.onload = () => {
      document.location = url;
    };
    iframe.src = url;

    window.onload = () => {
      document.body.appendChild(iframe);

      setTimeout(() => {
        window.location = fallback;
      }, 25);
    };
  }

  function iosLaunch() {
    // chrome and safari on ios >= 9 don't allow the iframe approach
    if (ua.match(/CriOS/) || (ua.match(/Safari/) && ua.match(/Version\/(9|10)/))) {
      launchWekitApproach(urls.deepLink, urls.iosStoreLink || urls.fallback);
    } else {
      launchIframeApproach(urls.deepLink, urls.iosStoreLink || urls.fallback);
    }
  }

  function androidLaunch() {
    if (ua.match(/Chrome/)) {
      document.location = urls.android_intent;
    } else if (ua.match(/Firefox/)) {
      launchWekitApproach(urls.deepLink, urls.playStoreLink || urls.fallback);
    } else {
      launchIframeApproach(url, urls.playStoreLink || urls.fallback);
    }
  }

  // fallback to the application store on mobile devices
  if (isMobile.ios() && urls.deepLink && urls.iosStoreLink) {
    iosLaunch();
  } else if (isMobile.android() && androidPackageName) {
    androidLaunch();
  } else {
    window.location = urls.fallback;
  }
}

// expose module so it can be required later in tests
if (typeof module !== 'undefined') {
  module.exports = deepLink;
}
