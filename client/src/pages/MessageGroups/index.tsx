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
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchMessageGroups = async () => {
            setLoading(true);
            const { data } = await api.get('/messages/groups/');
            setMessageGroups(data?.results);
        };

        const generateRSAKeyPairsAndCertificates = async () => {
            if (localStorage.getItem('privateKey') && localStorage.getItem('serverPublicKey')) {
                setLoading(false);
                return;
            }
            const keyPair = await safeGenerate({ bits: 4096, e: 0x10001, algorithm: 'RSA-OAEP' });
            const certificate = generateCertificate(keyPair, user!);
            const publicKey = publicKeyToPEM(keyPair?.publicKey);
            const { data } = await api.post(`/crypto/rsa/`, {
                public_key: publicKey,
                x509_pem: certificate,
            });
            const serverPublicKey = publicKeyToPEM(verifyX509Cert(data?.x509_pem));
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
