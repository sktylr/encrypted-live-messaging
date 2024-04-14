import forge from '@vilic/node-forge';
import { TokenClaims } from '../types/interfaces';

const pki = forge.pki;
type KeyPair = forge.pki.rsa.KeyPair;

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

export const generateCertificate = (keyPair: KeyPair, user: TokenClaims) => {
    const cert = pki.createCertificate();
    cert.publicKey = keyPair.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
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
    cert.sign(keyPair.privateKey, forge.md.sha256.create());
    const pemCert = pki.certificateToPem(cert);
    return pemCert;
};

export const publicKeyToPEM = (publicKey: forge.pki.rsa.PublicKey) => {
    return pki.publicKeyToPem(publicKey);
};

const certificateFromPEM = (certificate: string) => pki.certificateFromPem(certificate);

export const privateKeyToPEM = (privateKey: forge.pki.rsa.PrivateKey) => pki.privateKeyToPem(privateKey);

const privateKeyFromPEM = (privateKey: string) => pki.privateKeyFromPem(privateKey);

const decode64 = (input: string) => forge.util.decode64(input);

export const decryptBase64FromPEM = (ciphertext: string, privateKeyPEM: string) => {
    const privateKey = privateKeyFromPEM(privateKeyPEM);
    const decryptedMessage = privateKey?.decrypt(decode64(ciphertext), 'RSA-OAEP', {
        md: forge.md.sha256.create(),
        mfg1: {
            md: forge.md.sha256.create(),
        },
    });
    return decryptedMessage;
};

export const verifyX509Cert = (x509CertPEM: string): forge.pki.rsa.PublicKey => {
    const certificate = certificateFromPEM(x509CertPEM);
    const verified = certificate?.verify(certificate);
    const now = new Date();
    if (!verified || certificate?.validity?.notAfter <= now || certificate?.validity?.notBefore >= now) {
        throw new Error('Certificate invalid!');
    }
    return certificate?.publicKey as forge.pki.rsa.PublicKey;
};

export const verify = (message: string, signature: string, publicKeyPEM: string) => {
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
