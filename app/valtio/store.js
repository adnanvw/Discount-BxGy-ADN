import { proxy, useSnapshot } from "valtio";

export const store = proxy({
    toast:{
        error:false,
        active:false,
        message:''
    }
  });
