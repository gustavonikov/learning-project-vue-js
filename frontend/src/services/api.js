import axios from 'axios'

const api = axios.create({
	baseURL: 'http://localhost:3333',
/* 	headers: {
		'Authorization': 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6Ikd1c3Rhdm8gQ2hhdmVzIFBlZHJvemEiLCJlbWFpbCI6Imd1c3Rhdm9uaWtvdkBleGFtcGxlLmNvbSIsImFkbWluIjp0cnVlLCJpYXQiOjE2MjExODkxNDYsImV4cCI6MTYyMTQ0ODM0Nn0.qXsQm63sjRrpOjQW-UxcsPA3KbzzdITDJ3Pal4xuYGA'
	} */
})

export default api
