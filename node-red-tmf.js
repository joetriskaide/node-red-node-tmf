/**
 * Copyright 2014,2016 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
/*eslint-env node */
/*
 * Put this file under the "nodes" directory in your NODES-RED project and restart the app.
 *    yaml2node initial version written by jsoef.reisinger@de.ibm.com
 */
module.exports = function(RED) {
    try {
  
        var https = require("https");
        function GenericAPI(config) {
            console.log("Enter GenericAPIRq ");
            try {
                RED.nodes.createNode(this, config);
                var node = this;
                var options = {
		    		hostname: config.hostname,
                    headers: {
                        "Content-Type": "application/json"
                    }
                };
                var GenericAPIRsp = function(rsp, msg) {
                    console.log("Enter GenericAPIRsp ");
                    try {
                        var data = "";
                        rsp.setEncoding("utf8");
                        rsp.on("data", function(chunk) {
                            data += chunk;
                        });
                        rsp.on("end", function() {
                            console.log("Enter GenericAPIRsp.on.end ");
                            try {
                                console.log("========= data =============");
                                console.log(data);
                                try {
                                    msg.payload = JSON.parse(data);
                                } catch (e) {
                                    msg.payload = data;
                                }
                                node.httpStatus = rsp.statusCode;
                                if (rsp.headers["content-type"]) msg.contentType = rsp.headers["content-type"];
                                node.send(msg);
                            } catch (e) {
                                console.dir(e);
                                msg.httpStatus = 500;
                                msg.payload = e;
                                msg.contentType = "application/json";
                                node.send(msg);
                            }
                            console.log("Leave GenericAPIRsp.on.end ");
                        });
                    } catch (e) {
                        console.dir(e);
                        msg.httpStatus = 500;
                        msg.payload = e;
                        msg.contentType = "application/json";
                        node.send(msg);
                    }
                    console.log("Leave GenericAPIRsp ");
                };
                //
                // for the http request, we need these items:
                // o the method => part of a JSON string represented in the <option>'s value
                // o the path => part of a JSON string represented in the <option>'s value
                // o the base url => part of default config
                var GenericAPIRq = function(msg) {
                    console.log("Enter GenericAPIRq ");
                    try {
                        var req;
                        var method = JSON.parse(config.method);
                        var baseUrl=config.baseurl;
                        var delim="?";
                		var k;
                        
 						//
 						// configure method as from option value
 						//
 						options.method = method.m.toLowerCase();
                        options.path = baseUrl+"/"+method.p;
                        //
                        // add id field if sender provided one
                        //
                        if (msg.payload.id) options.path += "/" + msg.payload.id;
                        //
                        // make sure no double slashes are in path
                        options.path=options.path.replace(/\/\//g, "/");
                        //
                        // add a setof attributes to be returned, if sender provides one
                        //
                        if (msg.payload.fields) {
                        	options.path += "?fields=" + encodeURI(msg.payload.fields);
                        	delim="&";
                        }
                        //
                        // add filter if sender provides one. A filter is a list of name=value pairs, delimited by comma
                        //
                        if (msg.payload.filter) options.path += delim + encodeURI(msg.payload.filter);
                        //
                        // Forward X-IBM-Client-Id and X-IBM-Client-Secret header.
                        //
                        if (msg.headers !== undefined) for (k in msg.headers) {
                        	options.headers[k]=msg.headers[k];
                        }
                        //
                        // execute the request
                        //
                        req = https.request(options, function(rsp) {
                            GenericAPIRsp(rsp, msg);
                        });
                        //
                        // add body if provided by sender
                        //
                        if (options.method === "put" || options.method === "post" || options.method === "patch") {
                        	if (msg.payload.body) {
	                            var body = msg.payload.body;
	                            if (typeof msg.payload !== "string") body = JSON.stringify(msg.payload.body);
	                            console.log("========= body =============");
	                            console.log(body);
	                            req.write(body);
                           	} else {
                           		node.log("got method="+options.method+", but no body");
                           	}
                        }
                        req.on("error", function(e) {
                            msg.httpStatus = 500;
                            msg.payload = e;
                            node.send(msg);
                        });
                        console.log("========= options =============");
                        console.log(JSON.stringify(options, null, 4));
                        req.end();
                } catch (e) {
                        console.dir(e);
                        msg.httpStatus = 500;
                        msg.payload = e;
                        msg.contentType = "application/json";
                        node.send(msg);
                    }
                    console.log("Leave GenericAPIRq ");
                };
                this.on("input", function(msg) {
                    GenericAPIRq(msg);
                });
            } catch (e) {
                console.dir(e);
            }
        }
        
    RED.nodes.registerType("api-customermanagement", GenericAPI);
    RED.nodes.registerType("product-catalog-management", GenericAPI);
    RED.nodes.registerType("api-partymanagement", GenericAPI);
    RED.nodes.registerType("api-productinventory", GenericAPI);
    RED.nodes.registerType("api-productordering", GenericAPI);
    RED.nodes.registerType("api-slamanagement", GenericAPI);
    RED.nodes.registerType("api-troubleticket", GenericAPI);
    RED.nodes.registerType("api-usagemanagement", GenericAPI);
    RED.nodes.registerType("api-billingmanagement", GenericAPI);

    } catch (e) {
        console.log(e);
    }
    console.log("loaded tmf-node-red-node-generic");
};
