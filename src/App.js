import React, { Component } from 'react';
import {
	BrowserRouter,
	Route,
	browserHistory,
	Redirect,
} from 'react-router-dom';
import { Toolbar, Footer } from './components';
import Register from './containers/auth/Register';
import Login from './containers/auth/Login';
import History from './containers/History';
import Check from './containers/Check';
import About from './containers/About';
import Home from './containers/Home';
import Deregister from './containers/auth/Deregister';
import './App.css';

//const USER_ID = localStorage.getItem('USER_ID');

class App extends Component {
	state = {
		name: '',
		logedIn: false,
		userId: '',
	};
	setUserID = (userId) => {
		console.log({ userId });
		if (userId !== 0 && userId !== '') {
			localStorage.setItem('USER_ID', userId);
			this.setState({ logedIn: true, userId: userId }, function () {
				this.getUserData(userId);
			});
		} else {
			localStorage.removeItem('USER_ID');
			this.setState({ logedIn: false, userId: '' }, function () {
				//this.getUserData(userId);
			});
		}
	};
	componentDidMount() {
		this.getUserData(localStorage.getItem('USER_ID'));
	}

	getUserData = (userId) => {
		if (userId && userId !== undefined) {
			fetch(`${process.env.REACT_APP_DOMAIN}/user/api/get-user/${userId}`, {
				credentials: 'include',
				method: 'get',
				headers: new Headers({
					Authorization:
						'Basic ' +
						btoa(
							localStorage.getItem('USERNAME') +
								':' +
								localStorage.getItem('PASSWORD')
						),
					'Content-Type': 'application/json',
				}),
			})
				.then((res) => res.json())
				.then((res) => {
					console.log('res from App', res);
					if (res && res.id) {
						console.log('fetched from app.js', res);
						this.setState({
							name: res.firstname,
							logedIn: true,
							userId: userId,
						});
					}
				})
				.catch((err) => {
					console.log(err);
					this.setState({ name: '', logedIn: false });
					//alert('The server has crashed!');
				});
		}
	};

	render() {
		const { name, logedIn } = this.state;
		return (
			<div className='body'>
				{logedIn ? (
					<BrowserRouter>
						<Toolbar name={name} login={logedIn} setUserID={this.setUserID} />
						<Route
							exact
							path='/register'
							render={() => <Redirect to='/login' />}
						></Route>
						<Route exact path='/about' component={About} />
						<Route exact path='/'>
							<Home name={name} user={logedIn} />
						</Route>
						<Route exact path='/history'>
							<History userId={logedIn} />
						</Route>
						<Route exact path='/check' component={Check} />
						<Route path='/deregister'>
							<Deregister setUserID={this.setUserID} />
						</Route>
						<Route path='/login' render={() => <Redirect to='/' />} />
					</BrowserRouter>
				) : (
					<BrowserRouter>
						<Toolbar name={name} login={logedIn} setUserID={this.setUserID} />
						<Route exact path='/register'>
							<Register />
						</Route>
						<Route exact path='/login'>
							<Login setUserID={this.setUserID} />
						</Route>
						<Route exact path='/about' component={About} />
						<Route exact path='/'>
							<Home name={name} user={logedIn} />
						</Route>
					</BrowserRouter>
				)}
				<Footer />
			</div>
		);
	}
}
export default App;
