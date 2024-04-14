import forge from '@vilic/node-forge';
import { TokenClaims } from '../types/interfaces';

const pki = forge.pki;
type KeyPair = forge.pki.rsa.KeyPair;

// this generates an RSA key pair but does it asynchronously and using built-in browser functionality where available
// it is safer than the synchronous version and the recommendation from the library maintainers
export const safeGenerate = (options?: forge.pki.rsa.GenerateKeyPairOptions): Promise<KeyPair> =>
    new Promise((resolve, reject) => {
        pki.rsa.generateKeyPair(options, (err, keyPair) => {
            if (err) {
                reject(err);
            } else {
                resolve(keyPair);
            }
        });
    });

// given a base64 encoded ciphertext and a private key in PEM encoding, decrypt the ciphertext
export const decryptBase64FromPEM = (ciphertext: string, privateKeyPEM: string) => {
    const privateKey = privateKeyFromPEM(privateKeyPEM);
    // use SHA-256 digests here (also used on the server side so need to match)
    const decryptedMessage = privateKey?.decrypt(decode64(ciphertext), 'RSA-OAEP', {
        md: forge.md.sha256.create(),
        mfg1: {
            md: forge.md.sha256.create(),
        },
    });
    return decryptedMessage;
};

// verify an X.509 certificate given it in PEM encoding and return the embedded public key
export const verifyX509Cert = (x509CertPEM: string): forge.pki.rsa.PublicKey => {
    const certificate = certificateFromPEM(x509CertPEM);
    // returns true if it is verified, false otherwise
    const verified = certificate?.verify(certificate);
    const now = new Date();
    // validate it is still in date
    if (!verified || certificate?.validity?.notAfter <= now || certificate?.validity?.notBefore >= now) {
        throw new Error('Certificate invalid!');
    }
    return certificate?.publicKey as forge.pki.rsa.PublicKey;
};

// verify a signed message, given the message and signature in base64 encoding and the public key in PEM encoding
export const verify = (message: string, signature: string, publicKeyPEM: string) => {
    // create the PSS padding - this must be the same as was used by whoever signed the message
    const pss = forge.pss.create({
        md: forge.md.sha256.create(),
        mgf: forge.mgf.mgf1.create(forge.md.sha256.create()),
        saltLength: 20,
    });

    const publicKey = pki.publicKeyFromPem(publicKeyPEM);

    const digest = forge.md.sha256.create();
    digest.update(decode64(message));

    return publicKey.verify(digest.digest().getBytes(), decode64(signature), pss);
};

// generate an X.509 certificate given a key pair and the user's basic details
export const generateCertificate = (keyPair: KeyPair, user: TokenClaims) => {
    const cert = pki.createCertificate();
    cert.publicKey = keyPair.publicKey;
    cert.serialNumber = '01';
    // make certificate last for 1 year
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
    // set issuer and subject details (same in this case since it is self signed)
    // for my purposes these are just "random" details and not hugely important
    const attrs = [
        {
            name: 'commonName',
            value: `${user?.first_name} ${user?.last_name}`,
        },
        {
            name: 'countryName',
            value: 'IE',
        },
        {
            name: 'organizationName',
            value: `${user?.first_name} ${user?.last_name}`,
        },
        {
            shortName: 'OU',
            value: `${user?.first_name?.charAt(0)}${user?.last_name?.charAt(0)}`,
        },
    ];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.setExtensions([
        {
            name: 'basicConstraints',
            cA: true,
        },
        {
            name: 'keyUsage',
            keyCertSign: true,
            digitalSignature: true,
            nonRepudiation: true,
            keyEncipherment: true,
            dataEncipherment: true,
        },
        {
            name: 'extKeyUsage',
            serverAuth: true,
            clientAuth: true,
            codeSigning: true,
            emailProtection: true,
            timeStamping: true,
        },
        {
            name: 'nsCertType',
            client: true,
            server: true,
            email: true,
            objsign: true,
            sslCA: true,
            emailCA: true,
            objCA: true,
        },
        {
            name: 'subjectKeyIdentifier',
        },
    ]);
    // sign the certificate with the private key and a SHA-256 digest
    cert.sign(keyPair.privateKey, forge.md.sha256.create());
    // convert the certificate to PEM encoding before returning
    const pemCert = pki.certificateToPem(cert);
    return pemCert;
};

// utility functions for converting between various formats
export const publicKeyToPEM = (publicKey: forge.pki.rsa.PublicKey) => {
    return pki.publicKeyToPem(publicKey);
};

export const privateKeyToPEM = (privateKey: forge.pki.rsa.PrivateKey) => pki.privateKeyToPem(privateKey);

const certificateFromPEM = (certificate: string) => pki.certificateFromPem(certificate);

const privateKeyFromPEM = (privateKey: string) => pki.privateKeyFromPem(privateKey);

const decode64 = (input: string) => forge.util.decode64(input);
