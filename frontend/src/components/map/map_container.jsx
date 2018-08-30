import {Map, InfoWindow, Marker, GoogleApiWrapper, Polygon} from 'google-maps-react';
import React from 'react';
import Point from '../../util/point';
const gAPI = require('../../config/keys').gAPI;

export class MapContainer extends React.Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    center: {},
    clicked: {},
    clickedMarker: []
  };

  onMarkerClick = (props, marker, e) =>
  this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingInfoWindow: true
  });

  onMapClicked = (props, map, e) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
    // console.log(e.latLng);
    // console.log('clicked lat:', e.latLng.lat(), e.latLng.lng())
    this.setState({clicked: {lat: e.latLng.lat(), lng: e.latLng.lng()}})
    this.setState({clickedMarker: <Marker onClick={this.onMarkerClick}
      name={'Clicked point'}
      position={{lat: e.latLng.lat(), lng: e.latLng.lng()}}
      icon={{path: this.props.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW, scale: 5}}/>});
      console.log(this.state.clicked);

    };

    render() {

    const lat = 37.7749;
    const lng = -122.4194;
    const minutes = 15;
    const origin = new Point({
      lat: lat,
      lng: lng,
      minutes: minutes
    })

    let points = origin.initEndPoints();

      // const triangleCoords = [
      //     {lat: 25.774, lng: -80.190},
      //     {lat: 18.466, lng: -66.118},
      //     {lat: 32.321, lng: -64.757},
      //     // {lat: 25.774, lng: -80.190}
      //   ];

      let goldStar = {
        path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
        fillColor: 'yellow',
        fillOpacity: 0.8,
        scale: 1,
        strokeColor: 'gold',
        strokeWeight: 14
      };

      const style = {
        width: '500px',
        height: '500px'
      }

      const markers = [<Marker onClick={this.onMarkerClick}
        name={'Current location'} />,
      <Marker
        onClick = { this.onMarkerClick }
        title = { 'Changing Colors Garage' }
        position = {{ lat: 39.648209, lng: -75.711185 }}
        name = { 'Changing Colors Garage' }
        />,
      <Marker onClick={this.onMarkerClick}
        name={'AA'}
        position={{lat: 37.7990, lng: -122.4014}} />,
      <Marker onClick={this.onMarkerClick}
        name={'YOUR LOCATION!'}
        position={this.state.center}
        icon= {{path: this.props.google.maps.SymbolPath.CIRCLE, scale:10}}
        />];

        // let pos = {};
        // navigator.geolocation.getCurrentPosition(function(position) {
        //     pos = {
        //         lat: position.coords.latitude,
        //         lng: position.coords.longitude
        //     }
        // });

        let that = this;
        if(navigator.geolocation){
          navigator.geolocation.getCurrentPosition(function(position) {
            let pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            that.setState({center: pos});
          });
          return (
            <div>
              <div className = "mapContainer">
                <Map google={this.props.google}
                  onClick={this.onMapClicked}
                  center={this.state.center}
                  style={style}>

                  {markers}
                  {this.state.clickedMarker}

                  <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}>
                    <div>
                      <h1>{this.state.selectedPlace.name}</h1>
                    </div>
                  </InfoWindow>

                  <Polygon
                    paths={points}
                    strokeColor="#0000FF"
                    strokeOpacity={0.8}
                    strokeWeight={2}
                    fillColor="#0000FF"
                    fillOpacity={0.35} />
                </Map>
                  </div>
                  <div className="footer">
                    <div className="links">
                      <div className="ft-headers">© 2018 ROVER</div>
                      <div className="ft-headers">FOLLOW</div>
                      <div className="ft2-1">
                        <p>
                          ROVER is a map based web application that allows users to see areas they can access given free time.
                        </p>
                      </div>
                      <div className="ft2-2">
                        <a className="socials" href="mailto:tonywzhang@gmail.com">
                          <i className="fab fa-google"></i>
                        </a>
                        <br/>
                        <a className="socials" href="tel:+16508883357">
                          <i className="fas fa-mobile"></i>
                        </a>
                        <br/>
                        <a className="socials" href='https://www.facebook.com/tonywzhang'>
                          <i className="fab fa-facebook"></i>
                        </a>
                        <br/>
                        <a className="socials" href="https://www.linkedin.com/in/kevin-ou-b56a768b/">
                          <i className="fab fa-linkedin"></i>
                        </a>
                        <br/>
                        <a className="socials" href="https://github.com/capoxix/intro-mongo">
                          <i className="fab fa-github"></i>
                        </a>
                      </div>
                </div>
              </div>
            </div>
          );

        } else {
          return (<div>no location</div>);
        }
      }
    }

    export default GoogleApiWrapper({
      apiKey: (gAPI)
    })(MapContainer)
