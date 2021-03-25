import React from 'react';
import '../CSS_files/Form.css';

export const Input = (props) => {
	return (
		<div className='input-field'>
			<label {...props.elementConfig}>
				{props.elementConfig.type.toUpperCase()}
			</label>
			<input
				{...props.elementConfig}
				value={props.value}
				onChange={props.changed}
			/>
		</div>
	);
};
