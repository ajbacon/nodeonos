import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io.connect('http://localhost:5000');

function App() {
  const [loading, setLoading] = useState(true);
  const [streamData, setStreamData] = useState({});

  // retrieve server session data on mount
  useEffect(() => {
    setLoading(true);
    socket.emit('getStreamData');
    socket.on('serverStreamData', (data) => {
      setStreamData(JSON.parse(data));
      socket.removeAllListeners();
      setLoading(false);
    });

    return () => {
      socket.close();
    };
  }, []);

  const renderStreamLinks = () => {
    return streamData.availableStreams.map((stream) => {
      return (
        <button key={stream._id} id={stream._id} onClick={playlistHandler}>
          {stream.name}
        </button>
      );
    });
  };

  const renderImage = () => {
    if (streamData.playingId === null) {
      return (
        <div className='no-selection'>
          <img src={'assets/no_sel.png'} alt={'pic'} height='200'></img>
        </div>
      );
    }
    const image = streamData.availableStreams.find(
      (elm) => elm._id === streamData.playingId
    ).image;

    return <img src={`assets/${image}`} alt={'pic'} height='400'></img>;
  };

  const renderCurrentStream = () => {
    if (streamData.playingId === null) {
      return 'No music selected';
    }
    console.log(streamData);
    return streamData.availableStreams.find(
      (elm) => elm._id === streamData.playingId
    ).name;
  };

  const renderPlayButton = () => {
    if (streamData.playingId === null) {
      return (
        <img
          onClick={playHandler}
          alt='play-grey'
          src={'play-dark-grey-64.png'}
        ></img>
      );
    } else if (streamData.isPlaying) {
      return <img onClick={playHandler} alt='pause' src={'pause-64.png'}></img>;
    }
    return <img onClick={playHandler} alt='play' src={'play-64.png'}></img>;
  };

  const playlistHandler = (e) => {
    e.preventDefault();
    socket.emit('selectStream', e.target.id);
  };

  const playHandler = () => {
    if (streamData.playingId === null) return;
    socket.emit('play-pause', 'switch');
  };

  // update when streamData is modified
  useEffect(() => {
    socket.on('serverStreamData', (data) => {
      setStreamData(JSON.parse(data));
      socket.removeAllListeners();
    });
  }, [streamData]);

  return loading ? (
    <div>loading</div>
  ) : (
    <div className='App'>
      <h1>NODEONOS</h1>
      <div id='stream-links'>{renderStreamLinks()}</div>
      <div>{renderImage()}</div>
      {/* <img src={'assets/no_sel.png'} alt={'pic'} height='400'></img> */}
      <p>{renderCurrentStream()}</p>
      <div>{renderPlayButton()}</div>
    </div>
  );
}

export default App;
