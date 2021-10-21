import React from 'react';
import styled from "styled-components";
import { withStyles } from '@material-ui/core/styles';

const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = "1e1ad46b86644091a1973734caccde4f";
const redirectUri = "http://localhost:3000";
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
  'user-modify-playback-state',
];

// Get the hash of the url
const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function(initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
window.location.hash = "";

class SpotMe extends React.Component {
    state = {
        currentSong: undefined
    }

    constructor(props) {
        super(props)

        this.getLyrics = this.getLyrics.bind(this)
        this.getCurrentSong = this.getCurrentSong.bind(this)
        this.getProfile = this.getProfile.bind(this)
    }

    componentDidMount() {
        // Set token
        let _token = hash.access_token;
        if (_token) {
            // Set token
            this.setState({
                token: _token,
                geniusToken: "ZvXw3u46jpLx1qY-b8p0U4SAbyU4XCfIy5TcD1ITCJbxKUBQMwGH5h4bwJB3ntD6",
            });
            this.getCurrentSong(_token)
            this.getProfile(_token)
        } else {
            // this.setState({})
        }
    }

    render(){
        const { token, currentSong } = this.state;

        return (
            <Container>

                {!token && 
                <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    <a
                        style={{ color: '#00ff00' }}
                        href={`${authEndpoint}?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&show_dialog=true`}
                    >
                        Login to Spotify
                    </a>
                </div>}
                {currentSong &&
                    <div style={{display: 'flex', width: '100vw', height: '100vh', justifyContent: 'center', alignItems: 'center'}}>
                        <CurrentSong>
                            <img style={{width: 'auto', height: '100%'}} src={currentSong.album.images[0].url} />
                            <div style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', justifyContent: 'space-evenly', height: '100%' }}>
                                <div>{currentSong.name}</div>
                                <div>{currentSong.artists[0].name}</div>
                            </div>
                        </CurrentSong>
                    </div>
                }
            </Container>
        );
    }

    getLyrics(token) {
        fetch("https://api.spotify.com/v1/me/player", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(async (response) => {
            if(response.status !== 204) {
                const json = await response.json()
                console.log(json)
                this.setState({currentSong: json.item}, this.getCurrentSongAnalysis)
            }
        })
    }

    async getCurrentSong(token) {
        fetch("https://api.spotify.com/v1/me/player", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(async (response) => {
            if(response.status !== 204) {
                const json = await response.json()
                console.log(json)
                this.setState({currentSong: json.item}, this.getCurrentSongAnalysis)
            }
        })
    }

    async getCurrentSongAnalysis() {
        const { currentSong, token } = this.state;

        fetch(`https://api.spotify.com/v1/audio-analysis/${currentSong.id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(async (response) => {
            if(response.status !== 204) {
                const json = await response.json()
                console.log(json)
                // this.setState({currentSong: json.item})
            }
        })
    }

    async getProfile(token) {
        fetch("https://api.spotify.com/v1/me", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(async (response) => {
            if(response.status !== 204) {
                const json = await response.json()
                // this.setState({currentSong: json.item})
            }
        })
    }
}

const CurrentSong = styled.div({
    display: 'flex',
    color: '#00ff00',
    height: '100px',
    width: '250px',
    border: '1px solid #00ff00',
    borderRadius: '5px',
    justifyContent: 'space-around',
    marginTop: '20px',
    padding: '10px',
})

const styles = {
    title: {
        color: '#00ff00',
        fontSize: '72px',
    },
};

const Container = styled.div({
    width: '100vw',
    height: '100vh',
    backgroundColor: "#000000",
})

export default withStyles(styles)(SpotMe);
