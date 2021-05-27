import React from "react";

export const IMG_URL = 'http://194.67.90.172/static/';

export const closeBtn = (onclick, className, red= false) => <svg xmlns="http://www.w3.org/2000/svg"
                                                     className={className}
                                                     width="18"
                                                     height="18"
                                                     fill="red"
                                                     viewBox="0 0 19 19"
                                                     onClick={(arg) => onclick(arg)}>
    <path className="close-menu-burger "
          stroke={red ? "#f8f7ff" : "#000000"}
          style={{fill: red ? "#fdffff" : "#000000"}}
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.9" d="M9 9.5l8-8-8 8-8-8 8 8zm0 0l8 8-8-8-8 8 8-8z">
    </path>
</svg>