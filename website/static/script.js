const user_loodspots = document.querySelector(".user_loodspots")

async function deleteLoodspot(id){
    fetch("/delete-spot", {
        method: "POST",
        body: JSON.stringify({ spot_id:id}),
    });

    el = document.getElementById(id);
    el.className = "loodspot user_loodspot loodspot_change_transition";
    await sleep(400);
    el.className = "loodspot user_loodspot deleted";
    btn = el.getElementsByClassName('btn_block')[0];
    btn.setAttribute('onclick', "restoreLoodspot('"+id+"')");

    label = btn.getElementsByClassName('loodspot_action_btn')[0];
    label.innerHTML = "restore"
}

async function restoreLoodspot(id){
    fetch("/restore-spot", {
        method: "POST",
        body: JSON.stringify({spot_id:id}),
    });
    el = document.getElementById(id);
    el.className = "loodspot user_loodspot loodspot_change_transition";
    await sleep(400);
    el.className = "loodspot user_loodspot";
    btn = el.getElementsByClassName('btn_block')[0];
    label = btn.getElementsByClassName('loodspot_action_btn')[0];
    btn.setAttribute('onclick',"deleteLoodspot('"+id+"')");
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
                loodspot = data[key]
                let distance = getDistance(user_latitude, user_longitude, loodspot.coordinates.latitude, loodspot.coordinates.longitude)
                
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