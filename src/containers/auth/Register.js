import React, { Component } from 'react';
import { Input, Button, Spinner } from '../../components';
import '../../CSS_files/Form.css';

const { REACT_APP_SERVER_KEY, REACT_APP_DOMAIN } = process.env;

export const reg = (
	id,
	username,
	password,
	firstname,
	lastname,
	phonenumber,
	email,
	subscription,
	imageEntityId
) => {
	return (
		fetch(`${REACT_APP_DOMAIN}/user/api/register`, {
			credentials: 'include',
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: id,
				username: username,
				password: password,
				firstname: firstname,
				lastname: lastname,
				email: email,
				phonenumber: phonenumber,
				subscription: subscription,
				imageEntityId: imageEntityId,
			}),
		})
			//.then((res) => res.json())
			.catch((err) => {
				console.log(err);
			})
	);
};
class Register extends Component {
	state = {
		controls: {
			username: {
				elementType: 'input',
				elementConfig: {
					type: 'username',
					placeholder: 'username',
				},
				value: '',
				touched: false,
				validation: {
					required: true,
				},
			},
			password: {
				elementType: 'input',
				elementConfig: {
					type: 'password',
					placeholder: 'password',
				},
				value: '',
				validation: {
					required: true,
					minLenght: 4,
				},
				valid: false,
				touched: false,
			},
			firstname: {
				elementType: 'input',
				elementConfig: {
					type: 'firstname',
					placeholder: 'firstname',
				},
				value: '',
				touched: false,
				validation: {
					required: true,
				},
			},
			lastname: {
				elementType: 'input',
				elementConfig: {
					type: 'lastname',
					placeholder: 'lastname',
				},
				value: '',
				touched: false,
				validation: {
					required: true,
				},
			},
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'email',
					placeholder: 'email address',
				},
				value: '',
				validation: {
					required: true,
					isEmail: true,
				},
				valid: false,
				touched: false,
			},
			phonenumber: {
				elementType: 'input',
				elementConfig: {
					type: 'phonenumber',
					placeholder: 'phonenumber',
				},
				value: '',
				validation: {
					required: true,
					isEmail: false,
				},
				valid: false,
				touched: false,
			},
		},
		subscription: {},
		loading: false,
		registered: false,
	};
	checkValidity(value, rules) {
		let isValid = true;
		if (!rules) {
			return true;
		}

		if (rules.required) {
			isValid = value.trim() !== '' && isValid;
		}

		if (rules.minLength) {
			isValid = value.length >= rules.minLength && isValid;
		}

		if (rules.maxLength) {
			isValid = value.length <= rules.maxLength && isValid;
		}

		if (rules.isEmail) {
			const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
			isValid = pattern.test(value) && isValid;
		}

		if (rules.isNumeric) {
			const pattern = /^\d+$/;
			isValid = pattern.test(value) && isValid;
		}

		return isValid;
	}
	inputChangedHandler = (event, controlName) => {
		const updatedControls = {
			...this.state.controls,
			[controlName]: {
				...this.state.controls[controlName],
				value: event.target.value,
				valid: this.checkValidity(
					event.target.value,
					this.state.controls[controlName].validation
				),
				touched: true,
			},
		};
		this.setState({ controls: updatedControls });
	};
	onSubmit = () => {
		const randomString = Math.random()
			.toString(36)
			.replace(/[^a-z]+/g, '')
			.substr(0, 10);
		const randomString2 = randomString + this.state.controls.username.value;
		this.setState({ loading: true });
		const that = this;
		navigator.serviceWorker
			.register('/worker.js')
			.then(function (registration) {
				that
					.askPermission()
					.then(function () {
						const options = {
							userVisibleOnly: true,
							applicationServerKey: that.urlBase64ToUint8Array(
								REACT_APP_SERVER_KEY
							),
						};
						return registration.pushManager.subscribe(options);
					})
					.then(function (pushSubscription) {
						console.log('sub data', JSON.stringify(pushSubscription));
						//send data to the backend
						reg(
							randomString,
							that.state.controls.username.value,
							that.state.controls.password.value,
							that.state.controls.firstname.value,
							that.state.controls.lastname.value,
							that.state.controls.phonenumber.value,
							that.state.controls.email.value,
							pushSubscription,
							randomString2
						).then((res) => {
							console.log({ res });
							if (res.status === 200) {
								console.log('from register', res);
								that.setState({ loading: false, registered: true });
								window.location.href = '/login';
							} else {
								that.setState({ loading: false }, () =>
									window.alert('Was unable to register. Please try again!')
								);
							}
						});
					});
			})
			.catch((err) => {
				console.log('Service Worker registration failed', err);
			});
	};

	askPermission = () => {
		return new Promise((resolve, reject) => {
			const permissionResult = Notification.requestPermission((result) => {
				resolve(result);
			});
			if (permissionResult) {
				permissionResult.then(resolve, reject);
			}
		}).then((permissionResult) => {
			if (permissionResult !== 'granted') {
				throw new Error('Permission denied');
			}
		});
	};

	urlBase64ToUint8Array(base64String) {
		var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
		var base64 = (base64String + padding)
			.replace(/\-/g, '+')
			.replace(/_/g, '/');

		var rawData = window.atob(base64);
		var outputArray = new Uint8Array(rawData.length);

		for (var i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i);
		}
		return outputArray;
	}
	componentDidMount() {
		const that = this;
		navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
			serviceWorkerRegistration.pushManager
				.getSubscription()
				.then(function (subscription) {
					if (subscription) {
						that.setState({ subscribed: true, subscription: subscription });
					}
				});
		});
	}
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
				invalid={!formElement.config.valid}
				shouldValidate={formElement.config.validation}
				touched={formElement.config.touched}
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
							<Button type='register' onClick={this.onSubmit} />
						</div>
					</div>
				)}
			</div>
		);
	}
}
export default Register;
