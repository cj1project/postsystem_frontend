import React, { Component } from 'react';
import '../App.css';
import styles from '../CSS_files/Navigation.module.css';
import { NavigationItem, Button } from '../components';
import '../CSS_files/Form.css';

class Home extends Component {
	deregister = () => {
		window.location.href = '/deregister';
	};
	render() {
		console.log(this.props.name);
		return (
			<div className='main-body '>
				{this.props.user ? (
					<div className='input-box flex-center'>
						<p className='pHome'>Welcome to your home, {this.props.name}.</p>
						<p className='pHome'>Press here to go to your post history:</p>
						<Button
							type='homeLink'
							onClick={() => (window.location.href = '/history')}
							buttonText='History'
						/>
						<p className='pHome'>
							Press here if you want to check your postbox now:
						</p>
						<Button
							type='homeLink'
							onClick={() => (window.location.href = '/check')}
							buttonText='Check Postbox'
						/>
						<p className='pHome'>Do you want to delete your account?</p>
						<Button
							type='homeLink'
							onClick={() => this.deregister()}
							buttonText='Deregister'
						/>
					</div>
				) : (
					<div className='input-box flex-center'>
						<p className='pHome'>
							Welcome. Please sign in or register to use the app.
						</p>
						<ul className={styles.navigation_list}>
							<li>
								<NavigationItem
									href='/register'
									css_classActive={styles.NavigationItem_active}
									css_class={styles.NavigationItemHome}
								>
									{'Register'}
								</NavigationItem>
							</li>
							<li>
								<p className={styles.slashHome}> / </p>
							</li>
							<li>
								<NavigationItem
									href='/login'
									css_classActive={styles.NavigationItem_active}
									css_class={styles.NavigationItemHome}
								>
									{'Login'}
								</NavigationItem>
							</li>
						</ul>
					</div>
				)}
			</div>
		);
	}
}
export default Home;
