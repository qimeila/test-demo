import { Col, Row } from 'antd';
import { Button, Card, Space } from 'antd-mobile';
import { useState } from 'react';
import {
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import USDT from './USDT';
import { toastFail, toastSuccess } from '../../../../utils/toast';
import { mySolAddress } from '../../const';
import Others from './Others';

const lamports = LAMPORTS_PER_SOL / 10 ** 4;
const withConnectionGenerateTx = (
  {
    wallet,
    connection,
    toPubkey = new PublicKey(mySolAddress),
  },
) => async () => {
  const tx = new Transaction();

  tx.add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey,
      // lamports: Math.random() > 0.3 ? LAMPORTS_PER_SOL : lamports,
      lamports,
    }),
  );
  const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  tx.recentBlockhash = recentBlockhash;
  tx.feePayer = wallet.publicKey;

  return tx;
};

const withConnectionGenerateVersionedTx = (
  {
    wallet,
    connection,
    toPubkey = new PublicKey(mySolAddress),
  },
) => async () => {
  const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  const versionedTransactionMessage = new TransactionMessage({
    payerKey: wallet.publicKey,
    recentBlockhash,
    instructions: [
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey,
        lamports,
      }),
    ],
  }).compileToV0Message();

  return new VersionedTransaction(versionedTransactionMessage);
};

export default function SignTransaction({ account, connection, wallet }) {
  const generateTx = withConnectionGenerateTx({ connection, wallet });
  const generateVersionedTx = withConnectionGenerateVersionedTx({ connection, wallet });

  const [signTransactionLoading, setSignTransactionLoading] = useState(false);
  const signTransaction = async (provider = 'solana') => {
    try {
      setSignTransactionLoading(true);
      const tx = await generateTx();
      const signedTx = provider === 'svm' ? await window.svm.signTransaction(tx) : await wallet.signTransaction(tx);
      console.log('Current log: signedTx: ', signedTx);
      const ret = await connection.sendRawTransaction(signedTx.serialize());
      console.log(ret);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setSignTransactionLoading(false);
    }
  };

  const [signAllTransactionsLoading, setSignAllTransactionsLoading] = useState(false);
  const signAllTransactions = async (provider = 'solana') => {
    try {
      setSignAllTransactionsLoading(true);
      const txs = [
        await generateTx(),
        await generateTx(),
      ];
      const signedTxs = provider === 'svm' ? await window.svm.signAllTransactions(txs) : await wallet.signAllTransactions(txs);

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < signedTxs.length; i++) {
        const tx = signedTxs[i];
        // eslint-disable-next-line no-await-in-loop
        const ret = await connection.sendRawTransaction(tx.serialize());
        console.log(ret);
      }
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setSignAllTransactionsLoading(false);
    }
  };

  const [signAndSendTransactionLoading, setSignAndSendTransactionLoading] = useState(false);
  const signAndSendTransaction = async () => {
    try {
      setSignAndSendTransactionLoading(true);
      const tx = await generateTx();
      const ret = await wallet.signAndSendTransaction(tx);
      console.log(ret);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setSignAndSendTransactionLoading(false);
    }
  };

  const [signVersionedTransactionLoading, setSignVersionedTransactionLoading] = useState(false);
  const signVersionedTransaction = async () => {
    try {
      setSignVersionedTransactionLoading(true);
      const tx = await generateVersionedTx();
      const signedTx = await wallet.signTransaction(tx);
      const ret = await connection.sendRawTransaction(signedTx.serialize());
      console.log(ret);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setSignVersionedTransactionLoading(false);
    }
  };

  const [
    signAllVersionedTransactionsLoading,
    setSignAllVersionedTransactionsLoading,
  ] = useState(false);
  const signAllVersionedTransactions = async () => {
    try {
      setSignAllVersionedTransactionsLoading(true);
      const txs = [
        await generateVersionedTx(),
        await generateVersionedTx(),
      ];
      const signedTxs = await wallet.signAllTransactions(txs);

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < signedTxs.length; i++) {
        const tx = signedTxs[i];
        // eslint-disable-next-line no-await-in-loop
        const ret = await connection.sendRawTransaction(tx.serialize());
        console.log(ret);
      }
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setSignAllVersionedTransactionsLoading(false);
    }
  };

  const [
    signAndSendVersionedTransactionLoading,
    setSignAndSendVersionedTransactionLoading,
  ] = useState(false);
  const signAndSendVersionedTransaction = async () => {
    try {
      setSignAndSendVersionedTransactionLoading(true);
      const tx = await generateVersionedTx();
      const ret = await wallet.signAndSendTransaction(tx);
      console.log(ret);
      toastSuccess();
    } catch (error) {
      console.log(error);
      toastFail();
    } finally {
      setSignAndSendVersionedTransactionLoading(false);
    }
  };

  return (
    <Card title="Contract Transaction - Open console tab to check the result">
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="Transaction">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                block
                disabled={!account}
                loading={signTransactionLoading}
                onClick={signTransaction}
              >
                signTransaction
              </Button>
              <Button
                block
                disabled={!account}
                loading={signTransactionLoading}
                onClick={() => {
                  signTransaction('svm');
                }}
              >
                signTransaction(svm)
              </Button>

              <Button
                block
                disabled={!account}
                loading={signAllTransactionsLoading}
                onClick={signAllTransactions}
              >
                signAllTransactions
              </Button>
              <Button
                block
                disabled={!account}
                loading={signAllTransactionsLoading}
                onClick={() => {
                  signAllTransactions('svm');
                }}
              >
                signAllTransactions(svm)
              </Button>

              <Button
                block
                disabled={!account}
                loading={signAndSendTransactionLoading}
                onClick={signAndSendTransaction}
              >
                signAndSendTransaction
              </Button>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Versioned Transaction">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                block
                disabled={!account}
                loading={signVersionedTransactionLoading}
                onClick={signVersionedTransaction}
              >
                signVersionedTransaction
              </Button>

              <Button
                block
                disabled={!account}
                loading={signAllVersionedTransactionsLoading}
                onClick={signAllVersionedTransactions}
              >
                signAllVersionedTransactions
              </Button>

              <Button
                block
                disabled={!account}
                loading={signAndSendVersionedTransactionLoading}
                onClick={signAndSendVersionedTransaction}
              >
                signAndSendVersionedTransaction
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
      <Row>
        <USDT account={account} wallet={wallet} connection={connection} />
        <Others account={account} wallet={wallet} connection={connection} />
      </Row>
    </Card>
  );
}
