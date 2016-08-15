# node-red-node-tmf
A set of node-red nodes to learn about the TMF APIs http://projects.tmforum.org/wiki/display/API/Open+API+Table
####A [Node-RED](http://nodered.org)  Palette for [TMF API](http://projects.tmforum.org/wiki/display/API/Open+API+Table) Nodes

This directory contains node for the [TMF APIs](http://projects.tmforum.org/wiki/display/API/Open+API+Table)
The API follows the CRUD paradigm, supporting partial updates of objects. 
The nodes are for educational purposes running against a sandbox provided by [TMF](www.tmf.org)

License: [Apache V2](http://www.apache.org/licenses/LICENSE-2.0)

Version: 0.0.1
Date: 15.7.2016

Install
-------
Install from [npm](http://npmjs.org)
```
npm install node-red-node-tmf-api-beta
```
or in bluemix add this line to package.json
```
  "node-red-node-tmf":"0.x"
```
Usage
-----

This package adds a new palette to your workspace with one node per API of  [TMF APIs](http://projects.tmforum.org/wiki/display/API/Open+API+Table)
The payload is forwarded transparently.


Parameters are carried as following:
- For operations requiring an id, the ID needs to be  provided as a number in `msg.payload.id`
- For operations allowing filtering, the filter needs to be  provided as a comma-separated string in `msg.payload.fields`
- For operations requiring a payload to be sent,  the payload needs to be provided in `msg.payload.body`
- to add/overwrite headers (especially impleetning security if conencting to API Connect instance) add them to `msg.header` array as `msg.header['content-type']='application/json'`


Authors
-------
Author: [Josef Reisinger](mailto:josef.reisinger@de.ibm.com?subject=TMF+API+Nodes+on+github)
