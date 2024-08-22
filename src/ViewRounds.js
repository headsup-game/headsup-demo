import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import axios from 'axios';

const cellStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  whiteSpace: 'nowrap', // Prevent wrapping
  textAlign: 'left',
};

const ViewRounds = () => {
  const { address } = useAccount();
  const [roundsData, setRoundsData] = useState([]);

  const fetchRounds = async () => {
    try {
      const response = await axios.post('https://headsup-indexer.up.railway.app/', {
        query: `
          query QueryRounds {
            rounds(orderBy: "epoch", orderDirection: "desc", limit: 20) {
              items {
                epoch
                apesPot
                punksPot
                totalAmount
                holeCardsRevealed
                communityCardsRevealed
                winner
                startTimestamp
                blindCloseTimestamp
                betCloseTimestamp
                participants(where: { userId: "${address}" }) {
                  items {
                    position
                    isWinner
                  }
                }
              }
            }
          }
        `
      });
      setRoundsData(response.data.data.rounds.items);
    } catch (error) {
      console.error('Error fetching rounds data:', error);
    }
  };

  useEffect(() => {
    fetchRounds();
    const interval = setInterval(fetchRounds, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [address]);

  return (
    <div style={{ 
      overflowX: 'auto', 
      overflowY: 'auto', // Enable vertical scrolling
      maxHeight: '500px', // Adjust this height as needed
      margin: '20px', 
      padding: '10px', 
      border: '1px solid #ccc', 
      borderRadius: '8px' 
    }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={cellStyle}>Round ID</th>
          <th style={cellStyle}>Apes Pot</th>
          <th style={cellStyle}>Punks Pot</th>
          <th style={cellStyle}>Total Pot</th>
          <th style={cellStyle}>Hole Cards Revealed</th>
          <th style={cellStyle}>Community Cards Revealed</th>
          <th style={cellStyle}>Winner Position</th>
          <th style={cellStyle}>Start Time</th>
          <th style={cellStyle}>Blind Close Time</th>
          <th style={cellStyle}>Bet Close Time</th>
          <th style={cellStyle}>Has User Participated</th>
          <th style={cellStyle}>Has Won</th>
        </tr>
      </thead>
      <tbody>
        {roundsData.map((round) => {
          const userParticipated = round.participants.items.length > 0;
          const isWinner = userParticipated ? round.participants.items[0].isWinner : false;

          return (
            <tr key={round.epoch}>
              <td style={cellStyle}>{round.epoch}</td>
              <td style={cellStyle}>{formatEther(round.apesPot)}</td>
              <td style={cellStyle}>{formatEther(round.punksPot)}</td>
              <td style={cellStyle}>{formatEther(round.totalAmount)}</td>
              <td style={cellStyle}>{round.holeCardsRevealed ? 'Yes' : 'No'}</td>
              <td style={cellStyle}>{round.communityCardsRevealed ? 'Yes' : 'No'}</td>
              <td style={cellStyle}>{round.winner}</td>
              <td style={cellStyle}>{new Date(round.startTimestamp * 1000).toISOString()}</td>
              <td style={cellStyle}>{new Date(round.blindCloseTimestamp * 1000).toISOString()}</td>
              <td style={cellStyle}>{new Date(round.betCloseTimestamp * 1000).toISOString()}</td>
              <td style={cellStyle}>{userParticipated ? 'True' : 'False'}</td>
              <td style={cellStyle}>{userParticipated ? (isWinner ? 'Yes' : 'No') : 'N/A'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
  );
};

export default ViewRounds;
