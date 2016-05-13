'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('babel-polyfill');

var _constants = require('./constants');

var constants = _interopRequireWildcard(_constants);

var _http = require('./io/http');

var _http2 = _interopRequireDefault(_http);

var _utils = require('./utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __config = void 0;
var __defaultConfig = {
  localStorageKey: constants.DEFAULT_LOCAL_STORAGE_KEY,
  apiUrl: 'http://localhost:3000',
  loginUrl: 'auth/access/token',
  userUrl: 'users/:id'
};
var __currentUser = null;

var ApiGuardian = function () {
  function ApiGuardian() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ApiGuardian);

    this._inited = false;

    __initialize.call(this, options);
  }

  _createClass(ApiGuardian, [{
    key: 'configure',
    value: function configure(fn) {
      var result = fn(Object.assign({}, __config));
      return __config = Object.assign({}, __config, result);
    }
  }, {
    key: 'loginWithEmail',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(email, password) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', this.login({
                  grant_type: 'password',
                  username: email,
                  password: password
                }));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function loginWithEmail(_x2, _x3) {
        return ref.apply(this, arguments);
      }

      return loginWithEmail;
    }()
  }, {
    key: 'loginWithFacebook',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(accessToken) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', this.login({
                  grant_type: 'assertion',
                  assertion_type: 'facebook',
                  assertion: accessToken
                }));

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function loginWithFacebook(_x4) {
        return ref.apply(this, arguments);
      }

      return loginWithFacebook;
    }()
  }, {
    key: 'login',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(body) {
        var request = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
        var loginUrl, response;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                loginUrl = _utils.UrlUtils.buildLoginUrl(this.config.apiUrl, this.config.loginUrl);


                request.body = body;

                _context3.prev = 2;
                _context3.next = 5;
                return _http2.default.postJson(loginUrl, request, true);

              case 5:
                response = _context3.sent;

                __processAuthData.call(this, response);
                return _context3.abrupt('return', this.refreshCurrentUser());

              case 10:
                _context3.prev = 10;
                _context3.t0 = _context3['catch'](2);
                return _context3.abrupt('return', Promise.reject(_context3.t0));

              case 13:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[2, 10]]);
      }));

      function login(_x5, _x6) {
        return ref.apply(this, arguments);
      }

      return login;
    }()
  }, {
    key: 'refreshCurrentUser',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        var authData, accessToken, tokenData, userUrl, response;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                authData = this.getAuthData();

                if (!_utils.TokenUtils.isAuthDataValid(authData)) {
                  _context4.next = 18;
                  break;
                }

                accessToken = authData.access_token;
                tokenData = _utils.TokenUtils.decodeAccessToken(accessToken);
                userUrl = _utils.UrlUtils.buildUserUrl(this.config.apiUrl, this.config.userUrl, tokenData.user.id);
                _context4.prev = 5;
                _context4.next = 8;
                return _http2.default.getJson(userUrl);

              case 8:
                response = _context4.sent;

                __buildCurrentUser.call(this, tokenData, response);
                return _context4.abrupt('return', Promise.resolve(this.currentUser));

              case 13:
                _context4.prev = 13;
                _context4.t0 = _context4['catch'](5);
                return _context4.abrupt('return', Promise.reject(_context4.t0));

              case 16:
                _context4.next = 21;
                break;

              case 18:
                this.clearAuthData();
                this.clearCurrentUser();
                return _context4.abrupt('return', Promise.reject('Auth data invalid.'));

              case 21:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[5, 13]]);
      }));

      function refreshCurrentUser() {
        return ref.apply(this, arguments);
      }

      return refreshCurrentUser;
    }()
  }, {
    key: 'logout',
    value: function logout() {
      // TODO: Ddigits logout
      this.clearAuthData();
      this.clearCurrentUser();
      return Promise.resolve();
    }
  }, {
    key: 'getAuthData',
    value: function getAuthData() {
      var ls = __getLocalStorage.call(this);

      if (ls && ls.authData) {
        return ls.authData;
      } else {
        return null;
      }
    }
  }, {
    key: 'clearAuthData',
    value: function clearAuthData() {
      __resetLocalStorage.call(this);
      _http2.default.setAccessToken(null);
    }
  }, {
    key: 'getAccessToken',
    value: function getAccessToken() {
      var authData = this.getAuthData();
      return authData && authData.access_token ? authData.access_token : null;
    }
  }, {
    key: 'clearCurrentUser',
    value: function clearCurrentUser() {
      __currentUser = null;
    }
  }, {
    key: 'config',
    get: function get() {
      return Object.assign({}, __config);
    }
  }, {
    key: 'currentUser',
    get: function get() {
      return __currentUser ? Object.assign({}, __currentUser) : null;
    }
  }]);

  return ApiGuardian;
}();

function __initialize(options) {
  if (this._inited) {
    return;
  }

  __buildConfig.call(this, options);
  __initLocalStorage.call(this);

  var accessToken = this.getAccessToken();
  _http2.default.setAccessToken(accessToken);

  this._inited = true;
}

function __buildConfig(options) {
  __config = Object.assign({}, __defaultConfig, options);
}

function __initLocalStorage() {
  if (!__getLocalStorage.call(this)) {
    __resetLocalStorage.call(this);
  }
}

function __getLocalStorage() {
  var authData = localStorage.getItem(this.config.localStorageKey);
  return authData ? JSON.parse(authData) : null;
}

function __resetLocalStorage() {
  localStorage.setItem(this.config.localStorageKey, JSON.stringify({
    authData: null
  }));
}

function __updateLocalStorage(key, value) {
  __initLocalStorage.call(this);
  var authData = __getLocalStorage.call(this);

  authData[key] = value;

  localStorage.setItem(this.config.localStorageKey, JSON.stringify(authData));
}

function __processAuthData(authData) {
  __updateLocalStorage.call(this, 'authData', authData);
  _http2.default.setAccessToken(this.getAccessToken());
}

function __buildCurrentUser(tokenData, userData) {
  var attributes = _utils.StrUtils.camelCaseKeys(userData.data.attributes);

  __currentUser = {
    id: tokenData.user.id,
    permissions: tokenData.permissions,
    attributes: attributes,
    isGuest: function isGuest() {
      // TODO: This needs to be built from API data
      return false;
    }
  };
}

exports.default = ApiGuardian;

// function AuthService($rootScope, $q, $http, $window, $localStorage, $ionicModal, $ionicLoading, $cordovaDialogs, DigitsService, DeviceService, APP_CONFIG) {
//   this.registerWithEmail = registerWithEmail;
//   this.registerWithDigits = registerWithDigits;
//   this.registerWithFacebook = registerWithFacebook;
//   this.registerAsGuest = registerAsGuest;
//   this.register = register;
//   this.loginWithDigits = loginWithDigits;
//   this.resetPassword = resetPassword;
//   this.completeResetPassword = completeResetPassword;
//   this.refreshSession = refreshSession;
//   this.sessionExpired = sessionExpired;
//   this.updateUserSetting = updateUserSetting;
//   this.handleResetPassword = handleResetPassword;
//
//   function registerWithEmail(fields) {
//     return this.register(
//       Object.assign({}, fields, {
//         type: 'email'
//       })
//     );
//   }
//
//   function registerWithDigits(digitsOptions) {
//     return DigitsService.authenticate(digitsOptions)
//       .then(function(session) {
//         var authData = session.authData;
//         return _this.register({
//           type: 'digits',
//           auth_url: authData[DIGITS_URL_KEY],
//           auth_header: authData[DIGITS_AUTH_HEADER_KEY]
//         });
//       });
//   }
//
//   function registerWithFacebook(fields) {
//     return this.register(
//       Object.assign({}, fields, {
//         type: 'facebook'
//       })
//     );
//   }
//
//   function registerAsGuest() {
//     var deferred = $q.defer();
//
//     deferred.reject('Not Yet Implemented');
//
//     return deferred.promise;
//   }
//
//   function register(options) {
//     return $http.post(APP_CONFIG.API_URL + '/auth/register', options)
//       .then(function(result) {
//         $rootScope.$emit(REGISTER_SUCCESS);
//       }, function(errorResult) {
//         $rootScope.$emit(REGISTER_FAILED, errorResult.statusText);
//         return $q.reject({errors: errorResult.data.errors, result: errorResult});
//       })
//   }
//
//   function loginWithDigits(digitsOptions) {
//     return DigitsService.authenticate(digitsOptions)
//       .then(function(session) {
//         var encodedPassword = getEncodedDigitsPassword(session.authData);
//
//         return _this.login({
//           type: 'digits',
//           username: session.phoneNumber,
//           password: encodedPassword
//         });
//       });
//   }
//
//   function resetPassword(email) {
//     return $http.post(APP_CONFIG.API_URL + '/auth/reset-password', {email: email});
//   }
//
//   function completeResetPassword(options) {
//     return $http.post(APP_CONFIG.API_URL + '/auth/complete-reset-password', {
//       token: options.token,
//       email: options.email,
//       password: options.password,
//       password_confirmation: options.password_confirmation
//     });
//   }
//
//   function refreshSession() {
//     var sessionData = this.getAccessToken();
//
//     if(sessionData && sessionData.refresh_token) {
//       var params = {
//         grant_type: 'refresh_token',
//         refresh_token: sessionData.refresh_token
//       };
//
//       return $http.post(APP_CONFIG.API_URL + '/auth/access/token', params)
//         .then(function(result) {
//           if(result.status == 200 && result.data) {
//             console.log('AuthService#refreshSession: Session refreshed successfully.');
//             updateLocalStorage('accessToken', result.data);
//             return _this.refreshCurrentUser();
//           } else {
//             console.log('AuthService#refreshSession: Session could not be refreshed.');
//             return _this.sessionExpired();
//           }
//         }, function(err) {
//           console.log('AuthService#refreshSession: Session could not be refreshed.');
//           return _this.sessionExpired();
//         });
//     } else {
//       return $q.reject('No refresh token is available.');
//     }
//   }
//
//   function sessionExpired() {
//     $rootScope.$emit(SESSION_EXPIRED);
//     _this.clearAccessToken();
//     return $q.reject('Session has expired.');
//   }
//
//   function getEncodedDigitsPassword(authHeaders) {
//     var apiUrl = authHeaders[DIGITS_URL_KEY];
//     var authHeader = authHeaders[DIGITS_AUTH_HEADER_KEY];
//     return $window.btoa([apiUrl, authHeader].join(';'));
//   }
//
//   function prepSettings(settings) {
//     var prepped = {};
//     Object.keys(settings).forEach(function(key) {
//       var setting = settings[key];
//       if(setting == "true") {
//         prepped[key] = true;
//       } else if (setting == "false") {
//         prepped[key] = false;
//       } else {
//         prepped[key] = setting;
//       }
//     });
//     return prepped;
//   }
//
//   function updateUserSetting(key, value) {
//     var setting = {
//       key: key,
//       value: value
//     };
//
//     return $http.put(APP_CONFIG.API_URL + '/users/' + _this._currentUser.id + '/settings', {setting: setting})
//       .then(function() {
//         _this._currentUser.settings[key] = value;
//       });
//   }
//