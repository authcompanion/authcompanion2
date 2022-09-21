# Integrate

JWTs (JSON Web Token, pronounced 'jot') are a popular way of handling auth and are particularly suited for microserverice arcitectures. 

>JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. The claims in a JWT are encoded as a JSON object that is used as the payload of a JSON Web Signature (JWS) structure or as the plaintext of a JSON Web Encryption (JWE) structure, enabling the claims to be digitally signed or integrity protected with a Message Authentication Code (MAC) and/or encrypted. - [IETF](https://www.rfc-editor.org/rfc/rfc7519)

Authcompanion provides JWTs after a user successfully login and registration for use on your web application frontends and authentication into API backends. In this article we'll describe how to use these JWTs. 

