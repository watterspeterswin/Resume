
function getLocation(options)
{
	if (navigator.geolocation)
	{
		navigator.geolocation.getCurrentPosition(showPosition,showError,options);
	}
	else{document.getElementById("map").innerHTML="Geolocation is not supported by this browser.";}
}

function showPosition(position)
{
	var latlon=position.coords.latitude+","+position.coords.longitude;
	var img_url="http://maps.googleapis.com/maps/api/staticmap?center="
				+latlon+"&zoom=14&size=400x300&sensor=false";

	document.getElementById("map").innerHTML="<img src='"+img_url+"' />";

}

function showError(error)
{
	switch(error.code)
	{
	case error.PERMISSION_DENIED:
		document.getElementById("map").innerHTML="User denied the request for Geolocation."
		break;
	case error.POSITION_UNAVAILABLE:
		document.getElementById("map").innerHTML="Location information is unavailable."
		break;
	case error.TIMEOUT:
		document.getElementById("map").innerHTML="The request to get user location timed out."
		break;
	case error.UNKNOWN_ERROR:
		document.getElementById("map").innerHTML="An unknown error occurred."
			break;
	}
}
