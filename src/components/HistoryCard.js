import React from 'react';
import { Button } from '../components';

export const HistoryCard = ({ image, clickDelete, onClick, date, time }) => (
	<div className='Card flex-center'>
		<img
			src={image}
			alt='Logotype'
			className='historyImage'
			onClick={onClick}
		/>
		<p>
			Photo taken on: {date} {time}
		</p>
		<Button type='delete' className='' onClick={clickDelete} />
	</div>
);
