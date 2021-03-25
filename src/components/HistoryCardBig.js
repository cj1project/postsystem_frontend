import React from 'react';
import { Button } from '../components';
import '../CSS_files/Form.css';

export const HistoryCardBig = ({ image, clickClose, date, time }) => (
	<div className='Card'>
		<div className='histCardBigTop'>
			<p>
				Photo taken on: {date} {time}
			</p>
			<Button type='close' className='' onClick={clickClose} />
		</div>
		<img src={image} alt='Logotype' className='historyImageBig' />
	</div>
);
