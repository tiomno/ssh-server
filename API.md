# SSH Keys Manager API

  Returns JSON data with the ssh private key and the port number to reverse ssh a gateway.

* **URL**

  /api/sshKeyGen

* **Method:**

  `GET` | `POST`
  
*  **URL or Data Params**

   **Required:**
 
   The MAC address of the gateway which will open the reverse ssh connection
 
   `macaddress=[string]`

   **Required:**
 
   The time (ms) the reverse ssh connection will be open
 
   `timeout=[integer]`

* **Success Response:**

  * **Code:** 200 <br>
    **Content:** `{"key": [string representing the ssh private key], "port": [integer]}`<br>
    **Example:** `{"key":"-----BEGIN RSA PRIVATE KEY-----`<br>
    `MHHOpAIBAAKCAQEA1sbRE2LmfmQBMWlfXv8f2IAimG7eFYSdZ2xdVEQyskZFU3is`<br>
    `lCkGdvC++I0P8MC/wYXKtO5ysHd5BHu00+PSgLX9vzALuPVOcMYI8i6co+QzXR7e`<br>
    `f17rpTrbl+p8Jca+M0vWbBsnP5c78nHcDEdorekufdY8ZTWDb0zEkeOMV+JpQ6VW`<br>
    `fhdPN33kn+nJPv8MtRDfaKn7yLLqb7GcOO3+u8/LJJNcFsK/ix/4FMbaFjOpRsnX`<br>
    `KBuIusHiX+nh24ApfSH8fDDCmNQH31F2Pv48iYB+K7GsdJmFbEB0RzL+QxB5DGXZ`<br>
    `XaiY701mvrZeLrZl1OHKmlnTqihYBPO3HM0heyw6732BAoIBAD9WjIvaC71UQqHO`<br>
    `wGhkdoDDcPBhKa9Q15aLd46FOiom3QT7vnFHE/f5kWf9Oak3PpWUni3zb/EompC+`<br>
    `5pniQs7gXL+ILLzT4tkRHcxGAL24a4lXtCf91yJ4FBBd/1SooqjAAbEJ5O407GHY`<br>
    `QBuC55T6AlLr3g2+1U76ZbHcWCQGP9V+ENxvzflF2H/LJKIEtBI6kCGOFavvXjGc`<br>
    `s/aKdaPn0hDAH1TyBQSW9YE1CzU3s4PmBPFdhdpT75xkPSfy62yM0bCtC8aRuQx/`<br>
    `/VOOySz+lDGjpQ0Nkc6plSaW9kIeaNPY7TQthU8rAQtQaB6Dx0CT2nTyD0uljmH9`<br>
    `znq66G0CgYEA6r+goQKKpffe4eHWaEKsZJeZjBoQTORm2zWY7AX1eCjL3mcFHYES`<br>
    `IZjJmWb0bqcAH/XsYP/SiDaLsROteTuCDP1mKvU1YD23vUPneBnYi+5W2QJ9aoTe`<br>
    `AFCrxjmjyc6twbVhYqMui9JDEh+2w8t0wzogWB2HMEQZBi7Xg3aGcCsCgYEA6jhV`<br>
    `bHPKuaHoIU4dR++Td4EUKce3YIekjWtOPxBvAZh+MkXdZlj0IYIetcfXr5tMKemK`<br>
    `mTNQC7zQPbfLDs2i6NxlwgKOBYWR1siYPGEmGqCz3/7cFb1PoqtKqlC9fMnWkF4b`<br>
    `bmHacnXm16uF3oLxBlpyQCgR4iXEYACFO+vFfCMCgYEA52VXV/8iXnFUIYK1D3bR`<br>
    `aiLJt4GlmbX28ZQGlnlVO0mzlBomv6uQDNAHwQ/sV/qEM/z9MaxageyKjFViRUN0`<br>
    `cYuDH0swfxq3OHhr/UY039Jjh2xd5hbsopDikfYVToNNYcmCInHKGwd7F61tQdkW`<br>
    `0q5EXbdVoC0wIZkg1TSLVpsCgYEAnHiB6O/6MMVPFGDhAtu0QpPC6p53jU9QyQE0`<br>
    `xsCtx/0d4Wv3Gpa2kWQiLAKTvscavK0+YFZ9VToQTArq5rrN6I7ElDWst1eiNEDS`<br>
    `IxQrpoJRaIUUdpmACAYy3VEPJbyZUNztqnJIw0qsqsv1pM8JQdtOlDmwqMneRNxU`<br>
    `JdG+ns0CgYA7k+7VzQFOdLCcC1Eo2zTcoRcpWGzn8xeR1CY7GTsUCnlucaZ7MQMg`<br>
    `hJSvkn6rLB8NonveRKpCuMXaK/mnlgj2HcadiRLRXHN0QrCjjGKyQXsZ2FbZsz0u`<br>
    `p6uLwtA58rAZgtK4zVEDOHYXuj8ZY1CRt3+3ld+-ueir7363kityg==`<br>
    `-----END RSA PRIVATE KEY-----`<br>
    `","port":20001}`
 
* **Error Response:**

  * **Code:** 200 <br>
    **Content:** `{"error": [string with details of the error] }` <br>
    **Example:** `{"error":"macaddress is a required parameter for this action"}`

* **Example of a request in JavaScript (jQuery)**

  ```javascript
      $.ajax({
          url: 'http://ssh-server-ip:8080/api/sshKeyGen',
          data: {
              macaddress: '001348026AFE',
              timeout: 1800000
          },
          dataType: 'json',
          type: 'POST',
          error: function() {
              console.log('An unspecified error occurred. Please try again.');
          },
          success: function(response) {
              if(response.error) {
                  console.log(reponse.error);
              } else {
                  console.log(reponse);
              }
          }
      });
  ``` 
    
* **Example of a request in PHP**
    
  ```PHP
      $postData = http_build_query([
          'macaddress' => '001348026AFE',
          'timeout' => 1800000
      ]);
      
      $context = [
          'http' => [
              'method'  => 'POST',
              'header'  => 'Content-type: application/x-www-form-urlencoded',
              'content' => $postData
          ]
      ];
      
      $sshResponse = json_decode(file_get_contents('http://ssh-server-ip:8080/api/sshKeyGen', false, stream_context_create($context)));
      
      if(empty($sshResponse->error)) {
          error_log(print_r($sshResponse->error, true));
      } else {
          error_log($sshResponse->error);
      }
  ``` 

* **Example of a request with curl**

  ```BASH
      curl -v -X POST -d 'macaddress=001348026AFE&timeout=1800000' http://ssh-server:8080/api/sshKeyGen
  ``` 

* **Notes:**

  This API is meant to be behind a firewall that only grants access to requests from the main server. Hence, the process that consumes the API should run on the server; if the firewall is active, no connection from the user's browser will work.
  
  The API will listen on port **8080**
