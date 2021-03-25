import React, { Component } from 'react';
import { Input, Button, Spinner } from '../../components';
import { NavLink } from 'react-router-dom';

export const deregister = () => {
	return fetch(`${process.env.REACT_APP_DOMAIN}/user/api/deregister`, {
		method: 'post',
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
	});
};
class Deregister extends Component {
	state = {
		controls: {
			username: {
				elementType: 'input',
				elementConfig: {
					type: 'username',
					placeholder: 'username',
				},
				value: '',
			},
			password: {
				elementType: 'input',
				elementConfig: {
					type: 'password',
					placeholder: 'password',
				},
				value: '',
			},
		},
		loading: false,
		deregistered: false,
	};

	inputChangedHandler = (event, controlName) => {
		const updatedControls = {
			...this.state.controls,
			[controlName]: {
				...this.state.controls[controlName],
				value: event.target.value,
			},
		};
		this.setState({ controls: updatedControls });
	};

	onSubmit = () => {
		this.setState({ loading: true });
		deregister().then((res) => {
			if (res.status == 200) {
				console.log({ res });
				const that = this;
				navigator.serviceWorker.ready.then(function (
					serviceWorkerRegistration
				) {
					serviceWorkerRegistration.unregister();
				});
				this.props.setUserID('');
				localStorage.clear();
				this.setState({ loading: false, deregistered: true });
				window.location.href = '/';
			} else {
				this.setState({ loading: false }, () =>
					window.alert('There was a problem while deleting your account.')
				);
			}
		});
	};

	render() {
		const formElementsArray = [];
		for (let key in this.state.controls) {
			formElementsArray.push({
				id: key,
				config: this.state.controls[key],
			});
		}
		return (
			<div className='main-body'>
				{!this.props.logedIn ? (
					!this.state.deregistered ? (
						<div className='input-box'>
							<p>
								Do you really want to delete your account? This action cannot be
								undone.
							</p>
							<div className='button-div'>
								<Button type='deregister' onClick={this.onSubmit} />
							</div>
						</div>
					) : (
						<div className='input-box'>
							<p>Your account has been deleted.</p>
						</div>
					)
				) : (
					<div className='input-box'>
						<p>You are not logged in.</p>
					</div>
				)}
			</div>
		);
	}
}
export default Deregister;
