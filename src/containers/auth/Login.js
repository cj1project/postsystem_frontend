import React, { Component } from 'react';
import { Input, Button, Spinner } from '../../components';
import { NavLink } from 'react-router-dom';

export const log = (username, password) => {
	return fetch(`${process.env.REACT_APP_DOMAIN}/user/api/login`, {
		method: 'post',
		headers: new Headers({
			Authorization: 'Basic ' + btoa(username + ':' + password),
			'Content-Type': 'application/json',
		}),
	});
};
class Login extends Component {
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
		log(this.state.controls.username.value, this.state.controls.password.value)
			.then((res) => {
				if (res.status === 200) {
					localStorage.setItem('USERNAME', this.state.controls.username.value);
					localStorage.setItem('PASSWORD', this.state.controls.password.value);
					return res.json();
				} else {
					this.setState((prevState) => {
						let controls = Object.assign({}, prevState.controls);
						controls.username.value = '';
						controls.password.value = '';
						let loading = false;
						return { controls, loading };
					}, window.alert('Login credentials were incorrect. Please try again!'));
				}
			})
			.then((res) => {
				console.log('from login', res);
				if (res !== undefined && res.id && res.id !== '') {
					this.setState({ loading: false });
					this.props.setUserID(res.id);
					//window.location.href = '/';
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
		const form = formElementsArray.map((formElement) => (
			<Input
				key={formElement.id}
				elementType={formElement.config.elementType}
				elementConfig={formElement.config.elementConfig}
				value={formElement.config.value}
				changed={(event) => this.inputChangedHandler(event, formElement.id)}
			/>
		));
		return (
			<div className='main-body'>
				{this.state.loading ? (
					<Spinner />
				) : (
					<div className='input-box'>
						{form}
						<div className='button-div'>
							<Button type='login' onClick={this.onSubmit} />
						</div>
					</div>
				)}
			</div>
		);
	}
}
export default Login;
