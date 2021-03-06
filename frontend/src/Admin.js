import React, { useEffect} from 'react';

import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


import { useAlert } from "react-alert";

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';


const surfaceColor = "#27292D"
const inputColor = "#383B40"
const Admin = (props) => {
  const { globalUrl, } = props;
	const [firstRequest, setFirstRequest] = React.useState(true);
	const [modalUser, setModalUser] = React.useState({});
	const [modalOpen, setModalOpen] = React.useState(false);
	const [loginInfo, setLoginInfo] = React.useState("");
	const [curTab, setCurTab] = React.useState(0);
	const [users, setUsers] = React.useState([]);
	const [environments, setEnvironments] = React.useState([]);

	const alert = useAlert()

	const submitUser = (data) => {
		// FIXME - add some check here ROFL
		console.log("INPUT: ", data)

		// Just use this one?
		var data = {"username": data.Username, "password": data.Password}
		var baseurl = globalUrl
		const url = baseurl+'/api/v1/register';
		fetch(url, {
			method: 'POST',
	  	credentials: "include",
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			},
		})
		.then(response =>
			response.json().then(responseJson => {
				if (responseJson["success"] === false) {
					setLoginInfo("Error in input: "+responseJson.reason)
				} else {
					setLoginInfo("")
					setModalOpen(false)
					getUsers()
				}
			}),
		)
		.catch(error => {
			console.log("Error in userdata: ", error)
		});
	}

	const deleteEnvironment = (name) => {
		// FIXME - add some check here ROFL
		var newEnv = []
		for (var key in environments) {
			if (environments[key].Name == name) {
				continue
			}

			newEnv.push(environments[key])
		}

		// Just use this one?
		const url = globalUrl+'/api/v1/setenvironments';
		fetch(url, {
			method: 'PUT',
	  	credentials: "include",
			body: JSON.stringify(newEnv),
			headers: {
				'Content-Type': 'application/json',
			},
		})
		.then(response =>
			response.json().then(responseJson => {
				if (responseJson["success"] === false) {
					alert.error(responseJson.reason)
				} else {
					setLoginInfo("")
					setModalOpen(false)
					getEnvironments()
				}
			}),
		)
		//.catch(error => {
		//	console.log("Error in userdata: ", error)
		//});
	}

	const submitEnvironment = (data) => {
		// FIXME - add some check here ROFL
		environments.push({"name": data.environment, "type": "onprem"})

		// Just use this one?
		var baseurl = globalUrl
		const url = baseurl+'/api/v1/setenvironments';
		fetch(url, {
			method: 'PUT',
	  	credentials: "include",
			body: JSON.stringify(environments),
			headers: {
				'Content-Type': 'application/json',
			},
		})
		.then(response =>
			response.json().then(responseJson => {
				if (responseJson["success"] === false) {
					setLoginInfo("Error in input: "+responseJson.reason)
				} else {
					setLoginInfo("")
					setModalOpen(false)
					getEnvironments()
				}
			}),
		)
		.catch(error => {
			console.log("Error in userdata: ", error)
		});
	}

	const getEnvironments = () => {
		fetch(globalUrl+"/api/v1/getenvironments", {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			credentials: "include",
    })
		.then((response) => {
			if (response.status !== 200) {
				console.log("Status not 200 for apps :O!")
				return
			}

			return response.json()
		})
    .then((responseJson) => {
			setEnvironments(responseJson)
		})
		.catch(error => {
			alert.error(error.toString())
		});
	}

	const getUsers = () => {
		fetch(globalUrl+"/api/v1/getusers", {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
	  			credentials: "include",
    		})
		.then((response) => {
			if (response.status !== 200) {
				console.log("Status not 200 for apps :O!")
				return
			}

			return response.json()
		})
    .then((responseJson) => {
			setUsers(responseJson)
		})
		.catch(error => {
			alert.error(error.toString())
		});
	}

	if (firstRequest) {
		setFirstRequest(false)
		getUsers()
	}

	const paperStyle = {
		minWidth: "100%",
		maxWidth: "100%",
		color: "white",
		backgroundColor: surfaceColor,
		marginBottom: 10, 
		padding: 20,
	}

	const changeModalData = (field, value) => {
		modalUser[field] = value
	}

	const modalView = 
		<Dialog modal 
			open={modalOpen}
			onClose={() => {setModalOpen(false)}}
			PaperProps={{
				style: {
					backgroundColor: surfaceColor,
					color: "white",
					minWidth: "800px",
					minHeight: "320px",
				},
			}}
		>
			<DialogTitle><span style={{color: "white"}}>Add user</span></DialogTitle>
			<DialogContent>
				{curTab === 0 ? 
					<div>
						Username
						<TextField
							color="primary"
							style={{backgroundColor: inputColor}}
							autoFocus
							InputProps={{
								style:{
									height: "50px", 
									color: "white",
									fontSize: "1em",
								},
							}}
							required
							fullWidth={true}
							autoComplete="username"
							placeholder="username@example.com"
							id="emailfield"
							margin="normal"
							variant="outlined"
							onChange={(event) => changeModalData("Username", event.target.value)}
						/>
						Password	
						<TextField
							color="primary"
							style={{backgroundColor: inputColor}}
							InputProps={{
								style:{
									height: "50px", 
									color: "white",
									fontSize: "1em",
								},
							}}
							required
							fullWidth={true}
							autoComplete="password"
							type="password"
							placeholder="********"
							id="pwfield"
							margin="normal"
							variant="outlined"
							onChange={(event) => changeModalData("Password", event.target.value)}
						/>
					</div>
				: curTab === 1 ?
				<div>
					Environment Name	
					<TextField
						color="primary"
						style={{backgroundColor: inputColor}}
						autoFocus
						InputProps={{
							style:{
								height: "50px", 
								color: "white",
								fontSize: "1em",
							},
						}}
						required
						fullWidth={true}
						placeholder="datacenter froglantern"
						id="environment_name"
						margin="normal"
						variant="outlined"
						onChange={(event) => changeModalData("environment", event.target.value)}
					/>
					</div>
				: null }
				{loginInfo}
			</DialogContent>
			<DialogActions>
				<Button style={{borderRadius: "0px"}} onClick={() => setModalOpen(false)} color="primary">
					Cancel
				</Button>
				<Button variant="contained" style={{borderRadius: "0px"}} onClick={() => {
					if (curTab === 0) {
						submitUser(modalUser)
					} else if (curTab === 1) {
						submitEnvironment(modalUser)
					}
				}} color="primary">
					Submit	
				</Button>
			</DialogActions>
		</Dialog>

	const usersView = curTab === 0 ?
		<div>
			<h2>	
				User management
			</h2>
			<Button 
				style={{}} 
				variant="contained"
				color="primary"
				onClick={() => setModalOpen(true)}
			> 
				Add user	
			</Button>
			<Divider style={{marginTop: 20, marginBottom: 20, backgroundColor: inputColor}}/>
			<List>
				{users === undefined ? null : users.map(data => {
					console.log(data)
					return (
						<ListItem>
							{data.Username}
						</ListItem>
					)
				})}
			</List>
		</div>
		: null

	const environmentView = curTab === 1 ?
		<div>
			<h2>	
				Environments	
			</h2>
			<Button 
				style={{}} 
				variant="contained"
				color="primary"
				onClick={() => setModalOpen(true)}
			> 
				Add environment 
			</Button>
			<Divider style={{marginTop: 20, marginBottom: 20, backgroundColor: inputColor}}/>
			<List>
				{environments === undefined ? null : environments.map(environment => {
					return (
						<ListItem>
							<Button type="outlined" style={{borderRadius: "0px"}} onClick={() => deleteEnvironment(environment.Name)} color="primary">Delete</Button>
							- {environment.Name}
						</ListItem>
					)
				})}
			</List>
		</div>
		: null

	const setConfig = (event, newValue) => {
		if (newValue === 1) {
			getEnvironments()
		}

		setModalUser({})
		setCurTab(newValue)
	}

	const data = 
		<div style={{width: 1366, margin: "auto"}}>
			<Paper style={paperStyle}>
				<Tabs
					value={curTab}
					indicatorColor="primary"
					textColor="primary"
					onChange={setConfig}
					aria-label="disabled tabs example"
				>
					<Tab label="Users" />
					<Tab label="Environments"/>
				</Tabs>
				<div style={{marginBottom: 10}}/>
				{usersView}	
				{environmentView}
			</Paper>
		</div>

	return (
		<div>
			{modalView}
			{data}
		</div>
	)
}

export default Admin 
