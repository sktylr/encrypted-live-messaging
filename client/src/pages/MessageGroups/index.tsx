import { Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { MessageGroup } from '../../types/interfaces';
import UseAxios from '../../utils/UseAxios';
import MessageGroupCard from './MessageGroupCard';
import { generateCertificate, privateKeyToPEM, publicKeyToPEM, safeGenerate, verifyX509Cert } from '../../services/rsa';
import AuthContext from '../../context/AuthContext';

const MessageGroups = () => {
    const [messageGroups, setMessageGroups] = React.useState<MessageGroup[]>([]);
    const api = UseAxios();
    const { user } = useContext(AuthContext);
    // the loading state is used here so that a chat page is not entered prematurely before the RSA key exchange has
    // completed, meaning the users would not be able to decrypt new keys
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchMessageGroups = async () => {
            setLoading(true);
            const { data } = await api.get('/messages/groups/');
            setMessageGroups(data?.results);
        };

        const generateRSAKeyPairsAndCertificates = async () => {
            // we don't need to perform the key exchange if the local storage already has the server's public key and
            // client's private key.
            // in reality we should verify that the keys are still valid but for my purposes I kept it as is
            if (localStorage.getItem('privateKey') && localStorage.getItem('serverPublicKey')) {
                setLoading(false);
                return;
            }
            // generate a new RSA key with a 4096 key size and e = 65537_10
            const keyPair = await safeGenerate({ bits: 4096, e: 0x10001, algorithm: 'RSA-OAEP' });
            // generate the certificate (this is already in PEM encoding)
            const certificate = generateCertificate(keyPair, user!);
            // generate the PEM encoding of the public key and send both to the server
            const publicKey = publicKeyToPEM(keyPair?.publicKey);
            const { data } = await api.post(`/crypto/rsa/`, {
                public_key: publicKey,
                x509_pem: certificate,
            });
            // use the server's X.509 cert to verify the server's public key.
            // if the server could not verify the client's X.509 cert, then this next line will fail since the
            // `data?.x509_pem` will be `undefined` and will fail verification
            const serverPublicKey = publicKeyToPEM(verifyX509Cert(data?.x509_pem));
            // save the keys to the local storage for future use
            const privateKey = privateKeyToPEM(keyPair?.privateKey);
            localStorage.setItem('privateKey', JSON.stringify(privateKey));
            localStorage.setItem('serverPublicKey', JSON.stringify(serverPublicKey));
            setLoading(false);
        };

        fetchMessageGroups();
        generateRSAKeyPairsAndCertificates();
    }, []);

    return (
        <Grid container spacing={2}>
            {messageGroups?.map(group => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={group.id}>
                    <MessageGroupCard group={group} loading={loading} />
                </Grid>
            ))}
        </Grid>
    );
};

export default MessageGroups;
