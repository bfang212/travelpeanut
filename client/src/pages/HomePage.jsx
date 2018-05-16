import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TripList from '../components/TripListHome.jsx'
import * as userActions from '../actions/userActions.js'
import * as tripActions from '../actions/tripActions.js'
import Invitation from '../components/Invitation.jsx'
import Navbar from '../components/Navbar.jsx'
import CreateTripBtn from '../components/CreateTripBtn.jsx'
import Popup from '../components/CreateTripPopup.jsx'

class HomePage extends React.Component {
  constructor(props) {
    super(props)
    this.handleCreate = this.handleCreate.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.goToTrip = this.goToTrip.bind(this)
    this.getAllTrips = this.getAllTrips.bind(this) 
    this.deleteTrip = this.deleteTrip.bind(this)
    this.getInvitations = this.getInvitations.bind(this)
    this.acceptInvitation = this.acceptInvitation.bind(this)
    this.rejectInvitation = this.rejectInvitation.bind(this)
    this.handleClosePopup = this.handleClosePopup.bind(this)
    this.state = {
      show: 'none'
    }
  }

  componentDidMount(){
    this.getAllTrips()
    this.getInvitations()
  }

  getAllTrips(){
    let {currentUser} = this.props.userState
    this.props.actions.getAllTrips(currentUser.id)
  }

  handleCreate(){
    this.setState({
      show: 'block'
    })  
  }


  acceptInvitation(email, tripId, userId) {
    Promise.resolve(this.props.actions.acceptInvitation(email, tripId, userId))
    .then(() => this.props.actions.addMember(userId, tripId))
    .then(() => this.getAllTrips())
  }

  rejectInvitation(email, tripId) {
    this.props.actions.rejectInvitation(email, tripId)

  }

  handleSubmit(){
    this.setState({
      show: 'none'
    })

    let data = {
      name: this.name.value,
      city: this.city.value,
      country: this.country.value,
      startDate: this.startDate.value,
      endDate: this.endDate.value,
      province: '', 
      // ownerId needs to come from login state. hard coded right now
      ownerId: this.props.userState.currentUser.id
    }
    this.props.actions.createTrip(data)
  }

  handleClosePopup(){
    this.setState({
      show: 'none'
    })
  }

  goToTrip(item) {
    this.props.actions.setCurrentTrip(item)
  }

  deleteTrip(tripId) {
    let {currentUser} = this.props.userState
    this.props.actions.deleteTrip(tripId, currentUser.id)
  }

  getInvitations() {
    this.props.actions.getInvitations(this.props.userState.currentUser.email)
  }


  render() {
    console.log('this is trip state:', this.props.userState);    
    let {userState} = this.props
    let {tripState} = this.props
    return(
      <div className="home">
        <Navbar {...this.props} ifLoginPage={false} />
        <div className="home-hero">
          <span className="home-hero__text">Welcome, {userState.currentUser.firstName}!</span>
          <CreateTripBtn handleCreate={this.handleCreate}/>
        </div>

        <Popup show={this.state.show} handleSubmit={this.handleSubmit} handleClosePopup={this.handleClosePopup}/>
        
        <div className="home-container">

          <br/><br/>      

          <h2>Your Trips</h2>
          <TripList 
            allTrips={tripState.allTrips} 
            goToTrip={(item) => this.goToTrip(item)}
            currentUserId={userState.currentUser.id}
            deleteTrip={(tripId) => this.deleteTrip(tripId)}
          />
        </div>

       
      </div>
    )
  }



}

export default connect(
  state => ({
      userState: state.userReducer,
      tripState: state.tripReducer
  }),
  dispatch => ({
      actions: bindActionCreators(Object.assign({}, tripActions, userActions), dispatch)
  })
)(HomePage);




// {userState.invitations && userState.invitations.map((invitation, index) => {
//   return (
//   <div key={index}>
//   <Invitation
//     invitation={invitation}
//   />
//   <button onClick={() => this.acceptInvitation(userState.currentUser.email, invitation.id, userState.currentUser.id)}>Yes</button>
//   <button onClick={() => this.rejectInvitation(userState.currentUser.email, invitation.id, userState.currentUser.id)}>No</button> 
//   </div>)
// }
// )}        
