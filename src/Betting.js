import React, { useState, useEffect } from 'react';
import { useSimulateContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import axios from 'axios';
import { HeadsUpAbi } from './Abi';
import { config, contractAddress, getCardRankShortForm, graphEndpoint } from './config';

function DisplayCards({ title, imageIds, fallbackText }) {
  const baseURL = 'https://deckofcardsapi.com/static/img/';
  console.log({title, imageIds});

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <h4>{title}</h4>
      {imageIds != [] && imageIds != undefined ? (
        <div>
          {imageIds.map((id, index) => (
            <img
              key={index}
              src={`${baseURL}${id}.png`}
              alt={`Card ${id}`}
              style={{ maxWidth: '100px' }}
            />
          ))}
        </div>
      ) : (
        <p>{fallbackText}</p>
      )}
    </div>
  );
}

const Betting = () => {
  const [betAmountInEth, setBetAmountInEth] = useState('');
  const [totalRound, setTotalRound] = useState(0);
  const {address} = useAccount({config: config});
  const [holeCards, setHoleCards] = useState();
  const [punksCards, setPunksCards] = useState();
  const [apesCards, setApesCards]= useState();
  const [communityCards, setCommunityCards] = useState();

  const fetchHoleCards = async() => {
    const holeCardsQuery = `
    query GetTargetRound {
      rounds(
        limit: 1
        orderBy: "epoch"
        orderDirection: "desc") {
          items {
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
        }
      }`
    console.log({holeCardsQuery: holeCardsQuery});
    const response = await axios.post(graphEndpoint, {
      query: holeCardsQuery,
    });
    console.log(response.data.data)
    const holeCards = response.data.data.rounds.items[0];
    setHoleCards(holeCards);
      if(holeCards != null && holeCards != undefined && holeCards.holeCardsRevealed == true) {
        console.log({holeCards: holeCards});
        const pCard1 = `${getCardRankShortForm(holeCards.punksCards.card1.rank)}${holeCards.punksCards.card1.suit.slice(0,1).toUpperCase()}`
        const pCard2 = `${getCardRankShortForm(holeCards.punksCards.card2.rank)}${holeCards.punksCards.card2.suit.slice(0,1).toUpperCase()}`
        const punksCards = [pCard1, pCard2];
        const aCard1 = `${getCardRankShortForm(holeCards.apesCards.card1.rank)}${holeCards.apesCards.card1.suit.slice(0,1).toUpperCase()}`
        const aCard2 = `${getCardRankShortForm(holeCards.apesCards.card2.rank)}${holeCards.apesCards.card2.suit.slice(0,1).toUpperCase()}`
        const apesCards = [aCard1, aCard2];
        setApesCards(apesCards);
        setPunksCards(punksCards);
        console.log({punksCards, apesCards});
      } else {
        setApesCards([]);
        setPunksCards([]);
      }
  }

  const fetchCommunityCards = async() => {
    const communityCardsQuery = `
    query GetTargetRound {
      rounds(
        limit: 1
        orderBy: "epoch"
        orderDirection: "desc") {
          items {
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
      }
    }`
    const response = await axios.post(graphEndpoint, {
      query: communityCardsQuery,
    });
    const communityCards = response.data.data.rounds.items[0];
    console.log({communityCards});
    if(communityCards != null && communityCards != undefined && communityCards.communityCardsRevealed == true) {
      const cCard1 = `${getCardRankShortForm(holeCards.communityCards.card1.rank)}${holeCards.communityCards.card1.suit.slice(0,1).toUpperCase()}`
      const cCard2 = `${getCardRankShortForm(holeCards.communityCards.card2.rank)}${holeCards.communityCards.card2.suit.slice(0,1).toUpperCase()}`
      const cCard3 = `${getCardRankShortForm(holeCards.communityCards.card3.rank)}${holeCards.communityCards.card3.suit.slice(0,1).toUpperCase()}`
      const cCard4 = `${getCardRankShortForm(holeCards.communityCards.card4.rank)}${holeCards.communityCards.card4.suit.slice(0,1).toUpperCase()}`
      const cCard5 = `${getCardRankShortForm(holeCards.communityCards.card5.rank)}${holeCards.communityCards.card5.suit.slice(0,1).toUpperCase()}`
      const cCards = [cCard1, cCard2, cCard3, cCard4, cCard5];
      console.log({communityCards: communityCards});
      setCommunityCards(cCards);
      console.log({cCards});
    } else {
      setCommunityCards([]);
    }
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
    fetchTotalRound();
    const interval = setInterval(fetchData, 3000); // Poll every 5 seconds
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
      <DisplayCards title={"Punks Cards"} imageIds={punksCards} fallbackText={"Punks card not yet drawn. Wait for Blind bet period to end"} /> 
      <DisplayCards title={"Apes Cards"} imageIds={apesCards} fallbackText={"Apes card not yet drawn. Wait for Blind bet period to end"} /> 
      <DisplayCards title={"Community Cards"} imageIds={communityCards} fallbackText={"Community card not yet drawn. Wait for bet period to end"} /> 
      <p>Connect Address: {address}</p>
      <input
        type="number"
        step="0.000001"
        value={betAmountInEth}
        onChange={(e) => setBetAmountInEth(e.target.value)}
        placeholder="Bet Amount in ETH"
      />
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
