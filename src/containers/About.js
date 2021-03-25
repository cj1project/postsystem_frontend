import React, { Component } from 'react';
import { Input, Button } from '../components';
import hawLogo from '../components/HAW_Marke_weiss_RGB.svg';

class About extends Component {
	render() {
		return (
			<div className='main-body'>
				<ul className='input-box flex-center'>
					<li className='aboutList'>
						<b>Postmann</b> is the only app you will need in order to make sure
						you'll never have to walk down that fligth of stairs to your mailbox
						and comeback empty handed ever again!
					</li>
					<li className='aboutList'>Register or log in today!</li>
					<li className='aboutList'>
						Created by Information engineering students at HAW Hamburg
					</li>
					<li className='aboutList'>
						<img
							title='Hochschule für Angewandte Wissenschaften Hamburg'
							alt='Hochschule für Angewandte Wissenschaften Hamburg'
							src={hawLogo}
							style={{
								width: 200,
								height: 50,
								backgroundColor: '#003ca0',
								padding: '10px',
							}}
						/>
					</li>
					<li className='aboutList'>
						Our professional team is making sure that you have the most
						comfortable experience using our product.
					</li>
				</ul>
			</div>
		);
	}
}
export default About;
