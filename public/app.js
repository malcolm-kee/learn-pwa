(function() {
  console.log('in app.js');

  var urlBase64ToUint8Array = function(base64String) {
    var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);
    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  function subscribeUserToNotification() {
    Notification.requestPermission().then(function(permission) {
      if (permission === 'granted') {
        var subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array('asdf') // publicKey similar to push-keys.js
        };
        navigator.serviceWorker.ready
          .then(function(registration) {
            return registration.pushManager.subscribe(subscribeOptions);
          })
          .then(function(subscription) {
            console.log({ subscription });
          });
      }
    });
  }

  function offerNotification() {
    if (
      'Notification' in window &&
      'PushManager' in window &&
      'serviceWorker' in navigator
    ) {
      subscribeUserToNotification();
    }
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./serviceWorker.js')
      .then(function(registration) {
        console.log(
          'service worker registered with scope:',
          registration.scope
        );

        offerNotification();
      })
      .catch(function(err) {
        console.log('service worker registration fail', err);
      });
  }
})();
