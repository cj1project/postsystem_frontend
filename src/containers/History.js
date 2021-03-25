import React, { Component } from 'react';
import {
	Input,
	Button,
	HistoryCard,
	HistoryCardBig,
	Spinner,
} from '../components';
import '../CSS_files/Form.css';

class History extends Component {
	state = {
		history: [],
		updated: false,
		modalOpened: false,
		opened: '',
		spinner: false,
	};

	componentDidMount() {
		if (localStorage.getItem('USER_ID')) {
			this.setState({ spinner: true });
			fetch(
				`${
					process.env.REACT_APP_DOMAIN
				}/user/api/get-pics/${localStorage.getItem('USER_ID')}`,
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
						'Content-Type': 'application/json',
					}),
				}
			)
				.then((res) => res.json())
				.then((res) => {
					console.log('res from history', res);
					//res = res.reverse();
					//console.log('res reversed', res);
					this.setState(
						{
							history: res,
						},
						() => this.getBlobs(res)
					);
				})
				.catch((err) => {
					console.log(err);
					this.setState({ name: '', logedIn: false });
					alert('The server has crashed!');
				});
		}
	}
	getBlobs = (response) => {
		const that = this;
		const blobHisotry = response.map((key, index) => {
			fetch(
				`${process.env.REACT_APP_DOMAIN}/user/api/image/get-img-inputStream-without-save/${key.id}`,
				{
					credentials: 'include',
					method: 'get',
				}
			)
				.then((res) => res.blob())
				.then((res) => {
					console.log('from input stream', res);
					let reader = new FileReader();
					reader.readAsDataURL(res);

					reader.onloadend = async function () {
						let base64data = reader.result;
						let newImgUrlFromBase64data = String(base64data);

						localStorage.setItem(key.id, newImgUrlFromBase64data);
						that.setState((prevState) => {
							let history = prevState.history;
							history[index].file = newImgUrlFromBase64data;
							history[index].dateTime =
								history[index].date + history[index].time;
							return { history };
						});
					};
				});
		});
		setTimeout(() => this.sortHistory(), 1000);
	};
	sortHistory = () => {
		console.log('sort');
		const { history } = this.state;
		const sortedHistory = history.sort(this.dynamicSort('dateTime'));
		this.setState({ updated: true, spinner: false, history: sortedHistory });
	};
	delete = (id) => {
		this.setState(
			(prevState) => {
				let history = prevState.history;
				history = history.filter((image, index) => image.id !== id);
				return { history };
			},
			() => console.log('from from delete', this.state.history)
		);
		localStorage.removeItem(id);
		fetch(`${process.env.REACT_APP_DOMAIN}/user/api/delete-pic-from-db/${id}`, {
			credentials: 'include',
			method: 'get',
		})
			//.then((res) => res.json())
			.then((res) => {})
			.catch((err) => {
				console.log(err);
				this.setState({ name: '', logedIn: false });
				alert('The server has crashed!');
			});
	};
	dynamicSort = (property) => {
		var sortOrder = 1;
		if (property[0] === '-') {
			sortOrder = -1;
			property = property.substr(1);
		}
		return function (a, b) {
			/* next line works with strings and numbers,
			 * and you may want to customize it to your needs
			 */
			var result =
				a[property] > b[property] ? -1 : a[property] < b[property] ? 1 : 0;
			return result * sortOrder;
		};
	};
	clickOpen = (instance) => {
		let body = document.getElementsByClassName('main-body')[0];
		let footer = document.getElementsByTagName('footer')[0];
		body.classList.add('modal');
		footer.classList.add('footer-add');
		this.setState({ modalOpened: true, opened: instance });
	};
	closeModal = () => {
		let body = document.getElementsByClassName('main-body')[0];
		let footer = document.getElementsByTagName('footer')[0];
		footer.classList.remove('footer-add');
		body.classList.remove('modal');
		this.setState({ modalOpened: false, opened: '' });
	};
	render() {
		const { history, updated, opened, modalOpened, spinner } = this.state;
		let arrayImages = [];
		const newHist = [...history];
		console.log({ newHist });
		if (newHist[0]) {
			Object.entries(newHist).map((index) => {
				return arrayImages.push(
					<li className='historyList' key={index[1].name}>
						<HistoryCard
							image={index[1].file}
							date={index[1].date}
							time={index[1].time}
							index={index[1]}
							clickDelete={() => {
								this.delete(index[1].id);
							}}
							onClick={() => {
								this.clickOpen(index[1]);
							}}
						/>
					</li>
				);
			});
		}

		return (
			<div className={'main-body'}>
				{!modalOpened ? (
					!spinner ? (
						<div className='input-box flex-center'>
							<p className='pHome'>Here is your post history:</p>
							{history[0] ? (
								<ul className='historyUl'>{arrayImages}</ul>
							) : (
								<p className='pHome'>Your history is empty.</p>
							)}
						</div>
					) : (
						<Spinner />
					)
				) : (
					<div className='input-box flex-center'>
						<HistoryCardBig
							image={opened.file}
							date={opened.date}
							time={opened.time}
							index={opened}
							clickClose={() => {
								this.closeModal();
							}}
						/>
					</div>
				)}
			</div>
		);
	}
}
export default History;
