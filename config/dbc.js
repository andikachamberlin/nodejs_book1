const mysql = require('mysql');

const private_server = process.env.ENV_PRODUCTION == 'true' ? process.env.ENV_PRODUCTION_SERVER : process.env.ENV_DEVELOPMENT_SERVER;
const private_user = process.env.ENV_PRODUCTION == 'true' ? process.env.ENV_PRODUCTION_USER : process.env.ENV_DEVELOPMENT_USER;
const private_password = process.env.ENV_PRODUCTION == 'true' ? process.env.ENV_PRODUCTION_PASSWORD : process.env.ENV_DEVELOPMENT_PASSWORD;
const private_database = process.env.ENV_PRODUCTION == 'true' ? process.env.ENV_PRODUCTION_DATABASE : process.env.ENV_DEVELOPMENT_DATABASE;

const dbc  = mysql.createPool({
	connectionLimit : 100,
	host: private_server,
	user: private_user,
	password: private_password,
	database: private_database,
	multipleStatements: true
});

dbc.getConnection((error, connection) => {
	if (error) {
		console.log('------------------------------------------------------------------')
		console.log('NOT CONNECTED')
		console.log('------------------------------------------------------------------')
		console.log(error)
	}else{
		console.log('------------------------------------------------------------------')
		console.log('CONNECTED')
		console.log('------------------------------------------------------------------')
		// console.log(connection.config)
	} 
});

module.exports = {
	dbc,
	private_server,
	private_user,
	private_password,
	private_database
};
