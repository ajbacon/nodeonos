import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io.connect('http://localhost:5000');

function App() {
  // const [loading, setLoading] = useState(true);
  const [streamData, setStreamData] = useState({});

  useEffect(() => {
    // setLoading(true);
    socket.emit('getStreamData');
    socket.on('serverStreamData', (data) => {
      setStreamData(data);
      socket.removeAllListeners();
      // setLoading(false);
    });
  }, []);

  useEffect(() => {
    // setLoading(true);
    // socket.emit('getStreamData');
    socket.on('serverStreamData', (data) => {
      console.log('here');
      setStreamData(data);
      socket.removeAllListeners();
      // setLoading(false);
    });
  }, [streamData]);

  // const renderStations = () => {
  //   return streamData.availableStreams.map((stream) => {
  //     return (
  //       <button id={stream._id} onClick={playlistHandler}>
  //         {stream.name}
  //       </button>
  //     );
  //   });
  // };

  const playlistHandler = (e) => {
    e.preventDefault();
    socket.emit('selectStream', e.target.id);
    socket.on('serverStreamData', (data) => {
      setStreamData(data);
      socket.removeAllListeners();
    });
  };
  return (
    <div className='App'>
      <h1>NODEONOS</h1>
      <div id='stream-links'>
        <button id={0} onClick={playlistHandler}>
          stream1
        </button>
        <button id={1} onClick={playlistHandler}>
          stream2
        </button>
      </div>
      <img src={'assets/awesome-80s.jpg'} alt={'pic'} height='400'></img>
      <p>{streamData.playingId}</p>
    </div>
  );
}

export default App;
