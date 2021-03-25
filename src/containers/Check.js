import React, { Component } from 'react';
import { Input, Button, Spinner } from '../components';

class Check extends Component {
	state = {
		pictureSaved: false,
		pictureName: '',
		spinner: false,
		picturePath: '',
	};

	deletePicturesFromEsp = () => {
		this.setState({ spinner: true });
		fetch(`${process.env.REACT_APP_DOMAIN}/user/api/esp/delete-all`, {
			credentials: 'include',
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => {
				if (res.status == 200) {
					console.log('from delete', res);
					this.getPicture();
				}
			})
			.catch((err) => {
				console.log(err);
				this.setState({ pictureSaved: false });
				alert('The server has crashed!');
			});
	};
	getPicture = () => {
		fetch(`${process.env.REACT_APP_DOMAIN}/user/api/esp/capture`, {
			credentials: 'include',
			method: 'get',
		})
			//.then((res) => res.json())
			.then((res) => {
				console.log('runs getpic', res);
				if (res && res.status == 200) {
					//setTimeout(this.getStream(randomString), 2000);
					this.getStream();
				} else {
					alert(
						'There was a problem with the backend in capturing the picture.'
					);
				}
			})
			.catch((err) => {
				console.log(err);
				this.setState({ pictureGotten: false, spinner: false });
				alert('The server has crashed!');
			});
	};

	getStream = () => {
		const randomString = Math.random()
			.toString(36)
			.replace(/[^a-z]+/g, '')
			.substr(0, 10);
		//this.setState({ pictureName: randomString });
		fetch(
			`${process.env.REACT_APP_DOMAIN}/user/api/esp/saveImgToFileAndDbFile/${randomString}`,
			{
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
				}),
			}
		)
			.then((res) => res.blob())
			.then((res) => {
				console.log('from input stream', res);
				if (res.type === 'application/json') {
					this.getStream();
					return;
				}
				let reader = new FileReader();
				const that = this;
				reader.readAsDataURL(res);
				reader.onloadend = async function () {
					let base64data = reader.result; //returns file as encoded string
					let newImgUrlFromBase64data = String(base64data); //dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
					//localStorage.setItem(randomString, newImgUrlFromBase64data);
					that.setState({
						pictureSaved: true,
						pictureName: randomString,
						picturePath: newImgUrlFromBase64data,
					});
				};
				this.setState({ spinner: false });
				//window.location.href = '/check';
			})
			.catch((err) => {
				console.log(err);
				this.setState({ pictureId: '', spinner: false });
				alert('The server has crashed!');
			});
	};
	onCheck = () => {
		console.log('runs');
		this.deletePicturesFromEsp();
	};
	render() {
		return (
			<div className='main-body'>
				<div className='check'>
					{!this.state.spinner ? (
						<div className='input-box flex-center'>
							<p className='pHome'>
								You can check your postbox by clicking here:
							</p>
							<Button type='check' className='' onClick={this.onCheck} />
							{this.state.picturePath ? (
								<img className='historyImage' src={this.state.picturePath} />
							) : (
								''
							)}
						</div>
					) : (
						<Spinner />
					)}
				</div>
			</div>
		);
	}
}
export default Check;
