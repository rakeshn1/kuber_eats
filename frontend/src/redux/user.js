import {SET_USER} from "./constants";
import {REMOVE_USER} from "./constants";

export function setUser(data){
    return{
        type : SET_USER,
        payload : data
    }
}

export function removeUser(){
    return{
        type : REMOVE_USER
    }
}

export default function userReducer(state = null, action){
    switch(action.type){
        case(SET_USER):
            return action.payload;
        case(REMOVE_USER):
            return null;
        default:
            return state;
    }
}