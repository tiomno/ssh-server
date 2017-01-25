# SSH Keys Manager

*This is a lightweight service to create public/private key pairs for reverse ssh the gateways.*
 
*It's implemented in node.js with actionhero.js framework.*

## To install:
(assuming you have [node](http://nodejs.org/) and NPM installed)

`npm install`

## To Run:
`npm start`

## To Test:
`npm test`

[//]: # (This is just a comment to test GitLab and the CI Runners: 20161213 22:02:29)

## Overview
 
The SSH Keys Manager generates pairs of public/private SSH keys that can be used to open a reverse SSH connection to a gateway. The process is done in the following order:
  
  * _The Cloud makes a request to the SSH Keys Manager API asking for a private key and a port to connect to a gateway via a reverse SSH connection_
  
  Admin Cloud users that have `Manage Reverse SSH` permission have access to an option in the Admin Panel to request a private key and port. When this option is triggered, the Cloud makes a request to this service through the port 8080 by passing a timeout (_ms_) and gateway MAC address as parameters. The timeout is used by this service to delete any public key generated after that time has elapsed. The MAC address is used as an index to store and manage assigned public keys.
  
  * _This service receives a request from the Cloud and starts the process of generating and storing SSH keys_

  The API running on this service validates the request parameters and generates a pair of public and private SSH keys calling the OS ssh-keygen command.
  
  * _A free port to be used for the reverse SSH connection is sought_
   
  A valid port is in the range of 20,000 to 25,000. The API starts searching for a free port looking up the API local storage and then checks that there is no other OS process using it. The API local storage is powered by a Redis server which keeps a hash key updated with the list of MAC addresses and ports that are currently in use.
  
  * _After finding a free port, the public key is made available for its use on the ssh-server_
  
  When this service finds a valid free port, all the information is ready to be stored and replied to the Cloud. First, the public key is saved in the `authorized_keys` file on the ssh-server to allow ssh connections from the private key keeper. Then, a tuple with the MAC address and the port is saved in Redis under the hash key `sshsessions` to lock the port and bind it to the MAC address.
  
  * _A background task is scheduled to be triggered after the timeout has elapsed_
  
  At this stage, the API enqueues a delayed task to run when the timeout has passed. This task removes the public key from the `authorized_keys` file and unbinds the MAC address to the port on Redis, unlocking it for further use.
  
  * _This service creates a response to the Cloud after having the necessary data ready to be sent_
  
  After gathering a valid free port plus a private key from the OS, and having set up the binds to lock the port and make available the public key, this service is ready to respond to the Cloud. The private key and the port form the response which the gateway can use to start a reverse ssh connection through the ssh-server.
