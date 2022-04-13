// src/App.js

import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Debits from './components/Debits';
import Credits from './components/Credits';
import axios from "axios";

class App extends Component {
  constructor() {  // Create and initialize state
    super(); 
    this.state = {
      accountBalance: 0,
      currentUser: {
        userName: 'Joe Smith',
        memberSince: '07/23/96',
      },
      credits: [],
      debits: [],
      newDebitId: 1,
      newCreditId: 1
    }
  }

  async componentDidMount() {
    //define API url
    const debitsAPI = "https://moj-api.herokuapp.com/debits";
    const creditsAPI = "https://moj-api.herokuapp.com/credits";

    try {
      //update states
      let debitsData = await axios.get(debitsAPI);
      let creditsData = await axios.get(creditsAPI);
      this.setState({debits: debitsData.data});
      this.setState({credits: creditsData.data});
      //give the account balance an initial value
      let totalCredits = this.state.credits.reduce((totalAmount, credit) => totalAmount + credit.amount, 0);
      let totalDebits = this.state.debits.reduce((totalAmount, debit) => totalAmount + debit.amount, 0);
      let accountBalance = totalCredits - totalDebits;
      this.setState({accountBalance: accountBalance.toFixed(2)});
    } catch (error) {
      console.log(error.message);
    }

  }

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {  
    const newUser = {...this.state.currentUser}
    newUser.userName = logInInfo.userName
    this.setState({currentUser: newUser})
  }

  addDebit = (event) => {
    event.preventDefault(); // prevent the form from submitting
    const amount = event.target.amount.value;
    const description = event.target.description.value;
    const newDebit = {
      id: this.state.newDebitId.toString(), 
      description: description, 
      amount: amount, 
      date: new Date().toISOString()
    };
    this.setState({newDebitId: this.state.newDebitId + 1});
    this.setState({debits: [...this.state.debits, newDebit]});
    this.setState({accountBalance: this.setState.accountBalance - newDebit.amount});
  }

  addCredit = (event) => {
    event.preventDefault(); // prevent the form from submitting
    const amount = event.target.amount.value;
    const description = event.target.description.value;
    const newCredit = {
      id: this.state.newCreditId.toString(), 
      description: description, 
      amount: amount, 
      date: new Date().toISOString()
    };
    console.log(this.state.newCreditId)
    this.setState({newCreditId: this.state.newCreditId + 1});
    this.setState({credits: [...this.state.credits, newCredit]});
    this.setState({accountBalance: this.setState.accountBalance + newCredit.amount});
  }

  // Create Routes and React elements to be rendered using React components
  render() {  
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance}/>);
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince}  />
    );
    const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)  // Pass props to "LogIn" component
    const DebitsComponent = () => (<Debits debits={this.state.debits} addDebit={this.addDebit} />)
    const CreditsComponent = () => (<Credits credits={this.state.credits} addCredit={this.addCredit} />)
    return (
      <Router>
        <div>
          <Route exact path="/" render={HomeComponent}/>
          <Route exact path="/userProfile" render={UserProfileComponent}/>
          <Route exact path="/login" render={LogInComponent}/>
          <Route exact path="/debits" render={DebitsComponent}/>
          <Route exact path="/credits" render={CreditsComponent}/>
        </div>
      </Router>
    );
  }
}

export default App;