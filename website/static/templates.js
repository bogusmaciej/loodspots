function build_loodspot_list_element(city, name, address){
    return `<div class="loodspot">
                <div class="color_bar">
                    <div class="color_bar_contrast"></div>
                </div>
                <div class = "loodspot_block_top">
                    <div class="city_block"><div class="city">${city}</div></div>
                    <div class="name_block"><div class="name">${name}</div></div>
                    
                </div>
                <div class = "loodspot_block_bottom">
                    <div class="address_block">
                        <div class="address">
                            ${address}
                        </div>
                    </div>
                    <div class="distance_block">
                        <div class="distance"></div>
                    </div>
                </div>
            </div>`
}

function build_user_loodspot_element(id, name){
    return `<div class="loodspot user_loodspot" id="${id}">
                <div class="color_bar">
                    <div class="color_bar_contrast"></div>
                </div>
                <div class = "loodspot_block_top">
                    <div class="name_block"><div class="name">${name}</div></div>
                </div>
                <div class = "loodspot_block_bottom">
                <div class="btn_block" onclick="deleteLoodspot('${id}')">
                    <div class = loodspot_action_btn>remove</div>
                </div>
                </div>
            </div>`
}

function build_deleted_loodspot_element(id, name){
    return `<div class="loodspot user_loodspot deleted" id="${id}">
                <div class="color_bar">
                    <div class="color_bar_contrast"></div>
                </div>
                <div class = "loodspot_block_top">
                    <div class="name_block"><div class="name">${name}</div></div>
                </div>
                <div class = "loodspot_block_bottom">
                    <div class="btn_block" onclick="restoreLoodspot('${id}')">
                        <div class = loodspot_action_btn>restore</div>
                    </div>
                </div>
            </div>`
}