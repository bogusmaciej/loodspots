let geopermission = false
const content_block_all = document.querySelector(".all_loodspots");
const content_block_not_all = document.querySelector(".not_all_loodspots");
const content_block_deleted = document.querySelector(".deleted_loodspots");


function deleteLoodspot(id){
    fetch("/delete-spot", {
        method: "POST",
        body: JSON.stringify({ spot_id:id}),
    });
    el = document.getElementById(id);
    el.className = "loodspot deleted";
    content_block_deleted.appendChild(el);
    btn = el.lastElementChild;
    btn.setAttribute('onclick', "restoreLoodspot('"+id+"')");
    btn.innerHTML = "&#8635;"
}

function restoreLoodspot(id){
    fetch("/restore-spot", {
        method: "POST",
        body: JSON.stringify({spot_id:id}),
    });
    el = document.getElementById(id);
    el.className = "loodspot";
    content_block_not_all.appendChild(el);
    btn = el.lastElementChild;
    btn.setAttribute('onclick',"deleteLoodspot('"+id+"')");
    btn.innerHTML = "&#10005;"
}

function getCity(cityId){
    if(loodspot.cityId == '5ca20b7203f3922787c2af6c') city = "KR"
    else if(loodspot.cityId == '5ce2d03e676a25a5647230a0') city = "WWA"
    return city;
}

async function getDeletedLoodspots(){
    let url = '/api/deleted';
    try {
        let response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

async function getLoodspots(){
    let user_latitude="nd";
    let user_longitude="nd";
    deleted = await getDeletedLoodspots()
    if(geopermission){
        var position = await getPosition().then(position => {
            user_latitude = position.coords.latitude
            user_longitude = position.coords.longitude
        });    
    }
    
    let content = "";


    //let request = new Request("https://glapp.pl/loodspots")
    await fetch("/api", {
        method: 'POST',
        body: JSON.stringify() 
    })
    .then(response => response.json())
    .then(data => { 
        for (let key in data) {
            loodspot = data[key]
            distance=""
            city=getCity(loodspot.cityId);
            
            content = 
            `<div class="loodspot"">
                <div class= "loodspot_city loodspot_info">${city}</div>
                <div class = "loodspot_name loodspot_info">${loodspot.name}</div>
            </div>`
            content_block_all.innerHTML += content
            
            if(geopermission){
                distance = getDistance(user_latitude, user_longitude, loodspot.coordinates.latitude, loodspot.coordinates.longitude)
                distanceBlock = document.createElement("div");
                distanceBlock.className = "distance loodspot_info";
                distanceBlock.textContent = `${distance} km`;
                content_block_all.lastChild.appendChild(distanceBlock)
            }
            
            if(deleted.includes(loodspot.id)) {
                content =
                `<div class="loodspot deleted" id="${loodspot.id}">
                    <div class = "loodspot_name loodspot_info">${loodspot.name}</div>
                    <div class = loodspot_action_btn onclick="restoreLoodspot('${loodspot.id}')">&#8635;</div>
                </div>`
                content_block_deleted.innerHTML += content 
                continue
            }

            content =
            `<div class="loodspot" id="${loodspot.id}">
                <div class = "loodspot_name loodspot_info">${loodspot.name}</div>
                <div class = loodspot_action_btn onclick="deleteLoodspot('${loodspot.id}')">&#10005;</div>
            </div>`
            content_block_not_all.innerHTML += content
        }
    })
};
  
function getPosition() {
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
    });
}


function getDistance(lat1, lon1, lat2, lon2)
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
    navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if(result.state == "granted"){
            geopermission = true;
        }
    });
}

(() => {
    getLoodspots();
    checkGeoPermission();
})();