webpackJsonp([1,4],{

/***/ 1048:
/***/ (function(module, exports) {

function Mapper() {
    var sources = {};
    this.forEach = function (callback) {
        for (var key in sources) {
            var source = sources[key];
            for (var key2 in source)
                callback(source[key2]);
        }
        ;
    };
    this.get = function (id, source) {
        var ids = sources[source];
        if (ids == undefined)
            return undefined;
        return ids[id];
    };
    this.remove = function (id, source) {
        var ids = sources[source];
        if (ids == undefined)
            return;
        delete ids[id];
        // Check it's empty
        for (var i in ids) {
            return false;
        }
        delete sources[source];
    };
    this.set = function (value, id, source) {
        if (value == undefined)
            return this.remove(id, source);
        var ids = sources[source];
        if (ids == undefined)
            sources[source] = ids = {};
        ids[id] = value;
    };
}
;
Mapper.prototype.pop = function (id, source) {
    var value = this.get(id, source);
    if (value == undefined)
        return undefined;
    this.remove(id, source);
    return value;
};
module.exports = Mapper;


/***/ }),

/***/ 1049:
/***/ (function(module, exports, __webpack_require__) {

/*
 * (C) Copyright 2014 Kurento (http://kurento.org/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
var JsonRpcClient = __webpack_require__(1050);
exports.JsonRpcClient = JsonRpcClient;


/***/ }),

/***/ 1050:
/***/ (function(module, exports, __webpack_require__) {

/*
 * (C) Copyright 2014 Kurento (http://kurento.org/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
var RpcBuilder = __webpack_require__(523);
var WebSocketWithReconnection = __webpack_require__(522);
Date.now = Date.now || function () {
    return +new Date;
};
var PING_INTERVAL = 5000;
var RECONNECTING = 'RECONNECTING';
var CONNECTED = 'CONNECTED';
var DISCONNECTED = 'DISCONNECTED';
var Logger = console;
/**
 *
 * heartbeat: interval in ms for each heartbeat message,
 * sendCloseMessage : true / false, before closing the connection, it sends a closeSession message
 * <pre>
 * ws : {
 * 	uri : URI to conntect to,
 *  useSockJS : true (use SockJS) / false (use WebSocket) by default,
 * 	onconnected : callback method to invoke when connection is successful,
 * 	ondisconnect : callback method to invoke when the connection is lost,
 * 	onreconnecting : callback method to invoke when the client is reconnecting,
 * 	onreconnected : callback method to invoke when the client succesfully reconnects,
 * 	onerror : callback method to invoke when there is an error
 * },
 * rpc : {
 * 	requestTimeout : timeout for a request,
 * 	sessionStatusChanged: callback method for changes in session status,
 * 	mediaRenegotiation: mediaRenegotiation
 * }
 * </pre>
 */
function JsonRpcClient(configuration) {
    var self = this;
    var wsConfig = configuration.ws;
    var notReconnectIfNumLessThan = -1;
    var pingNextNum = 0;
    var enabledPings = true;
    var pingPongStarted = false;
    var pingInterval;
    var status = DISCONNECTED;
    var onreconnecting = wsConfig.onreconnecting;
    var onreconnected = wsConfig.onreconnected;
    var onconnected = wsConfig.onconnected;
    var onerror = wsConfig.onerror;
    configuration.rpc.pull = function (params, request) {
        request.reply(null, "push");
    };
    wsConfig.onreconnecting = function () {
        Logger.debug("--------- ONRECONNECTING -----------");
        if (status === RECONNECTING) {
            Logger.error("Websocket already in RECONNECTING state when receiving a new ONRECONNECTING message. Ignoring it");
            return;
        }
        status = RECONNECTING;
        if (onreconnecting) {
            onreconnecting();
        }
    };
    wsConfig.onreconnected = function () {
        Logger.debug("--------- ONRECONNECTED -----------");
        if (status === CONNECTED) {
            Logger.error("Websocket already in CONNECTED state when receiving a new ONRECONNECTED message. Ignoring it");
            return;
        }
        status = CONNECTED;
        enabledPings = true;
        updateNotReconnectIfLessThan();
        usePing();
        if (onreconnected) {
            onreconnected();
        }
    };
    wsConfig.onconnected = function () {
        Logger.debug("--------- ONCONNECTED -----------");
        if (status === CONNECTED) {
            Logger.error("Websocket already in CONNECTED state when receiving a new ONCONNECTED message. Ignoring it");
            return;
        }
        status = CONNECTED;
        enabledPings = true;
        usePing();
        if (onconnected) {
            onconnected();
        }
    };
    wsConfig.onerror = function (error) {
        Logger.debug("--------- ONERROR -----------");
        status = DISCONNECTED;
        if (onerror) {
            onerror(error);
        }
    };
    var ws = new WebSocketWithReconnection(wsConfig);
    Logger.debug('Connecting websocket to URI: ' + wsConfig.uri);
    var rpcBuilderOptions = {
        request_timeout: configuration.rpc.requestTimeout,
        ping_request_timeout: configuration.rpc.heartbeatRequestTimeout
    };
    var rpc = new RpcBuilder(RpcBuilder.packers.JsonRPC, rpcBuilderOptions, ws, function (request) {
        Logger.debug('Received request: ' + JSON.stringify(request));
        try {
            var func = configuration.rpc[request.method];
            if (func === undefined) {
                Logger.error("Method " + request.method + " not registered in client");
            }
            else {
                func(request.params, request);
            }
        }
        catch (err) {
            Logger.error('Exception processing request: ' + JSON.stringify(request));
            Logger.error(err);
        }
    });
    this.send = function (method, params, callback) {
        if (method !== 'ping') {
            Logger.debug('Request: method:' + method + " params:" + JSON.stringify(params));
        }
        var requestTime = Date.now();
        rpc.encode(method, params, function (error, result) {
            if (error) {
                try {
                    Logger.error("ERROR:" + error.message + " in Request: method:" +
                        method + " params:" + JSON.stringify(params) + " request:" +
                        error.request);
                    if (error.data) {
                        Logger.error("ERROR DATA:" + JSON.stringify(error.data));
                    }
                }
                catch (e) { }
                error.requestTime = requestTime;
            }
            if (callback) {
                if (result != undefined && result.value !== 'pong') {
                    Logger.debug('Response: ' + JSON.stringify(result));
                }
                callback(error, result);
            }
        });
    };
    function updateNotReconnectIfLessThan() {
        Logger.debug("notReconnectIfNumLessThan = " + pingNextNum + ' (old=' +
            notReconnectIfNumLessThan + ')');
        notReconnectIfNumLessThan = pingNextNum;
    }
    function sendPing() {
        if (enabledPings) {
            var params = null;
            if (pingNextNum == 0 || pingNextNum == notReconnectIfNumLessThan) {
                params = {
                    interval: configuration.heartbeat || PING_INTERVAL
                };
            }
            pingNextNum++;
            self.send('ping', params, (function (pingNum) {
                return function (error, result) {
                    if (error) {
                        Logger.debug("Error in ping request #" + pingNum + " (" +
                            error.message + ")");
                        if (pingNum > notReconnectIfNumLessThan) {
                            enabledPings = false;
                            updateNotReconnectIfLessThan();
                            Logger.debug("Server did not respond to ping message #" +
                                pingNum + ". Reconnecting... ");
                            ws.reconnectWs();
                        }
                    }
                };
            })(pingNextNum));
        }
        else {
            Logger.debug("Trying to send ping, but ping is not enabled");
        }
    }
    /*
    * If configuration.hearbeat has any value, the ping-pong will work with the interval
    * of configuration.hearbeat
    */
    function usePing() {
        if (!pingPongStarted) {
            Logger.debug("Starting ping (if configured)");
            pingPongStarted = true;
            if (configuration.heartbeat != undefined) {
                pingInterval = setInterval(sendPing, configuration.heartbeat);
                sendPing();
            }
        }
    }
    this.close = function () {
        Logger.debug("Closing jsonRpcClient explicitly by client");
        if (pingInterval != undefined) {
            Logger.debug("Clearing ping interval");
            clearInterval(pingInterval);
        }
        pingPongStarted = false;
        enabledPings = false;
        if (configuration.sendCloseMessage) {
            Logger.debug("Sending close message");
            this.send('closeSession', null, function (error, result) {
                if (error) {
                    Logger.error("Error sending close message: " + JSON.stringify(error));
                }
                ws.close();
            });
        }
        else {
            ws.close();
        }
    };
    // This method is only for testing
    this.forceClose = function (millis) {
        ws.forceClose(millis);
    };
    this.reconnect = function () {
        ws.reconnectWs();
    };
}
module.exports = JsonRpcClient;


/***/ }),

/***/ 1051:
/***/ (function(module, exports, __webpack_require__) {

/*
 * (C) Copyright 2014 Kurento (http://kurento.org/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
var WebSocketWithReconnection = __webpack_require__(522);
exports.WebSocketWithReconnection = WebSocketWithReconnection;


/***/ }),

/***/ 1052:
/***/ (function(module, exports) {

/**
 * JsonRPC 2.0 packer
 */
/**
 * Pack a JsonRPC 2.0 message
 *
 * @param {Object} message - object to be packaged. It requires to have all the
 *   fields needed by the JsonRPC 2.0 message that it's going to be generated
 *
 * @return {String} - the stringified JsonRPC 2.0 message
 */
function pack(message, id) {
    var result = {
        jsonrpc: "2.0"
    };
    // Request
    if (message.method) {
        result.method = message.method;
        if (message.params)
            result.params = message.params;
        // Request is a notification
        if (id != undefined)
            result.id = id;
    }
    else if (id != undefined) {
        if (message.error) {
            if (message.result !== undefined)
                throw new TypeError("Both result and error are defined");
            result.error = message.error;
        }
        else if (message.result !== undefined)
            result.result = message.result;
        else
            throw new TypeError("No result or error is defined");
        result.id = id;
    }
    ;
    return JSON.stringify(result);
}
;
/**
 * Unpack a JsonRPC 2.0 message
 *
 * @param {String} message - string with the content of the JsonRPC 2.0 message
 *
 * @throws {TypeError} - Invalid JsonRPC version
 *
 * @return {Object} - object filled with the JsonRPC 2.0 message content
 */
function unpack(message) {
    var result = message;
    if (typeof message === 'string' || message instanceof String) {
        result = JSON.parse(message);
    }
    // Check if it's a valid message
    var version = result.jsonrpc;
    if (version !== '2.0')
        throw new TypeError("Invalid JsonRPC version '" + version + "': " + message);
    // Response
    if (result.method == undefined) {
        if (result.id == undefined)
            throw new TypeError("Invalid message: " + message);
        var result_defined = result.result !== undefined;
        var error_defined = result.error !== undefined;
        // Check only result or error is defined, not both or none
        if (result_defined && error_defined)
            throw new TypeError("Both result and error are defined: " + message);
        if (!result_defined && !error_defined)
            throw new TypeError("No result or error is defined: " + message);
        result.ack = result.id;
        delete result.id;
    }
    // Return unpacked message
    return result;
}
;
exports.pack = pack;
exports.unpack = unpack;


/***/ }),

/***/ 1053:
/***/ (function(module, exports) {

function pack(message) {
    throw new TypeError("Not yet implemented");
}
;
function unpack(message) {
    throw new TypeError("Not yet implemented");
}
;
exports.pack = pack;
exports.unpack = unpack;


/***/ }),

/***/ 1054:
/***/ (function(module, exports, __webpack_require__) {

var JsonRPC = __webpack_require__(1052);
var XmlRPC = __webpack_require__(1053);
exports.JsonRPC = JsonRPC;
exports.XmlRPC = XmlRPC;


/***/ }),

/***/ 1055:
/***/ (function(module, exports, __webpack_require__) {

/*
 * (C) Copyright 2014-2015 Kurento (http://kurento.org/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var freeice = __webpack_require__(768);
var inherits = __webpack_require__(481);
var UAParser = __webpack_require__(1062);
var uuid = __webpack_require__(1064);
var hark = __webpack_require__(770);
var EventEmitter = __webpack_require__(480).EventEmitter;
var recursive = __webpack_require__(774).recursive.bind(undefined, true);
var sdpTranslator = __webpack_require__(1044);
var logger = window.Logger || console;
// var gUM = navigator.mediaDevices.getUserMedia || function (constraints) {
//   return new Promise(navigator.getUserMedia(constraints, function (stream) {
//     videoStream = stream
//     start()
//   }).eror(callback));
// }
try {
    __webpack_require__(773);
}
catch (error) {
    if (typeof getScreenConstraints === 'undefined') {
        logger.warn('screen sharing is not available');
        getScreenConstraints = function getScreenConstraints(sendSource, callback) {
            callback(new Error("This library is not enabled for screen sharing"));
        };
    }
}
var MEDIA_CONSTRAINTS = {
    audio: true,
    video: {
        width: 640,
        framerate: 15
    }
};
// Somehow, the UAParser constructor gets an empty window object.
// We need to pass the user agent string in order to get information
var ua = (window && window.navigator) ? window.navigator.userAgent : '';
var parser = new UAParser(ua);
var browser = parser.getBrowser();
var usePlanB = false;
if (browser.name === 'Chrome' || browser.name === 'Chromium') {
    logger.debug(browser.name + ": using SDP PlanB");
    usePlanB = true;
}
function noop(error) {
    if (error)
        logger.error(error);
}
function trackStop(track) {
    track.stop && track.stop();
}
function streamStop(stream) {
    stream.getTracks().forEach(trackStop);
}
/**
 * Returns a string representation of a SessionDescription object.
 */
var dumpSDP = function (description) {
    if (typeof description === 'undefined' || description === null) {
        return '';
    }
    return 'type: ' + description.type + '\r\n' + description.sdp;
};
function bufferizeCandidates(pc, onerror) {
    var candidatesQueue = [];
    pc.addEventListener('signalingstatechange', function () {
        if (this.signalingState === 'stable') {
            while (candidatesQueue.length) {
                var entry = candidatesQueue.shift();
                this.addIceCandidate(entry.candidate, entry.callback, entry.callback);
            }
        }
    });
    return function (candidate, callback) {
        callback = callback || onerror;
        switch (pc.signalingState) {
            case 'closed':
                callback(new Error('PeerConnection object is closed'));
                break;
            case 'stable':
                if (pc.remoteDescription) {
                    pc.addIceCandidate(candidate, callback, callback);
                    break;
                }
            default:
                candidatesQueue.push({
                    candidate: candidate,
                    callback: callback
                });
        }
    };
}
/* Simulcast utilities */
function removeFIDFromOffer(sdp) {
    var n = sdp.indexOf("a=ssrc-group:FID");
    if (n > 0) {
        return sdp.slice(0, n);
    }
    else {
        return sdp;
    }
}
function getSimulcastInfo(videoStream) {
    var videoTracks = videoStream.getVideoTracks();
    if (!videoTracks.length) {
        logger.warn('No video tracks available in the video stream');
        return '';
    }
    var lines = [
        'a=x-google-flag:conference',
        'a=ssrc-group:SIM 1 2 3',
        'a=ssrc:1 cname:localVideo',
        'a=ssrc:1 msid:' + videoStream.id + ' ' + videoTracks[0].id,
        'a=ssrc:1 mslabel:' + videoStream.id,
        'a=ssrc:1 label:' + videoTracks[0].id,
        'a=ssrc:2 cname:localVideo',
        'a=ssrc:2 msid:' + videoStream.id + ' ' + videoTracks[0].id,
        'a=ssrc:2 mslabel:' + videoStream.id,
        'a=ssrc:2 label:' + videoTracks[0].id,
        'a=ssrc:3 cname:localVideo',
        'a=ssrc:3 msid:' + videoStream.id + ' ' + videoTracks[0].id,
        'a=ssrc:3 mslabel:' + videoStream.id,
        'a=ssrc:3 label:' + videoTracks[0].id
    ];
    lines.push('');
    return lines.join('\n');
}
/**
 * Wrapper object of an RTCPeerConnection. This object is aimed to simplify the
 * development of WebRTC-based applications.
 *
 * @constructor module:kurentoUtils.WebRtcPeer
 *
 * @param {String} mode Mode in which the PeerConnection will be configured.
 *  Valid values are: 'recv', 'send', and 'sendRecv'
 * @param localVideo Video tag for the local stream
 * @param remoteVideo Video tag for the remote stream
 * @param {MediaStream} videoStream Stream to be used as primary source
 *  (typically video and audio, or only video if combined with audioStream) for
 *  localVideo and to be added as stream to the RTCPeerConnection
 * @param {MediaStream} audioStream Stream to be used as second source
 *  (typically for audio) for localVideo and to be added as stream to the
 *  RTCPeerConnection
 */
function WebRtcPeer(mode, options, callback) {
    if (!(this instanceof WebRtcPeer)) {
        return new WebRtcPeer(mode, options, callback);
    }
    WebRtcPeer.super_.call(this);
    if (options instanceof Function) {
        callback = options;
        options = undefined;
    }
    options = options || {};
    callback = (callback || noop).bind(this);
    var self = this;
    var localVideo = options.localVideo;
    var remoteVideo = options.remoteVideo;
    var videoStream = options.videoStream;
    var audioStream = options.audioStream;
    var mediaConstraints = options.mediaConstraints;
    var connectionConstraints = options.connectionConstraints;
    var pc = options.peerConnection;
    var sendSource = options.sendSource || 'webcam';
    var dataChannelConfig = options.dataChannelConfig;
    var useDataChannels = options.dataChannels || false;
    var dataChannel;
    var guid = uuid.v4();
    var configuration = recursive({
        iceServers: freeice()
    }, options.configuration);
    var onicecandidate = options.onicecandidate;
    if (onicecandidate)
        this.on('icecandidate', onicecandidate);
    var oncandidategatheringdone = options.oncandidategatheringdone;
    if (oncandidategatheringdone) {
        this.on('candidategatheringdone', oncandidategatheringdone);
    }
    var simulcast = options.simulcast;
    var multistream = options.multistream;
    var interop = new sdpTranslator.Interop();
    var candidatesQueueOut = [];
    var candidategatheringdone = false;
    Object.defineProperties(this, {
        'peerConnection': {
            get: function () {
                return pc;
            }
        },
        'id': {
            value: options.id || guid,
            writable: false
        },
        'remoteVideo': {
            get: function () {
                return remoteVideo;
            }
        },
        'localVideo': {
            get: function () {
                return localVideo;
            }
        },
        'dataChannel': {
            get: function () {
                return dataChannel;
            }
        },
        /**
         * @member {(external:ImageData|undefined)} currentFrame
         */
        'currentFrame': {
            get: function () {
                // [ToDo] Find solution when we have a remote stream but we didn't set
                // a remoteVideo tag
                if (!remoteVideo)
                    return;
                if (remoteVideo.readyState < remoteVideo.HAVE_CURRENT_DATA)
                    throw new Error('No video stream data available');
                var canvas = document.createElement('canvas');
                canvas.width = remoteVideo.videoWidth;
                canvas.height = remoteVideo.videoHeight;
                canvas.getContext('2d').drawImage(remoteVideo, 0, 0);
                return canvas;
            }
        }
    });
    // Init PeerConnection
    if (!pc) {
        pc = new RTCPeerConnection(configuration);
        if (useDataChannels && !dataChannel) {
            var dcId = 'WebRtcPeer-' + self.id;
            var dcOptions = undefined;
            if (dataChannelConfig) {
                dcId = dataChannelConfig.id || dcId;
                dcOptions = dataChannelConfig.options;
            }
            dataChannel = pc.createDataChannel(dcId, dcOptions);
            if (dataChannelConfig) {
                dataChannel.onopen = dataChannelConfig.onopen;
                dataChannel.onclose = dataChannelConfig.onclose;
                dataChannel.onmessage = dataChannelConfig.onmessage;
                dataChannel.onbufferedamountlow = dataChannelConfig.onbufferedamountlow;
                dataChannel.onerror = dataChannelConfig.onerror || noop;
            }
        }
    }
    pc.addEventListener('icecandidate', function (event) {
        var candidate = event.candidate;
        if (EventEmitter.listenerCount(self, 'icecandidate') ||
            EventEmitter.listenerCount(self, 'candidategatheringdone')) {
            if (candidate) {
                var cand;
                if (multistream && usePlanB) {
                    cand = interop.candidateToUnifiedPlan(candidate);
                }
                else {
                    cand = candidate;
                }
                self.emit('icecandidate', cand);
                candidategatheringdone = false;
            }
            else if (!candidategatheringdone) {
                self.emit('candidategatheringdone');
                candidategatheringdone = true;
            }
        }
        else if (!candidategatheringdone) {
            // Not listening to 'icecandidate' or 'candidategatheringdone' events, queue
            // the candidate until one of them is listened
            candidatesQueueOut.push(candidate);
            if (!candidate)
                candidategatheringdone = true;
        }
    });
    pc.ontrack = options.onaddstream;
    pc.onnegotiationneeded = options.onnegotiationneeded;
    this.on('newListener', function (event, listener) {
        if (event === 'icecandidate' || event === 'candidategatheringdone') {
            while (candidatesQueueOut.length) {
                var candidate = candidatesQueueOut.shift();
                if (!candidate === (event === 'candidategatheringdone')) {
                    listener(candidate);
                }
            }
        }
    });
    var addIceCandidate = bufferizeCandidates(pc);
    /**
     * Callback function invoked when an ICE candidate is received. Developers are
     * expected to invoke this function in order to complete the SDP negotiation.
     *
     * @function module:kurentoUtils.WebRtcPeer.prototype.addIceCandidate
     *
     * @param iceCandidate - Literal object with the ICE candidate description
     * @param callback - Called when the ICE candidate has been added.
     */
    this.addIceCandidate = function (iceCandidate, callback) {
        var candidate;
        if (multistream && usePlanB) {
            candidate = interop.candidateToPlanB(iceCandidate);
        }
        else {
            candidate = new RTCIceCandidate(iceCandidate);
        }
        logger.debug('Remote ICE candidate received', iceCandidate);
        callback = (callback || noop).bind(this);
        addIceCandidate(candidate, callback);
    };
    this.generateOffer = function (callback) {
        callback = callback.bind(this);
        var offerAudio = true;
        var offerVideo = true;
        // Constraints must have both blocks
        if (mediaConstraints) {
            offerAudio = (typeof mediaConstraints.audio === 'boolean') ?
                mediaConstraints.audio : true;
            offerVideo = (typeof mediaConstraints.video === 'boolean') ?
                mediaConstraints.video : true;
        }
        var browserDependantConstraints = {
            offerToReceiveAudio: (mode !== 'sendonly' && offerAudio),
            offerToReceiveVideo: (mode !== 'sendonly' && offerVideo)
        };
        //FIXME: clarify possible constraints passed to createOffer()
        /*var constraints = recursive(browserDependantConstraints,
          connectionConstraints)*/
        var constraints = browserDependantConstraints;
        logger.debug('constraints: ' + JSON.stringify(constraints));
        pc.createOffer(constraints).then(function (offer) {
            logger.debug('Created SDP offer');
            offer = mangleSdpToAddSimulcast(offer);
            return pc.setLocalDescription(offer);
        }).then(function () {
            var localDescription = pc.localDescription;
            logger.debug('Local description set', localDescription.sdp);
            if (multistream && usePlanB) {
                localDescription = interop.toUnifiedPlan(localDescription);
                logger.debug('offer::origPlanB->UnifiedPlan', dumpSDP(localDescription));
            }
            callback(null, localDescription.sdp, self.processAnswer.bind(self));
        }).catch(callback);
    };
    this.getLocalSessionDescriptor = function () {
        return pc.localDescription;
    };
    this.getRemoteSessionDescriptor = function () {
        return pc.remoteDescription;
    };
    function setRemoteVideo() {
        if (remoteVideo) {
            var stream = pc.getRemoteStreams()[0];
            var url = stream ? URL.createObjectURL(stream) : '';
            remoteVideo.pause();
            remoteVideo.src = url;
            remoteVideo.load();
            logger.debug('Remote URL:', url);
        }
    }
    this.showLocalVideo = function () {
        localVideo.src = URL.createObjectURL(videoStream);
        localVideo.muted = true;
    };
    this.send = function (data) {
        if (dataChannel && dataChannel.readyState === 'open') {
            dataChannel.send(data);
        }
        else {
            logger.warn('Trying to send data over a non-existing or closed data channel');
        }
    };
    /**
     * Callback function invoked when a SDP answer is received. Developers are
     * expected to invoke this function in order to complete the SDP negotiation.
     *
     * @function module:kurentoUtils.WebRtcPeer.prototype.processAnswer
     *
     * @param sdpAnswer - Description of sdpAnswer
     * @param callback -
     *            Invoked after the SDP answer is processed, or there is an error.
     */
    this.processAnswer = function (sdpAnswer, callback) {
        callback = (callback || noop).bind(this);
        var answer = new RTCSessionDescription({
            type: 'answer',
            sdp: sdpAnswer
        });
        if (multistream && usePlanB) {
            var planBAnswer = interop.toPlanB(answer);
            logger.debug('asnwer::planB', dumpSDP(planBAnswer));
            answer = planBAnswer;
        }
        logger.debug('SDP answer received, setting remote description');
        if (pc.signalingState === 'closed') {
            return callback('PeerConnection is closed');
        }
        pc.setRemoteDescription(answer, function () {
            setRemoteVideo();
            callback();
        }, callback);
    };
    /**
     * Callback function invoked when a SDP offer is received. Developers are
     * expected to invoke this function in order to complete the SDP negotiation.
     *
     * @function module:kurentoUtils.WebRtcPeer.prototype.processOffer
     *
     * @param sdpOffer - Description of sdpOffer
     * @param callback - Called when the remote description has been set
     *  successfully.
     */
    this.processOffer = function (sdpOffer, callback) {
        callback = callback.bind(this);
        var offer = new RTCSessionDescription({
            type: 'offer',
            sdp: sdpOffer
        });
        if (multistream && usePlanB) {
            var planBOffer = interop.toPlanB(offer);
            logger.debug('offer::planB', dumpSDP(planBOffer));
            offer = planBOffer;
        }
        logger.debug('SDP offer received, setting remote description');
        if (pc.signalingState === 'closed') {
            return callback('PeerConnection is closed');
        }
        pc.setRemoteDescription(offer).then(function () {
            return setRemoteVideo();
        }).then(function () {
            return pc.createAnswer();
        }).then(function (answer) {
            answer = mangleSdpToAddSimulcast(answer);
            logger.debug('Created SDP answer');
            return pc.setLocalDescription(answer);
        }).then(function () {
            var localDescription = pc.localDescription;
            if (multistream && usePlanB) {
                localDescription = interop.toUnifiedPlan(localDescription);
                logger.debug('answer::origPlanB->UnifiedPlan', dumpSDP(localDescription));
            }
            logger.debug('Local description set', localDescription.sdp);
            callback(null, localDescription.sdp);
        }).catch(callback);
    };
    function mangleSdpToAddSimulcast(answer) {
        if (simulcast) {
            if (browser.name === 'Chrome' || browser.name === 'Chromium') {
                logger.debug('Adding multicast info');
                answer = new RTCSessionDescription({
                    'type': answer.type,
                    'sdp': removeFIDFromOffer(answer.sdp) + getSimulcastInfo(videoStream)
                });
            }
            else {
                logger.warn('Simulcast is only available in Chrome browser.');
            }
        }
        return answer;
    }
    /**
     * This function creates the RTCPeerConnection object taking into account the
     * properties received in the constructor. It starts the SDP negotiation
     * process: generates the SDP offer and invokes the onsdpoffer callback. This
     * callback is expected to send the SDP offer, in order to obtain an SDP
     * answer from another peer.
     */
    function start() {
        if (pc.signalingState === 'closed') {
            callback('The peer connection object is in "closed" state. This is most likely due to an invocation of the dispose method before accepting in the dialogue');
        }
        if (videoStream && localVideo) {
            self.showLocalVideo();
        }
        if (videoStream) {
            pc.addStream(videoStream);
        }
        if (audioStream) {
            pc.addStream(audioStream);
        }
        // [Hack] https://code.google.com/p/chromium/issues/detail?id=443558
        var browser = parser.getBrowser();
        if (mode === 'sendonly' &&
            (browser.name === 'Chrome' || browser.name === 'Chromium') &&
            browser.major === 39) {
            mode = 'sendrecv';
        }
        callback();
    }
    if (mode !== 'recvonly' && !videoStream && !audioStream) {
        function getMedia(constraints) {
            if (constraints === undefined) {
                constraints = MEDIA_CONSTRAINTS;
            }
            navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                videoStream = stream;
                start();
            }).catch(callback);
        }
        if (sendSource === 'webcam') {
            getMedia(mediaConstraints);
        }
        else {
            getScreenConstraints(sendSource, function (error, constraints_) {
                if (error)
                    return callback(error);
                constraints = [mediaConstraints];
                constraints.unshift(constraints_);
                getMedia(recursive.apply(undefined, constraints));
            }, guid);
        }
    }
    else {
        setTimeout(start, 0);
    }
    this.on('_dispose', function () {
        if (localVideo) {
            localVideo.pause();
            localVideo.src = '';
            localVideo.load();
            //Unmute local video in case the video tag is later used for remote video
            localVideo.muted = false;
        }
        if (remoteVideo) {
            remoteVideo.pause();
            remoteVideo.src = '';
            remoteVideo.load();
        }
        self.removeAllListeners();
        if (window.cancelChooseDesktopMedia !== undefined) {
            window.cancelChooseDesktopMedia(guid);
        }
    });
}
inherits(WebRtcPeer, EventEmitter);
function createEnableDescriptor(type) {
    var method = 'get' + type + 'Tracks';
    return {
        enumerable: true,
        get: function () {
            // [ToDo] Should return undefined if not all tracks have the same value?
            if (!this.peerConnection)
                return;
            var streams = this.peerConnection.getLocalStreams();
            if (!streams.length)
                return;
            for (var i = 0, stream; stream = streams[i]; i++) {
                var tracks = stream[method]();
                for (var j = 0, track; track = tracks[j]; j++)
                    if (!track.enabled)
                        return false;
            }
            return true;
        },
        set: function (value) {
            function trackSetEnable(track) {
                track.enabled = value;
            }
            this.peerConnection.getLocalStreams().forEach(function (stream) {
                stream[method]().forEach(trackSetEnable);
            });
        }
    };
}
Object.defineProperties(WebRtcPeer.prototype, {
    'enabled': {
        enumerable: true,
        get: function () {
            return this.audioEnabled && this.videoEnabled;
        },
        set: function (value) {
            this.audioEnabled = this.videoEnabled = value;
        }
    },
    'audioEnabled': createEnableDescriptor('Audio'),
    'videoEnabled': createEnableDescriptor('Video')
});
WebRtcPeer.prototype.getLocalStream = function (index) {
    if (this.peerConnection) {
        return this.peerConnection.getLocalStreams()[index || 0];
    }
};
WebRtcPeer.prototype.getRemoteStream = function (index) {
    if (this.peerConnection) {
        return this.peerConnection.getRemoteStreams()[index || 0];
    }
};
/**
 * @description This method frees the resources used by WebRtcPeer.
 *
 * @function module:kurentoUtils.WebRtcPeer.prototype.dispose
 */
WebRtcPeer.prototype.dispose = function () {
    logger.debug('Disposing WebRtcPeer');
    var pc = this.peerConnection;
    var dc = this.dataChannel;
    try {
        if (dc) {
            if (dc.signalingState === 'closed')
                return;
            dc.close();
        }
        if (pc) {
            if (pc.signalingState === 'closed')
                return;
            pc.getLocalStreams().forEach(streamStop);
            // FIXME This is not yet implemented in firefox
            // if(videoStream) pc.removeStream(videoStream);
            // if(audioStream) pc.removeStream(audioStream);
            pc.close();
        }
    }
    catch (err) {
        logger.warn('Exception disposing webrtc peer ' + err);
    }
    this.emit('_dispose');
};
//
// Specialized child classes
//
function WebRtcPeerRecvonly(options, callback) {
    if (!(this instanceof WebRtcPeerRecvonly)) {
        return new WebRtcPeerRecvonly(options, callback);
    }
    WebRtcPeerRecvonly.super_.call(this, 'recvonly', options, callback);
}
inherits(WebRtcPeerRecvonly, WebRtcPeer);
function WebRtcPeerSendonly(options, callback) {
    if (!(this instanceof WebRtcPeerSendonly)) {
        return new WebRtcPeerSendonly(options, callback);
    }
    WebRtcPeerSendonly.super_.call(this, 'sendonly', options, callback);
}
inherits(WebRtcPeerSendonly, WebRtcPeer);
function WebRtcPeerSendrecv(options, callback) {
    if (!(this instanceof WebRtcPeerSendrecv)) {
        return new WebRtcPeerSendrecv(options, callback);
    }
    WebRtcPeerSendrecv.super_.call(this, 'sendrecv', options, callback);
}
inherits(WebRtcPeerSendrecv, WebRtcPeer);
function harkUtils(stream, options) {
    return hark(stream, options);
}
exports.bufferizeCandidates = bufferizeCandidates;
exports.WebRtcPeerRecvonly = WebRtcPeerRecvonly;
exports.WebRtcPeerSendonly = WebRtcPeerSendonly;
exports.WebRtcPeerSendrecv = WebRtcPeerSendrecv;
exports.hark = harkUtils;


/***/ }),

/***/ 1056:
/***/ (function(module, exports, __webpack_require__) {

/*
 * (C) Copyright 2014 Kurento (http://kurento.org/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
/**
 * This module contains a set of reusable components that have been found useful
 * during the development of the WebRTC applications with Kurento.
 *
 * @module kurentoUtils
 *
 * @copyright 2014 Kurento (http://kurento.org/)
 * @license ALv2
 */
var WebRtcPeer = __webpack_require__(1055);
exports.WebRtcPeer = WebRtcPeer;


/***/ }),

/***/ 1057:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/*
 * (C) Copyright 2017 OpenVidu (http://openvidu.io/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
var OpenViduInternal_1 = __webpack_require__(1059);
var Session_1 = __webpack_require__(525);
var Publisher_1 = __webpack_require__(524);
var adapter = __webpack_require__(528);
if (window) {
    window["adapter"] = adapter;
}
var OpenVidu = /** @class */ (function () {
    function OpenVidu() {
        this.openVidu = new OpenViduInternal_1.OpenViduInternal();
        console.info("'OpenVidu' initialized");
    }
    ;
    OpenVidu.prototype.initSession = function (param1, param2) {
        if (this.checkSystemRequirements()) {
            if (typeof param2 == "string") {
                return new Session_1.Session(this.openVidu.initSession(param2), this);
            }
            else {
                return new Session_1.Session(this.openVidu.initSession(param1), this);
            }
        }
        else {
            alert("Browser not supported");
        }
    };
    OpenVidu.prototype.initPublisher = function (parentId, cameraOptions, callback) {
        if (this.checkSystemRequirements()) {
            if (cameraOptions != null) {
                var cameraOptionsAux = {
                    audio: cameraOptions.audio != null ? cameraOptions.audio : true,
                    video: cameraOptions.video != null ? cameraOptions.video : true,
                    data: true,
                    mediaConstraints: this.openVidu.generateMediaConstraints(cameraOptions.quality)
                };
                cameraOptions = cameraOptionsAux;
            }
            else {
                cameraOptions = {
                    audio: true,
                    video: true,
                    data: true,
                    mediaConstraints: {
                        audio: true,
                        video: { width: { ideal: 1280 } }
                    }
                };
            }
            var publisher = new Publisher_1.Publisher(this.openVidu.initPublisherTagged(parentId, cameraOptions, callback), parentId);
            console.info("'Publisher' initialized");
            return publisher;
        }
        else {
            alert("Browser not supported");
        }
    };
    OpenVidu.prototype.checkSystemRequirements = function () {
        var browser = adapter.browserDetails.browser;
        var version = adapter.browserDetails.version;
        //Bug fix: 'navigator.userAgent' in Firefox for Ubuntu 14.04 does not return "Firefox/[version]" in the string, so version returned is null
        if ((browser == 'firefox') && (version == null)) {
            return 1;
        }
        if (((browser == 'chrome') && (version >= 28)) || ((browser == 'edge') && (version >= 12)) || ((browser == 'firefox') && (version >= 22))) {
            return 1;
        }
        else {
            return 0;
        }
    };
    OpenVidu.prototype.getDevices = function (callback) {
        navigator.mediaDevices.enumerateDevices().then(function (deviceInfos) {
            callback(null, deviceInfos);
        }).catch(function (error) {
            console.error("Error getting devices", error);
            callback(error, null);
        });
    };
    OpenVidu.prototype.enableProdMode = function () {
        console.log = function () { };
        console.debug = function () { };
        console.info = function () { };
        console.warn = function () { };
    };
    return OpenVidu;
}());
exports.OpenVidu = OpenVidu;


/***/ }),

/***/ 1058:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(1057));
__export(__webpack_require__(525));
__export(__webpack_require__(524));
__export(__webpack_require__(526));
__export(__webpack_require__(307));
__export(__webpack_require__(527));


/***/ }),

/***/ 1059:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/*
 * (C) Copyright 2017 OpenVidu (http://openvidu.io/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
var SessionInternal_1 = __webpack_require__(1060);
var Stream_1 = __webpack_require__(307);
var RpcBuilder = __webpack_require__(523);
var OpenViduInternal = /** @class */ (function () {
    function OpenViduInternal() {
        this.remoteStreams = [];
    }
    ;
    /* NEW METHODS */
    OpenViduInternal.prototype.initSession = function (sessionId) {
        console.info("'Session' initialized with 'sessionId' [" + sessionId + "]");
        this.session = new SessionInternal_1.SessionInternal(this, sessionId);
        return this.session;
    };
    OpenViduInternal.prototype.initPublisherTagged = function (parentId, cameraOptions, callback) {
        var _this = this;
        this.getCamera(cameraOptions);
        if (callback == null) {
            this.camera.requestCameraAccess(function (error, camera) {
                if (error) {
                    console.error("Error accessing the camera", error);
                }
                else {
                    _this.camera.setVideoElement(_this.cameraReady(camera, parentId));
                }
            });
            return this.camera;
        }
        else {
            this.camera.requestCameraAccess(function (error, camera) {
                if (error) {
                    callback(error);
                }
                else {
                    _this.camera.setVideoElement(_this.cameraReady(camera, parentId));
                    callback(undefined);
                }
            });
            return this.camera;
        }
    };
    OpenViduInternal.prototype.cameraReady = function (camera, parentId) {
        this.camera = camera;
        var videoElement = this.camera.playOnlyVideo(parentId, null);
        this.camera.emitStreamReadyEvent();
        return videoElement;
    };
    OpenViduInternal.prototype.initPublisher = function (cameraOptions, callback) {
        this.getCamera(cameraOptions);
        this.camera.requestCameraAccess(function (error, camera) {
            if (error)
                callback(error);
            else
                callback(undefined);
        });
    };
    OpenViduInternal.prototype.getLocalStream = function () {
        return this.camera;
    };
    OpenViduInternal.prototype.getRemoteStreams = function () {
        return this.remoteStreams;
    };
    /* NEW METHODS */
    OpenViduInternal.prototype.getWsUri = function () {
        return this.wsUri;
    };
    OpenViduInternal.prototype.setWsUri = function (wsUri) {
        this.wsUri = wsUri;
    };
    OpenViduInternal.prototype.getSecret = function () {
        return this.secret;
    };
    OpenViduInternal.prototype.setSecret = function (secret) {
        this.secret = secret;
    };
    OpenViduInternal.prototype.getOpenViduServerURL = function () {
        return 'https://' + this.wsUri.split("wss://")[1].split("/room")[0];
    };
    OpenViduInternal.prototype.getRoom = function () {
        return this.session;
    };
    OpenViduInternal.prototype.connect = function (callback) {
        this.callback = callback;
        this.initJsonRpcClient(this.wsUri);
    };
    OpenViduInternal.prototype.initJsonRpcClient = function (wsUri) {
        var config = {
            heartbeat: 3000,
            sendCloseMessage: false,
            ws: {
                uri: wsUri,
                useSockJS: false,
                onconnected: this.connectCallback.bind(this),
                ondisconnect: this.disconnectCallback.bind(this),
                onreconnecting: this.reconnectingCallback.bind(this),
                onreconnected: this.reconnectedCallback.bind(this)
            },
            rpc: {
                requestTimeout: 15000,
                //notifications
                participantJoined: this.onParticipantJoined.bind(this),
                participantPublished: this.onParticipantPublished.bind(this),
                participantUnpublished: this.onParticipantLeft.bind(this),
                participantLeft: this.onParticipantLeft.bind(this),
                participantEvicted: this.onParticipantEvicted.bind(this),
                sendMessage: this.onNewMessage.bind(this),
                iceCandidate: this.iceCandidateEvent.bind(this),
                mediaError: this.onMediaError.bind(this),
                custonNotification: this.customNotification.bind(this)
            }
        };
        this.jsonRpcClient = new RpcBuilder.clients.JsonRpcClient(config);
    };
    OpenViduInternal.prototype.customNotification = function (params) {
        if (this.isRoomAvailable()) {
            this.session.emitEvent("custom-message-received", [{ params: params }]);
        }
    };
    OpenViduInternal.prototype.connectCallback = function (error) {
        if (error) {
            this.callback(error);
        }
        else {
            this.callback(null);
        }
    };
    OpenViduInternal.prototype.isRoomAvailable = function () {
        if (this.session !== undefined && this.session instanceof SessionInternal_1.SessionInternal) {
            return true;
        }
        else {
            console.warn('Room instance not found');
            return false;
        }
    };
    OpenViduInternal.prototype.disconnectCallback = function () {
        console.warn('Websocket connection lost');
        if (this.isRoomAvailable()) {
            this.session.onLostConnection();
        }
        else {
            alert('Connection error. Please reload page.');
        }
    };
    OpenViduInternal.prototype.reconnectingCallback = function () {
        console.warn('Websocket connection lost (reconnecting)');
        if (this.isRoomAvailable()) {
            this.session.onLostConnection();
        }
        else {
            alert('Connection error. Please reload page.');
        }
    };
    OpenViduInternal.prototype.reconnectedCallback = function () {
        console.warn('Websocket reconnected');
    };
    OpenViduInternal.prototype.onParticipantJoined = function (params) {
        if (this.isRoomAvailable()) {
            this.session.onParticipantJoined(params);
        }
    };
    OpenViduInternal.prototype.onParticipantPublished = function (params) {
        if (this.isRoomAvailable()) {
            this.session.onParticipantPublished(params);
        }
    };
    OpenViduInternal.prototype.onParticipantLeft = function (params) {
        if (this.isRoomAvailable()) {
            this.session.onParticipantLeft(params);
        }
    };
    OpenViduInternal.prototype.onParticipantEvicted = function (params) {
        if (this.isRoomAvailable()) {
            this.session.onParticipantEvicted(params);
        }
    };
    OpenViduInternal.prototype.onNewMessage = function (params) {
        if (this.isRoomAvailable()) {
            this.session.onNewMessage(params);
        }
    };
    OpenViduInternal.prototype.iceCandidateEvent = function (params) {
        if (this.isRoomAvailable()) {
            this.session.recvIceCandidate(params);
        }
    };
    OpenViduInternal.prototype.onRoomClosed = function (params) {
        if (this.isRoomAvailable()) {
            this.session.onRoomClosed(params);
        }
    };
    OpenViduInternal.prototype.onMediaError = function (params) {
        if (this.isRoomAvailable()) {
            this.session.onMediaError(params);
        }
    };
    OpenViduInternal.prototype.setRpcParams = function (params) {
        this.rpcParams = params;
    };
    OpenViduInternal.prototype.sendRequest = function (method, params, callback) {
        if (params && params instanceof Function) {
            callback = params;
            params = undefined;
        }
        params = params || {};
        if (this.rpcParams && this.rpcParams !== null && this.rpcParams !== undefined) {
            for (var index in this.rpcParams) {
                if (this.rpcParams.hasOwnProperty(index)) {
                    params[index] = this.rpcParams[index];
                    console.debug('RPC param added to request {' + index + ': ' + this.rpcParams[index] + '}');
                }
            }
        }
        console.debug('Sending request: {method:"' + method + '", params: ' + JSON.stringify(params) + '}');
        this.jsonRpcClient.send(method, params, callback);
    };
    OpenViduInternal.prototype.close = function (forced) {
        if (this.isRoomAvailable()) {
            this.session.leave(forced, this.jsonRpcClient);
        }
    };
    ;
    OpenViduInternal.prototype.disconnectParticipant = function (stream) {
        if (this.isRoomAvailable()) {
            this.session.disconnect(stream);
        }
    };
    OpenViduInternal.prototype.getCamera = function (options) {
        if (this.camera) {
            return this.camera;
        }
        options = options || {
            audio: true,
            video: true,
            data: true,
            mediaConstraints: {
                audio: true,
                video: { width: { ideal: 1280 } }
            }
        };
        options.connection = this.session.getLocalParticipant();
        this.camera = new Stream_1.Stream(this, true, this.session, options);
        return this.camera;
    };
    ;
    /*joinSession(options: SessionOptions, callback: Callback<Session>) {
        
        this.session.configure(options);
        
        this.session.connect2();
        
        this.session.addEventListener('room-connected', roomEvent => callback(undefined,this.session));
        
        this.session.addEventListener('error-room', error => callback(error));
        
        return this.session;
    };*/
    //CHAT
    OpenViduInternal.prototype.sendMessage = function (room, user, message) {
        this.sendRequest('sendMessage', {
            message: message,
            userMessage: user,
            roomMessage: room
        }, function (error, response) {
            if (error) {
                console.error(error);
            }
        });
    };
    ;
    OpenViduInternal.prototype.sendCustomRequest = function (params, callback) {
        this.sendRequest('customRequest', params, callback);
    };
    ;
    OpenViduInternal.prototype.toggleLocalVideoTrack = function (activate) {
        this.getCamera().getWebRtcPeer().videoEnabled = activate;
    };
    OpenViduInternal.prototype.toggleLocalAudioTrack = function (activate) {
        this.getCamera().getWebRtcPeer().audioEnabled = activate;
    };
    OpenViduInternal.prototype.publishLocalVideoAudio = function () {
        this.toggleLocalVideoTrack(true);
        this.toggleLocalAudioTrack(true);
    };
    OpenViduInternal.prototype.unpublishLocalVideoAudio = function () {
        this.toggleLocalVideoTrack(false);
        this.toggleLocalAudioTrack(false);
    };
    OpenViduInternal.prototype.generateMediaConstraints = function (quality) {
        var mediaConstraints = {
            audio: true,
            video: {}
        };
        var w, h;
        switch (quality) {
            case 'LOW':
                w = 320;
                h = 240;
                break;
            case 'MEDIUM':
                w = 640;
                h = 480;
                break;
            case 'HIGH':
                w = 1280;
                h = 720;
                break;
            default:
                w = 640;
                h = 480;
        }
        mediaConstraints.video['width'] = { exact: w };
        mediaConstraints.video['height'] = { exact: h };
        //mediaConstraints.video['frameRate'] = { ideal: Number((<HTMLInputElement>document.getElementById('frameRate')).value) };
        return mediaConstraints;
    };
    return OpenViduInternal;
}());
exports.OpenViduInternal = OpenViduInternal;


/***/ }),

/***/ 1060:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Connection_1 = __webpack_require__(527);
var EventEmitter = __webpack_require__(135);
var SECRET_PARAM = '?secret=';
var SessionInternal = /** @class */ (function () {
    function SessionInternal(openVidu, sessionId) {
        this.openVidu = openVidu;
        this.ee = new EventEmitter();
        this.streams = {};
        this.participants = {};
        this.participantsSpeaking = [];
        this.connected = false;
        this.sessionId = this.getUrlWithoutSecret(sessionId);
        this.localParticipant = new Connection_1.Connection(this.openVidu, true, this);
        if (!this.openVidu.getWsUri()) {
            this.processOpenViduUrl(sessionId);
        }
    }
    SessionInternal.prototype.processOpenViduUrl = function (url) {
        this.openVidu.setSecret(this.getSecretFromUrl(url));
        this.openVidu.setWsUri(this.getFinalUrl(url));
    };
    SessionInternal.prototype.getSecretFromUrl = function (url) {
        var secret = '';
        if (url.indexOf(SECRET_PARAM) !== -1) {
            secret = url.substring(url.lastIndexOf(SECRET_PARAM) + SECRET_PARAM.length, url.length);
        }
        return secret;
    };
    SessionInternal.prototype.getUrlWithoutSecret = function (url) {
        if (url.indexOf(SECRET_PARAM) !== -1) {
            url = url.substring(0, url.lastIndexOf(SECRET_PARAM));
        }
        return url;
    };
    SessionInternal.prototype.getFinalUrl = function (url) {
        url = this.getUrlWithoutSecret(url).substring(0, url.lastIndexOf('/')) + '/room';
        if (url.indexOf(".ngrok.io") !== -1) {
            // OpenVidu server URL referes to a ngrok IP: secure wss protocol and delete port of URL
            url = url.replace("ws://", "wss://");
            var regex = /\.ngrok\.io:\d+/;
            url = url.replace(regex, ".ngrok.io");
        }
        else if ((url.indexOf("localhost") !== -1) || (url.indexOf("127.0.0.1") != -1)) {
            // OpenVidu server URL referes to localhost IP
        }
        return url;
    };
    /* NEW METHODS */
    SessionInternal.prototype.connect = function (token, callback) {
        var _this = this;
        this.openVidu.connect(function (error) {
            if (error) {
                callback('ERROR CONNECTING TO OPENVIDU');
            }
            else {
                if (!token) {
                    token = _this.randomToken();
                }
                var joinParams = {
                    token: token,
                    session: _this.sessionId,
                    metadata: _this.options.metadata,
                    secret: _this.openVidu.getSecret(),
                    dataChannels: false
                };
                if (_this.localParticipant) {
                    if (Object.keys(_this.localParticipant.getStreams()).some(function (streamId) {
                        return _this.streams[streamId].isDataChannelEnabled();
                    })) {
                        joinParams.dataChannels = true;
                    }
                }
                _this.openVidu.sendRequest('joinRoom', joinParams, function (error, response) {
                    if (error) {
                        callback(error);
                    }
                    else {
                        _this.connected = true;
                        var exParticipants = response.value;
                        // IMPORTANT: Update connectionId with value send by server
                        _this.localParticipant.connectionId = response.id;
                        _this.participants[response.id] = _this.localParticipant;
                        var roomEvent = {
                            participants: new Array(),
                            streams: new Array()
                        };
                        var length_1 = exParticipants.length;
                        for (var i = 0; i < length_1; i++) {
                            var connection = new Connection_1.Connection(_this.openVidu, false, _this, exParticipants[i]);
                            connection.creationTime = new Date().getTime();
                            _this.participants[connection.connectionId] = connection;
                            roomEvent.participants.push(connection);
                            var streams = connection.getStreams();
                            for (var key in streams) {
                                roomEvent.streams.push(streams[key]);
                                if (_this.subscribeToStreams) {
                                    streams[key].subscribe();
                                }
                            }
                        }
                        // Update local Connection object properties with values returned by server
                        _this.localParticipant.data = response.metadata;
                        _this.localParticipant.creationTime = new Date().getTime();
                        // Updates the value of property 'connection' in Session object
                        _this.ee.emitEvent('update-connection-object', [{ connection: _this.localParticipant }]);
                        // Own connection created event
                        _this.ee.emitEvent('connectionCreated', [{ connection: _this.localParticipant }]);
                        // One connection created event for each existing connection in the session
                        for (var _i = 0, _a = roomEvent.participants; _i < _a.length; _i++) {
                            var part = _a[_i];
                            _this.ee.emitEvent('connectionCreated', [{ connection: part }]);
                        }
                        //if (this.subscribeToStreams) {
                        for (var _b = 0, _c = roomEvent.streams; _b < _c.length; _b++) {
                            var stream = _c[_b];
                            _this.ee.emitEvent('streamCreated', [{ stream: stream }]);
                            // Adding the remote stream to the OpenVidu object
                            _this.openVidu.getRemoteStreams().push(stream);
                        }
                        //}
                        callback(undefined);
                    }
                });
            }
        });
    };
    SessionInternal.prototype.publish = function () {
        this.openVidu.getCamera().publish();
    };
    /* NEW METHODS */
    SessionInternal.prototype.configure = function (options) {
        this.options = options;
        this.id = options.sessionId;
        this.subscribeToStreams = options.subscribeToStreams == null ? true : options.subscribeToStreams;
        this.updateSpeakerInterval = options.updateSpeakerInterval || 1500;
        this.thresholdSpeaker = options.thresholdSpeaker || -50;
        this.activateUpdateMainSpeaker();
    };
    SessionInternal.prototype.getId = function () {
        return this.id;
    };
    SessionInternal.prototype.getSessionId = function () {
        return this.sessionId;
    };
    SessionInternal.prototype.activateUpdateMainSpeaker = function () {
        var _this = this;
        setInterval(function () {
            if (_this.participantsSpeaking.length > 0) {
                _this.ee.emitEvent('update-main-speaker', [{
                        participantId: _this.participantsSpeaking[_this.participantsSpeaking.length - 1]
                    }]);
            }
        }, this.updateSpeakerInterval);
    };
    SessionInternal.prototype.getLocalParticipant = function () {
        return this.localParticipant;
    };
    SessionInternal.prototype.addEventListener = function (eventName, listener) {
        this.ee.on(eventName, listener);
    };
    SessionInternal.prototype.addOnceEventListener = function (eventName, listener) {
        this.ee.once(eventName, listener);
    };
    SessionInternal.prototype.removeListener = function (eventName, listener) {
        this.ee.off(eventName, listener);
    };
    SessionInternal.prototype.removeEvent = function (eventName) {
        this.ee.removeEvent(eventName);
    };
    SessionInternal.prototype.emitEvent = function (eventName, eventsArray) {
        this.ee.emitEvent(eventName, eventsArray);
    };
    SessionInternal.prototype.subscribe = function (stream) {
        stream.subscribe();
    };
    SessionInternal.prototype.unsuscribe = function (stream) {
        console.info("Unsubscribing from " + stream.getId());
        this.openVidu.sendRequest('unsubscribeFromVideo', {
            sender: stream.getId()
        }, function (error, response) {
            if (error) {
                console.error("Error unsubscribing from Subscriber", error);
            }
            else {
                console.info("Unsubscribed correctly from " + stream.getId());
            }
        });
    };
    SessionInternal.prototype.onParticipantPublished = function (options) {
        options.metadata = this.participants[options.id].data;
        // Get the existing Connection created on 'onParticipantJoined' for
        // existing participants or create a new one for new participants
        var connection = this.participants[options.id];
        if (connection) {
            // Update existing Connection
            connection.options = options;
            connection.initStreams(options);
        }
        else {
            // Create new Connection
            connection = new Connection_1.Connection(this.openVidu, false, this, options);
        }
        var pid = connection.connectionId;
        if (!(pid in this.participants)) {
            console.debug("Remote Connection not found in connections list by its id [" + pid + "]");
        }
        else {
            console.debug("Remote Connection found in connections list by its id [" + pid + "]");
        }
        connection.creationTime = this.participants[pid].creationTime;
        this.participants[pid] = connection;
        this.ee.emitEvent('participant-published', [{ connection: connection }]);
        var streams = connection.getStreams();
        for (var key in streams) {
            var stream = streams[key];
            if (this.subscribeToStreams) {
                stream.subscribe();
            }
            this.ee.emitEvent('streamCreated', [{ stream: stream }]);
            // Adding the remote stream to the OpenVidu object
            this.openVidu.getRemoteStreams().push(stream);
        }
    };
    SessionInternal.prototype.onParticipantJoined = function (msg) {
        var connection = new Connection_1.Connection(this.openVidu, false, this, msg);
        connection.creationTime = new Date().getTime();
        var pid = connection.connectionId;
        if (!(pid in this.participants)) {
            this.participants[pid] = connection;
        }
        else {
            //use existing so that we don't lose streams info
            console.warn("Connection already exists in connections list with " +
                "the same connectionId, old:", this.participants[pid], ", joined now:", connection);
            connection = this.participants[pid];
        }
        this.ee.emitEvent('participant-joined', [{
                connection: connection
            }]);
        this.ee.emitEvent('connectionCreated', [{
                connection: connection
            }]);
    };
    SessionInternal.prototype.onParticipantLeft = function (msg) {
        var _this = this;
        var connection = this.participants[msg.name];
        if (connection !== undefined) {
            delete this.participants[msg.name];
            this.ee.emitEvent('participant-left', [{
                    connection: connection
                }]);
            var streams = connection.getStreams();
            for (var key in streams) {
                this.ee.emitEvent('streamDestroyed', [{
                        stream: streams[key],
                        preventDefault: function () { _this.ee.removeEvent('stream-destroyed-default'); }
                    }]);
                this.ee.emitEvent('stream-destroyed-default', [{
                        stream: streams[key]
                    }]);
                // Deleting the removed stream from the OpenVidu object
                var index = this.openVidu.getRemoteStreams().indexOf(streams[key]);
                this.openVidu.getRemoteStreams().splice(index, 1);
            }
            connection.dispose();
            this.ee.emitEvent('connectionDestroyed', [{
                    connection: connection
                }]);
        }
        else {
            console.warn("Participant " + msg.name
                + " unknown. Participants: "
                + JSON.stringify(this.participants));
        }
    };
    ;
    SessionInternal.prototype.onParticipantEvicted = function (msg) {
        this.ee.emitEvent('participant-evicted', [{
                localParticipant: this.localParticipant
            }]);
    };
    ;
    SessionInternal.prototype.onNewMessage = function (msg) {
        console.info("New message: " + JSON.stringify(msg));
        var room = msg.room;
        var user = msg.user;
        var message = msg.message;
        if (user !== undefined) {
            this.ee.emitEvent('newMessage', [{
                    room: room,
                    user: user,
                    message: message
                }]);
        }
        else {
            console.warn("User undefined in new message:", msg);
        }
    };
    SessionInternal.prototype.recvIceCandidate = function (msg) {
        var candidate = {
            candidate: msg.candidate,
            sdpMid: msg.sdpMid,
            sdpMLineIndex: msg.sdpMLineIndex
        };
        var connection = this.participants[msg.endpointName];
        if (!connection) {
            console.error("Participant not found for endpoint " +
                msg.endpointName + ". Ice candidate will be ignored.", candidate);
            return;
        }
        var streams = connection.getStreams();
        var _loop_1 = function (key) {
            var stream = streams[key];
            stream.getWebRtcPeer().addIceCandidate(candidate, function (error) {
                if (error) {
                    console.error("Error adding candidate for " + key
                        + " stream of endpoint " + msg.endpointName
                        + ": " + error);
                }
            });
        };
        for (var key in streams) {
            _loop_1(key);
        }
    };
    SessionInternal.prototype.onRoomClosed = function (msg) {
        console.info("Room closed: " + JSON.stringify(msg));
        var room = msg.room;
        if (room !== undefined) {
            this.ee.emitEvent('room-closed', [{
                    room: room
                }]);
        }
        else {
            console.warn("Room undefined in on room closed", msg);
        }
    };
    SessionInternal.prototype.onLostConnection = function () {
        if (!this.connected) {
            console.warn('Not connected to room: if you are not debugging, this is probably a certificate error');
            if (window.confirm('If you are not debugging, this is probably a certificate error at \"' + this.openVidu.getOpenViduServerURL() + '\"\n\nClick OK to navigate and accept it')) {
                location.assign(this.openVidu.getOpenViduServerURL() + '/accept-certificate');
            }
            ;
            return;
        }
        console.warn('Lost connection in Session ' + this.id);
        var room = this.id;
        if (room !== undefined) {
            this.ee.emitEvent('lost-connection', [{ room: room }]);
        }
        else {
            console.warn('Room undefined when lost connection');
        }
    };
    SessionInternal.prototype.onMediaError = function (params) {
        console.error("Media error: " + JSON.stringify(params));
        var error = params.error;
        if (error) {
            this.ee.emitEvent('error-media', [{
                    error: error
                }]);
        }
        else {
            console.warn("Received undefined media error. Params:", params);
        }
    };
    /*
     * forced means the user was evicted, no need to send the 'leaveRoom' request
     */
    SessionInternal.prototype.leave = function (forced, jsonRpcClient) {
        forced = !!forced;
        console.info("Leaving Session (forced=" + forced + ")");
        if (this.connected && !forced) {
            this.openVidu.sendRequest('leaveRoom', function (error, response) {
                if (error) {
                    console.error(error);
                }
                jsonRpcClient.close();
            });
        }
        else {
            jsonRpcClient.close();
        }
        this.connected = false;
        if (this.participants) {
            for (var pid in this.participants) {
                this.participants[pid].dispose();
                delete this.participants[pid];
            }
        }
    };
    SessionInternal.prototype.disconnect = function (stream) {
        var connection = stream.getParticipant();
        if (!connection) {
            console.error("Stream to disconnect has no participant", stream);
            return;
        }
        delete this.participants[connection.connectionId];
        connection.dispose();
        if (connection === this.localParticipant) {
            console.info("Unpublishing my media (I'm " + connection.connectionId + ")");
            delete this.localParticipant;
            this.openVidu.sendRequest('unpublishVideo', function (error, response) {
                if (error) {
                    console.error(error);
                }
                else {
                    console.info("Media unpublished correctly");
                }
            });
        }
        else {
            this.unsuscribe(stream);
        }
    };
    SessionInternal.prototype.unpublish = function (stream) {
        var connection = stream.getParticipant();
        if (!connection) {
            console.error("Stream to disconnect has no participant", stream);
            return;
        }
        if (connection === this.localParticipant) {
            delete this.participants[connection.connectionId];
            connection.dispose();
            console.info("Unpublishing my media (I'm " + connection.connectionId + ")");
            delete this.localParticipant;
            this.openVidu.sendRequest('unpublishVideo', function (error, response) {
                if (error) {
                    console.error(error);
                }
                else {
                    console.info("Media unpublished correctly");
                }
            });
        }
    };
    SessionInternal.prototype.getStreams = function () {
        return this.streams;
    };
    SessionInternal.prototype.addParticipantSpeaking = function (participantId) {
        this.participantsSpeaking.push(participantId);
    };
    SessionInternal.prototype.removeParticipantSpeaking = function (participantId) {
        var pos = -1;
        for (var i = 0; i < this.participantsSpeaking.length; i++) {
            if (this.participantsSpeaking[i] == participantId) {
                pos = i;
                break;
            }
        }
        if (pos != -1) {
            this.participantsSpeaking.splice(pos, 1);
        }
    };
    SessionInternal.prototype.stringClientMetadata = function (metadata) {
        if (!(typeof metadata === 'string')) {
            return JSON.stringify(metadata);
        }
        else {
            return metadata;
        }
    };
    SessionInternal.prototype.randomToken = function () {
        return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    };
    return SessionInternal;
}());
exports.SessionInternal = SessionInternal;


/***/ }),

/***/ 1077:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(530);


/***/ }),

/***/ 277:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__authentication_service__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Rx__ = __webpack_require__(483);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_Rx__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LessonService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var LessonService = (function () {
    function LessonService(http, authenticationService) {
        this.http = http;
        this.authenticationService = authenticationService;
        this.url = 'api-lessons';
    }
    LessonService.prototype.getLessons = function (user) {
        var _this = this;
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: headers });
        return this.http.get(this.url + '/user/' + user.id, options) // Must send userId
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    LessonService.prototype.getLesson = function (lessonId) {
        var _this = this;
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: headers });
        return this.http.get(this.url + '/lesson/' + lessonId, options) // Must send userId
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    // POST new lesson. On success returns the created lesson
    LessonService.prototype.newLesson = function (lesson) {
        var _this = this;
        var body = JSON.stringify(lesson);
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: headers });
        return this.http.post(this.url + '/new', body, options)
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    // PUT existing lesson. On success returns the updated lesson
    LessonService.prototype.editLesson = function (lesson) {
        var _this = this;
        var body = JSON.stringify(lesson);
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: headers });
        return this.http.put(this.url + '/edit', body, options)
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    // DELETE existing lesson. On success returns the deleted lesson (simplified version)
    LessonService.prototype.deleteLesson = function (lessonId) {
        var _this = this;
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: headers });
        return this.http.delete(this.url + '/delete/' + lessonId, options)
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    // PUT existing lesson, modifying its attenders (adding them). On success returns the updated lesson.attenders array
    LessonService.prototype.addLessonAttenders = function (lessonId, userEmails) {
        var _this = this;
        var body = JSON.stringify(userEmails);
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: headers });
        return this.http.put(this.url + '/edit/add-attenders/lesson/' + lessonId, body, options)
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    // PUT existing lesson, modifying its attenders (deleting them). On success returns the updated lesson.attenders array
    LessonService.prototype.deleteLessonAttenders = function (lesson) {
        var _this = this;
        var body = JSON.stringify(lesson);
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: headers });
        return this.http.put(this.url + '/edit/delete-attenders', body, options)
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    LessonService.prototype.obtainLocalLesson = function (id) {
        return this.authenticationService.getCurrentUser().lessons.find(function (lesson) { return lesson.id == id; });
    };
    LessonService.prototype.handleError = function (error) {
        console.error(error);
        return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw('Server error (' + error.status + '): ' + error.text());
    };
    LessonService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__authentication_service__["a" /* AuthenticationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__authentication_service__["a" /* AuthenticationService */]) === 'function' && _b) || Object])
    ], LessonService);
    return LessonService;
    var _a, _b;
}());
//# sourceMappingURL=lesson.service.js.map

/***/ }),

/***/ 278:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__authentication_service__ = __webpack_require__(42);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VideoSessionService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var VideoSessionService = (function () {
    function VideoSessionService(http, authenticationService) {
        this.http = http;
        this.authenticationService = authenticationService;
        this.url = 'api-sessions';
    }
    // Returns {0: sessionId}
    VideoSessionService.prototype.createSession = function (lessonId) {
        var _this = this;
        var body = JSON.stringify(lessonId);
        return this.http.post(this.url + '/create-session', body)
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    // Returns {0: sessionId, 1: token}
    VideoSessionService.prototype.generateToken = function (lessonId) {
        var _this = this;
        var body = JSON.stringify(lessonId);
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json' });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: headers });
        return this.http.post(this.url + '/generate-token', body, options)
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    VideoSessionService.prototype.removeUser = function (lessonId) {
        var _this = this;
        var body = JSON.stringify(lessonId);
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json' });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: headers });
        return this.http.post(this.url + '/remove-user', body, options)
            .map(function (response) { return response; })
            .catch(function (error) { return _this.handleError(error); });
    };
    VideoSessionService.prototype.handleError = function (error) {
        console.error(error);
        return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw('Server error (' + error.status + '): ' + error.text());
    };
    VideoSessionService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__authentication_service__["a" /* AuthenticationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__authentication_service__["a" /* AuthenticationService */]) === 'function' && _b) || Object])
    ], VideoSessionService);
    return VideoSessionService;
    var _a, _b;
}());
//# sourceMappingURL=video-session.service.js.map

/***/ }),

/***/ 307:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = __webpack_require__(135);
var kurentoUtils = __webpack_require__(1056);
var adapter = __webpack_require__(528);
if (window) {
    window["adapter"] = adapter;
}
function jq(id) {
    return id.replace(/(@|:|\.|\[|\]|,)/g, "\\$1");
}
function show(id) {
    document.getElementById(jq(id)).style.display = 'block';
}
function hide(id) {
    document.getElementById(jq(id)).style.display = 'none';
}
var Stream = /** @class */ (function () {
    function Stream(openVidu, local, room, options) {
        var _this = this;
        this.openVidu = openVidu;
        this.local = local;
        this.room = room;
        this.ee = new EventEmitter();
        this.videoElements = [];
        this.elements = [];
        this.showMyRemote = false;
        this.localMirrored = false;
        this.chanId = 0;
        this.dataChannelOpened = false;
        this.audioOnly = false;
        this.isReady = false;
        this.isVideoELementCreated = false;
        this.accessIsAllowed = false;
        this.accessIsDenied = false;
        if (options.id) {
            this.id = options.id;
        }
        else {
            this.id = "webcam";
        }
        this.connection = options.connection;
        this.recvVideo = options.recvVideo;
        this.recvAudio = options.recvAudio;
        this.dataChannel = options.data || false;
        this.sendVideo = options.video;
        this.sendAudio = options.audio;
        this.mediaConstraints = options.mediaConstraints;
        this.audioOnly = options.audioOnly || false;
        this.addEventListener('src-added', function (srcEvent) {
            _this.videoSrcObject = srcEvent.srcObject;
            if (_this.video)
                _this.video.srcObject = srcEvent.srcObject;
            console.debug("Video srcObject [" + srcEvent.srcObject + "] added to stream [" + _this.getId() + "]");
        });
    }
    Stream.prototype.emitSrcEvent = function (wrstream) {
        this.ee.emitEvent('src-added', [{
                srcObject: wrstream
            }]);
    };
    Stream.prototype.emitStreamReadyEvent = function () {
        this.ee.emitEvent('stream-ready'), [{}];
    };
    Stream.prototype.getVideoSrcObject = function () {
        return this.videoSrcObject;
    };
    Stream.prototype.removeVideo = function (parentElement) {
        if (typeof parentElement === "string") {
            document.getElementById(parentElement).removeChild(this.video);
        }
        else if (parentElement instanceof Element) {
            parentElement.removeChild(this.video);
        }
        else if (!parentElement) {
            if (document.getElementById(this.parentId)) {
                document.getElementById(this.parentId).removeChild(this.video);
            }
        }
    };
    Stream.prototype.getVideoElement = function () {
        return this.video;
    };
    Stream.prototype.setVideoElement = function (video) {
        this.video = video;
    };
    Stream.prototype.getRecvVideo = function () {
        return this.recvVideo;
    };
    Stream.prototype.getRecvAudio = function () {
        return this.recvAudio;
    };
    Stream.prototype.subscribeToMyRemote = function () {
        this.showMyRemote = true;
    };
    Stream.prototype.displayMyRemote = function () {
        return this.showMyRemote;
    };
    Stream.prototype.mirrorLocalStream = function (wr) {
        this.showMyRemote = true;
        this.localMirrored = true;
        if (wr) {
            this.wrStream = wr;
            this.emitSrcEvent(this.wrStream);
        }
    };
    Stream.prototype.isLocalMirrored = function () {
        return this.localMirrored;
    };
    Stream.prototype.getChannelName = function () {
        return this.getId() + '_' + this.chanId++;
    };
    Stream.prototype.isDataChannelEnabled = function () {
        return this.dataChannel;
    };
    Stream.prototype.isDataChannelOpened = function () {
        return this.dataChannelOpened;
    };
    Stream.prototype.onDataChannelOpen = function (event) {
        console.debug('Data channel is opened');
        this.dataChannelOpened = true;
    };
    Stream.prototype.onDataChannelClosed = function (event) {
        console.debug('Data channel is closed');
        this.dataChannelOpened = false;
    };
    Stream.prototype.sendData = function (data) {
        if (this.wp === undefined) {
            throw new Error('WebRTC peer has not been created yet');
        }
        if (!this.dataChannelOpened) {
            throw new Error('Data channel is not opened');
        }
        console.info("Sending through data channel: " + data);
        this.wp.send(data);
    };
    Stream.prototype.getWrStream = function () {
        return this.wrStream;
    };
    Stream.prototype.getWebRtcPeer = function () {
        return this.wp;
    };
    Stream.prototype.addEventListener = function (eventName, listener) {
        this.ee.addListener(eventName, listener);
    };
    Stream.prototype.addOnceEventListener = function (eventName, listener) {
        this.ee.addOnceListener(eventName, listener);
    };
    Stream.prototype.removeListener = function (eventName) {
        this.ee.removeAllListeners(eventName);
    };
    Stream.prototype.showSpinner = function (spinnerParentId) {
        var progress = document.createElement('div');
        progress.id = 'progress-' + this.getId();
        progress.style.background = "center transparent url('img/spinner.gif') no-repeat";
        var spinnerParent = document.getElementById(spinnerParentId);
        if (spinnerParent) {
            spinnerParent.appendChild(progress);
        }
    };
    Stream.prototype.hideSpinner = function (spinnerId) {
        spinnerId = (spinnerId === undefined) ? this.getId() : spinnerId;
        hide('progress-' + spinnerId);
    };
    Stream.prototype.playOnlyVideo = function (parentElement, thumbnailId) {
        // TO-DO: check somehow if the stream is audio only, so the element created is <audio> instead of <video>
        var _this = this;
        this.video = document.createElement('video');
        this.video.id = (this.local ? 'local-' : 'remote-') + 'video-' + this.getId();
        this.video.autoplay = true;
        this.video.controls = false;
        this.video.srcObject = this.videoSrcObject;
        this.videoElements.push({
            thumb: thumbnailId,
            video: this.video
        });
        if (this.local && !this.displayMyRemote()) {
            this.video.muted = true;
            this.video.onplay = function () {
                console.info("Local 'Stream' with id [" + _this.getId() + "] video is now playing");
                _this.ee.emitEvent('video-is-playing', [{
                        element: _this.video
                    }]);
            };
        }
        else {
            this.video.title = this.getId();
        }
        if (typeof parentElement === "string") {
            this.parentId = parentElement;
            var parentElementDom = document.getElementById(parentElement);
            if (parentElementDom) {
                this.video = parentElementDom.appendChild(this.video);
                this.ee.emitEvent('video-element-created-by-stream', [{
                        element: this.video
                    }]);
                this.isVideoELementCreated = true;
            }
        }
        else {
            this.parentId = parentElement.id;
            this.video = parentElement.appendChild(this.video);
        }
        this.ee.emitEvent('stream-created-by-publisher');
        this.isReady = true;
        return this.video;
    };
    Stream.prototype.playThumbnail = function (thumbnailId) {
        var container = document.createElement('div');
        container.className = "participant";
        container.id = this.getId();
        var thumbnail = document.getElementById(thumbnailId);
        if (thumbnail) {
            thumbnail.appendChild(container);
        }
        this.elements.push(container);
        var name = document.createElement('div');
        container.appendChild(name);
        var userName = this.getId().replace('_webcam', '');
        if (userName.length >= 16) {
            userName = userName.substring(0, 16) + "...";
        }
        name.appendChild(document.createTextNode(userName));
        name.id = "name-" + this.getId();
        name.className = "name";
        name.title = this.getId();
        this.showSpinner(thumbnailId);
        return this.playOnlyVideo(container, thumbnailId);
    };
    Stream.prototype.getIdInParticipant = function () {
        return this.id;
    };
    Stream.prototype.getParticipant = function () {
        return this.connection;
    };
    Stream.prototype.getId = function () {
        return this.connection.connectionId + "_" + this.id;
    };
    Stream.prototype.getRTCPeerConnection = function () {
        return this.getWebRtcPeer().peerConnection;
    };
    Stream.prototype.requestCameraAccess = function (callback) {
        var _this = this;
        this.connection.addStream(this);
        var constraints = this.mediaConstraints;
        /*let constraints2 = {
            audio: true,
            video: {
                width: {
                    ideal: 1280
                },
                frameRate: {
                    ideal: 15
                }
            }
        };*/
        this.userMediaHasVideo(function (hasVideo) {
            if (!hasVideo) {
                constraints.video = false;
                _this.sendVideo = false;
                _this.audioOnly = true;
                _this.requestCameraAccesAux(constraints, callback);
            }
            else {
                _this.requestCameraAccesAux(constraints, callback);
            }
        });
    };
    Stream.prototype.requestCameraAccesAux = function (constraints, callback) {
        var _this = this;
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (userStream) {
            _this.cameraAccessSuccess(userStream, callback);
        })
            .catch(function (error) {
            //  Try to ask for microphone only
            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                .then(function (userStream) {
                constraints.video = false;
                _this.sendVideo = false;
                _this.audioOnly = true;
                _this.cameraAccessSuccess(userStream, callback);
            })
                .catch(function (error) {
                _this.accessIsDenied = true;
                _this.accessIsAllowed = false;
                _this.ee.emitEvent('access-denied-by-publisher');
                console.error("Access denied", error);
                callback(error, _this);
            });
        });
    };
    Stream.prototype.cameraAccessSuccess = function (userStream, callback) {
        this.accessIsAllowed = true;
        this.accessIsDenied = false;
        this.ee.emitEvent('access-allowed-by-publisher');
        if (userStream.getAudioTracks()[0] != null) {
            userStream.getAudioTracks()[0].enabled = this.sendAudio;
        }
        if (userStream.getVideoTracks()[0] != null) {
            userStream.getVideoTracks()[0].enabled = this.sendVideo;
        }
        this.wrStream = userStream;
        this.emitSrcEvent(this.wrStream);
        callback(undefined, this);
    };
    Stream.prototype.userMediaHasVideo = function (callback) {
        navigator.mediaDevices.enumerateDevices().then(function (mediaDevices) {
            var videoInput = mediaDevices.filter(function (deviceInfo) {
                return deviceInfo.kind === 'videoinput';
            })[0];
            callback(videoInput != null);
        });
    };
    Stream.prototype.publishVideoCallback = function (error, sdpOfferParam, wp) {
        var _this = this;
        if (error) {
            return console.error("(publish) SDP offer error: "
                + JSON.stringify(error));
        }
        console.debug("Sending SDP offer to publish as "
            + this.getId(), sdpOfferParam);
        this.openVidu.sendRequest("publishVideo", {
            sdpOffer: sdpOfferParam,
            doLoopback: this.displayMyRemote() || false,
            audioOnly: this.audioOnly
        }, function (error, response) {
            if (error) {
                console.error("Error on publishVideo: " + JSON.stringify(error));
            }
            else {
                _this.processSdpAnswer(response.sdpAnswer);
                console.info("'Publisher' succesfully published to session");
            }
        });
    };
    Stream.prototype.startVideoCallback = function (error, sdpOfferParam, wp) {
        var _this = this;
        if (error) {
            return console.error("(subscribe) SDP offer error: "
                + JSON.stringify(error));
        }
        console.debug("Sending SDP offer to subscribe to "
            + this.getId(), sdpOfferParam);
        this.openVidu.sendRequest("receiveVideoFrom", {
            sender: this.getId(),
            sdpOffer: sdpOfferParam
        }, function (error, response) {
            if (error) {
                console.error("Error on recvVideoFrom: " + JSON.stringify(error));
            }
            else {
                _this.processSdpAnswer(response.sdpAnswer);
            }
        });
    };
    Stream.prototype.initWebRtcPeer = function (sdpOfferCallback) {
        var _this = this;
        if (this.local) {
            var userMediaConstraints = {
                audio: this.sendAudio,
                video: this.sendVideo
            };
            var options = {
                videoStream: this.wrStream,
                mediaConstraints: userMediaConstraints,
                onicecandidate: this.connection.sendIceCandidate.bind(this.connection),
            };
            if (this.dataChannel) {
                options.dataChannelConfig = {
                    id: this.getChannelName(),
                    onopen: this.onDataChannelOpen,
                    onclose: this.onDataChannelClosed
                };
                options.dataChannels = true;
            }
            if (this.displayMyRemote()) {
                this.wp = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function (error) {
                    if (error) {
                        return console.error(error);
                    }
                    _this.wp.generateOffer(sdpOfferCallback.bind(_this));
                });
            }
            else {
                this.wp = kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, function (error) {
                    if (error) {
                        return console.error(error);
                    }
                    _this.wp.generateOffer(sdpOfferCallback.bind(_this));
                });
            }
        }
        else {
            var offerConstraints = {
                audio: this.recvAudio,
                video: !this.audioOnly
            };
            console.debug("'Session.subscribe(Stream)' called. Constraints of generate SDP offer", offerConstraints);
            var options = {
                onicecandidate: this.connection.sendIceCandidate.bind(this.connection),
                mediaConstraints: offerConstraints
            };
            this.wp = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, function (error) {
                if (error) {
                    return console.error(error);
                }
                _this.wp.generateOffer(sdpOfferCallback.bind(_this));
            });
        }
        console.debug("Waiting for SDP offer to be generated ("
            + (this.local ? "local" : "remote") + " 'Stream': " + this.getId() + ")");
    };
    Stream.prototype.publish = function () {
        var _this = this;
        // FIXME: Throw error when stream is not local
        if (this.isReady) {
            this.initWebRtcPeer(this.publishVideoCallback);
        }
        else {
            this.ee.once('stream-ready', function (streamEvent) {
                _this.publish();
            });
        }
        // FIXME: Now we have coupled connecting to a room and adding a
        // stream to this room. But in the new API, there are two steps.
        // This is the second step. For now, it do nothing.
    };
    Stream.prototype.subscribe = function () {
        // FIXME: In the current implementation all participants are subscribed
        // automatically to all other participants. We use this method only to
        // negotiate SDP
        this.initWebRtcPeer(this.startVideoCallback);
    };
    Stream.prototype.processSdpAnswer = function (sdpAnswer) {
        var _this = this;
        var answer = new RTCSessionDescription({
            type: 'answer',
            sdp: sdpAnswer,
        });
        console.debug(this.getId() + ": set peer connection with recvd SDP answer", sdpAnswer);
        var participantId = this.getId();
        var pc = this.wp.peerConnection;
        pc.setRemoteDescription(answer, function () {
            // Avoids to subscribe to your own stream remotely 
            // except when showMyRemote is true
            if (!_this.local || _this.displayMyRemote()) {
                _this.wrStream = pc.getRemoteStreams()[0];
                console.debug("Peer remote stream", _this.wrStream);
                if (_this.wrStream != undefined) {
                    _this.emitSrcEvent(_this.wrStream);
                    _this.speechEvent = kurentoUtils.WebRtcPeer.hark(_this.wrStream, { threshold: _this.room.thresholdSpeaker });
                    _this.speechEvent.on('speaking', function () {
                        _this.room.addParticipantSpeaking(participantId);
                        _this.room.emitEvent('stream-speaking', [{
                                participantId: participantId
                            }]);
                    });
                    _this.speechEvent.on('stopped_speaking', function () {
                        _this.room.removeParticipantSpeaking(participantId);
                        _this.room.emitEvent('stream-stopped-speaking', [{
                                participantId: participantId
                            }]);
                    });
                }
                for (var _i = 0, _a = _this.videoElements; _i < _a.length; _i++) {
                    var videoElement = _a[_i];
                    var thumbnailId = videoElement.thumb;
                    var video = videoElement.video;
                    video.srcObject = _this.wrStream;
                    video.onplay = function () {
                        if (_this.local && _this.displayMyRemote()) {
                            console.info("Your own remote 'Stream' with id [" + _this.getId() + "] video is now playing");
                            _this.ee.emitEvent('remote-video-is-playing', [{
                                    element: _this.video
                                }]);
                        }
                        else if (!_this.local && !_this.displayMyRemote()) {
                            console.info("Remote 'Stream' with id [" + _this.getId() + "] video is now playing");
                            _this.ee.emitEvent('video-is-playing', [{
                                    element: _this.video
                                }]);
                        }
                        //show(thumbnailId);
                        //this.hideSpinner(this.getId());
                    };
                }
                _this.room.emitEvent('stream-subscribed', [{
                        stream: _this
                    }]);
            }
        }, function (error) {
            console.error(_this.getId() + ": Error setting SDP to the peer connection: "
                + JSON.stringify(error));
        });
    };
    Stream.prototype.unpublish = function () {
        if (this.wp) {
            this.wp.dispose();
        }
        else {
            if (this.wrStream) {
                this.wrStream.getAudioTracks().forEach(function (track) {
                    track.stop && track.stop();
                });
                this.wrStream.getVideoTracks().forEach(function (track) {
                    track.stop && track.stop();
                });
            }
        }
        if (this.speechEvent) {
            this.speechEvent.stop();
        }
        console.info(this.getId() + ": Stream '" + this.id + "' unpublished");
    };
    Stream.prototype.dispose = function () {
        function disposeElement(element) {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }
        this.elements.forEach(function (e) { return disposeElement(e); });
        //this.videoElements.forEach(ve => disposeElement(ve.video));
        disposeElement("progress-" + this.getId());
        if (this.wp) {
            this.wp.dispose();
        }
        else {
            if (this.wrStream) {
                this.wrStream.getAudioTracks().forEach(function (track) {
                    track.stop && track.stop();
                });
                this.wrStream.getVideoTracks().forEach(function (track) {
                    track.stop && track.stop();
                });
            }
        }
        if (this.speechEvent) {
            this.speechEvent.stop();
        }
        console.info((this.local ? "Local " : "Remote ") + "'Stream' with id [" + this.getId() + "]' has been succesfully disposed");
    };
    return Stream;
}());
exports.Stream = Stream;


/***/ }),

/***/ 42:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__ = __webpack_require__(483);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthenticationService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AuthenticationService = (function () {
    function AuthenticationService(http, router) {
        this.http = http;
        this.router = router;
        this.urlLogIn = 'api-logIn';
        this.urlLogOut = 'api-logOut';
        this.reqIsLogged();
        // set token if saved in local storage
        // let auth_token = JSON.parse(localStorage.getItem('auth_token'));
        // this.token = auth_token && auth_token.token;
    }
    AuthenticationService.prototype.logIn = function (user, pass) {
        var _this = this;
        console.log('Login service started...');
        var userPass = utf8_to_b64(user + ':' + pass);
        var headers = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Headers */]({
            'Authorization': 'Basic ' + userPass,
            'X-Requested-With': 'XMLHttpRequest'
        });
        var options = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["c" /* RequestOptions */]({ headers: headers });
        return this.http.get(this.urlLogIn, options)
            .map(function (response) {
            _this.processLogInResponse(response);
            return _this.user;
        })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__["Observable"].throw(error); });
    };
    AuthenticationService.prototype.logOut = function () {
        var _this = this;
        console.log('Logging out...');
        return this.http.get(this.urlLogOut).map(function (response) {
            console.log('Logout succesful!');
            _this.user = null;
            _this.role = null;
            // clear token remove user from local storage to log user out and navigates to welcome page
            _this.token = null;
            localStorage.removeItem('login');
            localStorage.removeItem('rol');
            _this.router.navigate(['']);
            return response;
        })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__["Observable"].throw(error); });
    };
    AuthenticationService.prototype.directLogOut = function () {
        this.logOut().subscribe(function (response) { }, function (error) { return console.log("Error when trying to log out: " + error); });
    };
    AuthenticationService.prototype.processLogInResponse = function (response) {
        // Correctly logged in
        console.log('Login succesful processing...');
        this.user = response.json();
        localStorage.setItem('login', 'OPENVIDUAPP');
        if (this.user.roles.indexOf('ROLE_TEACHER') !== -1) {
            this.role = 'ROLE_TEACHER';
            localStorage.setItem('rol', 'ROLE_TEACHER');
        }
        if (this.user.roles.indexOf('ROLE_STUDENT') !== -1) {
            this.role = 'ROLE_STUDENT';
            localStorage.setItem('rol', 'ROLE_STUDENT');
        }
    };
    AuthenticationService.prototype.reqIsLogged = function () {
        var _this = this;
        console.log('ReqIsLogged called');
        var headers = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Headers */]({
            'X-Requested-With': 'XMLHttpRequest'
        });
        var options = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["c" /* RequestOptions */]({ headers: headers });
        this.http.get(this.urlLogIn, options).subscribe(function (response) { return _this.processLogInResponse(response); }, function (error) {
            if (error.status != 401) {
                console.error('Error when asking if logged: ' + JSON.stringify(error));
                _this.logOut();
            }
        });
    };
    AuthenticationService.prototype.checkCredentials = function () {
        if (!this.isLoggedIn()) {
            this.logOut();
        }
    };
    AuthenticationService.prototype.isLoggedIn = function () {
        return ((this.user != null) && (this.user !== undefined));
    };
    AuthenticationService.prototype.getCurrentUser = function () {
        return this.user;
    };
    AuthenticationService.prototype.isTeacher = function () {
        return ((this.user.roles.indexOf('ROLE_TEACHER')) !== -1) && (localStorage.getItem('rol') === 'ROLE_TEACHER');
    };
    AuthenticationService.prototype.isStudent = function () {
        return ((this.user.roles.indexOf('ROLE_STUDENT')) !== -1) && (localStorage.getItem('rol') === 'ROLE_STUDENT');
    };
    AuthenticationService.prototype.updateUserLessons = function (lessons) {
        this.getCurrentUser().lessons = lessons;
    };
    AuthenticationService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__angular_http__["d" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_http__["d" /* Http */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */]) === 'function' && _b) || Object])
    ], AuthenticationService);
    return AuthenticationService;
    var _a, _b;
}());
function utf8_to_b64(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}
//# sourceMappingURL=authentication.service.js.map

/***/ }),

/***/ 459:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_authentication_service__ = __webpack_require__(42);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthGuard; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AuthGuard = (function () {
    function AuthGuard(router, authenticationService) {
        this.router = router;
        this.authenticationService = authenticationService;
    }
    AuthGuard.prototype.canActivate = function () {
        if (localStorage.getItem('login') && localStorage.getItem('rol') && this.authenticationService.isLoggedIn()) {
            // logged in so return true
            return true;
        }
        // not logged in so redirect to login page
        this.router.navigate(['']);
        return false;
    };
    AuthGuard = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__services_authentication_service__["a" /* AuthenticationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__services_authentication_service__["a" /* AuthenticationService */]) === 'function' && _b) || Object])
    ], AuthGuard);
    return AuthGuard;
    var _a, _b;
}());
//# sourceMappingURL=auth.guard.js.map

/***/ }),

/***/ 460:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_material__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_lesson__ = __webpack_require__(466);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_lesson_service__ = __webpack_require__(277);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_video_session_service__ = __webpack_require__(278);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_authentication_service__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__join_session_dialog_component__ = __webpack_require__(461);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var DashboardComponent = (function () {
    function DashboardComponent(lessonService, videoSessionService, authenticationService, router, snackBar, dialog) {
        this.lessonService = lessonService;
        this.videoSessionService = videoSessionService;
        this.authenticationService = authenticationService;
        this.router = router;
        this.snackBar = snackBar;
        this.dialog = dialog;
    }
    DashboardComponent.prototype.ngOnInit = function () {
        this.authenticationService.checkCredentials();
        this.getLessons();
    };
    DashboardComponent.prototype.logout = function () {
        this.authenticationService.logOut();
    };
    DashboardComponent.prototype.getLessons = function () {
        var _this = this;
        this.lessonService.getLessons(this.authenticationService.getCurrentUser()).subscribe(function (lessons) {
            console.log('User\'s lessons: ');
            console.log(lessons);
            _this.lessons = lessons;
            _this.authenticationService.updateUserLessons(_this.lessons);
        }, function (error) { return console.log(error); });
    };
    DashboardComponent.prototype.goToLesson = function (lesson) {
        var _this = this;
        var dialogRef;
        dialogRef = this.dialog.open(__WEBPACK_IMPORTED_MODULE_7__join_session_dialog_component__["a" /* JoinSessionDialogComponent */]);
        dialogRef.componentInstance.myReference = dialogRef;
        dialogRef.afterClosed().subscribe(function (cameraOptions) {
            if (cameraOptions != null) {
                console.log('Joining session with options:');
                console.log(cameraOptions);
                _this.videoSessionService.lesson = lesson;
                _this.videoSessionService.cameraOptions = cameraOptions;
                _this.router.navigate(['/lesson/' + lesson.id]);
            }
        });
    };
    DashboardComponent.prototype.goToLessonDetails = function (lesson) {
        this.router.navigate(['/lesson-details/' + lesson.id]);
    };
    DashboardComponent.prototype.newLesson = function () {
        var _this = this;
        this.sumbitNewLesson = true;
        this.lessonService.newLesson(new __WEBPACK_IMPORTED_MODULE_3__models_lesson__["a" /* Lesson */](this.lessonTitle)).subscribe(function (lesson) {
            console.log('New lesson added: ');
            console.log(lesson);
            _this.lessons.push(lesson);
            _this.authenticationService.updateUserLessons(_this.lessons);
            _this.sumbitNewLesson = false;
            _this.snackBar.open('Lesson added!', undefined, { duration: 3000 });
            _this.addingLesson = false;
        }, function (error) {
            console.log(error);
            _this.sumbitNewLesson = false;
            _this.snackBar.open('There has been a problem...', undefined, { duration: 3000 });
        });
    };
    DashboardComponent.prototype.createSession = function (lessonId) {
        this.videoSessionService.createSession(lessonId).subscribe(function (response) {
            console.log(response.text());
        }, function (error) {
            console.log(error);
        });
    };
    DashboardComponent.prototype.generateToken = function (lessonId) {
        this.videoSessionService.generateToken(lessonId).subscribe(function (response) {
            console.log(response.text());
        }, function (error) {
            console.log(error);
        });
    };
    DashboardComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'app-dashboard',
            template: __webpack_require__(778),
            styles: [__webpack_require__(762)],
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_4__services_lesson_service__["a" /* LessonService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__services_lesson_service__["a" /* LessonService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_5__services_video_session_service__["a" /* VideoSessionService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_5__services_video_session_service__["a" /* VideoSessionService */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_6__services_authentication_service__["a" /* AuthenticationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_6__services_authentication_service__["a" /* AuthenticationService */]) === 'function' && _c) || Object, (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === 'function' && _d) || Object, (typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_2__angular_material__["b" /* MdSnackBar */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_material__["b" /* MdSnackBar */]) === 'function' && _e) || Object, (typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_2__angular_material__["c" /* MdDialog */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_material__["c" /* MdDialog */]) === 'function' && _f) || Object])
    ], DashboardComponent);
    return DashboardComponent;
    var _a, _b, _c, _d, _e, _f;
}());
//# sourceMappingURL=dahsboard.component.js.map

/***/ }),

/***/ 461:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JoinSessionDialogComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var JoinSessionDialogComponent = (function () {
    function JoinSessionDialogComponent() {
        this.quality = 'medium';
        this.joinWithVideo = true;
        this.joinWithAudio = true;
    }
    JoinSessionDialogComponent.prototype.joinSession = function () {
        var cameraOptions = {
            audio: this.joinWithAudio,
            video: this.joinWithVideo,
            data: true,
            mediaConstraints: this.generateMediaConstraints()
        };
        this.myReference.close(cameraOptions);
    };
    JoinSessionDialogComponent.prototype.generateMediaConstraints = function () {
        var mediaConstraints = {
            audio: true,
            video: {}
        };
        var w = 640;
        var h = 480;
        switch (this.quality) {
            case 'low':
                w = 320;
                h = 240;
                break;
            case 'medium':
                w = 640;
                h = 480;
                break;
            case 'high':
                w = 1280;
                h = 720;
                break;
            case 'veryhigh':
                w = 1920;
                h = 1080;
                break;
        }
        mediaConstraints.video['width'] = { exact: w };
        mediaConstraints.video['height'] = { exact: h };
        //mediaConstraints.video['frameRate'] = { ideal: Number((<HTMLInputElement>document.getElementById('frameRate')).value) };
        return mediaConstraints;
    };
    JoinSessionDialogComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'app-join-session-dialog',
            template: "\n        <div>\n            <h1 md-dialog-title>\n                Video options\n            </h1>\n            <form #dialogForm (ngSubmit)=\"joinSession()\">\n                <md-dialog-content>\n                    <div id=\"quality-div\">\n                        <h5>Quality</h5>\n                        <md-radio-group [(ngModel)]=\"quality\" name=\"quality\" id=\"quality\">\n                            <md-radio-button value='low' title=\"320x240\">Low</md-radio-button>\n                            <md-radio-button value='medium' title=\"640x480\">Medium</md-radio-button>\n                            <md-radio-button value='high' title=\"1280x720\">High</md-radio-button>\n                            <md-radio-button value='veryhigh' title=\"1920x1080\">Very high</md-radio-button>\n                        </md-radio-group>\n                    </div>\n                    <div id=\"join-div\">\n                        <h5>Enter with active...</h5>\n                        <md-checkbox [(ngModel)]=\"joinWithVideo\" name=\"joinWithVideo\" id=\"joinWithVideo\">Video</md-checkbox>\n                        <md-checkbox [(ngModel)]=\"joinWithAudio\" name=\"joinWithAudio\">Audio</md-checkbox>\n                    </div>\n                </md-dialog-content>\n                <md-dialog-actions>\n                    <button md-button md-dialog-close>CANCEL</button>\n                    <button md-button id=\"join-btn\" type=\"submit\">JOIN</button>\n                </md-dialog-actions>\n            </form>\n        </div>\n    ",
            styles: ["\n        #quality-div {\n            margin-top: 20px;\n        }\n        #join-div {\n            margin-top: 25px;\n            margin-bottom: 20px;\n        }\n        #quality-tag {\n            display: block;\n        }\n        h5 {\n            margin-bottom: 10px;\n            text-align: left;\n        }\n        #joinWithVideo {\n            margin-right: 50px;\n        }\n        md-dialog-actions {\n            display: block;\n        }\n        #join-btn {\n            float: right;\n        }\n    "],
        }), 
        __metadata('design:paramtypes', [])
    ], JoinSessionDialogComponent);
    return JoinSessionDialogComponent;
}());
//# sourceMappingURL=join-session-dialog.component.js.map

/***/ }),

/***/ 462:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_material__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_lesson__ = __webpack_require__(466);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_user__ = __webpack_require__(705);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_lesson_service__ = __webpack_require__(277);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_authentication_service__ = __webpack_require__(42);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LessonDetailsComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var LessonDetailsComponent = (function () {
    function LessonDetailsComponent(lessonService, authenticationService, router, route, location, snackBar) {
        this.lessonService = lessonService;
        this.authenticationService = authenticationService;
        this.router = router;
        this.route = route;
        this.location = location;
        this.snackBar = snackBar;
        this.editingTitle = false;
        this.sumbitEditLesson = false;
        this.sumbitAddAttenders = false;
        this.arrayOfAttDels = [];
        // Feedback message parameters
        this.addAttendersCorrect = false;
        this.addAttendersError = false;
    }
    LessonDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params
            .map(function (params) { return _this.lessonService.obtainLocalLesson(+params['id']); })
            .subscribe(function (lesson) { return _this.lesson = lesson; });
    };
    LessonDetailsComponent.prototype.editLesson = function () {
        var _this = this;
        if (this.titleEdited !== this.lesson.title) {
            this.sumbitEditLesson = true;
            var l = new __WEBPACK_IMPORTED_MODULE_4__models_lesson__["a" /* Lesson */](this.titleEdited);
            l.id = this.lesson.id;
            this.lessonService.editLesson(l).subscribe(function (lesson) {
                // Lesson has been updated
                console.log('Lesson edited: ');
                console.log(lesson);
                _this.lesson = lesson;
                _this.sumbitEditLesson = false;
                _this.editingTitle = false;
                _this.snackBar.open('Lesson edited!', undefined, { duration: 3000 });
            }, function (error) {
                console.log(error);
                _this.sumbitEditLesson = false;
                _this.snackBar.open('There has been a problem...', undefined, { duration: 3000 });
            });
        }
        else {
            this.editingTitle = false; // The user has not modified the title
        }
    };
    LessonDetailsComponent.prototype.deleteLesson = function () {
        var _this = this;
        this.sumbitEditLesson = true;
        this.lessonService.deleteLesson(this.lesson.id).subscribe(function (lesson) {
            // Lesson has been deleted
            console.log('Lesson deleted');
            console.log(lesson);
            _this.sumbitEditLesson = false;
            _this.router.navigate(['/lessons']);
            _this.snackBar.open('Lesson deleted!', undefined, { duration: 3000 });
        }, function (error) {
            console.log(error);
            _this.sumbitEditLesson = false;
            _this.snackBar.open('There has been a problem...', undefined, { duration: 3000 });
        });
    };
    LessonDetailsComponent.prototype.addLessonAttenders = function () {
        var _this = this;
        this.sumbitAddAttenders = true;
        this.lessonService.addLessonAttenders(this.lesson.id, [this.emailAttender]).subscribe(function (response) {
            console.log('Attender added');
            console.log(response);
            _this.sumbitAddAttenders = false;
            var newAttenders = response.attendersAdded;
            _this.lesson.attenders = _this.lesson.attenders.concat(newAttenders);
            _this.handleAttendersMessage(response);
        }, function (error) {
            console.log(error);
            _this.sumbitAddAttenders = false;
            _this.snackBar.open('There has been a problem...', undefined, { duration: 3000 });
        });
    };
    LessonDetailsComponent.prototype.deleteLessonAttender = function (i, attender) {
        var _this = this;
        this.arrayOfAttDels[i] = true;
        var l = new __WEBPACK_IMPORTED_MODULE_4__models_lesson__["a" /* Lesson */](this.lesson.title);
        l.id = this.lesson.id;
        for (var i_1 = 0; i_1 < this.lesson.attenders.length; i_1++) {
            if (this.lesson.attenders[i_1].id !== attender.id) {
                l.attenders.push(new __WEBPACK_IMPORTED_MODULE_5__models_user__["a" /* User */](this.lesson.attenders[i_1])); //Inserting a new User object equal to the attender but "lessons" array empty
            }
        }
        this.lessonService.deleteLessonAttenders(l).subscribe(function (attenders) {
            console.log('Attender removed');
            console.log(attenders);
            _this.arrayOfAttDels[i] = false;
            _this.lesson.attenders = attenders;
            _this.snackBar.open('Attender removed!', undefined, { duration: 3000 });
        }, function (error) {
            console.log(error);
            _this.arrayOfAttDels[i] = false;
            _this.snackBar.open('There has been a problem...', undefined, { duration: 3000 });
        });
    };
    // Creates an error message when there is any problem during the process of adding Users to a Lesson
    // It also generates a correct feedback message when any student has been correctly added to the Lesson
    LessonDetailsComponent.prototype.handleAttendersMessage = function (response) {
        var isError = false;
        var isCorrect = false;
        this.attErrorContent = "";
        this.attCorrectContent = "";
        if (response.attendersAdded.length > 0) {
            for (var _i = 0, _a = response.attendersAdded; _i < _a.length; _i++) {
                var user = _a[_i];
                this.attCorrectContent += "<span class='feedback-list'>" + user.name + "</span>";
            }
            isCorrect = true;
        }
        if (response.attendersAlreadyAdded.length > 0) {
            this.attErrorContent += "<span>The following users were already added to the lesson</span>";
            for (var _b = 0, _c = response.attendersAlreadyAdded; _b < _c.length; _b++) {
                var user = _c[_b];
                this.attErrorContent += "<span class='feedback-list'>" + user.name + "</span>";
            }
            isError = true;
        }
        if (response.emailsValidNotRegistered.length > 0) {
            this.attErrorContent += "<span>The following users are not registered</span>";
            for (var _d = 0, _e = response.emailsValidNotRegistered; _d < _e.length; _d++) {
                var email = _e[_d];
                this.attErrorContent += "<span class='feedback-list'>" + email + "</span>";
            }
            isError = true;
        }
        if (response.emailsInvalid) {
            if (response.emailsInvalid.length > 0) {
                this.attErrorContent += "<span>These are not valid emails</span>";
                for (var _f = 0, _g = response.emailsInvalid; _f < _g.length; _f++) {
                    var email = _g[_f];
                    this.attErrorContent += "<span class='feedback-list'>" + email + "</span>";
                }
                isError = true;
            }
        }
        if (isError) {
            this.attErrorTitle = "There have been some problems";
            this.addAttendersError = true;
        }
        else if (response.attendersAdded.length == 0) {
            this.attErrorTitle = "No emails there!";
            this.addAttendersError = true;
        }
        if (isCorrect) {
            this.attCorrectTitle = "The following users where properly added";
            this.addAttendersCorrect = true;
        }
    };
    LessonDetailsComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'app-lesson-details',
            template: __webpack_require__(780),
            styles: [__webpack_require__(764)],
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_6__services_lesson_service__["a" /* LessonService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_6__services_lesson_service__["a" /* LessonService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_7__services_authentication_service__["a" /* AuthenticationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_7__services_authentication_service__["a" /* AuthenticationService */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === 'function' && _c) || Object, (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */]) === 'function' && _d) || Object, (typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_2__angular_common__["a" /* Location */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_common__["a" /* Location */]) === 'function' && _e) || Object, (typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_3__angular_material__["b" /* MdSnackBar */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__angular_material__["b" /* MdSnackBar */]) === 'function' && _f) || Object])
    ], LessonDetailsComponent);
    return LessonDetailsComponent;
    var _a, _b, _c, _d, _e, _f;
}());
//# sourceMappingURL=lesson-details.component.js.map

/***/ }),

/***/ 463:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_authentication_service__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_user_service__ = __webpack_require__(467);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PresentationComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var PresentationComponent = (function () {
    function PresentationComponent(authenticationService, userService, router) {
        this.authenticationService = authenticationService;
        this.userService = userService;
        this.router = router;
        this.roleUserSignup = 'student';
        this.loginView = true;
        this.tableShow = false;
    }
    PresentationComponent.prototype.ngOnInit = function () { };
    // If the user is loggedIn, navigates to dashboard
    PresentationComponent.prototype.ngAfterViewChecked = function () {
        if (this.authenticationService.isLoggedIn()) {
            this.router.navigate(['/lessons']);
        }
    };
    PresentationComponent.prototype.setLoginView = function (option) {
        this.fieldsIncorrect = false;
        this.loginView = option;
    };
    PresentationComponent.prototype.onSubmit = function () {
        console.log('Submit: email = ' + this.email + ' , password = ' + this.password + ', confirmPassword = ' + this.confirmPassword);
        this.submitProcessing = true;
        if (this.loginView) {
            // If login view is activated
            console.log('Logging in...');
            this.logIn(this.email, this.password);
        }
        else {
            // If signup view is activated
            console.log('Signing up...');
            this.signUp();
        }
    };
    PresentationComponent.prototype.logIn = function (user, pass) {
        var _this = this;
        this.authenticationService.logIn(user, pass).subscribe(function (result) {
            _this.submitProcessing = false;
            console.log('Login succesful! LOGGED AS ' + _this.authenticationService.getCurrentUser().name);
            // Login successful
            _this.fieldsIncorrect = false;
            _this.router.navigate(['/lessons']);
        }, function (error) {
            console.log('Login failed (error): ' + error);
            _this.errorTitle = 'Invalid field';
            _this.errorContent = 'Please check your email or password';
            _this.customClass = 'fail';
            // Login failed
            _this.handleError();
        });
    };
    PresentationComponent.prototype.signUp = function () {
        var _this = this;
        // Passwords don't match
        if (this.password !== this.confirmPassword) {
            this.errorTitle = 'Your passwords don\'t match!';
            this.errorContent = '';
            this.customClass = 'fail';
            this.handleError();
        }
        else {
            var userNameFixed_1 = this.email;
            var userPasswordFixed_1 = this.password;
            this.userService.newUser(userNameFixed_1, userPasswordFixed_1, this.nickName, this.roleUserSignup).subscribe(function (result) {
                // Sign up succesful
                _this.logIn(userNameFixed_1, userPasswordFixed_1);
                console.log('Sign up succesful!');
            }, function (error) {
                console.log('Sign up failed (error): ' + error);
                if (error === 409) {
                    _this.errorTitle = 'Invalid email';
                    _this.errorContent = 'That email is already in use';
                    _this.customClass = 'fail';
                }
                else if (error === 403) {
                    _this.errorTitle = 'Invalid email format';
                    _this.errorContent = 'Our server has rejected that email';
                    _this.customClass = 'fail';
                }
                // Sign up failed
                _this.handleError();
            });
        }
    };
    PresentationComponent.prototype.handleError = function () {
        this.submitProcessing = false;
        this.fieldsIncorrect = true;
    };
    PresentationComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'app-presentation',
            template: __webpack_require__(781),
            styles: [__webpack_require__(765)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__services_authentication_service__["a" /* AuthenticationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__services_authentication_service__["a" /* AuthenticationService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__services_user_service__["a" /* UserService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__services_user_service__["a" /* UserService */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === 'function' && _c) || Object])
    ], PresentationComponent);
    return PresentationComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=presentation.component.js.map

/***/ }),

/***/ 464:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_authentication_service__ = __webpack_require__(42);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ProfileComponent = (function () {
    function ProfileComponent(authenticationService) {
        this.authenticationService = authenticationService;
    }
    ProfileComponent.prototype.ngOnInit = function () {
        this.user = this.authenticationService.getCurrentUser();
    };
    ProfileComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'app-profile',
            template: __webpack_require__(782),
            styles: [__webpack_require__(766)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_authentication_service__["a" /* AuthenticationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__services_authentication_service__["a" /* AuthenticationService */]) === 'function' && _a) || Object])
    ], ProfileComponent);
    return ProfileComponent;
    var _a;
}());
//# sourceMappingURL=profile.component.js.map

/***/ }),

/***/ 465:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_openvidu_browser__ = __webpack_require__(1058);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_openvidu_browser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_openvidu_browser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_video_session_service__ = __webpack_require__(278);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_authentication_service__ = __webpack_require__(42);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VideoSessionComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var VideoSessionComponent = (function () {
    function VideoSessionComponent(location, authenticationService, videoSessionService) {
        this.location = location;
        this.authenticationService = authenticationService;
        this.videoSessionService = videoSessionService;
    }
    VideoSessionComponent.prototype.OPEN_VIDU_CONNECTION = function () {
        // 0) Obtain 'sessionId' and 'token' from server
        // In this case, the method ngOnInit takes care of it
        var _this = this;
        // 1) Initialize OpenVidu and your Session
        this.OV = new __WEBPACK_IMPORTED_MODULE_2_openvidu_browser__["OpenVidu"]();
        this.session = this.OV.initSession(this.sessionId);
        // 2) Specify the actions when events take place
        this.session.on('streamCreated', function (event) {
            console.warn("STREAM CREATED!");
            console.warn(event.stream);
            _this.session.subscribe(event.stream, 'subscriber', {
                insertMode: 'append',
                width: '100%',
                height: '100%'
            });
        });
        this.session.on('streamDestroyed', function (event) {
            console.warn("STREAM DESTROYED!");
            console.warn(event.stream);
        });
        this.session.on('connectionCreated', function (event) {
            if (event.connection.connectionId == _this.session.connection.connectionId) {
                console.warn("YOUR OWN CONNECTION CREATED!");
            }
            else {
                console.warn("OTHER USER'S CONNECTION CREATED!");
            }
            console.warn(event.connection);
        });
        this.session.on('connectionDestroyed', function (event) {
            console.warn("OTHER USER'S CONNECTION DESTROYED!");
            console.warn(event.connection);
        });
        // 3) Connect to the session
        this.session.connect(this.token, "CLIENT:" + this.authenticationService.getCurrentUser().name, function (error) {
            // If the connection is successful, initialize a publisher and publish to the session
            if (!error) {
                if (_this.authenticationService.isTeacher()) {
                    // 4) Get your own camera stream with the desired resolution and publish it, only if the user is supposed to do so
                    _this.publisher = _this.OV.initPublisher('publisher', _this.cameraOptions);
                    _this.publisher.on('accessAllowed', function () {
                        console.warn("CAMERA ACCESS ALLOWED!");
                    });
                    _this.publisher.on('accessDenied', function () {
                        console.warn("CAMERA ACCESS DENIED!");
                    });
                    _this.publisher.on('streamCreated', function (event) {
                        console.warn("STREAM CREATED BY PUBLISHER!");
                        console.warn(event.stream);
                    });
                    // 5) Publish your stream
                    _this.session.publish(_this.publisher);
                }
            }
            else {
                console.log('There was an error connecting to the session:', error.code, error.message);
            }
        });
    };
    VideoSessionComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Specific aspects of this concrete application
        this.previousConnectionStuff();
        if (this.authenticationService.isTeacher()) {
            // If the user is the teacher: creates the session and gets a token (with PUBLISHER role)
            this.videoSessionService.createSession(this.lesson.id).subscribe(function (sessionId) {
                _this.sessionId = sessionId[0];
                _this.videoSessionService.generateToken(_this.lesson.id).subscribe(function (sessionIdAndToken) {
                    _this.token = sessionIdAndToken[1];
                    console.warn("Token: " + _this.token);
                    console.warn("SessionId: " + _this.sessionId);
                    _this.OPEN_VIDU_CONNECTION();
                }, function (error) {
                    console.log(error);
                });
            }, function (error) {
                console.log(error);
            });
        }
        else {
            // If the user is a student: gets a token (with SUBSCRIBER role)
            this.videoSessionService.generateToken(this.lesson.id).subscribe(function (sessionIdAndToken) {
                _this.sessionId = sessionIdAndToken[0];
                _this.token = sessionIdAndToken[1];
                console.warn("Token: " + _this.token);
                console.warn("SessionId: " + _this.sessionId);
                _this.OPEN_VIDU_CONNECTION();
            }, function (error) {
                console.log(error);
            });
        }
        // Specific aspects of this concrete application
        this.afterConnectionStuff();
    };
    VideoSessionComponent.prototype.ngAfterViewInit = function () {
        this.toggleScrollPage("hidden");
    };
    VideoSessionComponent.prototype.ngOnDestroy = function () {
        this.videoSessionService.removeUser(this.lesson.id).subscribe(function (response) {
            console.warn("You have succesfully left the lesson");
        }, function (error) {
            console.log(error);
        });
        this.toggleScrollPage("auto");
        this.exitFullScreen();
        if (this.OV)
            this.session.disconnect();
    };
    VideoSessionComponent.prototype.toggleScrollPage = function (scroll) {
        var content = document.getElementsByClassName("mat-sidenav-content")[0];
        content.style.overflow = scroll;
    };
    VideoSessionComponent.prototype.toggleLocalVideo = function () {
        this.localVideoActivated = !this.localVideoActivated;
        this.publisher.publishVideo(this.localVideoActivated);
        this.videoIcon = this.localVideoActivated ? 'videocam' : 'videocam_off';
    };
    VideoSessionComponent.prototype.toggleLocalAudio = function () {
        this.localAudioActivated = !this.localAudioActivated;
        this.publisher.publishAudio(this.localAudioActivated);
        this.audioIcon = this.localAudioActivated ? 'mic' : 'mic_off';
    };
    VideoSessionComponent.prototype.toggleFullScreen = function () {
        var document = window.document;
        var fs = document.getElementsByTagName('html')[0];
        if (!document.fullscreenElement &&
            !document.mozFullScreenElement &&
            !document.webkitFullscreenElement &&
            !document.msFullscreenElement) {
            console.log("enter FULLSCREEN!");
            this.fullscreenIcon = 'fullscreen_exit';
            if (fs.requestFullscreen) {
                fs.requestFullscreen();
            }
            else if (fs.msRequestFullscreen) {
                fs.msRequestFullscreen();
            }
            else if (fs.mozRequestFullScreen) {
                fs.mozRequestFullScreen();
            }
            else if (fs.webkitRequestFullscreen) {
                fs.webkitRequestFullscreen();
            }
        }
        else {
            console.log("exit FULLSCREEN!");
            this.fullscreenIcon = 'fullscreen';
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    };
    VideoSessionComponent.prototype.exitFullScreen = function () {
        var document = window.document;
        var fs = document.getElementsByTagName('html')[0];
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    };
    VideoSessionComponent.prototype.previousConnectionStuff = function () {
        this.lesson = this.videoSessionService.lesson;
        this.cameraOptions = this.videoSessionService.cameraOptions;
    };
    VideoSessionComponent.prototype.afterConnectionStuff = function () {
        this.localVideoActivated = this.cameraOptions.video;
        this.localAudioActivated = this.cameraOptions.audio;
        this.videoIcon = this.localVideoActivated ? "videocam" : "videocam_off";
        this.audioIcon = this.localAudioActivated ? "mic" : "mic_off";
        this.fullscreenIcon = "fullscreen";
    };
    VideoSessionComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'app-video-session',
            template: __webpack_require__(783),
            styles: [__webpack_require__(767)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_common__["a" /* Location */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_common__["a" /* Location */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_4__services_authentication_service__["a" /* AuthenticationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__services_authentication_service__["a" /* AuthenticationService */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__services_video_session_service__["a" /* VideoSessionService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__services_video_session_service__["a" /* VideoSessionService */]) === 'function' && _c) || Object])
    ], VideoSessionComponent);
    return VideoSessionComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=video-session.component.js.map

/***/ }),

/***/ 466:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Lesson; });
var Lesson = (function () {
    function Lesson(title) {
        this.title = title;
        this.attenders = [];
    }
    return Lesson;
}());
//# sourceMappingURL=lesson.js.map

/***/ }),

/***/ 467:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var UserService = (function () {
    function UserService(http) {
        this.http = http;
        this.url = 'api-users';
    }
    UserService.prototype.newUser = function (name, pass, nickName, role) {
        var _this = this;
        var body = JSON.stringify([name, pass, nickName, role]);
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: headers });
        return this.http.post(this.url + "/new", body, options)
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    UserService.prototype.handleError = function (error) {
        return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error.status);
    };
    UserService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */]) === 'function' && _a) || Object])
    ], UserService);
    return UserService;
    var _a;
}());
//# sourceMappingURL=user.service.js.map

/***/ }),

/***/ 522:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*
 * (C) Copyright 2013-2015 Kurento (http://kurento.org/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var BrowserWebSocket = global.WebSocket || global.MozWebSocket;
var Logger = console;
/**
 * Get either the `WebSocket` or `MozWebSocket` globals
 * in the browser or try to resolve WebSocket-compatible
 * interface exposed by `ws` for Node-like environment.
 */
/*var WebSocket = BrowserWebSocket;
if (!WebSocket && typeof window === 'undefined') {
    try {
        WebSocket = require('ws');
    } catch (e) { }
}*/
//var SockJS = require('sockjs-client');
var MAX_RETRIES = 2000; // Forever...
var RETRY_TIME_MS = 3000; // FIXME: Implement exponential wait times...
var CONNECTING = 0;
var OPEN = 1;
var CLOSING = 2;
var CLOSED = 3;
/*
config = {
        uri : wsUri,
        useSockJS : true (use SockJS) / false (use WebSocket) by default,
        onconnected : callback method to invoke when connection is successful,
        ondisconnect : callback method to invoke when the connection is lost,
        onreconnecting : callback method to invoke when the client is reconnecting,
        onreconnected : callback method to invoke when the client succesfully reconnects,
    };
*/
function WebSocketWithReconnection(config) {
    var closing = false;
    var registerMessageHandler;
    var wsUri = config.uri;
    var useSockJS = config.useSockJS;
    var reconnecting = false;
    var forcingDisconnection = false;
    var ws;
    if (useSockJS) {
        ws = new SockJS(wsUri);
    }
    else {
        ws = new WebSocket(wsUri);
    }
    ws.onopen = function () {
        logConnected(ws, wsUri);
        if (config.onconnected) {
            config.onconnected();
        }
    };
    ws.onerror = function (error) {
        Logger.error("Could not connect to " + wsUri + " (invoking onerror if defined)", error);
        if (config.onerror) {
            config.onerror(error);
        }
    };
    function logConnected(ws, wsUri) {
        try {
            Logger.debug("WebSocket connected to " + wsUri);
        }
        catch (e) {
            Logger.error(e);
        }
    }
    var reconnectionOnClose = function () {
        if (ws.readyState === CLOSED) {
            if (closing) {
                Logger.debug("Connection closed by user");
            }
            else {
                Logger.debug("Connection closed unexpectecly. Reconnecting...");
                reconnectToSameUri(MAX_RETRIES, 1);
            }
        }
        else {
            Logger.debug("Close callback from previous websocket. Ignoring it");
        }
    };
    ws.onclose = reconnectionOnClose;
    function reconnectToSameUri(maxRetries, numRetries) {
        Logger.debug("reconnectToSameUri (attempt #" + numRetries + ", max=" + maxRetries + ")");
        if (numRetries === 1) {
            if (reconnecting) {
                Logger.warn("Trying to reconnectToNewUri when reconnecting... Ignoring this reconnection.");
                return;
            }
            else {
                reconnecting = true;
            }
            if (config.onreconnecting) {
                config.onreconnecting();
            }
        }
        if (forcingDisconnection) {
            reconnectToNewUri(maxRetries, numRetries, wsUri);
        }
        else {
            if (config.newWsUriOnReconnection) {
                config.newWsUriOnReconnection(function (error, newWsUri) {
                    if (error) {
                        Logger.debug(error);
                        setTimeout(function () {
                            reconnectToSameUri(maxRetries, numRetries + 1);
                        }, RETRY_TIME_MS);
                    }
                    else {
                        reconnectToNewUri(maxRetries, numRetries, newWsUri);
                    }
                });
            }
            else {
                reconnectToNewUri(maxRetries, numRetries, wsUri);
            }
        }
    }
    // TODO Test retries. How to force not connection?
    function reconnectToNewUri(maxRetries, numRetries, reconnectWsUri) {
        Logger.debug("Reconnection attempt #" + numRetries);
        ws.close();
        wsUri = reconnectWsUri || wsUri;
        var newWs;
        if (useSockJS) {
            newWs = new SockJS(wsUri);
        }
        else {
            newWs = new WebSocket(wsUri);
        }
        newWs.onopen = function () {
            Logger.debug("Reconnected after " + numRetries + " attempts...");
            logConnected(newWs, wsUri);
            reconnecting = false;
            registerMessageHandler();
            if (config.onreconnected()) {
                config.onreconnected();
            }
            newWs.onclose = reconnectionOnClose;
        };
        var onErrorOrClose = function (error) {
            Logger.warn("Reconnection error: ", error);
            if (numRetries === maxRetries) {
                if (config.ondisconnect) {
                    config.ondisconnect();
                }
            }
            else {
                setTimeout(function () {
                    reconnectToSameUri(maxRetries, numRetries + 1);
                }, RETRY_TIME_MS);
            }
        };
        newWs.onerror = onErrorOrClose;
        ws = newWs;
    }
    this.close = function () {
        closing = true;
        ws.close();
    };
    // This method is only for testing
    this.forceClose = function (millis) {
        Logger.debug("Testing: Force WebSocket close");
        if (millis) {
            Logger.debug("Testing: Change wsUri for " + millis + " millis to simulate net failure");
            var goodWsUri = wsUri;
            wsUri = "wss://21.234.12.34.4:443/";
            forcingDisconnection = true;
            setTimeout(function () {
                Logger.debug("Testing: Recover good wsUri " + goodWsUri);
                wsUri = goodWsUri;
                forcingDisconnection = false;
            }, millis);
        }
        ws.close();
    };
    this.reconnectWs = function () {
        Logger.debug("reconnectWs");
        reconnectToSameUri(MAX_RETRIES, 1, wsUri);
    };
    this.send = function (message) {
        ws.send(message);
    };
    this.addEventListener = function (type, callback) {
        registerMessageHandler = function () {
            ws.addEventListener(type, callback);
        };
        registerMessageHandler();
    };
}
module.exports = WebSocketWithReconnection;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)))

/***/ }),

/***/ 523:
/***/ (function(module, exports, __webpack_require__) {

/*
 * (C) Copyright 2014 Kurento (http://kurento.org/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
var defineProperty_IE8 = false;
if (Object.defineProperty) {
    try {
        Object.defineProperty({}, "x", {});
    }
    catch (e) {
        defineProperty_IE8 = true;
    }
}
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }
        var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function () { }, fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis
                ? this
                : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
        };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}
var EventEmitter = __webpack_require__(480).EventEmitter;
var inherits = __webpack_require__(481);
var packers = __webpack_require__(1054);
var Mapper = __webpack_require__(1048);
var BASE_TIMEOUT = 5000;
function unifyResponseMethods(responseMethods) {
    if (!responseMethods)
        return {};
    for (var key in responseMethods) {
        var value = responseMethods[key];
        if (typeof value == 'string')
            responseMethods[key] =
                {
                    response: value
                };
    }
    ;
    return responseMethods;
}
;
function unifyTransport(transport) {
    if (!transport)
        return;
    // Transport as a function
    if (transport instanceof Function)
        return { send: transport };
    // WebSocket & DataChannel
    if (transport.send instanceof Function)
        return transport;
    // Message API (Inter-window & WebWorker)
    if (transport.postMessage instanceof Function) {
        transport.send = transport.postMessage;
        return transport;
    }
    // Stream API
    if (transport.write instanceof Function) {
        transport.send = transport.write;
        return transport;
    }
    // Transports that only can receive messages, but not send
    if (transport.onmessage !== undefined)
        return;
    if (transport.pause instanceof Function)
        return;
    throw new SyntaxError("Transport is not a function nor a valid object");
}
;
/**
 * Representation of a RPC notification
 *
 * @class
 *
 * @constructor
 *
 * @param {String} method -method of the notification
 * @param params - parameters of the notification
 */
function RpcNotification(method, params) {
    if (defineProperty_IE8) {
        this.method = method;
        this.params = params;
    }
    else {
        Object.defineProperty(this, 'method', { value: method, enumerable: true });
        Object.defineProperty(this, 'params', { value: params, enumerable: true });
    }
}
;
/**
 * @class
 *
 * @constructor
 *
 * @param {object} packer
 *
 * @param {object} [options]
 *
 * @param {object} [transport]
 *
 * @param {Function} [onRequest]
 */
function RpcBuilder(packer, options, transport, onRequest) {
    var self = this;
    if (!packer)
        throw new SyntaxError('Packer is not defined');
    if (!packer.pack || !packer.unpack)
        throw new SyntaxError('Packer is invalid');
    var responseMethods = unifyResponseMethods(packer.responseMethods);
    if (options instanceof Function) {
        if (transport != undefined)
            throw new SyntaxError("There can't be parameters after onRequest");
        onRequest = options;
        transport = undefined;
        options = undefined;
    }
    ;
    if (options && options.send instanceof Function) {
        if (transport && !(transport instanceof Function))
            throw new SyntaxError("Only a function can be after transport");
        onRequest = transport;
        transport = options;
        options = undefined;
    }
    ;
    if (transport instanceof Function) {
        if (onRequest != undefined)
            throw new SyntaxError("There can't be parameters after onRequest");
        onRequest = transport;
        transport = undefined;
    }
    ;
    if (transport && transport.send instanceof Function)
        if (onRequest && !(onRequest instanceof Function))
            throw new SyntaxError("Only a function can be after transport");
    options = options || {};
    EventEmitter.call(this);
    if (onRequest)
        this.on('request', onRequest);
    if (defineProperty_IE8)
        this.peerID = options.peerID;
    else
        Object.defineProperty(this, 'peerID', { value: options.peerID });
    var max_retries = options.max_retries || 0;
    function transportMessage(event) {
        self.decode(event.data || event);
    }
    ;
    this.getTransport = function () {
        return transport;
    };
    this.setTransport = function (value) {
        // Remove listener from old transport
        if (transport) {
            // W3C transports
            if (transport.removeEventListener)
                transport.removeEventListener('message', transportMessage);
            else if (transport.removeListener)
                transport.removeListener('data', transportMessage);
        }
        ;
        // Set listener on new transport
        if (value) {
            // W3C transports
            if (value.addEventListener)
                value.addEventListener('message', transportMessage);
            else if (value.addListener)
                value.addListener('data', transportMessage);
        }
        ;
        transport = unifyTransport(value);
    };
    if (!defineProperty_IE8)
        Object.defineProperty(this, 'transport', {
            get: this.getTransport.bind(this),
            set: this.setTransport.bind(this)
        });
    this.setTransport(transport);
    var request_timeout = options.request_timeout || BASE_TIMEOUT;
    var ping_request_timeout = options.ping_request_timeout || request_timeout;
    var response_timeout = options.response_timeout || BASE_TIMEOUT;
    var duplicates_timeout = options.duplicates_timeout || BASE_TIMEOUT;
    var requestID = 0;
    var requests = new Mapper();
    var responses = new Mapper();
    var processedResponses = new Mapper();
    var message2Key = {};
    /**
     * Store the response to prevent to process duplicate request later
     */
    function storeResponse(message, id, dest) {
        var response = {
            message: message,
            /** Timeout to auto-clean old responses */
            timeout: setTimeout(function () {
                responses.remove(id, dest);
            }, response_timeout)
        };
        responses.set(response, id, dest);
    }
    ;
    /**
     * Store the response to ignore duplicated messages later
     */
    function storeProcessedResponse(ack, from) {
        var timeout = setTimeout(function () {
            processedResponses.remove(ack, from);
        }, duplicates_timeout);
        processedResponses.set(timeout, ack, from);
    }
    ;
    /**
     * Representation of a RPC request
     *
     * @class
     * @extends RpcNotification
     *
     * @constructor
     *
     * @param {String} method -method of the notification
     * @param params - parameters of the notification
     * @param {Integer} id - identifier of the request
     * @param [from] - source of the notification
     */
    function RpcRequest(method, params, id, from, transport) {
        RpcNotification.call(this, method, params);
        this.getTransport = function () {
            return transport;
        };
        this.setTransport = function (value) {
            transport = unifyTransport(value);
        };
        if (!defineProperty_IE8)
            Object.defineProperty(this, 'transport', {
                get: this.getTransport.bind(this),
                set: this.setTransport.bind(this)
            });
        var response = responses.get(id, from);
        /**
         * @constant {Boolean} duplicated
         */
        if (!(transport || self.getTransport())) {
            if (defineProperty_IE8)
                this.duplicated = Boolean(response);
            else
                Object.defineProperty(this, 'duplicated', {
                    value: Boolean(response)
                });
        }
        var responseMethod = responseMethods[method];
        this.pack = packer.pack.bind(packer, this, id);
        /**
         * Generate a response to this request
         *
         * @param {Error} [error]
         * @param {*} [result]
         *
         * @returns {string}
         */
        this.reply = function (error, result, transport) {
            // Fix optional parameters
            if (error instanceof Function || error && error.send instanceof Function) {
                if (result != undefined)
                    throw new SyntaxError("There can't be parameters after callback");
                transport = error;
                result = null;
                error = undefined;
            }
            else if (result instanceof Function
                || result && result.send instanceof Function) {
                if (transport != undefined)
                    throw new SyntaxError("There can't be parameters after callback");
                transport = result;
                result = null;
            }
            ;
            transport = unifyTransport(transport);
            // Duplicated request, remove old response timeout
            if (response)
                clearTimeout(response.timeout);
            if (from != undefined) {
                if (error)
                    error.dest = from;
                if (result)
                    result.dest = from;
            }
            ;
            var message;
            // New request or overriden one, create new response with provided data
            if (error || result != undefined) {
                if (self.peerID != undefined) {
                    if (error)
                        error.from = self.peerID;
                    else
                        result.from = self.peerID;
                }
                // Protocol indicates that responses has own request methods
                if (responseMethod) {
                    if (responseMethod.error == undefined && error)
                        message =
                            {
                                error: error
                            };
                    else {
                        var method = error
                            ? responseMethod.error
                            : responseMethod.response;
                        message =
                            {
                                method: method,
                                params: error || result
                            };
                    }
                }
                else
                    message =
                        {
                            error: error,
                            result: result
                        };
                message = packer.pack(message, id);
            }
            else if (response)
                message = response.message;
            else
                message = packer.pack({ result: null }, id);
            // Store the response to prevent to process a duplicated request later
            storeResponse(message, id, from);
            // Return the stored response so it can be directly send back
            transport = transport || this.getTransport() || self.getTransport();
            if (transport)
                return transport.send(message);
            return message;
        };
    }
    ;
    inherits(RpcRequest, RpcNotification);
    function cancel(message) {
        var key = message2Key[message];
        if (!key)
            return;
        delete message2Key[message];
        var request = requests.pop(key.id, key.dest);
        if (!request)
            return;
        clearTimeout(request.timeout);
        // Start duplicated responses timeout
        storeProcessedResponse(key.id, key.dest);
    }
    ;
    /**
     * Allow to cancel a request and don't wait for a response
     *
     * If `message` is not given, cancel all the request
     */
    this.cancel = function (message) {
        if (message)
            return cancel(message);
        for (var message in message2Key)
            cancel(message);
    };
    this.close = function () {
        // Prevent to receive new messages
        var transport = this.getTransport();
        if (transport && transport.close)
            transport.close();
        // Request & processed responses
        this.cancel();
        processedResponses.forEach(clearTimeout);
        // Responses
        responses.forEach(function (response) {
            clearTimeout(response.timeout);
        });
    };
    /**
     * Generates and encode a JsonRPC 2.0 message
     *
     * @param {String} method -method of the notification
     * @param params - parameters of the notification
     * @param [dest] - destination of the notification
     * @param {object} [transport] - transport where to send the message
     * @param [callback] - function called when a response to this request is
     *   received. If not defined, a notification will be send instead
     *
     * @returns {string} A raw JsonRPC 2.0 request or notification string
     */
    this.encode = function (method, params, dest, transport, callback) {
        // Fix optional parameters
        if (params instanceof Function) {
            if (dest != undefined)
                throw new SyntaxError("There can't be parameters after callback");
            callback = params;
            transport = undefined;
            dest = undefined;
            params = undefined;
        }
        else if (dest instanceof Function) {
            if (transport != undefined)
                throw new SyntaxError("There can't be parameters after callback");
            callback = dest;
            transport = undefined;
            dest = undefined;
        }
        else if (transport instanceof Function) {
            if (callback != undefined)
                throw new SyntaxError("There can't be parameters after callback");
            callback = transport;
            transport = undefined;
        }
        ;
        if (self.peerID != undefined) {
            params = params || {};
            params.from = self.peerID;
        }
        ;
        if (dest != undefined) {
            params = params || {};
            params.dest = dest;
        }
        ;
        // Encode message
        var message = {
            method: method,
            params: params
        };
        if (callback) {
            var id = requestID++;
            var retried = 0;
            message = packer.pack(message, id);
            function dispatchCallback(error, result) {
                self.cancel(message);
                callback(error, result);
            }
            ;
            var request = {
                message: message,
                callback: dispatchCallback,
                responseMethods: responseMethods[method] || {}
            };
            var encode_transport = unifyTransport(transport);
            function sendRequest(transport) {
                var rt = (method === 'ping' ? ping_request_timeout : request_timeout);
                request.timeout = setTimeout(timeout, rt * Math.pow(2, retried++));
                message2Key[message] = { id: id, dest: dest };
                requests.set(request, id, dest);
                transport = transport || encode_transport || self.getTransport();
                if (transport)
                    return transport.send(message);
                return message;
            }
            ;
            function retry(transport) {
                transport = unifyTransport(transport);
                console.warn(retried + ' retry for request message:', message);
                var timeout = processedResponses.pop(id, dest);
                clearTimeout(timeout);
                return sendRequest(transport);
            }
            ;
            function timeout() {
                if (retried < max_retries)
                    return retry(transport);
                var error = new Error('Request has timed out');
                error.request = message;
                error.retry = retry;
                dispatchCallback(error);
            }
            ;
            return sendRequest(transport);
        }
        ;
        // Return the packed message
        message = packer.pack(message);
        transport = transport || this.getTransport();
        if (transport)
            return transport.send(message);
        return message;
    };
    /**
     * Decode and process a JsonRPC 2.0 message
     *
     * @param {string} message - string with the content of the message
     *
     * @returns {RpcNotification|RpcRequest|undefined} - the representation of the
     *   notification or the request. If a response was processed, it will return
     *   `undefined` to notify that it was processed
     *
     * @throws {TypeError} - Message is not defined
     */
    this.decode = function (message, transport) {
        if (!message)
            throw new TypeError("Message is not defined");
        try {
            message = packer.unpack(message);
        }
        catch (e) {
            // Ignore invalid messages
            return console.debug(e, message);
        }
        ;
        var id = message.id;
        var ack = message.ack;
        var method = message.method;
        var params = message.params || {};
        var from = params.from;
        var dest = params.dest;
        // Ignore messages send by us
        if (self.peerID != undefined && from == self.peerID)
            return;
        // Notification
        if (id == undefined && ack == undefined) {
            var notification = new RpcNotification(method, params);
            if (self.emit('request', notification))
                return;
            return notification;
        }
        ;
        function processRequest() {
            // If we have a transport and it's a duplicated request, reply inmediatly
            transport = unifyTransport(transport) || self.getTransport();
            if (transport) {
                var response = responses.get(id, from);
                if (response)
                    return transport.send(response.message);
            }
            ;
            var idAck = (id != undefined) ? id : ack;
            var request = new RpcRequest(method, params, idAck, from, transport);
            if (self.emit('request', request))
                return;
            return request;
        }
        ;
        function processResponse(request, error, result) {
            request.callback(error, result);
        }
        ;
        function duplicatedResponse(timeout) {
            console.warn("Response already processed", message);
            // Update duplicated responses timeout
            clearTimeout(timeout);
            storeProcessedResponse(ack, from);
        }
        ;
        // Request, or response with own method
        if (method) {
            // Check if it's a response with own method
            if (dest == undefined || dest == self.peerID) {
                var request = requests.get(ack, from);
                if (request) {
                    var responseMethods = request.responseMethods;
                    if (method == responseMethods.error)
                        return processResponse(request, params);
                    if (method == responseMethods.response)
                        return processResponse(request, null, params);
                    return processRequest();
                }
                var processed = processedResponses.get(ack, from);
                if (processed)
                    return duplicatedResponse(processed);
            }
            // Request
            return processRequest();
        }
        ;
        var error = message.error;
        var result = message.result;
        // Ignore responses not send to us
        if (error && error.dest && error.dest != self.peerID)
            return;
        if (result && result.dest && result.dest != self.peerID)
            return;
        // Response
        var request = requests.get(ack, from);
        if (!request) {
            var processed = processedResponses.get(ack, from);
            if (processed)
                return duplicatedResponse(processed);
            return console.warn("No callback was defined for this message", message);
        }
        ;
        // Process response
        processResponse(request, error, result);
    };
}
;
inherits(RpcBuilder, EventEmitter);
RpcBuilder.RpcNotification = RpcNotification;
module.exports = RpcBuilder;
var clients = __webpack_require__(1049);
var transports = __webpack_require__(1051);
RpcBuilder.clients = clients;
RpcBuilder.clients.transports = transports;
RpcBuilder.packers = packers;


/***/ }),

/***/ 524:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = __webpack_require__(135);
var Publisher = /** @class */ (function () {
    function Publisher(stream, parentId) {
        var _this = this;
        this.ee = new EventEmitter();
        this.accessAllowed = false;
        this.stream = stream;
        this.stream.addEventListener('camera-access-changed', function (event) {
            _this.accessAllowed = event.accessAllowed;
            if (_this.accessAllowed) {
                _this.ee.emitEvent('accessAllowed');
            }
            else {
                _this.ee.emitEvent('accessDenied');
            }
        });
        if (document.getElementById(parentId) != null) {
            this.element = document.getElementById(parentId);
        }
    }
    Publisher.prototype.publishAudio = function (value) {
        this.stream.getWebRtcPeer().audioEnabled = value;
    };
    Publisher.prototype.publishVideo = function (value) {
        this.stream.getWebRtcPeer().videoEnabled = value;
    };
    Publisher.prototype.destroy = function () {
        this.session.unpublish(this);
        this.stream.dispose();
        this.stream.removeVideo(this.element);
        return this;
    };
    Publisher.prototype.subscribeToRemote = function () {
        this.stream.subscribeToMyRemote();
    };
    Publisher.prototype.on = function (eventName, callback) {
        var _this = this;
        this.ee.addListener(eventName, function (event) {
            if (event) {
                console.info("Event '" + eventName + "' triggered by 'Publisher'", event);
            }
            else {
                console.info("Event '" + eventName + "' triggered by 'Publisher'");
            }
            callback(event);
        });
        if (eventName == 'videoElementCreated') {
            if (this.stream.isVideoELementCreated) {
                this.ee.emitEvent('videoElementCreated', [{
                        element: this.stream.getVideoElement()
                    }]);
            }
            else {
                this.stream.addOnceEventListener('video-element-created-by-stream', function (element) {
                    _this.id = element.id;
                    _this.ee.emitEvent('videoElementCreated', [{
                            element: element.element
                        }]);
                });
            }
        }
        if (eventName == 'videoPlaying') {
            var video = this.stream.getVideoElement();
            if (!this.stream.displayMyRemote() && video &&
                video.currentTime > 0 &&
                video.paused == false &&
                video.ended == false &&
                video.readyState == 4) {
                this.ee.emitEvent('videoPlaying', [{
                        element: this.stream.getVideoElement()
                    }]);
            }
            else {
                this.stream.addOnceEventListener('video-is-playing', function (element) {
                    _this.ee.emitEvent('videoPlaying', [{
                            element: element.element
                        }]);
                });
            }
        }
        if (eventName == 'remoteVideoPlaying') {
            var video = this.stream.getVideoElement();
            if (this.stream.displayMyRemote() && video &&
                video.currentTime > 0 &&
                video.paused == false &&
                video.ended == false &&
                video.readyState == 4) {
                this.ee.emitEvent('remoteVideoPlaying', [{
                        element: this.stream.getVideoElement()
                    }]);
            }
            else {
                this.stream.addOnceEventListener('remote-video-is-playing', function (element) {
                    _this.ee.emitEvent('remoteVideoPlaying', [{
                            element: element.element
                        }]);
                });
            }
        }
        if (eventName == 'streamCreated') {
            if (this.stream.isReady) {
                this.ee.emitEvent('streamCreated', [{ stream: this.stream }]);
            }
            else {
                this.stream.addEventListener('stream-created-by-publisher', function () {
                    console.warn('Publisher emitting streamCreated');
                    _this.ee.emitEvent('streamCreated', [{ stream: _this.stream }]);
                });
            }
        }
        if (eventName == 'accessAllowed') {
            if (this.stream.accessIsAllowed) {
                this.ee.emitEvent('accessAllowed');
            }
            else {
                this.stream.addEventListener('access-allowed-by-publisher', function () {
                    _this.ee.emitEvent('accessAllowed');
                });
            }
        }
        if (eventName == 'accessDenied') {
            if (this.stream.accessIsDenied) {
                this.ee.emitEvent('accessDenied');
            }
            else {
                this.stream.addEventListener('access-denied-by-publisher', function () {
                    _this.ee.emitEvent('accessDenied');
                });
            }
        }
    };
    return Publisher;
}());
exports.Publisher = Publisher;


/***/ }),

/***/ 525:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = __webpack_require__(526);
var EventEmitter = __webpack_require__(135);
var Session = /** @class */ (function () {
    function Session(session, openVidu) {
        var _this = this;
        this.session = session;
        this.openVidu = openVidu;
        this.ee = new EventEmitter();
        this.sessionId = session.getSessionId();
        // Listens to the deactivation of the default behaviour upon the deletion of a Stream object
        this.session.addEventListener('stream-destroyed-default', function (event) {
            event.stream.removeVideo();
        });
        // Listens to the deactivation of the default behaviour upon the disconnection of a Session
        this.session.addEventListener('session-disconnected-default', function () {
            var s;
            for (var _i = 0, _a = _this.openVidu.openVidu.getRemoteStreams(); _i < _a.length; _i++) {
                s = _a[_i];
                s.removeVideo();
            }
            if (_this.connection) {
                for (var streamId in _this.connection.getStreams()) {
                    _this.connection.getStreams()[streamId].removeVideo();
                }
            }
        });
        // Sets or updates the value of 'connection' property. Triggered by SessionInternal when succesful connection
        this.session.addEventListener('update-connection-object', function (event) {
            _this.connection = event.connection;
        });
    }
    Session.prototype.connect = function (param1, param2, param3) {
        // Early configuration to deactivate automatic subscription to streams
        if (param3) {
            this.session.configure({
                sessionId: this.session.getSessionId(),
                participantId: param1,
                metadata: this.session.stringClientMetadata(param2),
                subscribeToStreams: false
            });
            this.session.connect(param1, param3);
        }
        else {
            this.session.configure({
                sessionId: this.session.getSessionId(),
                participantId: param1,
                metadata: '',
                subscribeToStreams: false
            });
            this.session.connect(param1, param2);
        }
    };
    Session.prototype.disconnect = function () {
        var _this = this;
        this.openVidu.openVidu.close(false);
        this.session.emitEvent('sessionDisconnected', [{
                preventDefault: function () { _this.session.removeEvent('session-disconnected-default'); }
            }]);
        this.session.emitEvent('session-disconnected-default', [{}]);
    };
    Session.prototype.publish = function (publisher) {
        publisher.session = this;
        publisher.stream.publish();
    };
    Session.prototype.unpublish = function (publisher) {
        this.session.unpublish(publisher.stream);
    };
    Session.prototype.on = function (eventName, callback) {
        this.session.addEventListener(eventName, function (event) {
            if (event) {
                console.info("Event '" + eventName + "' triggered by 'Session'", event);
            }
            else {
                console.info("Event '" + eventName + "' triggered by 'Session'");
            }
            callback(event);
        });
    };
    Session.prototype.once = function (eventName, callback) {
        this.session.addOnceEventListener(eventName, function (event) {
            callback(event);
        });
    };
    Session.prototype.off = function (eventName, eventHandler) {
        this.session.removeListener(eventName, eventHandler);
    };
    Session.prototype.subscribe = function (param1, param2, param3) {
        // Subscription
        this.session.subscribe(param1);
        var subscriber = new Subscriber_1.Subscriber(param1, param2);
        param1.playOnlyVideo(param2, null);
        return subscriber;
    };
    Session.prototype.unsubscribe = function (subscriber) {
        this.session.unsuscribe(subscriber.stream);
        subscriber.stream.removeVideo();
    };
    /* Shortcut event API */
    Session.prototype.onStreamCreated = function (callback) {
        this.session.addEventListener("streamCreated", function (streamEvent) {
            callback(streamEvent.stream);
        });
    };
    Session.prototype.onStreamDestroyed = function (callback) {
        this.session.addEventListener("streamDestroyed", function (streamEvent) {
            callback(streamEvent.stream);
        });
    };
    Session.prototype.onParticipantJoined = function (callback) {
        this.session.addEventListener("participant-joined", function (participantEvent) {
            callback(participantEvent.connection);
        });
    };
    Session.prototype.onParticipantLeft = function (callback) {
        this.session.addEventListener("participant-left", function (participantEvent) {
            callback(participantEvent.connection);
        });
    };
    Session.prototype.onParticipantPublished = function (callback) {
        this.session.addEventListener("participant-published", function (participantEvent) {
            callback(participantEvent.connection);
        });
    };
    Session.prototype.onParticipantEvicted = function (callback) {
        this.session.addEventListener("participant-evicted", function (participantEvent) {
            callback(participantEvent.connection);
        });
    };
    Session.prototype.onRoomClosed = function (callback) {
        this.session.addEventListener("room-closed", function (roomEvent) {
            callback(roomEvent.room);
        });
    };
    Session.prototype.onLostConnection = function (callback) {
        this.session.addEventListener("lost-connection", function (roomEvent) {
            callback(roomEvent.room);
        });
    };
    Session.prototype.onMediaError = function (callback) {
        this.session.addEventListener("error-media", function (errorEvent) {
            callback(errorEvent.error);
        });
    };
    return Session;
}());
exports.Session = Session;


/***/ }),

/***/ 526:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = __webpack_require__(135);
var Subscriber = /** @class */ (function () {
    function Subscriber(stream, parentId) {
        this.ee = new EventEmitter();
        this.stream = stream;
        if (document.getElementById(parentId) != null) {
            this.element = document.getElementById(parentId);
        }
    }
    Subscriber.prototype.on = function (eventName, callback) {
        var _this = this;
        this.ee.addListener(eventName, function (event) {
            if (event) {
                console.info("Event '" + eventName + "' triggered by 'Subscriber'", event);
            }
            else {
                console.info("Event '" + eventName + "' triggered by 'Subscriber'");
            }
            callback(event);
        });
        if (eventName == 'videoElementCreated') {
            if (this.stream.isReady) {
                this.ee.emitEvent('videoElementCreated', [{
                        element: this.stream.getVideoElement()
                    }]);
            }
            else {
                this.stream.addOnceEventListener('video-element-created-by-stream', function (element) {
                    console.warn("Subscriber emitting videoElementCreated");
                    _this.id = element.id;
                    _this.ee.emitEvent('videoElementCreated', [{
                            element: element
                        }]);
                });
            }
        }
        if (eventName == 'videoPlaying') {
            var video = this.stream.getVideoElement();
            if (!this.stream.displayMyRemote() && video &&
                video.currentTime > 0 &&
                video.paused == false &&
                video.ended == false &&
                video.readyState == 4) {
                this.ee.emitEvent('videoPlaying', [{
                        element: this.stream.getVideoElement()
                    }]);
            }
            else {
                this.stream.addOnceEventListener('video-is-playing', function (element) {
                    _this.ee.emitEvent('videoPlaying', [{
                            element: element.element
                        }]);
                });
            }
        }
    };
    return Subscriber;
}());
exports.Subscriber = Subscriber;


/***/ }),

/***/ 527:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Stream_1 = __webpack_require__(307);
var Connection = /** @class */ (function () {
    function Connection(openVidu, local, room, options) {
        this.openVidu = openVidu;
        this.local = local;
        this.room = room;
        this.options = options;
        this.streams = {};
        this.streamsOpts = [];
        console.info("'Connection' created (" + (local ? "local" : "remote") + ")" + (local ? "" : ", with 'connectionId' [" + (options ? options.id : '') + "] "));
        if (options) {
            this.connectionId = options.id;
            this.data = options.metadata;
            if (options.streams) {
                this.initStreams(options);
            }
        }
    }
    Connection.prototype.addStream = function (stream) {
        this.streams[stream.getIdInParticipant()] = stream;
        this.room.getStreams()[stream.getIdInParticipant()] = stream;
    };
    Connection.prototype.getStreams = function () {
        return this.streams;
    };
    Connection.prototype.dispose = function () {
        for (var key in this.streams) {
            this.streams[key].dispose();
        }
    };
    Connection.prototype.sendIceCandidate = function (candidate) {
        console.debug((this.local ? "Local" : "Remote"), "candidate for", this.connectionId, JSON.stringify(candidate));
        this.openVidu.sendRequest("onIceCandidate", {
            endpointName: this.connectionId,
            candidate: candidate.candidate,
            sdpMid: candidate.sdpMid,
            sdpMLineIndex: candidate.sdpMLineIndex
        }, function (error, response) {
            if (error) {
                console.error("Error sending ICE candidate: "
                    + JSON.stringify(error));
            }
        });
    };
    Connection.prototype.initStreams = function (options) {
        for (var _i = 0, _a = options.streams; _i < _a.length; _i++) {
            var streamOptions = _a[_i];
            var streamOpts = {
                id: streamOptions.id,
                connection: this,
                recvVideo: (streamOptions.recvVideo == undefined ? true : streamOptions.recvVideo),
                recvAudio: (streamOptions.recvAudio == undefined ? true : streamOptions.recvAudio),
                audio: streamOptions.audio,
                video: streamOptions.video,
                data: streamOptions.data,
                mediaConstraints: streamOptions.mediaConstraints,
                audioOnly: streamOptions.audioOnly,
            };
            var stream = new Stream_1.Stream(this.openVidu, false, this.room, streamOpts);
            this.addStream(stream);
            this.streamsOpts.push(streamOpts);
        }
        console.info("Remote 'Connection' with 'connectionId' [" + this.connectionId + "] is now configured for receiving Streams with options: ", this.streamsOpts);
    };
    return Connection;
}());
exports.Connection = Connection;


/***/ }),

/***/ 529:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 529;


/***/ }),

/***/ 530:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(671);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__(702);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(706);




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 701:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_authentication_service__ = __webpack_require__(42);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AppComponent = (function () {
    function AppComponent(router, authenticationService) {
        this.router = router;
        this.authenticationService = authenticationService;
    }
    AppComponent.prototype.isVideoSessionUrl = function () {
        return (this.router.url.substring(0, '/lesson/'.length) === '/lesson/');
    };
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__(777),
            styles: [__webpack_require__(761)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__services_authentication_service__["a" /* AuthenticationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__services_authentication_service__["a" /* AuthenticationService */]) === 'function' && _b) || Object])
    ], AppComponent);
    return AppComponent;
    var _a, _b;
}());
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 702:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_routing__ = __webpack_require__(703);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_material__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_flex_layout__ = __webpack_require__(620);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_hammerjs__ = __webpack_require__(769);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_hammerjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_hammerjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__app_component__ = __webpack_require__(701);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_presentation_presentation_component__ = __webpack_require__(463);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_dashboard_dahsboard_component__ = __webpack_require__(460);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_lesson_details_lesson_details_component__ = __webpack_require__(462);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_profile_profile_component__ = __webpack_require__(464);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_video_session_video_session_component__ = __webpack_require__(465);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_error_message_error_message_component__ = __webpack_require__(704);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_dashboard_join_session_dialog_component__ = __webpack_require__(461);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__services_authentication_service__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__services_user_service__ = __webpack_require__(467);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__services_lesson_service__ = __webpack_require__(277);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__services_video_session_service__ = __webpack_require__(278);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__auth_guard__ = __webpack_require__(459);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





















var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_8__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_9__components_presentation_presentation_component__["a" /* PresentationComponent */],
                __WEBPACK_IMPORTED_MODULE_10__components_dashboard_dahsboard_component__["a" /* DashboardComponent */],
                __WEBPACK_IMPORTED_MODULE_11__components_lesson_details_lesson_details_component__["a" /* LessonDetailsComponent */],
                __WEBPACK_IMPORTED_MODULE_12__components_profile_profile_component__["a" /* ProfileComponent */],
                __WEBPACK_IMPORTED_MODULE_13__components_video_session_video_session_component__["a" /* VideoSessionComponent */],
                __WEBPACK_IMPORTED_MODULE_14__components_error_message_error_message_component__["a" /* ErrorMessageComponent */],
                __WEBPACK_IMPORTED_MODULE_15__components_dashboard_join_session_dialog_component__["a" /* JoinSessionDialogComponent */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_5__angular_material__["a" /* MaterialModule */],
                __WEBPACK_IMPORTED_MODULE_6__angular_flex_layout__["FlexLayoutModule"].forRoot(),
                __WEBPACK_IMPORTED_MODULE_4__app_routing__["a" /* routing */],
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_16__services_authentication_service__["a" /* AuthenticationService */],
                __WEBPACK_IMPORTED_MODULE_17__services_user_service__["a" /* UserService */],
                __WEBPACK_IMPORTED_MODULE_18__services_lesson_service__["a" /* LessonService */],
                __WEBPACK_IMPORTED_MODULE_19__services_video_session_service__["a" /* VideoSessionService */],
                __WEBPACK_IMPORTED_MODULE_20__auth_guard__["a" /* AuthGuard */],
            ],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_15__components_dashboard_join_session_dialog_component__["a" /* JoinSessionDialogComponent */],
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_8__app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 703:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_presentation_presentation_component__ = __webpack_require__(463);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_dashboard_dahsboard_component__ = __webpack_require__(460);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_lesson_details_lesson_details_component__ = __webpack_require__(462);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_profile_profile_component__ = __webpack_require__(464);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_video_session_video_session_component__ = __webpack_require__(465);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__auth_guard__ = __webpack_require__(459);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return routing; });







var appRoutes = [
    {
        path: '',
        component: __WEBPACK_IMPORTED_MODULE_1__components_presentation_presentation_component__["a" /* PresentationComponent */],
        pathMatch: 'full',
    },
    {
        path: 'lessons',
        component: __WEBPACK_IMPORTED_MODULE_2__components_dashboard_dahsboard_component__["a" /* DashboardComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_6__auth_guard__["a" /* AuthGuard */]]
    },
    {
        path: 'lesson-details/:id',
        component: __WEBPACK_IMPORTED_MODULE_3__components_lesson_details_lesson_details_component__["a" /* LessonDetailsComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_6__auth_guard__["a" /* AuthGuard */]]
    },
    {
        path: 'profile',
        component: __WEBPACK_IMPORTED_MODULE_4__components_profile_profile_component__["a" /* ProfileComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_6__auth_guard__["a" /* AuthGuard */]]
    },
    {
        path: 'lesson/:id',
        component: __WEBPACK_IMPORTED_MODULE_5__components_video_session_video_session_component__["a" /* VideoSessionComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_6__auth_guard__["a" /* AuthGuard */]]
    },
];
var routing = __WEBPACK_IMPORTED_MODULE_0__angular_router__["b" /* RouterModule */].forRoot(appRoutes, { useHash: true });
//# sourceMappingURL=app.routing.js.map

/***/ }),

/***/ 704:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ErrorMessageComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ErrorMessageComponent = (function () {
    function ErrorMessageComponent() {
        this.eventShowable = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* EventEmitter */]();
    }
    ErrorMessageComponent.prototype.closeAlert = function () {
        this.eventShowable.emit(false);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["y" /* Input */])(), 
        __metadata('design:type', String)
    ], ErrorMessageComponent.prototype, "errorTitle", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["y" /* Input */])(), 
        __metadata('design:type', String)
    ], ErrorMessageComponent.prototype, "errorContent", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["y" /* Input */])(), 
        __metadata('design:type', String)
    ], ErrorMessageComponent.prototype, "customClass", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["y" /* Input */])(), 
        __metadata('design:type', Boolean)
    ], ErrorMessageComponent.prototype, "closable", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["y" /* Input */])(), 
        __metadata('design:type', Number)
    ], ErrorMessageComponent.prototype, "timeable", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(), 
        __metadata('design:type', Object)
    ], ErrorMessageComponent.prototype, "eventShowable", void 0);
    ErrorMessageComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'app-error-message',
            template: __webpack_require__(779),
            styles: [__webpack_require__(763)]
        }), 
        __metadata('design:paramtypes', [])
    ], ErrorMessageComponent);
    return ErrorMessageComponent;
}());
//# sourceMappingURL=error-message.component.js.map

/***/ }),

/***/ 705:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return User; });
var User = (function () {
    function User(u) {
        this.id = u.id;
        this.name = u.name;
        this.nickName = u.nickName;
        this.roles = u.roles;
        this.lessons = [];
    }
    return User;
}());
//# sourceMappingURL=user.js.map

/***/ }),

/***/ 706:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
var environment = {
    production: false,
    envName: 'container',
    URL_BACK: window.location.origin
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ 761:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(44)();
// imports


// module
exports.push([module.i, "md-sidenav {\n  width: 250px;\n}\n\nmd-sidenav-container {\n  height: 100%;\n}\n\nfooter.page-footer {\n  margin: 0;\n}\n\nfooter h2 {\n  margin-top: 10px;\n}\n\n.sidenav-button {\n  width: 100%;\n}\n\nheader .fill-remaining-space {\n  -webkit-box-flex: 1;\n      -ms-flex: 1 1 auto;\n          flex: 1 1 auto;\n}\n\nheader #navbar-logo {\n  font-weight: bold;\n}\n\nfooter ul {\n  padding-left: 0;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 762:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(44)();
// imports


// module
exports.push([module.i, "md-card {\n  margin-top: 20px;\n}\n\nmd-card md-icon {\n  text-align: center;\n}\n\nspan.teacher {\n  font-size: 12px;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 763:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(44)();
// imports


// module
exports.push([module.i, ".fail {\n  background-color: rgba(167, 56, 65, 0.2);\n  color: #a73841;\n}\n\n.warning {\n  background-color: rgba(175, 110, 0, 0.2);\n  color: #af6e00;\n}\n\n.correct {\n  background-color: rgba(55, 86, 70, 0.25);\n  color: #375546;\n}\n\nmd-icon {\n  cursor: pointer;\n  float: right;\n}\n\nmd-card {\n  max-width: 400px;\n  margin-top: 20px;\n  margin-bottom: 20px;\n  box-shadow: none;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 764:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(44)();
// imports


// module
exports.push([module.i, ".attender-email {\n  font-size: 11px;\n}\n\n.no-margin-bottom {\n  margin-bottom: 0 !important;\n}\n\n.attender-row {\n  width: 100%;\n  margin-top: 20px;\n  min-height: 27px;\n}\n\n#new-attender-title {\n  margin-bottom: 5px;\n}\n\n\n/*Rotating animation*/\n\n@-webkit-keyframes rotating\n/* Safari and Chrome */\n\n{\n  from {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n  to {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n}\n\n@keyframes rotating {\n  from {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n  to {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n}\n\n.rotating {\n  -webkit-animation: rotating 1s linear infinite;\n  animation: rotating 1s linear infinite;\n  cursor: default !important;\n}\n\n.rotating:hover {\n  color: inherit !important;\n}\n\n\n/*End rotating animation*/\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 765:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(44)();
// imports


// module
exports.push([module.i, "h1 {\n  text-align: center;\n  display: block;\n}\n\nmd-input-container {\n  width: 100%;\n}\n\nmd-card-actions {\n  padding-left: 10px;\n  padding-right: 10px;\n  color: #9e9e9e;\n}\n\n.btn-container {\n  text-align: center;\n  padding-top: 20px;\n}\n\n.card-button {\n  margin-left: 10px !important;\n}\n\n.radio-button-div {\n  text-align: center;\n  margin-bottom: 10px;\n}\n\n#sign-up-as {\n  color: #9e9e9e;\n  display: block;\n  margin-top: 15px;\n  margin-bottom: 10px;\n}\n\ntable {\n  margin: 0 auto;\n  margin-top: 20px;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 766:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(44)();
// imports


// module
exports.push([module.i, "table {\n  margin-top: 15px;\n  border-collapse: separate;\n  border-spacing: 15px 17px;\n}\n\nth {\n  text-align: left;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 767:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(44)();
// imports


// module
exports.push([module.i, "h1 {\n  text-align: center;\n  margin: 0;\n  color: white;\n}\n\n#header-div {\n  position: absolute;\n  z-index: 1000;\n  width: 100%;\n  background: rgba(0, 0, 0, 0.4);\n}\n\nmd-icon {\n  font-size: 38px;\n  width: 38px;\n  height: 38px;\n  color: white;\n  transition: color .2s linear;\n}\n\nmd-icon:hover {\n  color: #ffd740;\n}\n\n#back-btn {\n  float: left;\n}\n\n.right-btn {\n  float: right;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 777:
/***/ (function(module, exports) {

module.exports = "<md-sidenav-container>\n\n  <md-sidenav #sidenav>\n    <button md-button (click)=\"router.navigate(['/lessons']); sidenav.close()\" class=\"sidenav-button\">Lessons</button>\n    <button md-button (click)=\"router.navigate(['/profile']); sidenav.close()\" class=\"sidenav-button\">Profile</button>\n    <button md-button (click)=\"sidenav.close(); authenticationService.directLogOut()\" class=\"sidenav-button\">Logout</button>\n  </md-sidenav>\n\n  <header *ngIf=\"!isVideoSessionUrl()\">\n    <md-toolbar color=\"primary\" class=\"mat-elevation-z6\">\n      <button md-button routerLink=\"/\" id=\"navbar-logo\">\n        OpenVidu Classroom Demo\n      </button>\n      <span class=\"fill-remaining-space\"></span>\n      <div *ngIf=\"authenticationService.isLoggedIn()\" fxLayout=\"row\" fxShow=\"false\" fxShow.gt-sm>\n        <button md-button routerLink=\"/lessons\">Lessons</button>\n        <button md-button routerLink=\"/profile\">Profile</button>\n        <button md-button (click)=\"authenticationService.directLogOut()\">LOGOUT</button>\n      </div>\n      <button *ngIf=\"authenticationService.isLoggedIn()\" md-button fxHide=\"false\" fxHide.gt-sm (click)=\"sidenav.open()\">\n        <md-icon>menu</md-icon>\n      </button>\n    </md-toolbar>\n  </header>\n\n  <main>\n    <router-outlet></router-outlet>\n  </main>\n\n  <footer *ngIf=\"!isVideoSessionUrl()\" class=\"page-footer back-primary color-secondary mat-elevation-z5\">\n    <div class=\"container\">\n      <div fxLayout=\"row\" fxLayout.xs=\"column\" fxLayoutAlign=\"start start\" fxLayoutAlign.xs=\"start\">\n        <div fxFlex=\"50%\" fxFlex.xs=\"100%\">\n          <h2>This is a sample application</h2>\n          <p class=\"grey-text text-lighten-4\">Implementing a secure real time app with OpenVidu</p>\n        </div>\n        <div fxFlex=\"50%\" fxFlex.xs=\"100%\">\n          <div fxLayout=\"row\" fxLayoutAlign=\"end start\" fxLayoutAlign.xs=\"start\">\n            <div fxFlex=\"50%\">\n              <h2>Technologies</h2>\n              <ul>\n                <li><a class=\"hover-link\" href=\"https://angular.io/\" target=\"_blank\">Angular</a></li>\n                <li><a class=\"hover-link\" href=\"https://material.angular.io/\" target=\"_blank\">Angular Material</a></li>\n                <li><a class=\"hover-link\" href=\"https://spring.io/\" target=\"_blank\">Spring Framework</a></li>\n                <li><a class=\"hover-link\" href=\"https://www.kurento.org/\" target=\"_blank\">Kurento</a></li>\n              </ul>\n            </div>\n            <div fxFlex=\"50%\">\n              <h2>Connect</h2>\n              <ul>\n                <li><a class=\"hover-link\" href=\"https://github.com/OpenVidu\" target=\"_blank\">GitHub repository</a></li>\n              </ul>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </footer>\n\n</md-sidenav-container>\n"

/***/ }),

/***/ 778:
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"!this.lessons\" class=\"cssload-container\">\n  <div class=\"cssload-tube-tunnel\"></div>\n</div>\n\n<div *ngIf=\"this.lessons\" fxLayout=\"row\" fxLayoutAlign=\"center center\">\n  <div class=\"div-inner-main\" [style.xs]=\"{'width': '100%'}\">\n\n    <div *ngIf=\"!addingLesson\" fxLayout=\"row\" fxLayoutAlign=\"center center\">\n      <div fxFlex=\"80%\">MY LESSONS</div>\n      <md-icon fxFlex=\"20%\" fxLayoutAlign=\"end center\" *ngIf=\"authenticationService.isTeacher()\" (click)=\"addingLesson = true\"\n        [title]=\"'Add lesson'\">add_circle_outline</md-icon>\n    </div>\n\n    <div *ngIf=\"addingLesson\">\n      <div>NEW LESSON</div>\n      <form #newLessonForm (ngSubmit)=\"newLesson(); newLessonForm.reset()\" [class.filtered]=\"sumbitNewLesson\">\n        <md-input-container>\n          <input mdInput placeholder=\"Title\" [(ngModel)]=\"lessonTitle\" name=\"lessonTitle\" id=\"lessonTitle\" type=\"text\" autocomplete=\"off\"\n            required>\n        </md-input-container>\n        <div class=\"block-btn\">\n          <button md-button type=\"submit\" [disabled]=\"sumbitNewLesson\">Send</button>\n          <button md-button (click)=\"addingLesson = false; newLessonForm.reset()\" [disabled]=\"sumbitNewLesson\">Cancel</button>\n        </div>\n      </form>\n    </div>\n\n    <md-card *ngFor=\"let lesson of lessons\">\n      <div fxLayout=\"row\" fxLayoutAlign=\"center center\" fxLayoutGap=\"10px\">\n        <span fxFlex=\"70%\" class=\"title\">{{lesson.title}}</span>\n        <span fxFlex=\"70%\" *ngIf=\"this.authenticationService.isStudent()\" class=\"teacher\">{{lesson.teacher.nickName}}</span>\n        <md-icon fxFlex=\"15%\" *ngIf=\"this.authenticationService.isTeacher()\" (click)=\"goToLessonDetails(lesson)\" [title]=\"'Modify lesson'\">mode_edit</md-icon>\n        <md-icon fxFlex=\"15%\" (click)=\"goToLesson(lesson)\" [title]=\"'Go to lesson!'\">play_circle_filled</md-icon>\n      </div>\n    </md-card>\n\n    <div *ngIf=\"lessons.length === 0 && authenticationService.isStudent() && !addingLesson\">\n      <app-error-message [errorTitle]=\"'You do not have any lessons'\" [errorContent]=\"'Your teacher must invite you'\" [customClass]=\"'warning'\"\n        [closable]=\"false\"></app-error-message>\n    </div>\n\n    <div *ngIf=\"lessons.length === 0 && authenticationService.isTeacher() && !addingLesson\">\n      <app-error-message [errorTitle]=\"'You do not have any lessons'\" [errorContent]=\"'You can add one by clicking on the icon above'\"\n        [customClass]=\"'warning'\" [closable]=\"false\"></app-error-message>\n    </div>\n\n  </div>\n</div>\n"

/***/ }),

/***/ 779:
/***/ (function(module, exports) {

module.exports = "<md-card [ngClass]=\"customClass\">\n  <md-icon *ngIf=\"closable\" (click)=\"closeAlert()\">clear</md-icon>\n  <md-card-title>{{this.errorTitle}}</md-card-title>\n  <md-card-subtitle [innerHTML]=\"this.errorContent\"></md-card-subtitle>\n</md-card>\n"

/***/ }),

/***/ 780:
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"lesson\" fxLayout=\"row\" fxLayoutAlign=\"center center\">\n  <div class=\"div-inner-main\" [style.xs]=\"{'width': '100%'}\">\n\n    <div *ngIf=\"!editingTitle\" fxLayout=\"row\" fxLayoutAlign=\"center center\">\n      <md-icon fxFlex=\"15%\" fxLayoutAlign=\"start center\" (click)=\"router.navigate(['/lessons'])\" [title]=\"'Back to lessons'\">keyboard_arrow_left</md-icon>\n      <h2 fxFlex=\"70%\">{{lesson.title}}</h2>\n      <md-icon fxFlex=\"15%\" fxLayoutAlign=\"end center\" (click)=\"editingTitle = true; titleEdited = lesson.title\" [title]=\"'Edit lesson'\">mode_edit</md-icon>\n    </div>\n\n    <div *ngIf=\"editingTitle\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\n      <form #editLessonForm (ngSubmit)=\"editLesson(); editLessonForm.reset()\" [class.filtered]=\"sumbitEditLesson\">\n        <md-input-container>\n          <input mdInput placeholder=\"Title\" [(ngModel)]=\"titleEdited\" name=\"lessonTitle\" type=\"text\" autocomplete=\"off\" required>\n        </md-input-container>\n        <div class=\"block-btn\">\n          <button md-button type=\"submit\" [disabled]=\"sumbitEditLesson\">Send</button>\n          <a md-button (click)=\"editingTitle = false; titleEdited = ''\" [disabled]=\"sumbitEditLesson\">Cancel</a>\n          <a md-button (click)=\"deleteLesson()\" [disabled]=\"sumbitEditLesson\">Delete lesson</a>\n        </div>\n      </form>\n    </div>\n\n    <form #addAttendersForm (ngSubmit)=\"addLessonAttenders(); addAttendersForm.reset()\" [class.filtered]=\"sumbitAddAttenders\">\n      <h4 id=\"new-attender-title\">New attender</h4>\n      <md-input-container>\n        <input mdInput placeholder=\"Email\" [(ngModel)]=\"emailAttender\" name=\"attenderEmail\" type=\"text\" autocomplete=\"off\" required>\n      </md-input-container>\n      <div class=\"block-btn\">\n        <button md-button type=\"submit\" [disabled]=\"sumbitAddAttenders\">Send</button>\n        <a md-button (click)=\"addAttendersForm.reset()\" [disabled]=\"sumbitAddAttenders || emailAttender == null\">Cancel</a>\n      </div>\n    </form>\n\n    <app-error-message *ngIf=\"addAttendersCorrect\" (eventShowable)=\"addAttendersCorrect = false\" [errorTitle]=\"attCorrectTitle\"\n      [errorContent]=\"attCorrectContent\" [customClass]=\"'correct'\" [closable]=\"true\"></app-error-message>\n    <app-error-message *ngIf=\"addAttendersError\" (eventShowable)=\"addAttendersError = false\" [errorTitle]=\"attErrorTitle\" [errorContent]=\"attErrorContent\"\n      [customClass]=\"'fail'\" [closable]=\"true\"></app-error-message>\n\n    <div fxLayout=\"row\" fxLayout.xs=\"column\" fxLayoutGap=\"20px\" fxLayoutAlign=\"space-between center\" fxLayoutAlign.xs=\"start\"\n      class=\"attender-row\">\n      <div fxFlex=\"90%\" class=\"no-margin-bottom\">\n        <div fxLayout=\"row\" fxLayout.xs=\"column\" fxLayoutAlign=\"space-between center\" fxLayoutAlign.xs=\"start\" fxLayoutGap=\"20px\">\n          <div class=\"no-margin-bottom\" fxFlex>{{authenticationService.getCurrentUser().nickName}}</div>\n          <div class=\"attender-email\" fxFlex>{{authenticationService.getCurrentUser().name}}</div>\n        </div>\n      </div>\n      <div fxFlex=\"10%\"></div>\n    </div>\n    <div *ngFor=\"let attender of lesson.attenders; let i = index\">\n      <div *ngIf=\"attender.id != authenticationService.getCurrentUser().id\" fxLayout=\"row\" fxLayoutAlign.xs=\"start\" fxLayoutGap=\"20px\"\n        class=\"attender-row\">\n        <div fxFlex=\"90%\">\n          <div fxLayout=\"row\" fxLayout.xs=\"column\" fxLayoutAlign=\"space-between center\" fxLayoutAlign.xs=\"start\" fxLayoutGap=\"20px\">\n            <div class=\"no-margin-bottom\" fxFlex>{{attender.nickName}}</div>\n            <div class=\"attender-email\" fxFlex>{{attender.name}}</div>\n          </div>\n        </div>\n        <div fxFlex=\"10%\">\n          <md-icon *ngIf=\"!this.arrayOfAttDels[i]\" (click)=\"deleteLessonAttender(i, attender)\" [title]=\"'Remove attender'\">clear</md-icon>\n          <md-icon *ngIf=\"this.arrayOfAttDels[i]\" class=\"rotating\">cached</md-icon>\n        </div>\n      </div>\n    </div>\n    \n  </div>\n</div>\n"

/***/ }),

/***/ 781:
/***/ (function(module, exports) {

module.exports = "<div fxLayout=\"row\" fxLayoutAlign=\"center center\">\n  <div class=\"div-inner-main\" [style.xs]=\"{'width': '100%'}\">\n\n    <h1>OpenVidu Classroom Demo</h1>\n\n    <div fxLayout=\"column\" fxLayoutAlign=\"space-around center\">\n\n      <md-card>\n        <md-card-content>\n\n          <div *ngIf=\"submitProcessing\" class=\"cssload-container\">\n            <div class=\"cssload-tube-tunnel\"></div>\n          </div>\n\n          <form #myForm (ngSubmit)=\"onSubmit()\" [class.filtered]=\"submitProcessing\">\n\n            <div>\n              <md-input-container>\n                <input mdInput placeholder=\"Email\" [(ngModel)]=\"email\" name=\"email\" id=\"email\" type=\"email\" required>\n              </md-input-container>\n            </div>\n\n            <div *ngIf=\"!loginView\">\n              <md-input-container>\n                <input mdInput placeholder=\"Name\" [(ngModel)]=\"nickName\" name=\"nickName\" id=\"nickName\" type=\"text\" autocomplete=\"off\" required>\n              </md-input-container>\n            </div>\n\n            <div>\n              <md-input-container>\n                <input mdInput placeholder=\"Password\" [(ngModel)]=\"password\" name=\"password\" id=\"password\" type=\"password\" required>\n              </md-input-container>\n            </div>\n\n            <div *ngIf=\"!loginView\">\n              <md-input-container>\n                <input mdInput placeholder=\"Confirm password\" [(ngModel)]=\"confirmPassword\" name=\"confirmPassword\" id=\"confirmPassword\" type=\"password\"\n                  autocomplete=\"off\" required>\n              </md-input-container>\n            </div>\n\n            <div *ngIf=\"!loginView\" class=\"radio-button-div\">\n              <span id=\"sign-up-as\">Sign up as...</span>\n              <md-radio-group [(ngModel)]=\"roleUserSignup\" name=\"roleUserSignup\" id=\"roleUserSignup\">\n                <md-radio-button value='student'>Student</md-radio-button>\n                <md-radio-button value='teacher'>Teacher</md-radio-button>\n              </md-radio-group>\n            </div>\n\n            <app-error-message *ngIf=\"fieldsIncorrect\" (eventShowable)=\"fieldsIncorrect = false\" [errorTitle]=\"errorTitle\" [errorContent]=\"errorContent\"\n              [customClass]=\"customClass\" [closable]=\"true\"></app-error-message>\n\n            <div class=\"btn-container\">\n              <button md-raised-button color=\"accent\" type=\"submit\" *ngIf=\"loginView\" id=\"log-in-btn\">Log in</button>\n              <button md-icon-button *ngIf=\"loginView\" type=\"button\" (click)=\"tableShow=!tableShow\" mdTooltip=\"Show registered users\" mdTooltipPosition=\"right\"><md-icon>info_outline</md-icon></button>\n              <button md-raised-button color=\"primary\" type=\"submit\" *ngIf=\"!loginView\" id=\"sign-up-btn\">Sign up</button>\n            </div>\n\n          </form>\n\n          <div *ngIf=\"loginView && tableShow\">\n            <table>\n              <tr>\n                <th>Email</th>\n                <th>Password</th>\n              </tr>\n              <tr>\n                <td>teacher@gmail.com</td>\n                <td>pass</td>\n              </tr>\n              <tr>\n                <td>student1@gmail.com</td>\n                <td>pass</td>\n              </tr>\n              <tr>\n                <td>student2@gmail.com</td>\n                <td>pass</td>\n              </tr>\n            </table>\n          </div>\n\n        </md-card-content>\n\n        <md-card-actions>\n          <div *ngIf=\"loginView\">Not registered yet?<button md-button (click)=\"setLoginView(false); tableShow=false; myForm.reset()\" class=\"card-button\">Sign up</button></div>\n          <div *ngIf=\"!loginView\">Already registered?<button md-button (click)=\"setLoginView(true); myForm.reset()\" class=\"card-button\">Log in</button></div>\n        </md-card-actions>\n\n      </md-card>\n\n    </div>\n\n  </div>\n</div>\n"

/***/ }),

/***/ 782:
/***/ (function(module, exports) {

module.exports = "<div fxLayout=\"row\" fxLayoutAlign=\"center center\">\n  <div class=\"div-inner-main\" [style.xs]=\"{'width': '100%'}\">\n\n    <div>MY PROFILE</div>\n    <table>\n      <tr>\n        <td>Name</td>\n        <th>{{authenticationService.getCurrentUser().nickName}}</th>\n      </tr>\n      <tr>\n        <td>Email</td>\n        <th>{{authenticationService.getCurrentUser().name}}</th>\n      </tr>\n    </table>\n    \n  </div>\n</div>\n"

/***/ }),

/***/ 783:
/***/ (function(module, exports) {

module.exports = "<div id=\"header-div\">\n    <md-icon id=\"back-btn\" (click)=\"location.back()\" [title]=\"'Back to lessons'\">keyboard_arrow_left</md-icon>\n    <md-icon class=\"right-btn\" (click)=\"toggleFullScreen()\" [title]=\"'Fullscreen'\">{{fullscreenIcon}}</md-icon>\n    <md-icon class=\"right-btn\" (click)=\"toggleLocalVideo()\" [title]=\"'Toggle video'\">{{videoIcon}}</md-icon>\n    <md-icon class=\"right-btn\" (click)=\"toggleLocalAudio()\" [title]=\"'Toggle audio'\">{{audioIcon}}</md-icon>\n    <h1>{{lesson?.title}}</h1>\n</div>\n<div id=\"publisher\"></div>\n<div id=\"subscriber\"></div>"

/***/ })

},[1077]);
//# sourceMappingURL=main.bundle.js.map