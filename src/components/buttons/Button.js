import React from 'react';
import styles from '../../CSS_files/Button.module.css';

const getButtonType = ({ type = '', buttonText, ...rest }) => {
	const buttonDictionary = {
		register: {
			className: styles.login_reg,
			text: 'Register',
		},
		login: {
			className: styles.login_reg,
			text: 'Login',
		},
		deregister: {
			className: styles.login_reg,
			text: 'Deregister',
		},
		delete: {
			className: styles.login_reg,
			text: 'Delete',
		},
		check: {
			className: styles.login_reg,
			text: 'Check',
		},
		logout: {
			className: styles.logout,
			text: 'Logout',
		},
		close: {
			className: styles.close,
			text: 'X',
		},
		homeLink: {
			className: styles.login_reg,
			text: buttonText,
		},
	};
	return buttonDictionary[type] || {};
};

export const Button = ({ onClick, ...props }) => (
	<button className={getButtonType(props).className} onClick={onClick}>
		{getButtonType(props).text}
	</button>
);
