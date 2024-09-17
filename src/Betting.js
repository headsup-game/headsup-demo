import React, { useState, useEffect } from 'react';
import { useSimulateContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import axios from 'axios';
import { HeadsUpAbi } from './Abi';
import { config, contractAddress, graphEndpoint } from './config';

const Betting = () => {
  const [betAmountInEth, setBetAmountInEth] = useState('');
  const [totalRound, setTotalRound] = useState(0);
  const {address} = useAccount({config: config});
  const [holeCards, setHoleCards] = useState();
  const [communityCards, setCommunityCards] = useState();

  const fetchHoleCards = async() => {
    const roundId = `${totalRound}-${contractAddress}`;
    const holeCardsQuery = `
    query GetTargetRound {
      round(id: "${roundId}") {
        epoch
        holeCardsRevealed
        apesCards {
          card1 {
            rank
            suit
          }
          card2 {
            rank
            suit
          }
        }
        punksCards {
          card1 {
            rank
            suit
          }
          card2 {
            rank
            suit
          }
        }
      }
    }`
    const response = await axios.post(graphEndpoint, {
      query: holeCardsQuery,
    });
    console.log({holeCards: response.data.data.round});
    setHoleCards(response.data.data.round);
  }

  const fetchCommunityCards = async() => {
    const roundId = `${totalRound}-${contractAddress}`;
    const communityCardsQuery = `
    query GetTargetRound {
      round(id: "${roundId}") {
        epoch
        communityCardsRevealed
        communityCards {
          card1 {
            rank
            suit
          }
          card2 {
            rank
            suit
          }
          card3 {
            rank
            suit
          }
          card4 {
            rank
            suit
          }
          card5 {
            rank
            suit
          }
        }
      }
    }`
    const response = await axios.post(graphEndpoint, {
      query: communityCardsQuery,
    });
    console.log({communityCards: response.data.data.round});
    setCommunityCards(response.data.data.round);
  }

  const fetchTotalRound = async () => {
    try {
      const response = await axios.post(graphEndpoint, {
        query: `
          query MyQuery {
            headsUps {
              items {
                totaRound
              }
            }
          }
        `,
      });
      const totalRoundValue = response.data.data.headsUps.items[0].totaRound;
      console.log({totalRoundValue});
      setTotalRound(totalRoundValue);
    } catch (error) {
      console.error('Error fetching total round:', error);
    }
  };

  const fetchData = async () => {
    await fetchTotalRound();
    await fetchHoleCards();
    await fetchCommunityCards();
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const { writeContractAsync, data, error } = useWriteContract();

  async function awaitedEnterPunks() {
    const data = await writeContractAsync({
      account: address,
      address: contractAddress,
      abi: HeadsUpAbi,
      functionName: 'enterPunks',
      args: [totalRound],
      value: parseEther(betAmountInEth),
      config
    });
    console.log(data);
  }
  

  async function awaitedEnterApes() {
    const data = await writeContractAsync({
      account: address,
      address: contractAddress,
      abi: HeadsUpAbi,
      functionName: 'enterApes',
      args: [totalRound],
      value: parseEther(betAmountInEth),
      config
    });
    console.log(data);
  }
  

  function log() {
    console.log({
      account: address,
      address: contractAddress,
      abi: HeadsUpAbi,
      functionName: 'enterApes',
      args: [totalRound],
      value: parseEther(betAmountInEth),
      config
    })
      console.log('Punks Transaction Data:', data);
      console.log('Punks Transaction Error:', error);
  }

  const { isLoading: punksTxLoading } = useWaitForTransactionReceipt({ hash: data?.hash });
  const { isLoading: apesTxLoading } = useWaitForTransactionReceipt({ hash: data?.hash });

  return (
    <div>
      <input
        type="number"
        step="0.000001"
        value={betAmountInEth}
        onChange={(e) => setBetAmountInEth(e.target.value)}
        placeholder="Bet Amount in ETH"
      />
      <p>{address}</p>
      <button onClick={log}>Log</button>
      <button onClick={awaitedEnterPunks} disabled={punksTxLoading}>
        {punksTxLoading ? 'Entering Punks...' : 'Enter Punks'}
      </button>
      <button onClick={awaitedEnterApes} disabled={apesTxLoading}>
        {apesTxLoading ? 'Entering Apes...' : 'Enter Apes'}
      </button>
    </div>
  );
};

export default Betting;
