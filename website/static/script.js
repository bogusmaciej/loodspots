const user_spots = document.querySelector(".user_spots")

async function deleteSpot(id){
    fetch("/delete-spot", {
        method: "POST",
        body: JSON.stringify({ spot_id:id}),
    });

    el = document.getElementById(id);
    el.className = "spot user_spot spot_change_transition";
    await sleep(400);
    el.className = "spot user_spot deleted";
    btn = el.getElementsByClassName('btn_block')[0];
    btn.setAttribute('onclick', "restoreSpot('"+id+"')");

    label = btn.getElementsByClassName('spot_action_btn')[0];
    label.innerHTML = "restore"
}

async function restoreSpot(id){
    fetch("/restore-spot", {
        method: "POST",
        body: JSON.stringify({spot_id:id}),
    });
    el = document.getElementById(id);
    el.className = "spot user_spot spot_change_transition";
    await sleep(400);
    el.className = "spot user_spot";
    btn = el.getElementsByClassName('btn_block')[0];
    label = btn.getElementsByClassName('spot_action_btn')[0];
    btn.setAttribute('onclick',"deleteSpot('"+id+"')");
    label.innerHTML = "remove"
}

async function showDistances(){
    await getPosition().then(async position => {

        const user_latitude = position.coords.latitude
        const user_longitude = position.coords.longitude
        let all_distance_divs = document.querySelectorAll(".distance");
        let i = 0
        await fetch("/api", {
            method: 'POST',
            body: JSON.stringify(),
        })
        .then(response => response.json())
        .then(data => { 
            for (let key in data) {
                spot = data[key]
                let distance = getDistance(user_latitude, user_longitude, spot.coordinates.latitude, spot.coordinates.longitude)
                
                all_distance_divs[i].innerHTML = `${distance} km`;
                i++
            }
        })
    });    
};
  
function getPosition() {
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
    });
}

function getDistance(lat1, lon1, lat2, lon2) //not mine
{
    lon1 =  lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
    + Math.cos(lat1) * Math.cos(lat2)
    * Math.pow(Math.sin(dlon / 2),2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;

    // calculate the result
    return((c * r).toFixed(2));
}

function checkGeoPermission(){
    console.log(navigator.permissions.query({ name: 'geolocation' }))
    navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if(result.state == "granted"){
            showDistances();
        }
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(() => {
    checkGeoPermission();
})();