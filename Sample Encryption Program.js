signCert = "PRIVATE_KEY_HERE";
encCert = "MAYBANK_ENCRYPTION_CERT_HERE";
let encAlg = "A256CBC-HS512";
let hdrKeyEnc = "RSA-OAEP-256";

let repyld = JSON.stringify("REQUEST_BODY_HERE");
var buffer = Buffer.from(repyld);

var jwsHdrsign = jose.createJWSHeader(signCert, "RS256");
jose.createJWSSigner(jwsHdrsign).update(buffer).sign('compact', function (error, jwsObj) {
    if (error) {
        console.error("Signature Generation Failed:" + error);
        session.reject(signerrcode);
    } else {
        console.log("signout: " + jwsObj);
        try {
            var jweHdr = jose.createJWEHeader(encAlg);
            jweHdr.setProtected('alg', hdrKeyEnc);
            jweHdr.setProtected('cty', 'JWT');
            jweHdr.setKey(encCert);
            jose.createJWEEncrypter(jweHdr).update(jwsObj).encrypt('compact', function (error, jweCompactObj) {
                if (error) {
                    console.error("Generating Encrypted Data Failed:" + error);
                    session.reject(encerrorcode);
                    return
                } else {
                    session.output.write(jweCompactObj);
                    console.log("Encrypted Data:" + jweCompactObj);
                }
            });
        } catch (e) {
            console.error("Generating Encrypted Data Failed:" + error);
            session.reject(encerrorcode);
        }
    }
})